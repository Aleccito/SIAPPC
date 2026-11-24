// Simulador del backend: atiende las mismas rutas (backend/src/routes/*.ts) con los mismos permisos
// (`rol_permiso` de seed.sql), códigos de error ({ error: string }), cabeceras (X-Total-Count) y DTO.
// `http.ts` lo llama en vez de fetch('/api/…') cuando VITE_API_MODE no es `real`.
import type { User } from '../types/auth';
import type { HistoriaEntry, SoapNote } from '../types/clinical';
import type { SearchResponse } from '../types/search';
import type { Report } from '../types/reports';
import { delayFor, wait, type DelayKind } from './delay';
import { clearFlag, mockFlags } from './flags';
import { puede, tokenDe, usuarioDeLogin, usuarioDeToken, type Accion } from './session';
import * as db from './db';
import * as ia from './ai';

type Ctx = {
  method: string;
  params: Record<string, string>;
  query: URLSearchParams;
  body: Record<string, unknown>;
  user: User;
  signal?: AbortSignal | null;
};
type Handler = (ctx: Ctx) => Response | Promise<Response>;
type Route = { method: string; pattern: RegExp; keys: string[]; perm?: [string, Accion]; delay: DelayKind; handler: Handler };

const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(status === 204 ? null : JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } });
const error = (status: number, message: string) => json(status, { error: message });

const routes: Route[] = [];
function route(method: string, path: string, opts: { perm?: [string, Accion]; delay?: DelayKind }, handler: Handler) {
  const keys: string[] = [];
  const pattern = new RegExp(`^${path.replace(/:([a-zA-Z]+)/g, (_, k: string) => (keys.push(k), '([^/]+)'))}$`);
  routes.push({ method, pattern, keys, perm: opts.perm, delay: opts.delay ?? (method === 'GET' ? 'detalle' : 'escritura'), handler });
}

/** El paciente de la ruta (por id numérico, como el backend), o un 404. */
function conPaciente(id: string, fn: (i: number) => Response): Response {
  const demo = db.demoDe(id);
  return demo ? fn(db.indiceDe(demo)) : error(404, `No existe el paciente ${id}`);
}

const texto = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null);

// --- Sesión -----------------------------------------------------------------

route('POST', '/auth/logout', {}, () => json(204, null));
route('GET', '/auth/me', {}, ({ user }) => json(200, user));

// --- Pacientes --------------------------------------------------------------

route('GET', '/patients', { delay: 'lista' }, ({ query }) => {
  const todos = db.pacientes();
  const page = Number(query.get('page') ?? 0);
  const size = query.get('pageSize') ? Number(query.get('pageSize')) : null;
  const items = size ? todos.slice(page * size, page * size + size) : todos;
  return json(200, items, { 'X-Total-Count': String(todos.length) });
});
route('GET', '/patients/:id', {}, ({ params }) => conPaciente(params.id, (i) => json(200, db.paciente(i))));
route('GET', '/patients/:id/assignments', { perm: ['pacientes', 'ver'] }, ({ params }) =>
  conPaciente(params.id, (i) => json(200, [{ userId: 1, name: 'Carlos Méndez', role: 'Médico', assignedAt: db.paciente(i).arrivedAt, reason: 'Médico tratante' }])),
);

// --- Expediente -------------------------------------------------------------

route('GET', '/historia/:id', { perm: ['historia_clinica', 'ver'] }, ({ params }) => conPaciente(params.id, (i) => json(200, db.expediente(i))));
route('GET', '/historia/:id/cambios', { perm: ['historia_clinica', 'ver'] }, ({ params }) => conPaciente(params.id, () => json(200, [])));
// Enfermería escribe observaciones con `ver` (backend/src/routes/historia.ts).
route('PATCH', '/historia/:id/observaciones', { perm: ['historia_clinica', 'ver'] }, ({ params, body }) =>
  conPaciente(params.id, () => {
    db.diario.observaciones[params.id] = String(body.notes ?? '');
    db.guardar();
    return json(200, { patientId: params.id, notes: texto(body.notes), updatedAt: new Date().toISOString() });
  }),
);
route('GET', '/historia/:id/exploracion-fisica', { perm: ['historia_clinica', 'ver'] }, ({ params }) => conPaciente(params.id, (i) => json(200, db.exploracion(i))));
route('PUT', '/historia/:id/exploracion-fisica', { perm: ['historia_clinica', 'editar'] }, ({ params, body }) =>
  conPaciente(params.id, () => {
    const dto = { ...(body as object), updatedAt: new Date().toISOString() } as ReturnType<typeof db.exploracion>;
    db.diario.exploracion[params.id] = dto;
    db.guardar();
    return json(200, dto);
  }),
);
route('GET', '/historia/:id/:cat', { perm: ['historia_clinica', 'ver'], delay: 'lista' }, ({ params }) =>
  db.CATEGORIAS.includes(params.cat as never) ? conPaciente(params.id, (i) => json(200, db.categoria(i, params.cat))) : error(404, 'Ruta no encontrada'),
);
route('POST', '/historia/:id/:cat', { perm: ['historia_clinica', 'crear'] }, ({ params, body }) => {
  if (!db.CATEGORIAS.includes(params.cat as never)) return error(404, 'Ruta no encontrada');
  return conPaciente(params.id, () => {
    const entry: HistoriaEntry = { ...body, id: db.nuevoId() };
    if (params.cat === 'antecedentes') entry.active ??= true;
    if (params.cat === 'diagnosticos') entry.status ??= 'activo';
    const porPaciente = (db.diario.historia[params.id] ??= {});
    porPaciente[params.cat] = [entry, ...(porPaciente[params.cat] ?? [])];
    db.guardar();
    return json(201, entry, { Location: `/historia/${params.id}/${params.cat}/${entry.id}` });
  });
});
route('PATCH', '/historia/:id/:cat/:item', { perm: ['historia_clinica', 'editar'] }, ({ params, body }) =>
  conPaciente(params.id, (i) => {
    const actual = db.categoria(i, params.cat).find((e) => e.id === params.item);
    if (!actual) return error(404, `No existe el registro ${params.item}`);
    db.diario.cambiosHistoria[params.item] = { ...db.diario.cambiosHistoria[params.item], ...body };
    db.guardar();
    return json(200, { ...actual, ...body });
  }),
);

// --- Notas SOAP -------------------------------------------------------------

const notaDe = (id: string) => db.notas().find((n) => n.id === id);
const secciones = (b: Record<string, unknown>) => ({ subjective: texto(b.subjective), objective: texto(b.objective), assessment: texto(b.assessment), plan: texto(b.plan) });

route('GET', '/soap/notes', { perm: ['notas_soap', 'ver'], delay: 'lista' }, ({ query }) => {
  const patientId = query.get('patientId');
  if (!patientId) return error(400, 'patientId es requerido');
  if (!db.demoDe(patientId)) return error(404, `No existe el paciente ${patientId}`);
  return json(200, db.notas().filter((n) => n.patientId === patientId && n.parentId === null).sort((a, b) => b.at.localeCompare(a.at)));
});
route('GET', '/soap/notes/:id', { perm: ['notas_soap', 'ver'] }, ({ params }) => {
  const nota = notaDe(params.id);
  return nota ? json(200, nota) : error(404, `No existe la nota ${params.id}`);
});
route('POST', '/soap/notes', { perm: ['notas_soap', 'crear'] }, ({ body, user }) => {
  const patientId = String(body.patientId ?? '');
  if (!db.demoDe(patientId)) return error(404, `No existe el paciente ${patientId}`);
  const s = secciones(body);
  if (!s.subjective && !s.objective && !s.assessment && !s.plan) return error(400, 'La nota necesita al menos una sección');
  const ahora = new Date().toISOString();
  const firmar = body.sign === true;
  const nota: SoapNote = {
    id: db.nuevoId(),
    patientId,
    authorId: user.id,
    authorName: user.name,
    parentId: null,
    at: ahora,
    ...s,
    status: firmar ? 'firmada' : 'borrador',
    signedById: firmar ? user.id : null,
    signedByName: firmar ? user.name : null,
    signedAt: firmar ? ahora : null,
  };
  db.diario.notas.unshift(nota);
  db.guardar();
  return json(201, nota);
});
const editarNota: Handler = ({ params, body, user, method }) => {
  const nota = notaDe(params.id);
  if (!nota) return error(404, `No existe la nota ${params.id}`);
  if (nota.status === 'firmada') return error(409, 'La nota ya está firmada: agregue un addendum');
  if (nota.authorId !== user.id) return error(403, 'Solo el autor puede editar su borrador');
  const s = secciones(body);
  const cambios = method === 'PUT' ? s : Object.fromEntries(Object.entries(s).filter(([k]) => k in body));
  db.diario.cambiosNota[nota.id] = { ...db.diario.cambiosNota[nota.id], ...cambios, at: new Date().toISOString() };
  db.guardar();
  return json(200, notaDe(nota.id));
};
route('PUT', '/soap/notes/:id', { perm: ['notas_soap', 'editar'] }, editarNota);
route('PATCH', '/soap/notes/:id', { perm: ['notas_soap', 'editar'] }, editarNota);
route('POST', '/soap/notes/:id/sign', { perm: ['notas_soap', 'editar'] }, ({ params, user }) => {
  const nota = notaDe(params.id);
  if (!nota) return error(404, `No existe la nota ${params.id}`);
  if (nota.authorId !== user.id) return error(403, 'Solo el autor puede firmar la nota');
  if (nota.status === 'firmada') return error(409, 'La nota ya está firmada');
  const ahora = new Date().toISOString();
  db.diario.cambiosNota[nota.id] = { ...db.diario.cambiosNota[nota.id], status: 'firmada', signedById: user.id, signedByName: user.name, signedAt: ahora };
  db.guardar();
  return json(200, notaDe(nota.id));
});
route('POST', '/soap/notes/:id/addendum', { perm: ['notas_soap', 'crear'] }, ({ params, body, user }) => {
  const padre = notaDe(params.id);
  if (!padre) return error(404, `No existe la nota ${params.id}`);
  if (padre.status !== 'firmada') return error(409, 'La nota todavía es un borrador: edítela en vez de añadir un addendum');
  const ahora = new Date().toISOString();
  const nota: SoapNote = { ...padre, id: db.nuevoId(), parentId: padre.id, authorId: user.id, authorName: user.name, at: ahora, ...secciones(body), status: 'firmada', signedById: user.id, signedByName: user.name, signedAt: ahora };
  db.diario.notas.unshift(nota);
  db.guardar();
  return json(201, nota);
});

// --- Tablero, monitoreo, sensores y dispositivos ----------------------------

// El seed solo asigna pacientes al médico. Para poder recorrer la app con la cuenta de enfermería,
// el simulador le muestra los mismos 8 (en el backend real su lista saldría vacía).
route('GET', '/dashboard/assigned-patients', { perm: ['pacientes', 'ver'], delay: 'lista' }, ({ user }) =>
  json(200, user.role === 'medico' || user.role === 'enfermero' ? db.DEMOS.map((_, i) => db.asignado(i)).sort((a, b) => b.arrivedAt.localeCompare(a.arrivedAt)) : []),
);
route('GET', '/dashboard/devices', { perm: ['dispositivos', 'ver'], delay: 'lista' }, () => json(200, db.dispositivos()));
route('GET', '/monitoring/beds', { perm: ['monitoreo', 'ver'], delay: 'lista' }, ({ query }) => {
  const unitId = query.get('unitId');
  return json(200, db.camas().filter((c) => !unitId || c.unitId === unitId));
});
route('GET', '/sensors/readings', { perm: ['monitoreo', 'ver'], delay: 'lista' }, ({ query }) => {
  const device = query.get('device');
  const variable = query.get('variable');
  const limit = Math.min(Number(query.get('limit') ?? 100), 500);
  return json(200, db.lecturas().filter((l) => (!device || l.device === device) && (!variable || l.variable === variable)).slice(0, limit));
});
route('GET', '/sensors/alerts', { perm: ['alertas', 'ver'], delay: 'lista' }, ({ query }) => {
  const f = (k: string) => query.get(k);
  const limit = Math.min(Number(f('limit') ?? 100), 500);
  return json(
    200,
    db
      .alertas()
      .filter((a) => (!f('device') || a.device === f('device')) && (!f('variable') || a.variable === f('variable')) && (!f('severity') || a.severity === f('severity')) && (!f('status') || a.status === f('status')))
      .slice(0, limit),
  );
});

// --- Notificaciones ---------------------------------------------------------

route('GET', '/notifications', { perm: ['alertas', 'ver'], delay: 'lista' }, ({ query }) => {
  const page = Number(query.get('page') ?? 0);
  const size = Number(query.get('pageSize') ?? 20);
  const todas = db.notificaciones();
  return json(200, { total: todas.length, unread: todas.filter((n) => !n.read).length, entries: todas.slice(page * size, page * size + size) });
});
route('POST', '/notifications/read-all', { perm: ['alertas', 'ver'] }, () => {
  const updated = db.notificaciones().filter((n) => !n.read).length;
  db.diario.leidas = ['*'];
  db.guardar();
  return json(200, { updated });
});
route('POST', '/notifications/:id/read', { perm: ['alertas', 'ver'] }, ({ params }) => {
  if (!db.notificaciones().some((n) => n.id === params.id)) return error(404, 'Notificación no encontrada');
  db.diario.leidas = [...new Set([...db.diario.leidas, params.id])];
  db.guardar();
  return json(204, null);
});

// --- Reportes y búsqueda ----------------------------------------------------

// GET /reports es la bitácora del ETL (backend/etl/), no los reportes clínicos. Inventado: el seed no la trae.
route('GET', '/reports', { delay: 'lista' }, () => {
  const corrida = (id: number, name: string, source: string, horas: number, leidas: number, escritas: number): Report => ({
    id: String(id), name, source, status: 'ready', updatedAt: db.isoHace(horas * 3_600_000), rowsRead: leidas, rowsWritten: escritas, error: null,
  });
  return json(200, [corrida(3, 'lectura_hora', 'lectura', 0.5, 984, 24), corrida(2, 'alerta_dia', 'alerta', 1, 168, 6), corrida(1, 'simulacion', 'siappc_sim', 20, 5400, 5400)]);
});
route('GET', '/reports/actividad-clinica.csv', { perm: ['reportes', 'ver'], delay: 'escritura' }, ({ query }) => {
  const desde = query.get('desde') ?? '';
  const hasta = query.get('hasta') ?? '';
  const filas = db.notas().map((n) => `${n.at.slice(0, 10)},${db.demoDe(n.patientId)?.delSeed.cedula ?? ''},nota_soap,${n.status},${n.authorName}`);
  const csv = ['fecha,cedula,tipo,estado,autor', ...filas].join('\n');
  return new Response(csv, { status: 200, headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="actividad-clinica_${desde}_${hasta}.csv"` } });
});

route('GET', '/search', { delay: 'lista' }, ({ query }) => {
  const q = (query.get('q') ?? '').trim();
  if (q.length < 2) return error(400, 'La búsqueda necesita al menos 2 caracteres');
  const has = (t: string | null | undefined) => (t ?? '').toLocaleLowerCase('es').includes(q.toLocaleLowerCase('es'));
  // Mismas reglas que backend/src/routes/search.ts: paciente por nombre o cédula; nota por su texto; documento por su título.
  const patients = db.DEMOS.flatMap((d, i) => {
    if (!has(d.delSeed.nombre) && !has(d.delSeed.cedula)) return [];
    const a = db.asignado(i);
    const dx = db.categoria(i, 'diagnosticos').find((x) => x.status === 'activo');
    return [{ kind: 'patient' as const, id: a.id, name: a.name, document: a.document, critical: a.worstSeverity === 'alta' || a.worstSeverity === 'critica', bed: a.bed, unit: a.unit, device: a.device, diagnosis: (dx?.description as string) ?? null }];
  });
  const notes = db
    .notas()
    .filter((n) => [n.subjective, n.objective, n.assessment, n.plan].some(has))
    .map((n) => ({ kind: 'soapNote' as const, id: n.id, patientId: n.patientId, patientName: db.demoDe(n.patientId)?.delSeed.nombre ?? '', at: n.at, excerpt: [n.subjective, n.objective, n.assessment, n.plan].find(has) ?? '' }));
  const documents = db.DEMOS.flatMap((d, i) =>
    db
      .categoria(i, 'documentos')
      .filter((doc) => has(doc.title as string))
      .map((doc) => ({ kind: 'document' as const, id: doc.id, patientId: db.idDe(i), patientName: d.delSeed.nombre, title: doc.title as string, type: doc.type as string, at: (doc.uploadedAt as string) ?? '', unit: db.asignado(i).unit })),
  );
  const body: SearchResponse = { query: q, patients, notes, documents, total: patients.length + notes.length + documents.length };
  return json(200, body);
});

// --- Asistente de IA (backend/src/routes/ai.ts) ------------------------------------------------------------

const IA: [string, Accion] = ['asistente_ia', 'ver'];
const RATE = 'Rate limit exceeded, retry in 1 minute';

/** El paciente de la ruta /ai/assist/:id (entero positivo, como el zod del backend), o el error. */
function pacienteIa(id: string): number | Response {
  if (!/^[1-9]\d*$/.test(id)) return error(400, 'patientId inválido');
  const demo = db.demoDe(id);
  return demo ? db.indiceDe(demo) : error(404, 'Paciente no encontrado');
}

// Toda consulta va sobre un paciente (PR #55): sin él, 400 antes de abrir el flujo.
route('POST', '/ai/assist/stream', { perm: IA, delay: 'detalle' }, async ({ body, signal }) => {
  const id = body.patientId;
  if (id === undefined || id === null || id === '' || !/^[1-9]\d*$/.test(String(id))) return error(400, 'Selecciona un paciente');
  const question = texto(body.question);
  const symptoms = texto(body.symptoms);
  if (!question && !symptoms) return error(400, 'Escribe la consulta');
  if ((question?.length ?? 0) > 5000 || (symptoms?.length ?? 0) > 5000) return error(400, 'La consulta no puede pasar de 5000 caracteres');
  const demo = db.demoDe(String(id));
  if (!demo) return error(404, 'Paciente no encontrado');
  if (ia.excedido('consulta')) return error(429, RATE);
  if (mockFlags().ia === 'caida') return error(503, ia.NO_DISPONIBLE);
  const respuesta = ia.responder(db.indiceDe(demo), [symptoms && `Síntomas/hallazgos: ${symptoms}`, question].filter(Boolean).join('\n'));
  return new Response(ia.flujo(respuesta, signal), { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
});

route('GET', '/ai/assist/:id', { perm: IA }, ({ params }) => {
  const i = pacienteIa(params.id);
  return typeof i === 'number' ? json(200, { analysis: ia.analisisVigente(i), disclaimer: ia.DISCLAIMER }) : i;
});

// Ideas a pedido (PR #55): aunque el paciente no tenga alertas; tarda lo que tarde el modelo.
route('POST', '/ai/assist/:id/ideas', { perm: IA, delay: 'detalle' }, async ({ params, signal }) => {
  const i = pacienteIa(params.id);
  if (typeof i !== 'number') return i;
  if (ia.excedido('ideas')) return error(429, RATE);
  await wait(ia.tiempos().ideas, signal);
  if (mockFlags().ia === 'caida') return error(503, ia.NO_DISPONIBLE);
  return json(200, { analysis: ia.generarIdeas(i), disclaimer: ia.DISCLAIMER });
});

// --- Flujo de alertas -------------------------------------------------------

// El seed no genera alertas nuevas: el flujo avisa que está listo y se queda abierto (con latido)
// hasta que la pantalla lo cierra, igual que el backend sin alertas nuevas.
route('GET', '/alerts/stream', { perm: ['alertas', 'ver'], delay: 'detalle' }, ({ signal }) => {
  const encoder = new TextEncoder();
  let latido: ReturnType<typeof setInterval> | undefined;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(`event: listo\ndata: ${JSON.stringify({ at: new Date().toISOString() })}\n\n`));
      latido = setInterval(() => controller.enqueue(encoder.encode(': latido\n\n')), 25_000);
      signal?.addEventListener('abort', () => {
        clearInterval(latido);
        try {
          controller.close();
        } catch {
          // Ya cerrado.
        }
      });
    },
    cancel() {
      clearInterval(latido);
    },
  });
  return new Response(stream, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
});

// --- Entrada ----------------------------------------------------------------

function cabecera(init: RequestInit, nombre: string): string | null {
  const h = init.headers;
  if (!h) return null;
  if (h instanceof Headers) return h.get(nombre);
  if (Array.isArray(h)) return h.find(([k]) => k.toLowerCase() === nombre.toLowerCase())?.[1] ?? null;
  const entry = Object.entries(h).find(([k]) => k.toLowerCase() === nombre.toLowerCase());
  return entry ? String(entry[1]) : null;
}

/** El "fetch" del simulador. Recibe la ruta sin /api. */
export async function mockFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const method = (init.method ?? 'GET').toUpperCase();
  const url = new URL(path, 'http://simulador');
  let body: Record<string, unknown> = {};
  if (typeof init.body === 'string' && init.body) {
    try {
      body = JSON.parse(init.body) as Record<string, unknown>;
    } catch {
      return error(400, 'Cuerpo inválido');
    }
  }

  // El login no lleva sesión.
  if (method === 'POST' && url.pathname === '/auth/login') {
    await wait(delayFor('escritura'), init.signal);
    const email = texto(body.email);
    const password = texto(body.password);
    if (!email || !password) return error(400, 'Email y contraseña son requeridos');
    const user = usuarioDeLogin(email);
    return json(200, { token: tokenDe(user), user });
  }

  for (const r of routes) {
    if (r.method !== method) continue;
    const m = r.pattern.exec(url.pathname);
    if (!m) continue;
    await wait(delayFor(r.delay), init.signal);

    const token = cabecera(init, 'Authorization')?.replace(/^Bearer /, '') ?? null;
    const user = usuarioDeToken(token);
    if (mockFlags().sesion === 'vencida' && user) {
      clearFlag('sesion');
      return error(401, 'No autorizado');
    }
    if (!user) return error(401, 'No autorizado');
    if (r.perm && !puede(user.role, r.perm[0], r.perm[1])) return error(403, 'Permisos insuficientes');

    const params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
    return r.handler({ method, params, query: url.searchParams, body, user, signal: init.signal });
  }
  return error(404, `Ruta no encontrada: ${method} ${url.pathname}`);
}
