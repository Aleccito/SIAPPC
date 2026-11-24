// Estado del simulador. Se arma al cargar la página a partir de seed/ (seed de demo + lo inventado)
// y devuelve los mismos DTO que el backend (types/). Lo que se escribe (notas, exploración, altas
// del expediente, lecturas de notificaciones, pantallas sin backend) se guarda en sessionStorage:
// sobrevive a recargar y se pierde al cerrar la pestaña.
//
// Las fechas del seed son relativas a cuándo se aplicó (`NOW() - INTERVAL 20 HOUR`); aquí lo son a
// cuándo se abrió la página, así que el prototipo siempre se ve "en vivo".
import type { Patient } from '../types/patients';
import type { Expediente, HistoriaEntry, SoapNote } from '../types/clinical';
import type { AssignedPatient, DeviceStatus } from '../types/dashboard';
import type { MonitoredBed } from '../types/monitoring';
import type { AlertSeverity, SensorAlert, SensorReading } from '../types/sensors';
import type { Notification } from '../types/notifications';
import type { ExploracionDto, HallazgoDto } from '../exploracion';
import { DEMO_0001 } from './seed/DEMO-0001';
import { DEMO_0002 } from './seed/DEMO-0002';
import { DEMO_0003 } from './seed/DEMO-0003';
import { DEMO_0004 } from './seed/DEMO-0004';
import { DEMO_0005 } from './seed/DEMO-0005';
import { DEMO_0006 } from './seed/DEMO-0006';
import { DEMO_0007 } from './seed/DEMO-0007';
import { DEMO_0008 } from './seed/DEMO-0008';
import { DEL_SEED_CAMAS } from './seed/delSeed';
import type { Fecha, PacienteDemo, Region, Tecnica } from './seed/tipos';
import { USUARIOS } from './session';

export const DEMOS: PacienteDemo[] = [DEMO_0001, DEMO_0002, DEMO_0003, DEMO_0004, DEMO_0005, DEMO_0006, DEMO_0007, DEMO_0008];

// --- Tiempo -----------------------------------------------------------------

/** "Ahora" del seed: el momento en que se cargó la página. */
export const AHORA = Date.now();
const MIN = 60_000;
const HORA = 60 * MIN;
const DIA = 24 * HORA;

export const isoHace = (ms: number) => new Date(AHORA - ms).toISOString();
const fechaHace = (dias: number) => new Date(AHORA - dias * DIA).toISOString().slice(0, 10);
/** Fecha civil "AAAA-MM-DD" (lo que devuelve `fechaDto` del backend). */
export const civil = (f: Fecha) => (typeof f === 'number' ? fechaHace(f) : f);
/** Como `civilDateIso` del backend: medianoche en la hora del hospital (UTC-5). */
const civilIso = (fecha: string) => `${fecha}T00:00:00-05:00`;

// --- Identificadores y catálogos --------------------------------------------

/** id del paciente = orden de inserción en el seed (en una base nueva, DEMO-0001 es el 1). */
export const idDe = (i: number) => String(i + 1);
export const demoDe = (id: string): PacienteDemo | undefined => DEMOS[Number(id) - 1];
export const demoPorCedula = (cedula: string) => DEMOS.find((d) => d.delSeed.cedula === cedula);
export const indiceDe = (demo: PacienteDemo) => DEMOS.indexOf(demo);

/** Unidades de seed.sql (unidad_id por orden de inserción). */
export const UNIDADES: Record<string, string> = { UCI: '1', Trauma: '2', 'Admisión': '3', 'Piso 3': '4', TI: '5' };

export const UNIDAD_VARIABLE: Record<string, string> = { hr: 'lpm', spo2: '%', resp: 'rpm' };

// --- Guardado de lo que se escribe ------------------------------------------

type Diario = {
  /** Notas creadas en el prototipo y cambios a las que ya existían. */
  notas: SoapNote[];
  cambiosNota: Record<string, Partial<SoapNote>>;
  exploracion: Record<string, ExploracionDto>;
  observaciones: Record<string, string>;
  /** Altas del expediente por paciente y categoría, y cambios por id. */
  historia: Record<string, Record<string, HistoriaEntry[]>>;
  cambiosHistoria: Record<string, Partial<HistoriaEntry>>;
  leidas: string[];
  /** Pantallas sin backend (umbrales, nota de ingreso, interrogatorio, entrega de turno…). */
  extra: Record<string, unknown>;
  siguienteId: number;
};

const CLAVE = 'mock.diario.v1';

function leerDiario(): Diario {
  const vacio: Diario = { notas: [], cambiosNota: {}, exploracion: {}, observaciones: {}, historia: {}, cambiosHistoria: {}, leidas: [], extra: {}, siguienteId: 100000 };
  try {
    return { ...vacio, ...(JSON.parse(sessionStorage.getItem(CLAVE) ?? '{}') as Partial<Diario>) };
  } catch {
    return vacio;
  }
}

export const diario: Diario = leerDiario();

export function guardar() {
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify(diario));
  } catch {
    // Sin sessionStorage lo escrito dura lo que la página.
  }
}

export function nuevoId(): string {
  diario.siguienteId += 1;
  return String(diario.siguienteId);
}

/** Borra todo lo escrito (no se usa en pantallas; sirve a las pruebas). */
export function reiniciarDiario() {
  try {
    sessionStorage.removeItem(CLAVE);
  } catch {
    // Nada que borrar.
  }
}

// --- Pacientes --------------------------------------------------------------

export function paciente(i: number): Patient {
  const s = DEMOS[i].delSeed;
  return {
    id: idDe(i),
    name: s.nombre,
    document: s.cedula,
    status: s.estado as Patient['status'],
    arrivedAt: isoHace(s.llegadaHorasAtras * HORA),
    reason: s.motivo,
    birthDate: civilIso(s.nacimiento),
    sex: s.sexo,
    bloodType: s.sangre as Patient['bloodType'],
    emergencyContact: s.contacto,
  };
}

/** Los 8, ordenados como el backend: los que llegaron último, primero. */
export function pacientes(): Patient[] {
  return DEMOS.map((_, i) => paciente(i)).sort((a, b) => b.arrivedAt.localeCompare(a.arrivedAt));
}

// --- Lecturas y alertas -----------------------------------------------------

/** Momento de la lectura `indice` (la 0 es de hace 40 min; la 40, de ahora). */
const momentoLectura = (serie: number[], indice: number) => AHORA - (serie.length - 1 - indice) * MIN;

let lecturasCache: SensorReading[] | null = null;
/** Todas las lecturas del seed, de la más reciente a la más vieja (como GET /sensors/readings). */
export function lecturas(): SensorReading[] {
  if (lecturasCache) return lecturasCache;
  const todas: SensorReading[] = [];
  DEMOS.forEach((d, i) => {
    Object.entries(d.delSeed.lecturas).forEach(([variable, serie], v) => {
      serie.forEach((valor, k) =>
        todas.push({
          id: String((i + 1) * 10000 + v * 100 + k),
          device: d.delSeed.dispositivo.codigo,
          variable,
          unit: UNIDAD_VARIABLE[variable] ?? '',
          value: valor,
          at: new Date(momentoLectura(serie, k)).toISOString(),
        }),
      );
    });
  });
  lecturasCache = todas.sort((a, b) => b.at.localeCompare(a.at) || Number(b.id) - Number(a.id));
  return lecturasCache;
}

let alertasCache: SensorAlert[] | null = null;
/** Las alertas del seed, de la más reciente a la más vieja (como GET /sensors/alerts). */
export function alertas(): SensorAlert[] {
  if (alertasCache) return alertasCache;
  const todas: SensorAlert[] = [];
  let id = 1;
  DEMOS.forEach((d, i) => {
    const s = d.delSeed;
    for (const a of s.alertas) {
      const serie = s.lecturas[a.variable];
      const v = Object.keys(s.lecturas).indexOf(a.variable);
      todas.push({
        id: String(id++),
        readingId: String((i + 1) * 10000 + v * 100 + a.indice),
        device: s.dispositivo.codigo,
        variable: a.variable,
        unit: UNIDAD_VARIABLE[a.variable] ?? '',
        value: serie[a.indice],
        type: a.tipo,
        severity: a.severidad as AlertSeverity,
        message: a.mensaje,
        status: a.estado as SensorAlert['status'],
        at: new Date(momentoLectura(serie, a.indice)).toISOString(),
        resolvedAt: null,
      });
    }
  });
  alertasCache = todas.sort((a, b) => b.at.localeCompare(a.at) || Number(b.id) - Number(a.id));
  return alertasCache;
}

const ORDEN_SEVERIDAD: AlertSeverity[] = ['baja', 'media', 'alta', 'critica'];
const peor = (a: AlertSeverity | null, b: AlertSeverity) => (a === null || ORDEN_SEVERIDAD.indexOf(b) > ORDEN_SEVERIDAD.indexOf(a) ? b : a);

/** Alertas sin resolver de un equipo: cuántas y la peor (como /monitoring/beds y el tablero). */
export function resumenAlertas(device: string): { total: number; worst: AlertSeverity | null } {
  let total = 0;
  let worst: AlertSeverity | null = null;
  for (const a of alertas()) {
    if (a.device !== device || a.status === 'resuelta') continue;
    total += 1;
    worst = peor(worst, a.severity);
  }
  return { total, worst };
}

function ultima(device: string, variable: string): SensorReading | undefined {
  return lecturas().find((l) => l.device === device && l.variable === variable);
}

// --- Exploración física -----------------------------------------------------

/** Texto normal por región y técnica, para lo que lo inventado no marca como anormal. */
const NORMAL: Record<Region, Record<Tecnica, string>> = {
  cabeza_cuello: {
    inspeccion: 'Normocéfalo, mucosas hidratadas, sin ingurgitación yugular.',
    palpacion: 'Tiroides no palpable, sin adenomegalias cervicales.',
    percusion: 'Sin hallazgos.',
    auscultacion: 'Sin soplos carotídeos.',
  },
  torax: {
    inspeccion: 'Tórax simétrico, movimientos respiratorios rítmicos sin uso de músculos accesorios.',
    palpacion: 'Amplexión y amplexación normales, vibraciones vocales simétricas.',
    percusion: 'Claro pulmonar conservado en ambos hemitórax.',
    auscultacion: 'Murmullo vesicular conservado, sin estertores. Ruidos cardiacos rítmicos.',
  },
  abdomen: {
    inspeccion: 'Abdomen plano, sin cicatrices ni red venosa colateral.',
    palpacion: 'Blando, depresible, no doloroso, sin visceromegalias.',
    percusion: 'Timpanismo conservado.',
    auscultacion: 'Peristalsis presente y normal.',
  },
  extremidades_superiores: {
    inspeccion: 'Simétricas, sin deformidades ni edema.',
    palpacion: 'Pulsos radiales presentes y simétricos. Llenado capilar de 2 segundos.',
    percusion: 'Sin hallazgos.',
    auscultacion: 'Sin hallazgos.',
  },
  extremidades_inferiores: {
    inspeccion: 'Simétricas, sin edema ni deformidades.',
    palpacion: 'Pulsos pedios presentes, pantorrillas blandas y no dolorosas.',
    percusion: 'Sin hallazgos.',
    auscultacion: 'Sin hallazgos.',
  },
  neurologico: {
    inspeccion: 'Alerta, orientado en tiempo, lugar y persona.',
    palpacion: 'Sensibilidad conservada.',
    percusion: 'Reflejos osteotendinosos ++/++++.',
    auscultacion: 'Sin hallazgos.',
  },
};

export const REGIONES: Region[] = ['cabeza_cuello', 'torax', 'abdomen', 'extremidades_superiores', 'extremidades_inferiores', 'neurologico'];
export const TECNICAS: Tecnica[] = ['inspeccion', 'palpacion', 'percusion', 'auscultacion'];

export function exploracion(i: number): ExploracionDto {
  const id = idDe(i);
  if (diario.exploracion[id]) return diario.exploracion[id];
  const e = DEMOS[i].inventado.exploracion;
  if (!e) return { weightKg: null, heightCm: null, abdominalCm: null, glasgow: null, updatedAt: null, findings: [] };
  const findings: HallazgoDto[] = [];
  for (const region of REGIONES) {
    for (const tecnica of TECNICAS) {
      const [state, text] = e.hallazgos[region]?.[tecnica] ?? ['normal', NORMAL[region][tecnica]];
      findings.push({ region, technique: tecnica, state, text });
    }
  }
  return {
    weightKg: e.pesoKg,
    heightCm: e.tallaCm,
    abdominalCm: e.abdominalCm,
    glasgow: e.glasgow,
    updatedAt: isoHace((DEMOS[i].delSeed.llegadaHorasAtras - 1) * HORA),
    findings,
  };
}

// --- Expediente -------------------------------------------------------------

let historiaId = 1;
const historiaBase: Array<Record<string, HistoriaEntry[]>> = DEMOS.map((d) => {
  const s = d.delSeed;
  const inv = d.inventado;
  const sig = () => String(historiaId++);
  // El backend ordena cada categoría por id descendente: lo último registrado, primero.
  const desc = <T,>(xs: T[]) => [...xs].reverse();
  return {
    antecedentes: desc(
      [...s.antecedentes, ...inv.antecedentes].map((a) => ({ id: sig(), type: a.tipo, description: a.descripcion, relationship: a.parentesco, year: a.anio, active: true })),
    ),
    alergias: desc(s.alergias.map((a) => ({ id: sig(), substance: a.sustancia, reaction: a.reaccion, severity: a.severidad, status: a.estado, detectedOn: null }))),
    medicamentos: desc(
      s.medicamentos.map((m) => ({
        id: sig(),
        name: m.nombre,
        dose: m.dosis,
        route: m.via,
        frequency: m.frecuencia,
        indication: m.indicacion,
        status: m.estado,
        startedOn: fechaHace(m.inicioDiasAtras),
        endedOn: null,
        suspensionReason: null,
      })),
    ),
    // Los resueltos son de antes (se registraron primero); los del seed, de este ingreso.
    diagnosticos: desc([
      ...inv.resueltos.map((r) => ({ id: sig(), code: r.cie10, description: r.descripcion, type: 'definitivo', status: 'resuelto', diagnosedOn: civil(r.fecha), notes: null })),
      ...s.diagnosticos.map((x) => ({ id: sig(), code: x.cie10, description: x.descripcion, type: x.tipo, status: x.estado, diagnosedOn: fechaHace(x.diasAtras), notes: null })),
    ]),
    hospitalizaciones: desc(
      inv.hospitalizaciones.map((h) => ({ id: sig(), reason: h.motivo, service: h.servicio, facility: h.establecimiento, admittedOn: civil(h.ingreso), dischargedOn: civil(h.egreso), dischargeSummary: h.resumen })),
    ),
    procedimientos: desc(
      inv.procedimientos.map((p) => ({ id: sig(), name: p.nombre, code: p.codigo, performedOn: civil(p.fecha), description: p.descripcion, outcome: p.resultado, surgeon: p.cirujano })),
    ),
    documentos: desc(
      [...inv.documentos]
        .sort((a, b) => b.horasAtras - a.horasAtras)
        .map((doc) => ({
          id: sig(),
          type: doc.tipo,
          title: doc.titulo,
          description: doc.descripcion,
          documentedOn: isoHace(doc.horasAtras * HORA).slice(0, 10),
          hasFile: false,
          mime: null,
          sizeBytes: null,
          // Quién lo subió: el backend guarda `registrado_por` pero no lo devuelve; lo usa la pantalla.
          uploadedBy: doc.por,
          uploadedAt: isoHace(doc.horasAtras * HORA),
        })),
    ),
    evoluciones: [],
  };
});

export const CATEGORIAS = ['antecedentes', 'alergias', 'medicamentos', 'diagnosticos', 'hospitalizaciones', 'procedimientos', 'documentos', 'evoluciones'] as const;

export function categoria(i: number, cat: string): HistoriaEntry[] {
  const id = idDe(i);
  const altas = diario.historia[id]?.[cat] ?? [];
  return [...altas, ...(historiaBase[i][cat] ?? [])].map((e) => ({ ...e, ...diario.cambiosHistoria[e.id] }));
}

export function expediente(i: number): Expediente {
  const s = DEMOS[i].delSeed;
  const id = idDe(i);
  return {
    ...(Object.fromEntries(CATEGORIAS.map((c) => [c, categoria(i, c)])) as Record<(typeof CATEGORIAS)[number], HistoriaEntry[]>),
    patientId: id,
    patientName: s.nombre,
    document: s.cedula,
    openedAt: isoHace(s.expediente.aperturaHorasAtras * HORA),
    notes: diario.observaciones[id] ?? s.expediente.observaciones,
  };
}

// --- Notas SOAP -------------------------------------------------------------

// La nota firmada que el seed trae para cada paciente (backend/db/seed-demo.sql), tal cual. El autor y el firmante
// vienen por correo; se buscan en las cuentas de seed.sql.
const usuarioPorCorreo = (email: string | null) => USUARIOS.find((u) => u.email === email) ?? null;
const notasBase: SoapNote[] = DEMOS.flatMap((d, i) => {
  const n = d.delSeed.notaSoap;
  if (!n) return [];
  const autor = usuarioPorCorreo(n.autor);
  const firmante = usuarioPorCorreo(n.firmadaPor);
  const firmada = n.estado === 'firmada';
  return [
    {
      id: idDe(i),
      patientId: idDe(i),
      authorId: autor?.id ?? '0',
      authorName: autor?.name ?? n.autor,
      parentId: null,
      at: isoHace(n.horasAtras * HORA),
      subjective: n.subjetivo,
      objective: n.objetivo,
      assessment: n.analisis,
      plan: n.plan,
      status: n.estado as SoapNote['status'],
      signedById: firmada ? firmante?.id ?? null : null,
      signedByName: firmada ? firmante?.name ?? n.firmadaPor : null,
      signedAt: firmada && n.firmadaHorasAtras !== null ? isoHace(n.firmadaHorasAtras * HORA) : null,
    } satisfies SoapNote,
  ];
});

/** Todas las notas (las del prototipo incluidas), con los cambios aplicados. */
export function notas(): SoapNote[] {
  return [...diario.notas, ...notasBase].map((n) => ({ ...n, ...diario.cambiosNota[n.id] }));
}

// --- Tablero, monitoreo y dispositivos --------------------------------------

export function signosUltimos(i: number) {
  const dev = DEMOS[i].delSeed.dispositivo.codigo;
  const hr = ultima(dev, 'hr');
  const spo2 = ultima(dev, 'spo2');
  const resp = ultima(dev, 'resp');
  const at = [hr, spo2, resp].map((l) => l?.at).filter(Boolean).sort().at(-1) ?? null;
  return { hr: hr?.value ?? null, spo2: spo2?.value ?? null, resp: resp?.value ?? null, at };
}

export function asignado(i: number): AssignedPatient {
  const d = DEMOS[i];
  const s = d.delSeed;
  const p = paciente(i);
  const dev = s.dispositivo.codigo;
  const al = resumenAlertas(dev);
  const ex = exploracion(i);
  const v = signosUltimos(i);
  return {
    id: p.id,
    name: p.name,
    document: p.document,
    status: p.status,
    arrivedAt: p.arrivedAt,
    reason: p.reason,
    assignedAt: p.arrivedAt,
    device: dev,
    deviceState: s.dispositivo.estado as AssignedPatient['deviceState'],
    openAlerts: al.total,
    worstSeverity: al.worst,
    record: p.id,
    unit: DEL_SEED_CAMAS.find((c) => c.codigo === s.ingreso.cama)?.unidad ?? null,
    bed: s.ingreso.cama,
    admissionId: p.id,
    birthDate: p.birthDate,
    admissionType: s.ingreso.tipo as AssignedPatient['admissionType'],
    admittedAt: isoHace(s.ingreso.horasAtras * HORA),
    glasgow: ex.glasgow,
    examined: ex.updatedAt !== null,
    vitals: { hr: v.hr, spo2: v.spo2, at: v.at },
  };
}

/** Camas de las unidades: las de los 8 y las libres (las de DEMO-0009… no se cargan). */
export function camas(): MonitoredBed[] {
  return DEL_SEED_CAMAS.filter((c) => c.ocupadaPor === null || demoPorCedula(c.ocupadaPor)).map((c, n) => {
    const demo = c.ocupadaPor ? demoPorCedula(c.ocupadaPor) : undefined;
    const i = demo ? indiceDe(demo) : -1;
    const base = { id: String(n + 1), bed: c.codigo, unitId: UNIDADES[c.unidad], unit: c.unidad };
    if (!demo) {
      return { ...base, bedState: 'disponible', patientId: null, patientName: null, birthDate: null, device: null, deviceState: null, openAlerts: 0, worstSeverity: null, glasgow: null, vitals: { hr: null, spo2: null, resp: null, at: null } };
    }
    const a = asignado(i);
    const v = signosUltimos(i);
    return {
      ...base,
      bedState: 'ocupada',
      patientId: a.id,
      patientName: a.name,
      birthDate: a.birthDate,
      device: a.device,
      deviceState: a.deviceState,
      openAlerts: a.openAlerts,
      worstSeverity: a.worstSeverity,
      glasgow: a.glasgow,
      vitals: { hr: v.hr, spo2: v.spo2, resp: v.resp, at: v.at },
    };
  });
}

export function dispositivos(): DeviceStatus[] {
  return DEMOS.map((d, i) => {
    const s = d.delSeed;
    return {
      code: s.dispositivo.codigo,
      model: s.dispositivo.modelo,
      state: s.dispositivo.estado as DeviceStatus['state'],
      patient: s.nombre,
      sensors: Object.keys(s.lecturas).length,
      activeSensors: Object.keys(s.lecturas).length,
      lastReadingAt: signosUltimos(i).at,
    };
  }).sort((a, b) => a.code.localeCompare(b.code));
}

// --- Notificaciones (inventadas: el seed no trae `notificacion`) -------------

let notificacionesCache: Notification[] | null = null;
/**
 * No viene del seed: la ingesta crea una notificación por alerta alta o crítica de un paciente asignado,
 * pero el seed de demo no las trae. Aquí va una por paciente, signo y severidad (la más reciente).
 */
export function notificaciones(): Notification[] {
  if (!notificacionesCache) {
    const vistas = new Set<string>();
    const lista: Notification[] = [];
    for (const a of alertas()) {
      if (a.severity !== 'alta' && a.severity !== 'critica') continue;
      const demo = DEMOS.find((d) => d.delSeed.dispositivo.codigo === a.device);
      if (!demo) continue;
      const clave = `${a.device}|${a.variable}|${a.severity}`;
      if (vistas.has(clave)) continue;
      vistas.add(clave);
      lista.push({
        id: String(lista.length + 1),
        kind: a.severity === 'critica' ? 'alertaCritica' : 'alertaTemprana',
        alertId: a.id,
        patientId: idDe(indiceDe(demo)),
        patientName: demo.delSeed.nombre,
        device: a.device,
        variable: a.variable,
        unit: a.unit,
        value: a.value,
        type: a.type,
        severity: a.severity,
        message: a.message,
        at: a.at,
        // Las de severidad alta de hace más de 10 min ya se vieron.
        read: a.severity === 'alta' && AHORA - Date.parse(a.at) > 10 * MIN,
      });
    }
    notificacionesCache = lista;
  }
  return notificacionesCache.map((n) => ({ ...n, read: n.read || diario.leidas.includes(n.id) || diario.leidas.includes('*') }));
}
