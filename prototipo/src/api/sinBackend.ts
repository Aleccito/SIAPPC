// SIMULADO: lo que el backend todavía NO tiene (docs/CONEXION-BACKEND.md, secciones 3, 7 y 11). Siempre simulado,
// también con VITE_API_MODE=real, y por cédula (no por id: el id del backend real no tiene por qué
// coincidir con el del simulador). Cada función dice qué endpoint haría falta.
//
// De dónde sale cada paciente:
// - Los 8 del simulador (DEMO-0001…0008): del bloque `inventado` de src/api/mock/seed/DEMO-000X.ts, hecho a mano
//   coherente con su caso (no viene del seed).
// - Cualquier otro (DEMO-0009 en adelante, o uno dado de alta): un perfil GENERADO por src/api/simulacion.ts según
//   su motivo de consulta, la gravedad de sus alertas, su edad y su sexo (los textos usan además las observaciones
//   y los diagnósticos del expediente real). Lleva `generado: true`.
// Y en los dos casos lo que se mide (PA, temperatura, paneles del monitoreo detallado, tendencias) no es un número
// fijo: deriva poco a poco alrededor del valor del caso (simulacion.ts) y las pantallas lo vuelven a pedir cada 15 s.
// La temperatura es la del monitor cuando el backend la tiene (`temp`, la manda el publicador de demo).
import { useQuery } from '@tanstack/react-query';
import { ageFrom } from '../lib/clinical';
import { getExpediente } from './clinical';
import { listAssignedPatients } from './dashboard';
import { API_MODE, goesToBackend } from './mode';
import * as db from './mock/db';
import { delayFor, wait } from './mock/delay';
import type { Inventado } from './mock/seed/tipos';
import { listPatients } from './patients';
import { listReadings } from './sensors';
import { monitoreoVivo, perfilGenerado, signosVivos, vivo, type Contexto, type MonitoreoVivo } from './simulacion';
import type { Expediente } from './types/clinical';
import type { AssignedPatient } from './types/dashboard';
import type { Patient } from './types/patients';
import type { SensorReading } from './types/sensors';

const HORA = 3_600_000;
/** Cada cuánto vuelven a pedirse los valores simulados que cambian solos. */
export const VIVO_MS = 15_000;

async function pedir<T>(fn: () => T | Promise<T>, kind: 'detalle' | 'lista' | 'escritura' = 'detalle'): Promise<T> {
  await wait(delayFor(kind));
  return fn();
}

/** Lo guardado en las pantallas sin backend (sessionStorage, como el resto del simulador). */
function guardado<T>(clave: string): T | undefined {
  return db.diario.extra[clave] as T | undefined;
}
function guardar(clave: string, valor: unknown) {
  db.diario.extra[clave] = valor;
  db.guardar();
}

// --- El contexto real de cada paciente (para generar su perfil) ------------------------------------

/** La misma promesa durante `ttl` ms (si falla, se olvida y la siguiente vez se vuelve a pedir). */
function memo<T>(ttl: number, fn: () => Promise<T>) {
  let at = 0;
  let promesa: Promise<T> | null = null;
  return () => {
    if (!promesa || Date.now() - at > ttl) {
      at = Date.now();
      promesa = fn().catch((e: unknown) => {
        promesa = null;
        throw e;
      });
    }
    return promesa;
  };
}

// Cachés largas a propósito: el backend tiene un techo de 100 peticiones por minuto por IP (RATE_LIMIT_MAX, pedido 33)
// y React Query ya pide lo mismo para las pantallas. Lo que cambia (la gravedad, la temperatura) va cada 30 s, que es
// lo que tarda el monitor en mandar una lectura nueva.
const pacientes = memo(5 * 60_000, async (): Promise<Patient[]> => (await listPatients()).items);
/** Sin permiso (el administrador) o sin pacientes a cargo: lista vacía, el perfil sale sin la gravedad. */
const asignados = memo(30_000, () => listAssignedPatients().catch((): AssignedPatient[] => []));
const expedientes = new Map<string, () => Promise<Expediente | null>>();
const expediente = (id: string) => {
  if (!expedientes.has(id)) expedientes.set(id, memo(5 * 60_000, () => getExpediente(id).catch(() => null)));
  return expedientes.get(id)!();
};

/** Lo simulado de un paciente, sea hecho a mano o generado. */
type Perfil = Pick<Inventado, 'personales' | 'pa' | 'temp' | 'monitoreo' | 'notaIngreso' | 'interrogatorio' | 'indicaciones' | 'notaCorrelativa' | 'turno'> & {
  /** true: generado por diagnóstico (no es uno de los 8). */
  generado: boolean;
  signosIngreso: SignosIngreso | null;
  /** Alergias activas (las del seed o las del expediente real). */
  alergias: string[];
  /** Para las tendencias simuladas: cuándo llegó y sus FC, SpO2 y FR de ahora. */
  llegada: number;
  actuales: { hr: number; spo2: number; resp: number };
};

/**
 * El perfil del paciente, o null si la cédula no existe. `conTextos`: además pide el expediente real (observaciones,
 * diagnósticos y alergias) para los textos de un perfil generado; las listas no lo piden y los números son los mismos.
 */
async function perfil(cedula: string, conTextos = false): Promise<Perfil | null> {
  const d = db.demoPorCedula(cedula);
  if (d) {
    const s = d.delSeed;
    const ultimo = (v: string) => s.lecturas[v]?.at(-1) ?? 0;
    return {
      ...d.inventado,
      generado: false,
      signosIngreso: d.inventado.exploracion?.signosIngreso ?? null,
      alergias: s.alergias.filter((a) => a.estado === 'activa').map((a) => a.sustancia),
      llegada: db.AHORA - s.llegadaHorasAtras * HORA,
      actuales: { hr: ultimo('hr'), spo2: ultimo('spo2'), resp: ultimo('resp') },
    };
  }
  const p = (await pacientes().catch((): Patient[] => [])).find((x) => x.document === cedula);
  if (!p) return null;
  const a = (await asignados()).find((x) => x.id === p.id);
  const ctx: Contexto = { cedula, nombre: p.name, motivo: p.reason, edad: ageFrom(p.birthDate), sexo: p.sex, severidad: a?.worstSeverity ?? null };
  const e = conTextos ? await expediente(p.id) : null;
  if (e) {
    ctx.observaciones = e.notes;
    ctx.diagnosticos = e.diagnosticos.filter((x) => x.status === 'activo').map((x) => String(x.description));
  }
  const g = perfilGenerado(ctx);
  const dx = ctx.diagnosticos?.length ? ctx.diagnosticos.join('; ') : p.reason;
  return {
    ...g,
    generado: true,
    notaCorrelativa: `${dx}. ${g.turno.novedad}; pendiente: ${g.turno.pendiente.toLowerCase()}.`,
    alergias: (e?.alergias ?? []).filter((x) => x.status === 'activa').map((x) => String(x.substance)),
    llegada: Date.parse(p.arrivedAt),
    actuales: {
      hr: a?.vitals.hr ?? g.signosIngreso.fc - 8,
      spo2: a?.vitals.spo2 ?? Math.min(99, g.signosIngreso.spo2 + 2),
      resp: g.signosIngreso.fr - 2,
    },
  };
}

// --- Temperatura del monitor (la manda el publicador de demo; el backend la guarda sin umbrales) -----

/** Con el backend: la última `temp` de cada equipo (de los últimos 10 minutos). */
const temperaturas = memo(30_000, async () => {
  const porEquipo = new Map<string, number>();
  if (API_MODE === 'mock' || !goesToBackend('/sensors/readings')) return porEquipo;
  const lecturas = await listReadings({ variable: 'temp', limit: 500 }).catch((): SensorReading[] => []);
  for (const l of lecturas) {
    if (Date.now() - Date.parse(l.at) > 10 * 60_000) continue;
    if (!porEquipo.has(l.device)) porEquipo.set(l.device, l.value);
  }
  return porEquipo;
});

async function temperaturaDelMonitor(cedula: string): Promise<number | null> {
  const temps = await temperaturas();
  if (!temps.size) return null;
  const device = (await asignados()).find((a) => a.document === cedula)?.device;
  return device ? (temps.get(device) ?? null) : null;
}

// --- Datos personales (faltan en `paciente`: dirección, estado civil, ocupación, aseguradora) --------

export type DatosExtra = Inventado['personales'];
export const getDatosExtra = (cedula: string) => pedir(async (): Promise<DatosExtra | null> => (await perfil(cedula))?.personales ?? null);

// --- PA y temperatura (no existen en el modelo: `lectura.valor` es un número; la temperatura sí, del monitor) ---

export type SignosExtra = {
  pa: { sis: number; dia: number };
  pam: number;
  temp: number;
  /** true: la temperatura es la última del monitor (`temp` real); false: simulada. */
  tempDelMonitor: boolean;
  /** true: el perfil se generó por diagnóstico (no es uno de los 8). */
  generado: boolean;
};

async function signosDe(cedula: string): Promise<SignosExtra | null> {
  const p = await perfil(cedula);
  if (!p) return null;
  const v = signosVivos(cedula, p);
  const temp = await temperaturaDelMonitor(cedula);
  return { ...v, temp: temp ?? v.temp, tempDelMonitor: temp !== null, generado: p.generado };
}

export const getSignosExtra = (cedula: string) => pedir(() => signosDe(cedula));

/** PA y temperatura de todos los pacientes, para las listas (por cédula). */
export const getSignosExtraTodos = () =>
  pedir(async (): Promise<Record<string, SignosExtra>> => {
    const cedulas = new Set(db.DEMOS.map((d) => d.delSeed.cedula));
    for (const p of await pacientes().catch((): Patient[] => [])) cedulas.add(p.document);
    const filas = await Promise.all([...cedulas].map(async (c) => [c, await signosDe(c)] as const));
    return Object.fromEntries(filas.filter((f): f is [string, SignosExtra] => f[1] !== null));
  }, 'lista');

// --- Exploración: signos vitales de ingreso (el backend solo guarda Glasgow) --------------------

export type SignosIngreso = NonNullable<Inventado['exploracion']>['signosIngreso'];
export const getSignosIngreso = (cedula: string) =>
  pedir(async (): Promise<SignosIngreso | null> => guardado<SignosIngreso>(`signosIngreso:${cedula}`) ?? (await perfil(cedula))?.signosIngreso ?? null);
export const saveSignosIngreso = (cedula: string, signos: SignosIngreso) => pedir(() => guardar(`signosIngreso:${cedula}`, signos), 'escritura');

// --- Monitoreo detallado: neurológico, respiratorio, balance, laboratorios, perfusión -------------

export type MonitoreoExtra = MonitoreoVivo;
/** Los paneles del caso, con sus números moviéndose poco a poco (simulacion.ts, `monitoreoVivo`). */
export const getMonitoreoExtra = (cedula: string) =>
  pedir(async (): Promise<MonitoreoExtra | null> => {
    const p = await perfil(cedula);
    return p ? monitoreoVivo(p.monitoreo, cedula) : null;
  });

// --- Nota de ingreso (no existe; ¿evolución o nota SOAP de un tipo?) ------------------------------

export type NotaIngreso = Inventado['notaIngreso'];
export const getNotaIngreso = (cedula: string) =>
  pedir(async (): Promise<NotaIngreso | null> => guardado<NotaIngreso>(`ingreso:${cedula}`) ?? (await perfil(cedula, true))?.notaIngreso ?? null);
export const saveNotaIngreso = (cedula: string, nota: NotaIngreso) => pedir(() => guardar(`ingreso:${cedula}`, nota), 'escritura');

// --- Interrogatorio por aparatos (no existe) --------------------------------------------------------

export type Interrogatorio = Inventado['interrogatorio'];
export const getInterrogatorio = (cedula: string) =>
  pedir(async (): Promise<Interrogatorio> => guardado<Interrogatorio>(`interrogatorio:${cedula}`) ?? (await perfil(cedula, true))?.interrogatorio ?? {});
export const saveInterrogatorio = (cedula: string, datos: Interrogatorio) => pedir(() => guardar(`interrogatorio:${cedula}`, datos), 'escritura');

// --- Indicaciones que no son fármacos (los fármacos son `medicamento_paciente`) -------------------

export type IndicacionesExtra = Inventado['indicaciones'];
/** Una cédula que no existe: todo vacío. */
const SIN_INDICACIONES: IndicacionesExtra = { soluciones: [], dieta: [], restriccion: null, cuidados: [], estudios: [], interconsulta: null };
export const getIndicacionesExtra = (cedula: string) =>
  pedir(async (): Promise<IndicacionesExtra> => guardado<IndicacionesExtra>(`indicaciones:${cedula}`) ?? (await perfil(cedula))?.indicaciones ?? SIN_INDICACIONES);
export const saveIndicacionesExtra = (cedula: string, datos: IndicacionesExtra) => pedir(() => guardar(`indicaciones:${cedula}`, datos), 'escritura');

// --- Nota correlativa de diagnósticos (no existe; ¿`notas` de cada diagnóstico?) --------------------

export const getNotaCorrelativa = (cedula: string) =>
  pedir(async (): Promise<string> => guardado<string>(`correlativa:${cedula}`) ?? (await perfil(cedula, true))?.notaCorrelativa ?? '');
export const saveNotaCorrelativa = (cedula: string, texto: string) => pedir(() => guardar(`correlativa:${cedula}`, texto), 'escritura');

// --- Entrega de turno (no existe) -------------------------------------------------------------------

export type TurnoPaciente = Inventado['turno'] & { cedula: string; alergias: string[] };
/** Lo que se dice de cada paciente a cargo al entregar el turno, con sus alergias activas (para "Indicaciones importantes"). */
export const getTurno = () =>
  pedir(async (): Promise<TurnoPaciente[]> => {
    const lista = await asignados();
    const cedulas = lista.length ? lista.map((a) => a.document) : db.DEMOS.map((d) => d.delSeed.cedula);
    const filas = await Promise.all(
      cedulas.map(async (cedula) => {
        const p = await perfil(cedula, true);
        return p ? { ...p.turno, cedula, alergias: p.alergias } : null;
      }),
    );
    return filas.filter((f): f is TurnoPaciente => f !== null);
  }, 'lista');
export const getBorradorEntrega = () => pedir(() => guardado<string>('entrega:borrador') ?? null);

/** Una entrega de turno registrada en el prototipo (SIMULADO: el backend no tiene entregas, pedido 11). */
export type Entrega = {
  id: string;
  at: string;
  turno: string;
  entrego: string;
  pacientes: Array<{ cedula: string; nombre: string; cama: string | null; novedad: string; pendiente: string }>;
  notas: string;
  leida: boolean;
};
/** Las entregas registradas en esta pestaña, de la más reciente a la más vieja. */
export const getEntregas = () => pedir((): Entrega[] => [...(guardado<Entrega[]>('entregas') ?? [])].sort((a, b) => b.at.localeCompare(a.at)), 'lista');
export const guardarEntrega = (e: Omit<Entrega, 'id' | 'leida'>) =>
  pedir((): Entrega => {
    const nueva: Entrega = { ...e, id: `E-${Date.now()}`, leida: false };
    guardar('entregas', [nueva, ...(guardado<Entrega[]>('entregas') ?? [])]);
    guardar('entrega:borrador', null);
    return nueva;
  }, 'escritura');
export const marcarEntregaLeida = (id: string) =>
  pedir(() => guardar('entregas', (guardado<Entrega[]>('entregas') ?? []).map((e) => (e.id === id ? { ...e, leida: true } : e))), 'escritura');
export const saveBorradorEntrega = (texto: string) => pedir(() => guardar('entrega:borrador', texto), 'escritura');

// --- Notificaciones que no son alertas (el backend solo tiene `alertaCritica` y `alertaTemprana`) ---

export type NotificacionExtra = {
  id: string;
  tipo: 'asignacion' | 'laboratorio' | 'recordatorio' | 'imagen' | 'sistema';
  titulo: string;
  texto: string;
  at: string;
  /** Pantalla a la que lleva (con el paciente ya en la URL). */
  to: string | null;
  leida: boolean;
};

/**
 * Solo sin backend. Con VITE_API_MODE=real la campana y la bandeja son solo las notificaciones reales
 * (`GET /notifications`): estas hablan de los 8 del simulador y de borradores que solo existen en él.
 */
export const getNotificacionesExtra = () =>
  pedir((): NotificacionExtra[] => {
    if (API_MODE !== 'mock' && goesToBackend('/notifications')) return [];
    const leidas = guardado<string[]>('notificaciones:leidas') ?? [];
    const lista: Array<Omit<NotificacionExtra, 'leida'>> = [];
    const porLlegada = [...db.DEMOS].sort((a, b) => a.delSeed.llegadaHorasAtras - b.delSeed.llegadaHorasAtras);
    for (const d of [porLlegada[0], porLlegada.at(-1)!]) {
      const s = d.delSeed;
      lista.push({
        id: `asignacion-${s.cedula}`,
        tipo: 'asignacion',
        titulo: 'Nueva Asignación de Paciente',
        texto: `${s.nombre} (${s.cedula}) quedó a su cargo. Cama ${s.ingreso.cama}, motivo: ${s.motivo.toLowerCase()}.`,
        at: db.isoHace(s.llegadaHorasAtras * HORA),
        to: `/MedPacienteResumen?paciente=${s.cedula}`,
      });
    }
    const docs = db.DEMOS.flatMap((d) => d.inventado.documentos.map((doc) => ({ d, doc })));
    const lab = docs.filter((x) => x.doc.tipo === 'laboratorio').sort((a, b) => a.doc.horasAtras - b.doc.horasAtras)[0];
    const img = docs.filter((x) => x.doc.tipo === 'imagenologia').sort((a, b) => a.doc.horasAtras - b.doc.horasAtras)[0];
    for (const [x, tipo, titulo] of [
      [lab, 'laboratorio', 'Resultados de Laboratorio Listos'],
      [img, 'imagen', 'Estudio de Imagen Disponible'],
    ] as const) {
      if (!x) continue;
      lista.push({
        id: `${tipo}-${x.d.delSeed.cedula}`,
        tipo,
        titulo,
        texto: `${x.doc.titulo} de ${x.d.delSeed.nombre}: ${x.doc.descripcion}`,
        at: db.isoHace(x.doc.horasAtras * HORA),
        to: `/MedPacienteDocumentosClinicos?paciente=${x.d.delSeed.cedula}`,
      });
    }
    // Un recordatorio por cada borrador guardado en el prototipo (el seed solo trae notas firmadas).
    for (const n of db.notas().filter((x) => x.status === 'borrador')) {
      const d = db.demoDe(n.patientId);
      if (!d) continue;
      lista.push({
        id: `recordatorio-${n.id}`,
        tipo: 'recordatorio',
        titulo: `Nota SOAP sin firmar - ${d.delSeed.nombre}`,
        texto: `El borrador de evolución de ${d.delSeed.nombre} (Cama ${d.delSeed.ingreso.cama}) sigue sin firmar.`,
        at: n.at,
        to: `/MedPacienteNotasSoapHistorial?paciente=${d.delSeed.cedula}`,
      });
    }
    lista.push({
      id: 'sistema-actualizacion',
      tipo: 'sistema',
      titulo: 'Actualización del Sistema',
      texto: 'Mantenimiento programado completado. Nuevas funciones de exportación de reportes disponibles.',
      at: db.isoHace(30 * HORA),
      to: null,
    });
    return lista.map((n) => ({ ...n, leida: leidas.includes(n.id) || n.tipo === 'sistema' })).sort((a, b) => b.at.localeCompare(a.at));
  }, 'lista');

export const marcarNotificacionesExtra = (ids: string[]) =>
  pedir(() => guardar('notificaciones:leidas', [...new Set([...(guardado<string[]>('notificaciones:leidas') ?? []), ...ids])]), 'escritura');

// --- Tendencias (el backend guarda lecturas pero no tiene histórico agregado; el seed trae 40 min) ---

/** Un instante de la curva. `null` en un signo: no hay dato de ese signo en ese tramo. */
export type PuntoTendencia = { at: string; hr: number | null; spo2: number | null; resp: number | null; sis: number | null; dia: number | null; temp: number | null };

/**
 * Seis puntos repartidos en las últimas `horas`.
 * - Con el backend: FC, SpO2, FR y temperatura son el promedio de las lecturas reales de cada tramo
 *   (`GET /sensors/readings`, hasta 500 por signo); un tramo sin lecturas queda en null (la temperatura, simulada).
 *   La PA sigue simulada (falta en el backend: histórico agregado y PA, pedidos 9 y 10).
 * - Sin backend: todo simulado. Cada signo va de su valor de ingreso al de ahora, con la misma deriva que el resto
 *   de las pantallas (el último punto es exactamente el valor que muestran). Antes de que llegara no hay puntos.
 */
export const getTendencias = async (cedula: string, horas: number, device?: string | null): Promise<Array<PuntoTendencia | null>> => {
  const simulada = await tendenciaSimulada(cedula, horas);
  if (API_MODE === 'mock' || !goesToBackend('/sensors/readings')) return simulada;
  if (!device) return simulada.map((p) => (p ? { ...p, hr: null, spo2: null, resp: null } : null));
  const [hr, spo2, resp, temp] = await Promise.all(['hr', 'spo2', 'resp', 'temp'].map((variable) => listReadings({ device, variable, limit: 500 })));
  const tramo = (horas * HORA) / 5;
  const promedio = (lecturas: SensorReading[], centro: number, decimales = 0) => {
    const en = lecturas.filter((l) => Math.abs(Date.parse(l.at) - centro) <= tramo / 2).map((l) => l.value);
    const f = 10 ** decimales;
    return en.length ? Math.round((en.reduce((a, b) => a + b, 0) / en.length) * f) / f : null;
  };
  const ahora = Date.now();
  return Array.from({ length: 6 }, (_, i) => {
    const t = ahora - ((5 - i) / 5) * horas * HORA;
    const sim = simulada[i];
    const punto: PuntoTendencia = {
      at: new Date(t).toISOString(),
      hr: promedio(hr, t),
      spo2: promedio(spo2, t),
      resp: promedio(resp, t),
      sis: sim?.sis ?? null,
      dia: sim?.dia ?? null,
      temp: promedio(temp, t, 1) ?? sim?.temp ?? null,
    };
    return Object.entries(punto).some(([k, v]) => k !== 'at' && v !== null) ? punto : null;
  });
};

type Valores = { hr: number; spo2: number; resp: number; sis: number; dia: number; temp: number };

/**
 * Los signos simulados del paciente en el instante `t`: van de los de ingreso a los de ahora, con la misma deriva que
 * el resto de las pantallas (en t = ahora, el valor que muestran). null antes de que llegara.
 */
function valoresSimulados(p: Perfil, cedula: string, t: number, ahora: number): Valores | null {
  if (t < p.llegada) return null;
  const ing = p.signosIngreso;
  const [sisIng, diaIng] = (ing?.ta ?? `${p.pa.sis + 8}/${p.pa.dia + 6}`).split('/').map(Number);
  const inicio: Valores = { hr: ing?.fc ?? p.actuales.hr, spo2: ing?.spo2 ?? p.actuales.spo2, resp: ing?.fr ?? p.actuales.resp, sis: sisIng, dia: diaIng, temp: ing?.temp ?? p.temp };
  const fin: Valores = { ...p.actuales, sis: p.pa.sis, dia: p.pa.dia, temp: p.temp };
  const avance = Math.max(0, Math.min(1, (t - p.llegada) / Math.max(1, ahora - p.llegada)));
  const curva = (k: keyof Valores) => inicio[k] + (fin[k] - inicio[k]) * avance ** 1.5;
  const s = signosVivos(cedula, { pa: { sis: curva('sis'), dia: curva('dia') }, temp: curva('temp') }, t);
  return {
    hr: Math.round(vivo(curva('hr'), 4, `${cedula}:hr`, 7, t)),
    spo2: Math.min(100, Math.round(vivo(curva('spo2'), 1, `${cedula}:spo2`, 13, t))),
    resp: Math.round(vivo(curva('resp'), 1.5, `${cedula}:resp`, 9, t)),
    sis: s.pa.sis,
    dia: s.pa.dia,
    temp: s.temp,
  };
}

const tendenciaSimulada = (cedula: string, horas: number) =>
  pedir(async (): Promise<Array<PuntoTendencia | null>> => {
    const p = await perfil(cedula);
    if (!p) return Array.from({ length: 6 }, () => null);
    const ahora = Date.now();
    return Array.from({ length: 6 }, (_, i) => {
      const t = ahora - ((5 - i) / 5) * horas * HORA;
      const v = valoresSimulados(p, cedula, t, ahora);
      return v ? { ...v, at: new Date(t).toISOString() } : null;
    });
  });

// --- Serie de lecturas en su hora real (Tendencias y las curvas del monitor de cama) -------------------

export type Signo = 'hr' | 'spo2' | 'resp' | 'temp' | 'sis' | 'dia';
/** Cada punto es [instante en ms, valor]. */
export type Serie = {
  desde: number;
  hasta: number;
  series: Record<Signo, Array<[number, number]>>;
  /** Qué series son lecturas del monitor (el resto, simuladas). */
  reales: Signo[];
  /** El último valor de cada signo (lo que va en la cabecera). */
  ultimo: Partial<Record<Signo, number>>;
};

/** Como mucho `max` puntos: promedia por tramos de tiempo iguales (una gráfica no necesita más). */
function reducir(puntos: Array<[number, number]>, desde: number, hasta: number, max: number, decimales: number): Array<[number, number]> {
  if (puntos.length <= max) return puntos;
  const ancho = (hasta - desde) / max;
  const tramos = new Map<number, [number, number, number]>();
  for (const [t, v] of puntos) {
    const k = Math.min(max - 1, Math.floor((t - desde) / ancho));
    const a = tramos.get(k) ?? [0, 0, 0];
    tramos.set(k, [a[0] + t, a[1] + v, a[2] + 1]);
  }
  const f = 10 ** decimales;
  return [...tramos.values()].map(([st, sv, n]) => [st / n, Math.round((sv / n) * f) / f] as [number, number]).sort((x, y) => x[0] - y[0]);
}

/**
 * Las últimas `horas` de cada signo con su hora real.
 * - Con el backend: FC, SpO2, FR y temperatura son las lecturas del equipo (`GET /sensors/readings`, hasta 500 por
 *   signo y sin filtro de fecha: con lecturas cada 30 s alcanzan unas 4 h, pedido 9). La temperatura, simulada si el
 *   monitor no la manda.
 * - La PA siempre es simulada (pedido 10), en los mismos instantes que la FC o, sin lecturas, cada pocos minutos.
 * - Sin backend: todo simulado.
 */
export const getSerie = (cedula: string, horas: number, device?: string | null) =>
  pedir(async (): Promise<Serie | null> => {
    const p = await perfil(cedula);
    if (!p) return null;
    const hasta = Date.now();
    const desde = hasta - horas * HORA;
    const MAX = horas <= 1 ? 90 : 240;
    const series: Serie['series'] = { hr: [], spo2: [], resp: [], temp: [], sis: [], dia: [] };
    const reales: Signo[] = [];
    if (API_MODE !== 'mock' && goesToBackend('/sensors/readings') && device) {
      const limite = horas <= 1 ? 150 : 500;
      const vars = ['hr', 'spo2', 'resp', 'temp'] as const;
      const lecturas = await Promise.all(vars.map((variable) => listReadings({ device, variable, limit: limite }).catch((): SensorReading[] => [])));
      vars.forEach((k, i) => {
        const pts = lecturas[i]
          .map((l) => [Date.parse(l.at), l.value] as [number, number])
          .filter(([t]) => t >= desde && t <= hasta + 60_000)
          .sort((x, y) => x[0] - y[0]);
        if (pts.length) {
          series[k] = reducir(pts, desde, hasta, MAX, k === 'temp' ? 1 : 0);
          reales.push(k);
        }
      });
    }
    // Instantes de lo simulado: los de la FC real o, si no hay, unos 60 repartidos en el rango.
    const paso = (hasta - desde) / 60;
    const instantes = series.hr.length >= 2 ? series.hr.map(([t]) => t) : Array.from({ length: 61 }, (_, i) => desde + i * paso);
    for (const t of instantes) {
      const v = valoresSimulados(p, cedula, t, hasta);
      if (!v) continue;
      series.sis.push([t, v.sis]);
      series.dia.push([t, v.dia]);
      for (const k of ['hr', 'spo2', 'resp', 'temp'] as const) if (!reales.includes(k)) series[k].push([t, v[k]]);
    }
    const ultimo: Serie['ultimo'] = {};
    for (const k of Object.keys(series) as Signo[]) {
      const u = series[k].at(-1);
      if (u) ultimo[k] = u[1];
    }
    return { desde, hasta, series, reales, ultimo };
  });

// --- Umbrales por paciente (hoy son fijos para todos en backend/src/services/mqttIngest.ts) ---------

/** Una fila por signo, en el orden de la pantalla. `null`: el paciente usa los sugeridos. */
export type Umbrales = { severity: string[]; enabled: boolean[]; limits: Array<{ min: string; max: string }> };
export const getUmbrales = (cedula: string) => pedir(() => guardado<Umbrales>(`umbrales:${cedula}`) ?? null);
export const saveUmbrales = (cedula: string, umbrales: Umbrales) => pedir(() => guardar(`umbrales:${cedula}`, umbrales), 'escritura');

// --- Hook común -------------------------------------------------------------------------------------

/** PA y temperatura de todos (las listas del tablero, la central y el turno); se mueven solas. */
export const useSignosTodos = () => useQuery({ queryKey: ['sinBackend', 'signosTodos'], queryFn: getSignosExtraTodos, refetchInterval: VIVO_MS });

/**
 * Lo que cambia con el tiempo y se vuelve a pedir solo:
 * - signos, paneles y las curvas del monitor de cama (`curva-…`), cada 15 s, al ritmo del monitor;
 * - la serie de Tendencias (`serie-…`), cada 30 s;
 * - las minigráficas de la Comparativa (`tendencias-…`), cada 60 s.
 * Con el backend cada serie son 4 consultas de lecturas. Lo que se edita en pantalla (notas, indicaciones), no.
 */
const cadaCuanto = (nombre: string) =>
  /^(signos|monitoreo)$/.test(nombre) || nombre.startsWith('curva-') ? VIVO_MS : nombre.startsWith('serie-') ? 30_000 : nombre.startsWith('tendencias-') ? 60_000 : false;

/** React Query para estas funciones: `useExtra('monitoreo', cedula, getMonitoreoExtra)`. */
export function useExtra<T>(nombre: string, cedula: string | undefined, fn: (cedula: string) => Promise<T>) {
  return useQuery({
    queryKey: ['sinBackend', nombre, cedula],
    queryFn: () => fn(cedula!),
    enabled: !!cedula,
    refetchInterval: cadaCuanto(nombre),
  });
}
