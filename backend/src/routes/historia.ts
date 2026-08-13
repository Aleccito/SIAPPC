// Historia Clínica General.
//
// El expediente longitudinal del paciente: lo que es cierto de él y no de una
// visita concreta —antecedentes, alergias, medicación, diagnósticos,
// hospitalizaciones, procedimientos, documentos— más el historial de cambios.
//
// Convive con la tabla `historia_clinica` de siempre, que NO se tocó: esa sigue
// siendo la nota de evolución de un encuentro y aquí aparece como una categoría
// más, `/historia/:pacienteId/evoluciones`. Nada de lo que ya la consultaba
// cambia.
//
// Sobre los permisos. Todo sale de `rol_permiso` y se revalida contra la base en
// cada petición (módulo `historia_clinica`), igual que /users y /audit; el rol
// del JWT no basta. La matriz que siembra db/seed.sql expresa lo que pide la
// especificación SIN una sola condición por rol escrita en este archivo:
//
//   médico          ver+crear+editar  → lee y escribe todo el expediente
//   enfermero       ver               → lee todo, y escribe solo observaciones
//   administrativo  (sin renglón)     → 403 en todo, incluida la lectura
//   admin           ver               → lectura de auditoría, sin edición clínica
//
// Que enfermería escriba únicamente `observaciones` no es un `if` sobre el rol:
// es que esa ruta —y solo esa— pide `ver` en lugar de `editar`. Un hospital que
// quiera otra cosa mueve las casillas de la matriz y no toca el código.
//
// No hay DELETE en ninguna categoría, y es deliberado: del expediente no se
// borra: un antecedente equivocado se da de baja (`activo`), una alergia se
// marca `descartada`, un medicamento se `suspende`. Borrar dejaría un
// expediente que ya no explica por qué se tomaron las decisiones que se
// tomaron.

import type { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.ts";
import { recordAudit } from "../lib/audit.ts";
import type { Queryable } from "../lib/audit.ts";
import { badRequest, notFound, parseOr400 } from "../lib/http.ts";
import type { EvolucionEntry, HistoriaCategoria, HistoriaChange } from "../types.ts";

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

const pacienteParam = z.object({ pacienteId: z.coerce.number().int().positive() });
const pacienteYIdParam = pacienteParam.extend({ id: z.coerce.number().int().positive() });

/** `YYYY-MM-DD` a Date, o null. Las columnas de fecha del expediente son DATE. */
const fechaSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Se espera una fecha YYYY-MM-DD")
  .transform((valor) => new Date(`${valor}T00:00:00Z`));

function fechaDto(valor: Date | null): string | null {
  return valor ? valor.toISOString().slice(0, 10) : null;
}

/**
 * El expediente del paciente, creándolo si es la primera vez que se escribe.
 *
 * No se crea en el alta del paciente porque un paciente de sala de espera que
 * se va sin ser atendido no tiene expediente clínico que abrir; la fila nace
 * cuando alguien escribe la primera línea.
 */
async function abrirExpediente(db: Queryable, pacienteId: number): Promise<number> {
  const existente = await db.expedienteClinico.findUnique({
    where: { paciente_id: pacienteId },
    select: { expediente_id: true },
  });
  if (existente) return existente.expediente_id;

  const paciente = await db.paciente.findUnique({
    where: { paciente_id: pacienteId },
    select: { paciente_id: true },
  });
  if (!paciente) throw notFound(`No existe el paciente ${pacienteId}`);

  const creado = await db.expedienteClinico.create({
    data: { paciente_id: pacienteId },
    select: { expediente_id: true },
  });
  return creado.expediente_id;
}

/** El expediente para leer. Sin fila todavía, `null`: leer no lo crea. */
async function expedienteDeLectura(pacienteId: number) {
  return prisma.expedienteClinico.findUnique({ where: { paciente_id: pacienteId } });
}

/**
 * Anota el cambio en las DOS bitácoras, dentro de la transacción del cambio.
 *
 * `auditoria` es la bitácora transversal del sistema; `historia_cambio` es el
 * historial que se lee dentro del propio expediente, por categoría, sin
 * necesitar permiso de auditoría. Las dos, o ninguna: si no se puede dejar
 * constancia, el cambio no se hace.
 */
async function anotarCambio(
  tx: Queryable,
  req: FastifyRequest,
  entrada: {
    expedienteId: number;
    categoria: string;
    registroId: number | bigint;
    accion: "alta" | "modificacion" | "baja";
    detalle: string;
  },
): Promise<void> {
  await tx.historiaCambio.create({
    data: {
      expediente_id: entrada.expedienteId,
      categoria: entrada.categoria,
      registro_id: BigInt(entrada.registroId),
      accion: entrada.accion,
      usuario_id: Number(req.user.sub),
      detalle: entrada.detalle,
    },
  });
  await recordAudit(tx, {
    actorId: req.user.sub,
    entidad: `historia_${entrada.categoria}`,
    registroId: String(entrada.registroId),
    accion: entrada.accion === "alta" ? "INSERT" : entrada.accion === "baja" ? "DELETE" : "UPDATE",
    observacion: entrada.detalle,
  });
}

// ---------------------------------------------------------------------------
// Las siete categorías, descritas una vez
//
// Cada una es la misma forma —listar, dar de alta, modificar— sobre una tabla
// distinta, así que se declara qué tabla, qué valida la entrada y cómo se ve
// desde fuera, y las rutas salen de ahí. Es el mismo criterio de lib/crud.ts,
// pero la fábrica genérica no sirve aquí: estas rutas cuelgan de un paciente,
// tienen que abrir el expediente antes de escribir y escriben además en
// `historia_cambio`.
// ---------------------------------------------------------------------------

type Delegate = {
  findMany(args?: Record<string, unknown>): Promise<unknown[]>;
  findFirst(args: Record<string, unknown>): Promise<unknown>;
  create(args: Record<string, unknown>): Promise<unknown>;
  update(args: Record<string, unknown>): Promise<unknown>;
};

type Categoria = {
  slug: HistoriaCategoria;
  /** Nombre del modelo en el cliente de Prisma. */
  model: string;
  idField: string;
  createSchema: z.ZodTypeAny;
  updateSchema: z.ZodTypeAny;
  orderBy: Record<string, "asc" | "desc">;
  toDto: (row: Record<string, unknown>) => Record<string, unknown>;
  toData: (input: Record<string, unknown>) => Record<string, unknown>;
  /** Cómo se nombra el renglón en el historial de cambios. */
  label: (row: Record<string, unknown>) => string;
};

function delegate(client: Queryable | typeof prisma, model: string): Delegate {
  return (client as unknown as Record<string, Delegate>)[model]!;
}

/** Copia solo las claves presentes, traducidas al nombre de la columna. */
function mapear(
  input: Record<string, unknown>,
  campos: Record<string, string>,
): Record<string, unknown> {
  const salida: Record<string, unknown> = {};
  for (const [entrada, columna] of Object.entries(campos)) {
    if (input[entrada] !== undefined) salida[columna] = input[entrada];
  }
  return salida;
}

const texto = (max: number) => z.string().min(1).max(max);

const antecedenteSchema = z.object({
  type: z.enum(["personal", "familiar", "quirurgico", "ginecoobstetrico", "habito"]),
  description: texto(20_000),
  relationship: z.string().max(60).optional(),
  year: z.number().int().min(1900).max(2200).optional(),
  active: z.boolean().optional(),
});

const alergiaSchema = z.object({
  substance: texto(150),
  reaction: z.string().max(20_000).optional(),
  severity: z.enum(["leve", "moderada", "grave", "anafilaxia"]).default("leve"),
  status: z.enum(["activa", "resuelta", "descartada"]).default("activa"),
  detectedOn: fechaSchema.optional(),
});

const medicamentoSchema = z.object({
  name: texto(150),
  dose: z.string().max(80).optional(),
  route: z.string().max(40).optional(),
  frequency: z.string().max(80).optional(),
  indication: z.string().max(255).optional(),
  status: z.enum(["activo", "suspendido", "finalizado"]).default("activo"),
  startedOn: fechaSchema.optional(),
  endedOn: fechaSchema.optional(),
  suspensionReason: z.string().max(255).optional(),
});

const diagnosticoSchema = z.object({
  code: z.string().max(10).optional(),
  description: texto(255),
  type: z.enum(["presuntivo", "definitivo", "diferencial"]).default("presuntivo"),
  status: z.enum(["activo", "resuelto", "descartado"]).default("activo"),
  diagnosedOn: fechaSchema.optional(),
  notes: z.string().max(20_000).optional(),
});

const hospitalizacionSchema = z.object({
  reason: texto(255),
  service: z.string().max(120).optional(),
  facility: z.string().max(150).optional(),
  admittedOn: fechaSchema,
  dischargedOn: fechaSchema.optional(),
  dischargeSummary: z.string().max(20_000).optional(),
});

const procedimientoSchema = z.object({
  name: texto(200),
  code: z.string().max(20).optional(),
  performedOn: fechaSchema.optional(),
  description: z.string().max(20_000).optional(),
  outcome: z.string().max(20_000).optional(),
});

// PENDIENTE: solo la ficha del documento. La subida del archivo y su descarga
// no existen todavía; cuando exista el servicio de almacenamiento, `storage` y
// `path` los llena él —no el navegador— y esta ruta pasa a aceptar multipart.
// Ver el comentario del modelo DocumentoClinico en prisma/schema.prisma.
const documentoSchema = z.object({
  type: z
    .enum(["laboratorio", "imagenologia", "consentimiento", "interconsulta", "receta", "otro"])
    .default("otro"),
  title: texto(200),
  description: z.string().max(20_000).optional(),
  documentedOn: fechaSchema.optional(),
});

const categorias: Categoria[] = [
  {
    slug: "antecedentes",
    model: "antecedente",
    idField: "antecedente_id",
    createSchema: antecedenteSchema,
    updateSchema: antecedenteSchema.partial(),
    orderBy: { antecedente_id: "desc" },
    toDto: (row) => ({
      id: String(row.antecedente_id),
      type: row.tipo,
      description: row.descripcion,
      relationship: row.parentesco,
      year: row.anio,
      active: row.activo,
    }),
    toData: (input) =>
      mapear(input, {
        type: "tipo",
        description: "descripcion",
        relationship: "parentesco",
        year: "anio",
        active: "activo",
      }),
    label: (row) => `antecedente ${String(row.tipo)}`,
  },
  {
    slug: "alergias",
    model: "alergia",
    idField: "alergia_id",
    createSchema: alergiaSchema,
    updateSchema: alergiaSchema.partial(),
    orderBy: { alergia_id: "desc" },
    toDto: (row) => ({
      id: String(row.alergia_id),
      substance: row.sustancia,
      reaction: row.reaccion,
      severity: row.severidad,
      status: row.estado,
      detectedOn: fechaDto(row.fecha_deteccion as Date | null),
    }),
    toData: (input) =>
      mapear(input, {
        substance: "sustancia",
        reaction: "reaccion",
        severity: "severidad",
        status: "estado",
        detectedOn: "fecha_deteccion",
      }),
    label: (row) => `alergia a ${String(row.sustancia)}`,
  },
  {
    slug: "medicamentos",
    model: "medicamentoPaciente",
    idField: "medicamento_id",
    createSchema: medicamentoSchema,
    updateSchema: medicamentoSchema.partial(),
    orderBy: { medicamento_id: "desc" },
    toDto: (row) => ({
      id: String(row.medicamento_id),
      name: row.nombre,
      dose: row.dosis,
      route: row.via,
      frequency: row.frecuencia,
      indication: row.indicacion,
      status: row.estado,
      startedOn: fechaDto(row.fecha_inicio as Date | null),
      endedOn: fechaDto(row.fecha_fin as Date | null),
      suspensionReason: row.motivo_suspension,
    }),
    toData: (input) =>
      mapear(input, {
        name: "nombre",
        dose: "dosis",
        route: "via",
        frequency: "frecuencia",
        indication: "indicacion",
        status: "estado",
        startedOn: "fecha_inicio",
        endedOn: "fecha_fin",
        suspensionReason: "motivo_suspension",
      }),
    label: (row) => `medicamento ${String(row.nombre)}`,
  },
  {
    slug: "diagnosticos",
    model: "diagnosticoClinico",
    idField: "diagnostico_id",
    createSchema: diagnosticoSchema,
    updateSchema: diagnosticoSchema.partial(),
    orderBy: { diagnostico_id: "desc" },
    toDto: (row) => ({
      id: String(row.diagnostico_id),
      code: row.cie10,
      description: row.descripcion,
      type: row.tipo,
      status: row.estado,
      diagnosedOn: fechaDto(row.fecha_diagnostico as Date | null),
      notes: row.notas,
    }),
    toData: (input) =>
      mapear(input, {
        code: "cie10",
        description: "descripcion",
        type: "tipo",
        status: "estado",
        diagnosedOn: "fecha_diagnostico",
        notes: "notas",
      }),
    label: (row) => `diagnóstico ${String(row.descripcion)}`,
  },
  {
    slug: "hospitalizaciones",
    model: "hospitalizacion",
    idField: "hospitalizacion_id",
    createSchema: hospitalizacionSchema,
    updateSchema: hospitalizacionSchema.partial(),
    orderBy: { fecha_ingreso: "desc" },
    toDto: (row) => ({
      id: String(row.hospitalizacion_id),
      reason: row.motivo,
      service: row.servicio,
      facility: row.establecimiento,
      admittedOn: fechaDto(row.fecha_ingreso as Date | null),
      dischargedOn: fechaDto(row.fecha_egreso as Date | null),
      dischargeSummary: row.resumen_egreso,
    }),
    toData: (input) =>
      mapear(input, {
        reason: "motivo",
        service: "servicio",
        facility: "establecimiento",
        admittedOn: "fecha_ingreso",
        dischargedOn: "fecha_egreso",
        dischargeSummary: "resumen_egreso",
      }),
    label: (row) => `hospitalización por ${String(row.motivo)}`,
  },
  {
    slug: "procedimientos",
    model: "procedimiento",
    idField: "procedimiento_id",
    createSchema: procedimientoSchema,
    updateSchema: procedimientoSchema.partial(),
    orderBy: { procedimiento_id: "desc" },
    toDto: (row) => ({
      id: String(row.procedimiento_id),
      name: row.nombre,
      code: row.codigo,
      performedOn: fechaDto(row.fecha as Date | null),
      description: row.descripcion,
      outcome: row.resultado,
    }),
    toData: (input) =>
      mapear(input, {
        name: "nombre",
        code: "codigo",
        performedOn: "fecha",
        description: "descripcion",
        outcome: "resultado",
      }),
    label: (row) => `procedimiento ${String(row.nombre)}`,
  },
  {
    slug: "documentos",
    model: "documentoClinico",
    idField: "documento_id",
    createSchema: documentoSchema,
    updateSchema: documentoSchema.partial(),
    orderBy: { documento_id: "desc" },
    toDto: (row) => ({
      id: String(row.documento_id),
      type: row.tipo,
      title: row.titulo,
      description: row.descripcion,
      documentedOn: fechaDto(row.fecha_documento as Date | null),
      // PENDIENTE: sin servicio de archivos no hay nada que descargar. El
      // navegador usa esto para pintar la ficha como "sin archivo adjunto".
      hasFile: row.ruta !== null,
      mime: row.mime,
      sizeBytes: row.tamano_bytes === null ? null : Number(row.tamano_bytes),
    }),
    toData: (input) =>
      mapear(input, {
        type: "tipo",
        title: "titulo",
        description: "descripcion",
        documentedOn: "fecha_documento",
      }),
    label: (row) => `documento ${String(row.titulo)}`,
  },
];

const evolucionSchema = z.object({
  diagnosis: z.string().max(20_000).optional(),
  treatment: z.string().max(20_000).optional(),
  notes: z.string().max(20_000).optional(),
});

const observacionesSchema = z.object({ notes: z.string().max(20_000) });

type EvolucionRow = {
  historia_id: bigint;
  paciente_id: number;
  usuario_id: number;
  fecha_hora: Date;
  diagnostico: string | null;
  tratamiento: string | null;
  observaciones: string | null;
  usuario: { nombre: string };
};

function toEvolucion(row: EvolucionRow): EvolucionEntry {
  return {
    id: String(row.historia_id),
    patientId: String(row.paciente_id),
    authorId: String(row.usuario_id),
    authorName: row.usuario.nombre,
    at: row.fecha_hora.toISOString(),
    diagnosis: row.diagnostico,
    treatment: row.tratamiento,
    notes: row.observaciones,
  };
}

// ---------------------------------------------------------------------------

// --- Exploración física -----------------------------------------------------

const regiones = [
  "cabeza_cuello",
  "torax",
  "abdomen",
  "extremidades_superiores",
  "extremidades_inferiores",
  "neurologico",
] as const;

const tecnicas = ["inspeccion", "palpacion", "percusion", "auscultacion"] as const;

const exploracionSchema = z.object({
  // Rangos amplios a propósito: acotan el disparate de tecleo (un peso de
  // 6800 kg) sin meterse a decidir qué es un peso plausible, que es criterio
  // clínico y no de validación.
  weightKg: z.coerce.number().positive().max(500).nullish(),
  heightCm: z.coerce.number().positive().max(300).nullish(),
  abdominalCm: z.coerce.number().positive().max(300).nullish(),
  glasgow: z.coerce.number().int().min(3).max(15).nullish(),
  findings: z
    .array(
      z.object({
        region: z.enum(regiones),
        technique: z.enum(tecnicas),
        state: z.enum(["normal", "anormal"]),
        text: z.string().max(2000).nullish(),
      }),
    )
    .default([]),
});

type HallazgoRow = {
  region: string;
  tecnica: string;
  estado: string;
  descripcion: string | null;
};

type ExploracionRow = {
  peso_kg: unknown;
  talla_cm: unknown;
  perimetro_abdominal_cm: unknown;
  glasgow: number | null;
  actualizado_en: Date;
  hallazgos: HallazgoRow[];
};

/** Los DECIMAL llegan como objeto del driver; el navegador quiere números. */
const aNumero = (valor: unknown): number | null =>
  valor === null || valor === undefined ? null : Number(valor);

function toExploracion(row: ExploracionRow) {
  return {
    weightKg: aNumero(row.peso_kg),
    heightCm: aNumero(row.talla_cm),
    abdominalCm: aNumero(row.perimetro_abdominal_cm),
    glasgow: row.glasgow,
    updatedAt: row.actualizado_en.toISOString(),
    findings: row.hallazgos.map((h) => ({
      region: h.region,
      technique: h.tecnica,
      state: h.estado,
      text: h.descripcion,
    })),
  };
}

/**
 * Un paciente sin exploración todavía. Se devuelve esto y no un 404: la
 * pantalla necesita el formulario vacío para poder capturarla por primera vez,
 * y "no existe" no es un error aquí.
 */
function exploracionVacia() {
  return {
    weightKg: null,
    heightCm: null,
    abdominalCm: null,
    glasgow: null,
    updatedAt: null,
    findings: [] as { region: string; technique: string; state: string; text: string | null }[],
  };
}

export default async function historiaRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  const ver = [app.requirePermission("historia_clinica", "ver")];
  const crear = [app.requirePermission("historia_clinica", "crear")];
  const editar = [app.requirePermission("historia_clinica", "editar")];

  async function listar(categoria: Categoria, pacienteId: number) {
    const expediente = await expedienteDeLectura(pacienteId);
    if (!expediente) return [];
    const rows = (await delegate(prisma, categoria.model).findMany({
      where: { expediente_id: expediente.expediente_id },
      orderBy: categoria.orderBy,
    })) as Record<string, unknown>[];
    return rows.map(categoria.toDto);
  }

  // --- Una tanda de rutas por categoría ------------------------------------
  for (const categoria of categorias) {
    const base = `/historia/:pacienteId/${categoria.slug}`;

    app.get(base, { preHandler: ver }, async (req) => {
      const { pacienteId } = parseOr400(pacienteParam, req.params);
      return listar(categoria, pacienteId);
    });

    app.post(base, { preHandler: crear }, async (req, reply) => {
      const { pacienteId } = parseOr400(pacienteParam, req.params);
      const input = parseOr400(categoria.createSchema, req.body) as Record<string, unknown>;

      const row = await prisma.$transaction(async (tx) => {
        const expedienteId = await abrirExpediente(tx, pacienteId);
        const creado = (await delegate(tx, categoria.model).create({
          data: {
            ...categoria.toData(input),
            expediente_id: expedienteId,
            registrado_por: Number(req.user.sub),
          },
        })) as Record<string, unknown>;

        await anotarCambio(tx, req, {
          expedienteId,
          categoria: categoria.slug,
          registroId: Number(creado[categoria.idField]),
          accion: "alta",
          detalle: `registró ${categoria.label(creado)} en el expediente del paciente ${pacienteId}`,
        });

        return creado;
      });

      reply.header("Location", `${base.replace(":pacienteId", String(pacienteId))}/${row[categoria.idField]}`);
      return reply.code(201).send(categoria.toDto(row));
    });

    app.patch(`${base}/:id`, { preHandler: editar }, async (req) => {
      const { pacienteId, id } = parseOr400(pacienteYIdParam, req.params);
      const input = parseOr400(categoria.updateSchema, req.body) as Record<string, unknown>;
      const data = categoria.toData(input);
      if (Object.keys(data).length === 0) throw badRequest("Nada que actualizar");

      const expediente = await expedienteDeLectura(pacienteId);
      if (!expediente) throw notFound(`El paciente ${pacienteId} no tiene expediente abierto`);

      // Se busca por id Y por expediente: un id de otro paciente no se puede
      // editar pasándolo por la URL de este.
      const actual = (await delegate(prisma, categoria.model).findFirst({
        where: { [categoria.idField]: id, expediente_id: expediente.expediente_id },
      })) as Record<string, unknown> | null;
      if (!actual) throw notFound(`No existe ${categoria.slug} con id ${id} en este expediente`);

      return prisma.$transaction(async (tx) => {
        const actualizado = (await delegate(tx, categoria.model).update({
          where: { [categoria.idField]: id },
          data,
        })) as Record<string, unknown>;

        await anotarCambio(tx, req, {
          expedienteId: expediente.expediente_id,
          categoria: categoria.slug,
          registroId: id,
          accion: "modificacion",
          detalle: `actualizó ${categoria.label(actual)} del paciente ${pacienteId}`,
        });

        return categoria.toDto(actualizado);
      });
    });
  }

  // --- Evoluciones: la tabla `historia_clinica` de siempre -------------------
  app.get("/historia/:pacienteId/evoluciones", { preHandler: ver }, async (req) => {
    const { pacienteId } = parseOr400(pacienteParam, req.params);
    const rows = await prisma.historiaClinica.findMany({
      where: { paciente_id: pacienteId },
      include: { usuario: { select: { nombre: true } } },
      orderBy: { fecha_hora: "desc" },
    });
    return (rows as EvolucionRow[]).map(toEvolucion);
  });

  app.post("/historia/:pacienteId/evoluciones", { preHandler: crear }, async (req, reply) => {
    const { pacienteId } = parseOr400(pacienteParam, req.params);
    const input = parseOr400(evolucionSchema, req.body);
    if (!input.diagnosis && !input.treatment && !input.notes) {
      throw badRequest("La evolución necesita diagnóstico, tratamiento u observaciones");
    }

    const row = await prisma.$transaction(async (tx) => {
      const expedienteId = await abrirExpediente(tx, pacienteId);
      const creada = await tx.historiaClinica.create({
        data: {
          paciente_id: pacienteId,
          usuario_id: Number(req.user.sub),
          diagnostico: input.diagnosis ?? null,
          tratamiento: input.treatment ?? null,
          observaciones: input.notes ?? null,
        },
        include: { usuario: { select: { nombre: true } } },
      });

      await anotarCambio(tx, req, {
        expedienteId,
        categoria: "evoluciones",
        registroId: creada.historia_id,
        accion: "alta",
        detalle: `registró una nota de evolución del paciente ${pacienteId}`,
      });

      return creada as EvolucionRow;
    });

    reply.header("Location", `/historia/${pacienteId}/evoluciones/${row.historia_id}`);
    return reply.code(201).send(toEvolucion(row));
  });

  // --- Observaciones de enfermería ------------------------------------------
  //
  // La única escritura del expediente que pide `ver` y no `editar`. Ahí está la
  // regla de "enfermería escribe solo observaciones", expresada como permiso y
  // no como un `if` sobre el nombre del rol: con la matriz sembrada, enfermero
  // llega aquí y no a ninguna otra ruta de escritura, y administrativo no llega
  // ni a esta.
  app.patch("/historia/:pacienteId/observaciones", { preHandler: ver }, async (req) => {
    const { pacienteId } = parseOr400(pacienteParam, req.params);
    const { notes } = parseOr400(observacionesSchema, req.body);

    return prisma.$transaction(async (tx) => {
      const expedienteId = await abrirExpediente(tx, pacienteId);
      const actualizado = await tx.expedienteClinico.update({
        where: { expediente_id: expedienteId },
        data: { observaciones: notes },
      });

      await anotarCambio(tx, req, {
        expedienteId,
        categoria: "observaciones",
        registroId: expedienteId,
        accion: "modificacion",
        detalle: `actualizó las observaciones del expediente del paciente ${pacienteId}`,
      });

      return {
        patientId: String(pacienteId),
        notes: actualizado.observaciones,
        updatedAt: actualizado.actualizado_en.toISOString(),
      };
    });
  });

  // --- Historial de cambios --------------------------------------------------
  app.get("/historia/:pacienteId/cambios", { preHandler: ver }, async (req) => {
    const { pacienteId } = parseOr400(pacienteParam, req.params);
    const expediente = await expedienteDeLectura(pacienteId);
    if (!expediente) return [];

    const rows = await prisma.historiaCambio.findMany({
      where: { expediente_id: expediente.expediente_id },
      include: { usuario: { select: { nombre: true } } },
      orderBy: { fecha_hora: "desc" },
      take: 200,
    });

    return rows.map(
      (row): HistoriaChange => ({
        id: String(row.cambio_id),
        category: row.categoria,
        recordId: String(row.registro_id),
        action: row.accion,
        authorId: row.usuario_id === null ? null : String(row.usuario_id),
        authorName: row.usuario?.nombre ?? null,
        at: row.fecha_hora.toISOString(),
        detail: row.detalle,
      }),
    );
  });

  // --- El expediente completo -------------------------------------------------
  //
  // Una sola llamada con todo: la pantalla lo pinta por categorías plegables y
  // pedir nueve rutas para abrirla haría nueve viajes donde basta uno.
  app.get("/historia/:pacienteId", { preHandler: ver }, async (req) => {
    const { pacienteId } = parseOr400(pacienteParam, req.params);

    const paciente = await prisma.paciente.findUnique({
      where: { paciente_id: pacienteId },
      select: { paciente_id: true, nombre: true, cedula: true },
    });
    if (!paciente) throw notFound(`No existe el paciente ${pacienteId}`);

    const expediente = await expedienteDeLectura(pacienteId);
    const porCategoria = Object.fromEntries(
      await Promise.all(
        categorias.map(async (categoria) => [categoria.slug, await listar(categoria, pacienteId)]),
      ),
    );

    const evoluciones = await prisma.historiaClinica.findMany({
      where: { paciente_id: pacienteId },
      include: { usuario: { select: { nombre: true } } },
      orderBy: { fecha_hora: "desc" },
    });

    return {
      patientId: String(paciente.paciente_id),
      patientName: paciente.nombre,
      document: paciente.cedula,
      openedAt: expediente ? expediente.fecha_apertura.toISOString() : null,
      notes: expediente?.observaciones ?? null,
      ...porCategoria,
      evoluciones: (evoluciones as EvolucionRow[]).map(toEvolucion),
    };
  });

  // --- Exploración física ---------------------------------------------------
  //
  // Una sola fila por expediente: es el examen de ingreso, se corrige, no se
  // acumula. Por eso PUT y no POST, y por eso el guardado es un reemplazo
  // completo de lo que la pantalla tiene en el formulario.

  app.get("/historia/:pacienteId/exploracion-fisica", { preHandler: ver }, async (req) => {
    const { pacienteId } = parseOr400(pacienteParam, req.params);
    const expediente = await expedienteDeLectura(pacienteId);
    if (!expediente) return exploracionVacia();

    const fila = await prisma.exploracionFisica.findUnique({
      where: { expediente_id: expediente.expediente_id },
      include: { hallazgos: true },
    });
    return fila ? toExploracion(fila) : exploracionVacia();
  });

  app.put("/historia/:pacienteId/exploracion-fisica", { preHandler: editar }, async (req) => {
    const { pacienteId } = parseOr400(pacienteParam, req.params);
    const input = parseOr400(exploracionSchema, req.body);

    const guardada = await prisma.$transaction(async (tx) => {
      const expedienteId = await abrirExpediente(tx, pacienteId);

      // La somatometría se reemplaza entera; el IMC no se guarda porque sale
      // de peso y talla y podría contradecirlas.
      const datos = {
        peso_kg: input.weightKg ?? null,
        talla_cm: input.heightCm ?? null,
        perimetro_abdominal_cm: input.abdominalCm ?? null,
        glasgow: input.glasgow ?? null,
        registrado_por: Number(req.user.sub),
      };
      const exploracion = await tx.exploracionFisica.upsert({
        where: { expediente_id: expedienteId },
        create: { expediente_id: expedienteId, ...datos },
        update: datos,
        select: { exploracion_id: true },
      });

      // Los hallazgos se reemplazan en bloque: dos consultas en vez de un
      // `upsert` por celda.
      //
      // Con seis regiones por cuatro técnicas, el bucle eran hasta 24 idas a la
      // base dentro de la transacción, y una transacción interactiva de Prisma
      // aborta a los 5 segundos por omisión: bajo carga, la exploración se
      // perdía entera. Borrar y reinsertar cambia `hallazgo_id`, y eso da
      // igual porque ninguna otra tabla lo referencia —la bitácora anota
      // `exploracion_id`, no la celda—.
      await tx.hallazgoExploracion.deleteMany({
        where: { exploracion_id: exploracion.exploracion_id },
      });
      if (input.findings.length > 0) {
        await tx.hallazgoExploracion.createMany({
          data: input.findings.map((hallazgo) => ({
            exploracion_id: exploracion.exploracion_id,
            region: hallazgo.region,
            tecnica: hallazgo.technique,
            estado: hallazgo.state,
            descripcion: hallazgo.text ?? null,
          })),
        });
      }

      await anotarCambio(tx, req, {
        expedienteId,
        categoria: "exploracion-fisica",
        registroId: exploracion.exploracion_id,
        accion: "modificacion",
        detalle: "actualizó la exploración física",
      });

      return tx.exploracionFisica.findUnique({
        where: { exploracion_id: exploracion.exploracion_id },
        include: { hallazgos: true },
      });
    });

    return toExploracion(guardada!);
  });
}
