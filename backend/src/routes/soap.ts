// Notas SOAP.
//
// NO pasa por la fábrica de CRUD (lib/crud.ts) y es a propósito: aquí hay
// reglas del negocio que una configuración declarativa no sabe expresar.
//
//   1. Una nota firmada no se edita. PUT y PATCH sobre ella responden 409 con
//      el motivo, no 200 silencioso.
//   2. Solo el autor firma su nota. Ni el jefe de servicio ni el administrador.
//   3. Corregir una nota firmada es escribir un addendum —otra nota que apunta
//      a la original— no reescribirla.
//   4. No hay DELETE. Una nota clínica no se borra; si sobra, se corrige por
//      addendum y ahí queda quién lo hizo y cuándo.
//
// El permiso se revalida contra `rol_permiso` en cada ruta, igual que en
// /users, /roles y /audit: el rol que trae el JWT no basta. Que enfermería
// pueda o no leerlas es una casilla de la matriz de permisos (módulo
// `notas_soap`, acción `ver`) y no una condición escrita en este archivo — eso
// es lo que deja configurarlo por institución sin tocar el código.

import type { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.ts";
import { recordAudit } from "../lib/audit.ts";
import { conflict, forbidden, notFound, parseOr400 } from "../lib/http.ts";
import type { SoapNote } from "../types.ts";

const NOTA_INCLUDE = {
  autor: { select: { nombre: true } },
  firmante: { select: { nombre: true } },
} as const;

type NotaRow = {
  nota_id: bigint;
  paciente_id: number;
  usuario_id: number;
  nota_padre_id: bigint | null;
  fecha_hora: Date;
  subjetivo: string | null;
  objetivo: string | null;
  analisis: string | null;
  plan: string | null;
  estado: "borrador" | "firmada";
  firmada_por: number | null;
  firmada_en: Date | null;
  autor: { nombre: string };
  firmante: { nombre: string } | null;
};

function toNote(row: NotaRow): SoapNote {
  return {
    id: String(row.nota_id),
    patientId: String(row.paciente_id),
    authorId: String(row.usuario_id),
    authorName: row.autor.nombre,
    parentId: row.nota_padre_id === null ? null : String(row.nota_padre_id),
    at: row.fecha_hora.toISOString(),
    subjective: row.subjetivo,
    objective: row.objetivo,
    assessment: row.analisis,
    plan: row.plan,
    status: row.estado,
    signedById: row.firmada_por === null ? null : String(row.firmada_por),
    signedByName: row.firmante?.nombre ?? null,
    signedAt: row.firmada_en ? row.firmada_en.toISOString() : null,
  };
}

// Las cuatro secciones son opcionales una a una —una nota de seguimiento puede
// traer solo el plan— pero no las cuatro a la vez: eso es una nota vacía.
const seccionesSchema = z
  .object({
    subjective: z.string().max(20_000).optional(),
    objective: z.string().max(20_000).optional(),
    assessment: z.string().max(20_000).optional(),
    plan: z.string().max(20_000).optional(),
  })
  .refine(
    (value) => Object.values(value).some((texto) => (texto ?? "").trim().length > 0),
    { message: "La nota necesita al menos una sección con texto" },
  );

const createSchema = seccionesSchema.and(
  z.object({
    patientId: z.coerce.number().int().positive(),
    // Firmar en el mismo acto de crearla es el camino normal: se escribe la
    // nota y se firma. `false` la deja en borrador para terminarla después.
    sign: z.boolean().default(false),
  }),
);

// PATCH admite subconjunto y no exige que quede algo escrito: la validación de
// "no vaya vacía" ya la pasó el alta.
const patchSchema = z
  .object({
    subjective: z.string().max(20_000).optional(),
    objective: z.string().max(20_000).optional(),
    assessment: z.string().max(20_000).optional(),
    plan: z.string().max(20_000).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, { message: "Nada que actualizar" });

const listQuerySchema = z.object({
  patientId: z.coerce.number().int().positive(),
  // Por defecto salen todas, addenda incluidas, en orden inverso. `false` deja
  // solo las notas raíz, que es lo que quiere una vista resumida.
  includeAddenda: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
});

const idSchema = z.object({ id: z.coerce.number().int().positive() });

function toSecciones(input: {
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
}): Record<string, unknown> {
  return {
    ...(input.subjective !== undefined ? { subjetivo: input.subjective } : {}),
    ...(input.objective !== undefined ? { objetivo: input.objective } : {}),
    ...(input.assessment !== undefined ? { analisis: input.assessment } : {}),
    ...(input.plan !== undefined ? { plan: input.plan } : {}),
  };
}

async function findNota(id: number): Promise<NotaRow> {
  const row = await prisma.notaSoap.findUnique({
    where: { nota_id: BigInt(id) },
    include: NOTA_INCLUDE,
  });
  if (!row) throw notFound(`No existe la nota SOAP ${id}`);
  return row as NotaRow;
}

export default async function soapRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  const ver = [app.requirePermission("notas_soap", "ver")];
  const crear = [app.requirePermission("notas_soap", "crear")];
  const editar = [app.requirePermission("notas_soap", "editar")];

  // Orden inverso: la nota de hoy arriba. Es como se lee un expediente, y en un
  // ingreso largo la primera pantalla tiene que traer lo último, no lo del
  // primer día.
  app.get("/soap/notes", { preHandler: ver }, async (req, reply) => {
    const { patientId, includeAddenda } = parseOr400(listQuerySchema, req.query);

    const where = {
      paciente_id: patientId,
      ...(includeAddenda ? {} : { nota_padre_id: null }),
    };
    const [rows, total] = await Promise.all([
      prisma.notaSoap.findMany({
        where,
        include: NOTA_INCLUDE,
        orderBy: { fecha_hora: "desc" },
      }),
      prisma.notaSoap.count({ where }),
    ]);

    reply.header("X-Total-Count", String(total));
    return (rows as NotaRow[]).map(toNote);
  });

  app.get("/soap/notes/:id", { preHandler: ver }, async (req) => {
    const { id } = parseOr400(idSchema, req.params);
    return toNote(await findNota(id));
  });

  app.post("/soap/notes", { preHandler: crear }, async (req, reply) => {
    const input = parseOr400(createSchema, req.body);
    const autorId = Number(req.user.sub);
    const ahora = new Date();

    const created = await prisma.$transaction(async (tx) => {
      const row = await tx.notaSoap.create({
        data: {
          paciente_id: input.patientId,
          usuario_id: autorId,
          ...toSecciones(input),
          // Si se firma en el alta, el firmante es el autor por definición: no
          // hay forma de crear una nota a nombre de otro.
          ...(input.sign
            ? { estado: "firmada" as const, firmada_por: autorId, firmada_en: ahora }
            : {}),
        },
        include: NOTA_INCLUDE,
      });

      await recordAudit(tx, {
        actorId: req.user.sub,
        entidad: "nota_soap",
        registroId: String(row.nota_id),
        accion: "INSERT",
        // Sin el contenido clínico: la bitácora la lee quien tenga permiso de
        // auditoría, que no es lo mismo que permiso sobre la nota.
        observacion: `registró una nota SOAP ${input.sign ? "firmada" : "en borrador"} del paciente ${input.patientId}`,
      });

      return row as NotaRow;
    });

    reply.header("Location", `/soap/notes/${created.nota_id}`);
    return reply.code(201).send(toNote(created));
  });

  // PUT y PATCH comparten handler: los dos escriben las mismas cuatro
  // secciones y la diferencia es qué esquema valida la entrada.
  const editHandler =
    <T extends Record<string, unknown>>(schema: z.ZodType<T, z.ZodTypeDef, unknown>) =>
    async (req: FastifyRequest) => {
      const { id } = parseOr400(idSchema, req.params);
      const input = parseOr400(schema, req.body);
      const nota = await findNota(id);

      // La regla que da sentido a la firma. Sin este corte, "firmada" sería una
      // etiqueta y no un compromiso: cualquiera podría cambiar el texto después
      // y la firma seguiría ahí, avalando algo que ya no dice lo mismo.
      if (nota.estado === "firmada") {
        throw conflict(
          "La nota está firmada y no se puede editar; registre un addendum en su lugar",
        );
      }
      // Un borrador es de quien lo escribe. Que otro médico lo termine y quede
      // firmado por el primero es exactamente lo que la firma tiene que impedir.
      if (nota.usuario_id !== Number(req.user.sub)) {
        throw forbidden("Solo el autor puede editar su borrador");
      }

      return toNote(
        await prisma.$transaction(async (tx) => {
          const updated = await tx.notaSoap.update({
            where: { nota_id: BigInt(id) },
            data: toSecciones(input),
            include: NOTA_INCLUDE,
          });
          await recordAudit(tx, {
            actorId: req.user.sub,
            entidad: "nota_soap",
            registroId: id,
            accion: "UPDATE",
            observacion: `editó el borrador de la nota SOAP ${id}`,
          });
          return updated as NotaRow;
        }),
      );
    };

  app.put("/soap/notes/:id", { preHandler: editar }, editHandler(seccionesSchema));
  app.patch("/soap/notes/:id", { preHandler: editar }, editHandler(patchSchema));

  // Firmar es lo que cierra la nota. Va con permiso de edición y no de alta
  // porque es el último cambio que admite el registro.
  app.post("/soap/notes/:id/sign", { preHandler: editar }, async (req) => {
    const { id } = parseOr400(idSchema, req.params);
    const nota = await findNota(id);

    if (nota.usuario_id !== Number(req.user.sub)) {
      throw forbidden("Solo el autor puede firmar la nota");
    }
    if (nota.estado === "firmada") {
      throw conflict("La nota ya está firmada");
    }

    return toNote(
      await prisma.$transaction(async (tx) => {
        const updated = await tx.notaSoap.update({
          where: { nota_id: BigInt(id) },
          data: {
            estado: "firmada",
            firmada_por: Number(req.user.sub),
            firmada_en: new Date(),
          },
          include: NOTA_INCLUDE,
        });
        await recordAudit(tx, {
          actorId: req.user.sub,
          entidad: "nota_soap",
          registroId: id,
          accion: "UPDATE",
          observacion: `firmó la nota SOAP ${id}`,
        });
        return updated as NotaRow;
      }),
    );
  });

  // Addendum: la única forma de corregir una nota firmada.
  //
  // Un addendum es una nota completa —tiene autor, hora y firma propios— que
  // cuelga de la original. Se aplana a un solo nivel: el addendum de un
  // addendum apunta igualmente a la nota raíz, para que la pantalla muestre una
  // nota y sus correcciones y no un árbol que nadie sabe leer.
  app.post("/soap/notes/:id/addendum", { preHandler: crear }, async (req, reply) => {
    const { id } = parseOr400(idSchema, req.params);
    const input = parseOr400(seccionesSchema, req.body);
    const padre = await findNota(id);

    // Sobre un borrador no hay nada que corregir: se edita y ya. Permitirlo
    // dejaría dos textos vivos a la vez sin decir cuál vale.
    if (padre.estado !== "firmada") {
      throw conflict("La nota todavía es un borrador: edítela en vez de añadir un addendum");
    }

    const raiz = padre.nota_padre_id ?? padre.nota_id;
    const autorId = Number(req.user.sub);
    const ahora = new Date();

    const created = await prisma.$transaction(async (tx) => {
      const row = await tx.notaSoap.create({
        data: {
          paciente_id: padre.paciente_id,
          usuario_id: autorId,
          nota_padre_id: raiz,
          ...toSecciones(input),
          // El addendum nace firmado por quien lo escribe: es una corrección a
          // algo ya firmado y dejarlo en borrador abriría la puerta a
          // "corregir" sin responsable.
          estado: "firmada",
          firmada_por: autorId,
          firmada_en: ahora,
        },
        include: NOTA_INCLUDE,
      });

      await recordAudit(tx, {
        actorId: req.user.sub,
        entidad: "nota_soap",
        registroId: String(row.nota_id),
        accion: "INSERT",
        observacion: `registró un addendum de la nota SOAP ${raiz}`,
      });

      return row as NotaRow;
    });

    reply.header("Location", `/soap/notes/${created.nota_id}`);
    return reply.code(201).send(toNote(created));
  });
}
