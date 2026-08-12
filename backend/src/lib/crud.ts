// Fábrica de rutas CRUD.
//
// Un recurso se describe una vez —modelo, permisos, validación, cómo se ve
// desde afuera— y de ahí salen las rutas con los verbos que les tocan:
//
//   GET    /recurso        lista        (X-Total-Count, ?page & ?pageSize)
//   GET    /recurso/:id    uno          (404 si no está)
//   POST   /recurso        alta         (201 + Location)
//   PUT    /recurso/:id    reemplazo    (cuerpo completo)
//   PATCH  /recurso/:id    modificación (cuerpo parcial)
//   DELETE /recurso/:id    baja         (204)
//
// Lo que NO va aquí: cualquier ruta con lógica propia —autenticación, la matriz
// de permisos, la ingesta, los reportes— se escribe a mano. La fábrica es para
// el CRUD que se repetía igual en siete archivos, no para esconder las reglas
// del negocio.

import type { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "./prisma.ts";
import { recordAudit } from "./audit.ts";
import type { Queryable } from "./audit.ts";
import { notFound, parseOr400 } from "./http.ts";
import type { PermissionAction } from "../types.ts";

/**
 * Lo que la fábrica necesita de un modelo de Prisma. Se declara estructural en
 * vez de con los tipos generados porque no hay una unión de delegates que
 * TypeScript pueda estrechar por recurso. Los tipos que sí importan —el cuerpo
 * que entra y el objeto que sale— quedan atados en `CrudConfig`.
 */
type Delegate = {
  findMany(args?: Record<string, unknown>): Promise<unknown[]>;
  findFirst(args: Record<string, unknown>): Promise<unknown>;
  create(args: Record<string, unknown>): Promise<unknown>;
  update(args: Record<string, unknown>): Promise<unknown>;
  delete(args: Record<string, unknown>): Promise<unknown>;
  count(args?: Record<string, unknown>): Promise<number>;
};

/** Nombres de modelo válidos: los de `prisma.<modelo>`, no cualquier cadena. */
export type ModelName = {
  [K in keyof typeof prisma]: (typeof prisma)[K] extends { findMany: unknown } ? K : never;
}[keyof typeof prisma];

// El delegate dentro de `$transaction` es otro objeto que el de `prisma`, así
// que se resuelve por nombre sobre el cliente que toque.
function delegate(client: Queryable | typeof prisma, model: ModelName): Delegate {
  return (client as unknown as Record<string, Delegate>)[model]!;
}

export type CrudConfig<TRow, TDto, TCreate, TUpdate> = {
  /** Segmento de la URL, con la barra: "/patients". */
  path: string;
  /** Modelo de Prisma tal como se llama en el cliente: "paciente". */
  model: ModelName;
  /** Columna de la llave primaria: "paciente_id". */
  idField: string;
  /** Entidad tal como se anota en `auditoria`. */
  auditEntity: string;
  /**
   * Módulo de la tabla `permiso` que exige cada acción. `null` = basta con
   * estar autenticado.
   *
   * Va por acción y no por recurso porque los dos no coinciden: un catálogo
   * como `/units` lo lee cualquiera para llenar un selector, pero darlo de alta
   * o de baja es administración. Un solo módulo para todo el recurso obligaría
   * a elegir entre romper los formularios o dejar la escritura abierta.
   */
  permissions: Record<PermissionAction, string | null>;
  // El tercer parámetro queda abierto: un esquema con `.default()` acepta a la
  // entrada menos de lo que produce a la salida, y fijarlo a TCreate lo rechaza.
  createSchema: z.ZodType<TCreate, z.ZodTypeDef, unknown>;
  updateSchema: z.ZodType<TUpdate, z.ZodTypeDef, unknown>;
  /** Del renglón de la base a lo que ve el navegador. */
  toDto: (row: TRow) => TDto;
  /** Del cuerpo validado a `data` de Prisma. */
  toCreateData: (input: TCreate, req: FastifyRequest) => Record<string, unknown>;
  toUpdateData: (input: TUpdate, req: FastifyRequest) => Record<string, unknown>;
  /** Filtro, orden y relaciones comunes a lista y consulta por id. */
  query?: {
    /**
     * Constante, o una función de la petición cuando el filtro depende de
     * QUIÉN pregunta —el caso del hospital—.
     *
     * Se aplica a la lista, al conteo y a la consulta por id, y como esos dos
     * últimos son los que usan PATCH, PUT y DELETE antes de escribir, un
     * registro fuera del filtro no se lee NI se modifica: responde 404, que es
     * lo correcto —existir en otro hospital es indistinguible de no existir—.
     */
    where?: Record<string, unknown> | ((req: FastifyRequest) => Record<string, unknown>);
    orderBy?: unknown;
    include?: Record<string, unknown>;
  };
  /**
   * Baja lógica. Presente = DELETE marca la columna en vez de borrar el
   * renglón, que es lo que corresponde en todo lo que la bitácora referencia.
   */
  softDelete?: { field: string; inactiveValue: unknown };
  /** Texto de la bitácora. Se ve tal cual en la pantalla de Auditoría. */
  describe: {
    create: (row: TRow) => string;
    update: (row: TRow) => string;
    remove: (row: TRow) => string;
  };
};

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(1).max(200).optional(),
});

// Los identificadores son enteros sin signo en todas las tablas; uno que no lo
// es se corta aquí y no llega a la base.
const idSchema = z.coerce.number().int().positive();

export function registerCrud<TRow, TDto, TCreate, TUpdate>(
  app: FastifyInstance,
  config: CrudConfig<TRow, TDto, TCreate, TUpdate>,
): void {
  const { path, model, idField, auditEntity, permissions, query = {}, softDelete } = config;

  // Sin módulo para la acción, la ruta solo exige sesión; el `preHandler` de
  // autenticación lo pone quien registra el plugin.
  const guard = (accion: PermissionAction) => {
    const modulo = permissions[accion];
    return modulo ? [app.requirePermission(modulo, accion)] : [];
  };

  // Se resuelve por petición y no una vez al registrar la ruta: con el filtro
  // congelado en el arranque, uno que dependa de la sesión sería siempre el de
  // quien arrancó el proceso, que no es nadie.
  const whereFor = (req: FastifyRequest): Record<string, unknown> =>
    typeof query.where === "function" ? query.where(req) : (query.where ?? {});

  async function findById(id: number, req: FastifyRequest): Promise<TRow> {
    const row = (await delegate(prisma, model).findFirst({
      where: { ...whereFor(req), [idField]: id },
      include: query.include,
    })) as TRow | null;
    if (!row) throw notFound(`No existe ${auditEntity} con id ${id}`);
    return row;
  }

  const paramId = (req: FastifyRequest) =>
    parseOr400(idSchema, (req.params as { id: string }).id);

  app.get(path, { preHandler: guard("ver") }, async (req, reply) => {
    const { page, pageSize } = parseOr400(listQuerySchema, req.query);

    // Sin `pageSize` la lista sale completa: es como la pide hoy el navegador y
    // cambiar el valor por defecto rompería las pantallas que no paginan.
    const pagination = pageSize ? { skip: page * pageSize, take: pageSize } : {};
    const baseWhere = whereFor(req);
    const [rows, total] = await Promise.all([
      delegate(prisma, model).findMany({
        where: baseWhere,
        orderBy: query.orderBy,
        include: query.include,
        ...pagination,
      }),
      delegate(prisma, model).count({ where: baseWhere }),
    ]);

    // El total va en la cabecera y no en el cuerpo para que la respuesta siga
    // siendo el arreglo de recursos, que es lo que espera un cliente REST.
    reply.header("X-Total-Count", String(total));
    return (rows as TRow[]).map(config.toDto);
  });

  app.get(`${path}/:id`, { preHandler: guard("ver") }, async (req) =>
    config.toDto(await findById(paramId(req), req)),
  );

  app.post(path, { preHandler: guard("crear") }, async (req, reply) => {
    const data = config.toCreateData(parseOr400(config.createSchema, req.body), req);

    // Alta y bitácora en la misma transacción: un registro sin constancia de
    // quién lo creó es justo el rastro que no puede faltar. Si no se puede
    // anotar, no se da de alta.
    const row = await prisma.$transaction(async (tx) => {
      const created = (await delegate(tx, model).create({
        data,
        include: query.include,
      })) as TRow;
      await recordAudit(tx, {
        actorId: req.user.sub,
        entidad: auditEntity,
        registroId: rowId(created, idField),
        accion: "INSERT",
        observacion: config.describe.create(created),
      });
      return created;
    });

    reply.header("Location", `${path}/${rowId(row, idField)}`);
    return reply.code(201).send(config.toDto(row));
  });

  // PUT reemplaza (exige el cuerpo completo), PATCH modifica lo que venga. La
  // diferencia entre los dos es qué esquema valida la entrada, no qué hace la
  // base, así que comparten el resto.
  const upsertHandler =
    <T>(
      schema: z.ZodType<T, z.ZodTypeDef, unknown>,
      toData: (input: T, req: FastifyRequest) => Record<string, unknown>,
    ) =>
    async (req: FastifyRequest) => {
      const id = paramId(req);
      // Se lee ANTES de tocarlo: la bitácora necesita saber sobre qué se aplicó
      // el cambio, y después del UPDATE ya no se sabe cómo estaba. De paso, un
      // id inexistente se corta aquí y no tras un UPDATE que no afectó nada.
      const before = await findById(id, req);
      const data = toData(parseOr400(schema, req.body), req);

      return config.toDto(
        await prisma.$transaction(async (tx) => {
          const updated = (await delegate(tx, model).update({
            where: { [idField]: id },
            data,
            include: query.include,
          })) as TRow;
          await recordAudit(tx, {
            actorId: req.user.sub,
            entidad: auditEntity,
            registroId: id,
            accion: "UPDATE",
            observacion: config.describe.update(before),
          });
          return updated;
        }),
      );
    };

  app.put(`${path}/:id`, { preHandler: guard("editar") }, upsertHandler(config.createSchema, config.toCreateData));
  app.patch(`${path}/:id`, { preHandler: guard("editar") }, upsertHandler(config.updateSchema, config.toUpdateData));

  app.delete(`${path}/:id`, { preHandler: guard("eliminar") }, async (req, reply) => {
    const id = paramId(req);
    const before = await findById(id, req);

    await prisma.$transaction(async (tx) => {
      const d = delegate(tx, model);
      if (softDelete) {
        await d.update({
          where: { [idField]: id },
          data: { [softDelete.field]: softDelete.inactiveValue },
        });
      } else {
        await d.delete({ where: { [idField]: id } });
      }
      await recordAudit(tx, {
        actorId: req.user.sub,
        entidad: auditEntity,
        registroId: id,
        accion: "DELETE",
        observacion: config.describe.remove(before),
      });
    });

    return reply.code(204).send();
  });
}

function rowId(row: unknown, idField: string): number {
  return Number((row as Record<string, unknown>)[idField]);
}
