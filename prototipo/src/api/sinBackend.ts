// Lo que el backend todavía NO tiene (CONEXION-BACKEND.md, secciones 3 y 7). Siempre simulado,
// también con VITE_API_MODE=real, y por cédula (no por id: el id del backend real no tiene por qué
// coincidir con el del simulador). Cada función dice qué endpoint haría falta.
// Los datos salen del bloque `inventado` de src/api/mock/seed/DEMO-000X.ts (no viene del seed).
import { useQuery } from '@tanstack/react-query';
import { ApiError } from './http';
import * as db from './mock/db';
import { delayFor, wait } from './mock/delay';
import type { Inventado } from './mock/seed/tipos';

async function pedir<T>(fn: () => T, kind: 'detalle' | 'lista' | 'escritura' = 'detalle'): Promise<T> {
  await wait(delayFor(kind));
  return fn();
}

function demo(cedula: string) {
  const d = db.demoPorCedula(cedula);
  if (!d) throw new ApiError(404, `No hay ningún paciente con la cédula ${cedula}`);
  return d;
}

/** Lo guardado en las pantallas sin backend (sessionStorage, como el resto del simulador). */
function guardado<T>(clave: string): T | undefined {
  return db.diario.extra[clave] as T | undefined;
}
function guardar(clave: string, valor: unknown) {
  db.diario.extra[clave] = valor;
  db.guardar();
}

// --- Datos personales (faltan en `paciente`: dirección, estado civil, ocupación, aseguradora) --------

export type DatosExtra = Inventado['personales'];
export const getDatosExtra = (cedula: string) => pedir(() => demo(cedula).inventado.personales);

// --- PA y temperatura (no existen en el modelo: `lectura.valor` es un número y nadie publica temp) ---

export type SignosExtra = { pa: { sis: number; dia: number }; pam: number; temp: number };
export const getSignosExtra = (cedula: string) =>
  pedir((): SignosExtra => {
    const { pa, temp } = demo(cedula).inventado;
    return { pa, temp, pam: Math.round((pa.sis + 2 * pa.dia) / 3) };
  });

/** PA y temperatura de los 8, para las listas (por cédula). */
export const getSignosExtraTodos = () =>
  pedir((): Record<string, SignosExtra> =>
    Object.fromEntries(
      db.DEMOS.map((d) => {
        const { pa, temp } = d.inventado;
        return [d.delSeed.cedula, { pa, temp, pam: Math.round((pa.sis + 2 * pa.dia) / 3) }];
      }),
    ),
  'lista');

// --- Exploración: signos vitales de ingreso (el backend solo guarda Glasgow) --------------------

export type SignosIngreso = NonNullable<Inventado['exploracion']>['signosIngreso'];
export const getSignosIngreso = (cedula: string) =>
  pedir((): SignosIngreso | null => guardado<SignosIngreso>(`signosIngreso:${cedula}`) ?? demo(cedula).inventado.exploracion?.signosIngreso ?? null);
export const saveSignosIngreso = (cedula: string, signos: SignosIngreso) => pedir(() => guardar(`signosIngreso:${cedula}`, signos), 'escritura');

// --- Monitoreo detallado: neurológico, respiratorio, balance, laboratorios, perfusión -------------

export type MonitoreoExtra = Inventado['monitoreo'];
export const getMonitoreoExtra = (cedula: string) => pedir(() => demo(cedula).inventado.monitoreo);

// --- Nota de ingreso (no existe; ¿evolución o nota SOAP de un tipo?) ------------------------------

export type NotaIngreso = Inventado['notaIngreso'];
export const getNotaIngreso = (cedula: string) => pedir(() => guardado<NotaIngreso>(`ingreso:${cedula}`) ?? demo(cedula).inventado.notaIngreso);
export const saveNotaIngreso = (cedula: string, nota: NotaIngreso) => pedir(() => guardar(`ingreso:${cedula}`, nota), 'escritura');

// --- Interrogatorio por aparatos (no existe) --------------------------------------------------------

export type Interrogatorio = Inventado['interrogatorio'];
export const getInterrogatorio = (cedula: string) => pedir(() => guardado<Interrogatorio>(`interrogatorio:${cedula}`) ?? demo(cedula).inventado.interrogatorio);
export const saveInterrogatorio = (cedula: string, datos: Interrogatorio) => pedir(() => guardar(`interrogatorio:${cedula}`, datos), 'escritura');

// --- Indicaciones que no son fármacos (los fármacos son `medicamento_paciente`) -------------------

export type IndicacionesExtra = Inventado['indicaciones'];
export const getIndicacionesExtra = (cedula: string) => pedir(() => guardado<IndicacionesExtra>(`indicaciones:${cedula}`) ?? demo(cedula).inventado.indicaciones);
export const saveIndicacionesExtra = (cedula: string, datos: IndicacionesExtra) => pedir(() => guardar(`indicaciones:${cedula}`, datos), 'escritura');

// --- Nota correlativa de diagnósticos (no existe; ¿`notas` de cada diagnóstico?) --------------------

export const getNotaCorrelativa = (cedula: string) => pedir(() => guardado<string>(`correlativa:${cedula}`) ?? demo(cedula).inventado.notaCorrelativa);
export const saveNotaCorrelativa = (cedula: string, texto: string) => pedir(() => guardar(`correlativa:${cedula}`, texto), 'escritura');

// --- Entrega de turno (no existe) -------------------------------------------------------------------

export type TurnoPaciente = Inventado['turno'] & { cedula: string; alergias: string[] };
/** Lo que se dice de cada paciente al entregar el turno; las alergias son las del seed (para "Indicaciones importantes"). */
export const getTurno = () =>
  pedir(
    (): TurnoPaciente[] =>
      db.DEMOS.map((d) => ({ ...d.inventado.turno, cedula: d.delSeed.cedula, alergias: d.delSeed.alergias.filter((a) => a.estado === 'activa').map((a) => a.sustancia) })),
    'lista',
  );
export const getBorradorEntrega = () => pedir(() => guardado<string>('entrega:borrador') ?? null);
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

export const getNotificacionesExtra = () =>
  pedir((): NotificacionExtra[] => {
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
        at: db.isoHace(s.llegadaHorasAtras * 3_600_000),
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
        at: db.isoHace(x.doc.horasAtras * 3_600_000),
        to: `/MedPacienteDocumentosClinicos?paciente=${x.d.delSeed.cedula}`,
      });
    }
    for (const d of db.DEMOS) {
      const borrador = d.inventado.notasSoap.find((n) => n.estado === 'borrador');
      if (!borrador) continue;
      lista.push({
        id: `recordatorio-${d.delSeed.cedula}`,
        tipo: 'recordatorio',
        titulo: `Nota SOAP sin firmar - ${d.delSeed.nombre}`,
        texto: `El borrador de evolución de ${d.delSeed.nombre} (Cama ${d.delSeed.ingreso.cama}) sigue sin firmar.`,
        at: db.isoHace((borrador.horasAtras - 0.5) * 3_600_000),
        to: `/MedPacienteNotasSoapHistorial?paciente=${d.delSeed.cedula}`,
      });
    }
    lista.push({
      id: 'sistema-actualizacion',
      tipo: 'sistema',
      titulo: 'Actualización del Sistema',
      texto: 'Mantenimiento programado completado. Nuevas funciones de exportación de reportes disponibles.',
      at: db.isoHace(30 * 3_600_000),
      to: null,
    });
    return lista.map((n) => ({ ...n, leida: leidas.includes(n.id) || n.tipo === 'sistema' })).sort((a, b) => b.at.localeCompare(a.at));
  }, 'lista');

export const marcarNotificacionesExtra = (ids: string[]) =>
  pedir(() => guardar('notificaciones:leidas', [...new Set([...(guardado<string[]>('notificaciones:leidas') ?? []), ...ids])]), 'escritura');

// --- Tendencias (el backend guarda lecturas pero no tiene histórico agregado; el seed trae 40 min) ---

export type PuntoTendencia = { at: string; hr: number; spo2: number; resp: number; sis: number; dia: number; temp: number };

/** Número entre 0 y 1 que siempre sale igual para el mismo texto: las curvas no cambian al recargar. */
function ruido(texto: string): number {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) h = Math.imul(h ^ texto.charCodeAt(i), 16777619);
  return ((h >>> 0) % 1000) / 1000;
}

/**
 * Seis puntos repartidos en las últimas `horas`: el último es el valor de ahora (FC, SpO2 y FR del seed;
 * PA y temperatura inventadas) y los anteriores se inventan acercándose desde los signos de ingreso.
 * Antes de que el paciente llegara no hay puntos (`null`).
 */
export const getTendencias = (cedula: string, horas: number) =>
  pedir((): Array<PuntoTendencia | null> => {
    const d = demo(cedula);
    const s = d.delSeed;
    const inv = d.inventado;
    const ultimo = (v: string) => s.lecturas[v].at(-1) ?? 0;
    const ingreso = inv.exploracion?.signosIngreso;
    const [sisIng, diaIng] = (ingreso?.ta ?? `${inv.pa.sis + 8}/${inv.pa.dia + 6}`).split('/').map(Number);
    const inicio: Omit<PuntoTendencia, 'at'> = {
      hr: ingreso?.fc ?? s.lecturas.hr[0],
      spo2: ingreso?.spo2 ?? s.lecturas.spo2[0],
      resp: ingreso?.fr ?? s.lecturas.resp[0],
      sis: sisIng,
      dia: diaIng,
      temp: ingreso?.temp ?? inv.temp,
    };
    const fin: Omit<PuntoTendencia, 'at'> = { hr: ultimo('hr'), spo2: ultimo('spo2'), resp: ultimo('resp'), sis: inv.pa.sis, dia: inv.pa.dia, temp: inv.temp };
    const amplitud: Record<keyof typeof fin, number> = { hr: 6, spo2: 1.5, resp: 2, sis: 6, dia: 4, temp: 0.3 };
    const llegada = db.AHORA - s.llegadaHorasAtras * 3_600_000;
    return Array.from({ length: 6 }, (_, i) => {
      const t = db.AHORA - ((5 - i) / 5) * horas * 3_600_000;
      if (t < llegada) return null;
      const avance = Math.max(0, Math.min(1, (t - llegada) / Math.max(1, db.AHORA - llegada)));
      const punto = Object.fromEntries(
        (Object.keys(fin) as Array<keyof typeof fin>).map((k) => {
          if (i === 5) return [k, fin[k]];
          const base = inicio[k] + (fin[k] - inicio[k]) * avance ** 1.5;
          const v = base + (ruido(`${cedula}${k}${horas}${i}`) - 0.5) * 2 * amplitud[k];
          return [k, k === 'temp' ? Math.round(v * 10) / 10 : Math.round(v)];
        }),
      ) as Omit<PuntoTendencia, 'at'>;
      return { ...punto, spo2: Math.min(100, punto.spo2), at: new Date(t).toISOString() };
    });
  });

// --- Umbrales por paciente (hoy son fijos para todos en backend/src/services/mqttIngest.ts) ---------

/** Una fila por signo, en el orden de la pantalla. `null`: el paciente usa los sugeridos. */
export type Umbrales = { severity: string[]; enabled: boolean[]; limits: Array<{ min: string; max: string }> };
export const getUmbrales = (cedula: string) => pedir(() => (demo(cedula), guardado<Umbrales>(`umbrales:${cedula}`) ?? null));
export const saveUmbrales = (cedula: string, umbrales: Umbrales) => pedir(() => guardar(`umbrales:${cedula}`, umbrales), 'escritura');

// --- Hook común -------------------------------------------------------------------------------------

/** PA y temperatura de todos (las listas del tablero, la central y el turno). */
export const useSignosTodos = () => useQuery({ queryKey: ['sinBackend', 'signosTodos'], queryFn: getSignosExtraTodos });

/** React Query para estas funciones: `useExtra('monitoreo', cedula, getMonitoreoExtra)`. */
export function useExtra<T>(nombre: string, cedula: string | undefined, fn: (cedula: string) => Promise<T>) {
  return useQuery({ queryKey: ['sinBackend', nombre, cedula], queryFn: () => fn(cedula!), enabled: !!cedula });
}
