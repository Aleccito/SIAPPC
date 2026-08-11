// Forma única de los errores de la API y traducción de los errores de Prisma.
//
// El contrato con el navegador es `{ error: string }` para un fallo con
// mensaje, o `{ error: ZodIssue[] }` cuando la validación de entrada falla —
// exactamente lo que lee frontend/src/shared/api/http.ts. No se cambia por
// gusto: cualquier otra forma deja al usuario con "Internal Server Error" en
// pantalla en vez del motivo real.

import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export class ApiError extends Error {
  // Campos declarados y asignados a mano, no propiedades de parámetro: Node
  // ejecuta estos .ts quitando los tipos y nada más, y `constructor(readonly
  // x)` es sintaxis que hay que compilar, no borrar.
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const badRequest = (msg: string) => new ApiError(400, msg);
export const notFound = (msg: string) => new ApiError(404, msg);
export const conflict = (msg: string) => new ApiError(409, msg);

/** Valida `data` o lanza un 400 con las incidencias de zod tal cual. */
export function parseOr400<T extends z.ZodTypeAny>(schema: T, data: unknown): z.infer<T> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) throw new ZodError400(parsed.error);
  return parsed.data;
}

/** 400 cuyo cuerpo es el arreglo de incidencias, no una cadena. */
export class ZodError400 extends Error {
  zodError: z.ZodError;

  constructor(zodError: z.ZodError) {
    super("Datos inválidos");
    this.name = "ZodError400";
    this.zodError = zodError;
  }
}

// Códigos de Prisma que corresponden a un error del cliente y no del servidor.
// Ver https://www.prisma.io/docs/orm/reference/error-reference
function fromPrisma(code: string, meta: unknown): ApiError | null {
  switch (code) {
    case "P2002": {
      const target = (meta as { target?: string[] | string } | undefined)?.target;
      const campos = Array.isArray(target) ? target.join(", ") : (target ?? "el valor");
      return conflict(`Ya existe un registro con ${campos}`);
    }
    // FK que apunta a algo que no existe, o borrado que dejaría huérfanos.
    case "P2003":
      return conflict("La operación viola una referencia con otra tabla");
    case "P2025":
      return notFound("Registro no encontrado");
    default:
      return null;
  }
}

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((err: FastifyError, req: FastifyRequest, reply: FastifyReply) => {
    if (err instanceof ZodError400) {
      return reply.code(400).send({ error: err.zodError.issues });
    }
    if (err instanceof ApiError) {
      return reply.code(err.status).send({ error: err.message });
    }

    const code = (err as unknown as { code?: string }).code;
    if (code) {
      const mapped = fromPrisma(code, (err as unknown as { meta?: unknown }).meta);
      if (mapped) return reply.code(mapped.status).send({ error: mapped.message });
    }

    // Los errores del propio Fastify (rate limit, payload demasiado grande,
    // ruta no encontrada) ya traen statusCode y un mensaje presentable.
    const status = err.statusCode ?? 500;
    if (status < 500) {
      return reply.code(status).send({ error: err.message });
    }

    // Un 500 se registra completo pero no se cuenta: el mensaje de una
    // excepción interna puede incluir SQL o datos de otro registro.
    req.log.error({ err }, "error no controlado");
    return reply.code(500).send({ error: "Error interno del servidor" });
  });
}
