// SIMULADO: publicador de demo. Hace de los monitores de demo (DEMO-*) que están ASIGNADOS a un paciente, mientras no
// haya equipos de verdad, para que en el prototipo los signos vitales, las alertas y la onda del ECG cambien solos.
//
// Qué equipos simula: los que el backend avisa como asignados en siappc/<equipo>/asignacion (retenido; ver
// backend/src/services/mqttAsignacion.ts). Al arrancar recibe el aviso de todos; después, cada asignación y cada
// liberación en el acto, y una sincronía del backend cada 2 minutos. No hace falta reiniciarlo.
//   - Asignado: manda `online` y empieza a publicar. Liberado: manda `offline` y deja de publicar.
//   - Solo equipos con el prefijo PREFIJO (DEMO-): un equipo real asignado nunca se simula.
//   - Los valores: casos.json para DEMO-DEV-01…15; para los demás, un perfil de perfiles.json según los diagnósticos
//     activos o, mientras no haya diagnóstico, el motivo de consulta. Si el médico registra un diagnóstico, el perfil
//     cambia con el siguiente aviso (2 minutos como mucho).
//
// Publica por MQTT, por TLS y con usuario, lo mismo que la Raspberry (iot/monitor/net/publisher.py):
//   siappc/<equipo>/status     {device, status: "online"|"offline"}              retenido, al asignarse y al liberarse
//   siappc/<equipo>/telemetry  {device, variable, value, unit, ts, hash}         hr, spo2, resp y temp, cada PERIODO_S
//   siappc/<equipo>/waveform   {device, variable: "ecg", hz, ts, samples}       cada segundo (si ONDA=1)
// El backend (backend/src/services/mqttIngest.ts) guarda las lecturas, evalúa las alertas y reparte la onda.
//
// Variables de entorno (ver LEEME.md). Solo necesita las de MQTT: no se le pasa el .env entero.
//   MQTT_USER, MQTT_PASSWORD   las del .env de la raíz (no se imprimen nunca)
//   MQTT_HOST=mosquitto  MQTT_PORT=8883  MQTT_CA_FILE=/certs/ca.crt
//   PERIODO_S=30   cada cuántos segundos se manda una lectura de cada signo
//   ONDA=1         0 para no mandar la onda del ECG
//   ONDA_HZ=125    muestras por segundo de la onda (10 a 250)
//   EQUIPOS=       lista separada por comas para simular solo algunos de los asignados (vacío: todos)
//   PREFIJO=DEMO-  solo se simulan los equipos con este prefijo
// Argumento --una-vez: manda una lectura de cada signo de cada equipo asignado y termina (para probar). Con --historia,
// antes manda la historia: es la forma de cargarla una sola vez (LEEME.md).
// Argumento --alerta <equipo>: manda UNA lectura de FC de 150 lpm (alerta crítica) de ese equipo y termina.
// Argumento --historia 24h (o 6h, 90m…): manda las lecturas de ese tiempo hacia atrás de los equipos asignados de
// casos.json, cada PASO_HISTORIA_MIN minutos (5), dentro de los umbrales (pedido 34).
import { readFileSync } from 'node:fs';
import { createHash, randomBytes } from 'node:crypto';
import mqtt from 'mqtt';

const env = process.env;
const HOST = env.MQTT_HOST || 'mosquitto';
const PORT = Number(env.MQTT_PORT || 8883);
const PERIODO_S = Math.max(5, Number(env.PERIODO_S || 30));
const ONDA = env.ONDA !== '0';
const ONDA_HZ = Math.min(250, Math.max(10, Math.round(Number(env.ONDA_HZ || 125))));
const PREFIJO = env.PREFIJO ?? 'DEMO-';
const UNA_VEZ = process.argv.includes('--una-vez');
const iAlerta = process.argv.indexOf('--alerta');
const ALERTA = iAlerta >= 0 ? process.argv[iAlerta + 1] : null;
if (iAlerta >= 0 && !ALERTA) {
  console.error('Falta el equipo: --alerta DEMO-DEV-06');
  process.exit(1);
}
const iHistoria = process.argv.indexOf('--historia');
/** Milisegundos de historia a rellenar ("24h", "90m"), o 0. */
const HISTORIA_MS = (() => {
  if (iHistoria < 0) return 0;
  const m = /^(\d+)\s*(h|m)$/i.exec(process.argv[iHistoria + 1] ?? '');
  if (!m) {
    console.error('Uso: --historia 24h (horas con h, minutos con m)');
    process.exit(1);
  }
  return Number(m[1]) * (m[2].toLowerCase() === 'h' ? 3_600_000 : 60_000);
})();
const PASO_HISTORIA_MS = Math.max(1, Number(env.PASO_HISTORIA_MIN || 5)) * 60_000;
/** Cuánto se espera al arrancar a que lleguen los avisos retenidos antes de una ronda única. */
const ESPERA_AVISOS_MS = 3_000;

if (!env.MQTT_USER || !env.MQTT_PASSWORD) {
  console.error('Faltan MQTT_USER y MQTT_PASSWORD (las del .env de la raíz; ver LEEME.md).');
  process.exit(1);
}

const CASOS = JSON.parse(readFileSync(new URL('./casos.json', import.meta.url), 'utf8'));
delete CASOS._nota;
const PERFILES = JSON.parse(readFileSync(new URL('./perfiles.json', import.meta.url), 'utf8')).perfiles.map((p) => ({
  ...p,
  patron: p.palabras ? new RegExp(p.palabras) : null,
}));
const filtro = (env.EQUIPOS || '').split(',').map((s) => s.trim()).filter(Boolean);

// Las del catálogo `variable` (backend/db/seed.sql y seed-demo.sql): si no coinciden, el backend avisa y usa la suya.
const UNIDADES = { hr: 'lpm', spo2: '%', resp: 'rpm', temp: '°C' };

// --- Qué simular de cada equipo asignado ------------------------------------------------------------------------

const plano = (t) => String(t ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** El perfil del primer diagnóstico que coincida; si ninguno, el del motivo; si tampoco, `general`. */
function perfilDe(diagnosticos, motivo) {
  const buscar = (texto) => PERFILES.find((p) => p.patron && p.patron.test(plano(texto)));
  for (const d of diagnosticos ?? []) {
    const p = buscar(d);
    if (p) return { perfil: p, por: `diagnóstico "${d}"` };
  }
  const p = motivo ? buscar(motivo) : null;
  if (p) return { perfil: p, por: 'motivo de consulta' };
  return { perfil: PERFILES.find((x) => x.nombre === 'general'), por: 'sin diagnóstico ni motivo reconocible' };
}

/** device → { caso, origen } de los equipos asignados que se simulan. */
const asignados = new Map();

function casoDe(aviso) {
  if (CASOS[aviso.device]) return { caso: CASOS[aviso.device], origen: `casos.json (${CASOS[aviso.device].paciente})` };
  const { perfil, por } = perfilDe(aviso.diagnosticos, aviso.motivo);
  return { caso: perfil, origen: `perfil ${perfil.nombre} (${por})` };
}

// --- Valores que cambian poco a poco ---------------------------------------------------------------------------

function hashTexto(texto) {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) h = Math.imul(h ^ texto.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Entre -1 y 1, suave: tarda unos `periodoMin` minutos en ir de un lado al otro (fases propias de cada clave). */
function deriva(clave, periodoMin, t = Date.now()) {
  const h = hashTexto(clave);
  const x = t / (periodoMin * 60_000);
  const fase = (n) => (((h >>> n) % 1000) / 1000) * 2 * Math.PI;
  return 0.55 * Math.sin(2 * Math.PI * x + fase(0)) + 0.3 * Math.sin(2 * Math.PI * 2.31 * x + fase(7)) + 0.15 * Math.sin(2 * Math.PI * 3.73 * x + fase(13));
}

/** Cuánto tarda cada signo en oscilar (minutos): la FC se mueve más rápido que la temperatura. */
const PERIODO_MIN = { hr: 12, spo2: 16, resp: 10, temp: 40 };
/**
 * Ruido de una lectura a otra, para que no sea una curva perfecta. La temperatura y la SpO2 llevan lo suficiente para
 * que el número se mueva entre lecturas (con menos, el redondeo lo dejaba igual varios minutos).
 */
const RUIDO = { hr: 1.2, spo2: 1, resp: 0.6, temp: 0.1 };
/** Para la historia: dentro de los umbrales de backend/src/services/mqttIngest.ts, para no crear alertas. */
const SIN_ALERTA = { hr: [52, 118], spo2: [90, 100], resp: [9, 29], temp: [30, 43] };

function valor(codigo, variable, [centro, amplitud], t = Date.now()) {
  const v = centro + amplitud * deriva(`${codigo}:${variable}`, PERIODO_MIN[variable], t) + (Math.random() - 0.5) * 2 * RUIDO[variable];
  if (variable === 'temp') return Math.round(v * 10) / 10;
  if (variable === 'spo2') return Math.min(100, Math.round(v));
  return Math.max(0, Math.round(v));
}

// --- Onda del ECG: un latido PQRST por cada intervalo RR, a la FC del momento ------------------------------------

const gauss = (x, centro, ancho, alto) => alto * Math.exp(-((x - centro) ** 2) / (2 * ancho ** 2));
function latido(fase, conP) {
  return (
    (conP ? gauss(fase, 0.2, 0.025, 0.12) : 0) +
    gauss(fase, 0.36, 0.01, -0.12) +
    gauss(fase, 0.4, 0.012, 1.1) +
    gauss(fase, 0.44, 0.012, -0.25) +
    gauss(fase, 0.65, 0.045, 0.3)
  );
}

const ondas = new Map();

function muestrasEcg(codigo, caso, n) {
  if (!ondas.has(codigo)) ondas.set(codigo, { fase: Math.random(), rr: 0.8, t: 0 });
  const s = ondas.get(codigo);
  const fc = Math.max(30, centroActual(codigo, 'hr', caso.hr));
  const fa = caso.ritmo === 'fa';
  const out = [];
  for (let i = 0; i < n; i++) {
    s.t += 1 / ONDA_HZ;
    s.fase += 1 / ONDA_HZ / s.rr;
    if (s.fase >= 1) {
      s.fase -= 1;
      const rrBase = 60 / fc;
      // En la fibrilación auricular los latidos llegan a intervalos irregulares; en sinusal, casi iguales.
      s.rr = fa ? rrBase * (0.7 + Math.random() * 0.6) : rrBase * (0.97 + Math.random() * 0.06);
    }
    const linea = 0.05 * Math.sin(2 * Math.PI * 0.25 * s.t) + (fa ? 0.04 * Math.sin(2 * Math.PI * 6.3 * s.t) : 0);
    out.push(Math.round((latido(s.fase, !fa) + linea + (Math.random() - 0.5) * 0.02) * 1000) / 1000);
  }
  return out;
}

/** El valor de la FC sin el ruido (la onda sigue la tendencia, no cada lectura). */
function centroActual(codigo, variable, [centro, amplitud]) {
  return centro + amplitud * deriva(`${codigo}:${variable}`, PERIODO_MIN[variable]);
}

// --- MQTT --------------------------------------------------------------------------------------------------------

const client = mqtt.connect({
  protocol: 'mqtts',
  host: HOST,
  port: PORT,
  ca: readFileSync(env.MQTT_CA_FILE || '/certs/ca.crt'),
  rejectUnauthorized: true,
  username: env.MQTT_USER,
  password: env.MQTT_PASSWORD,
  // Único por proceso: en un contenedor el PID siempre es 1, y dos clientes con el mismo id se echan del broker
  // (correr --alerta mientras el publicador está corriendo lo desconectaba).
  clientId: `siappc-telemetria-demo-${randomBytes(4).toString('hex')}`,
  reconnectPeriod: 5_000,
  connectTimeout: 15_000,
});

const publicar = (topic, cuerpo, opciones) =>
  new Promise((resolve, reject) => client.publish(topic, JSON.stringify(cuerpo), opciones, (err) => (err ? reject(err) : resolve())));

function huella(device, variable, ts, value) {
  return createHash('sha256').update(`${device}|${variable}|${ts.toFixed(3)}|${value.toFixed(4)}`).digest('hex');
}

const estado = (device, status) => publicar(`siappc/${device}/status`, { device, status }, { qos: 1, retain: true });

const resumenAsignados = () =>
  asignados.size ? [...asignados].map(([d, { origen }]) => `${d}: ${origen}`).join(' · ') : 'ninguno (espera el aviso del backend en siappc/+/asignacion)';

/** Aplica un aviso de asignación: empieza, cambia de perfil o deja de simular ese equipo. */
async function alAviso(device, texto) {
  if (!device.startsWith(PREFIJO) || (filtro.length && !filtro.includes(device))) return;
  let aviso = null;
  try {
    aviso = texto ? JSON.parse(texto) : null;
  } catch {
    console.error(`Aviso de asignación inválido de ${device}: se ignora.`);
    return;
  }
  const antes = asignados.get(device);
  if (aviso?.asignado && aviso.device === device) {
    const nuevo = casoDe(aviso);
    asignados.set(device, nuevo);
    if (!antes) {
      console.log(`${new Date().toISOString()} ${device} asignado → ${nuevo.origen}`);
      await estado(device, 'online');
    } else if (antes.origen !== nuevo.origen) {
      console.log(`${new Date().toISOString()} ${device} cambia de perfil → ${nuevo.origen}`);
    }
  } else if (antes) {
    asignados.delete(device);
    ondas.delete(device);
    console.log(`${new Date().toISOString()} ${device} liberado: deja de publicar.`);
    await estado(device, 'offline');
  }
}

/** Las lecturas de las últimas `HISTORIA_MS`, con su fecha pasada, dentro de los umbrales. Solo de casos.json. */
async function historia() {
  const fin = Date.now() - 2 * 60_000;
  const inicio = fin - HISTORIA_MS;
  const equipos = [...asignados].filter(([device]) => CASOS[device]);
  let n = 0;
  for (let t = inicio; t <= fin; t += PASO_HISTORIA_MS) {
    for (const [device, { caso }] of equipos) {
      for (const variable of ['hr', 'spo2', 'resp', 'temp']) {
        if (!caso[variable]) continue;
        const [lo, hi] = SIN_ALERTA[variable];
        const value = Math.min(hi, Math.max(lo, valor(device, variable, caso[variable], t)));
        const ts = t / 1000;
        await publicar(`siappc/${device}/telemetry`, { device, variable, value, unit: UNIDADES[variable], ts, hash: huella(device, variable, ts, value) }, { qos: 1 });
        n++;
      }
    }
  }
  console.log(`Historia: ${n} lecturas de ${equipos.length} equipos, de las últimas ${Math.round(HISTORIA_MS / 3_600_000)} h, cada ${PASO_HISTORIA_MS / 60_000} min.`);
}

async function ronda() {
  if (!asignados.size) return;
  const resumen = [];
  for (const [device, { caso }] of asignados) {
    const valores = {};
    for (const variable of ['hr', 'spo2', 'resp', 'temp']) {
      if (!caso[variable]) continue;
      const value = valor(device, variable, caso[variable]);
      const ts = Date.now() / 1000;
      valores[variable] = value;
      await publicar(`siappc/${device}/telemetry`, { device, variable, value, unit: UNIDADES[variable], ts, hash: huella(device, variable, ts, value) }, { qos: 1 });
    }
    resumen.push(`${device.replace(PREFIJO, '')}: FC ${valores.hr} SpO2 ${valores.spo2} FR ${valores.resp} T ${valores.temp}`);
  }
  console.log(`${new Date().toISOString()} lecturas de ${asignados.size} equipos  ${resumen.join(' · ')}`);
}

function onda() {
  const ts = Date.now() / 1000;
  for (const [device, { caso }] of asignados) {
    client.publish(`siappc/${device}/waveform`, JSON.stringify({ device, variable: 'ecg', hz: ONDA_HZ, ts, samples: muestrasEcg(device, caso, ONDA_HZ) }), { qos: 0 });
  }
}

client.on('message', (topic, payload) => {
  const m = /^siappc\/([^/]+)\/asignacion$/.exec(topic);
  if (m) alAviso(m[1], payload.toString('utf8')).catch((e) => console.error('No se pudo aplicar el aviso:', e.message));
});

let timers = [];
let primera = true;
client.on('connect', async () => {
  console.log(`Conectado a mqtts://${HOST}:${PORT} como ${env.MQTT_USER}. Simula los equipos ${PREFIJO}* asignados${filtro.length ? ` (solo ${filtro.join(', ')})` : ''}. Lecturas cada ${PERIODO_S} s${ONDA ? `, onda ECG a ${ONDA_HZ} Hz` : ''}.`);
  try {
    if (ALERTA) {
      const ts = Date.now() / 1000;
      const value = 150;
      await publicar(`siappc/${ALERTA}/telemetry`, { device: ALERTA, variable: 'hr', value, unit: UNIDADES.hr, ts, hash: huella(ALERTA, 'hr', ts, value) }, { qos: 1 });
      console.log(`Lectura de prueba: ${ALERTA} FC ${value} lpm (alerta crítica).`);
      client.end(false, () => process.exit(0));
      return;
    }
    // Los avisos retenidos llegan en cuanto se suscribe: así sabe qué equipos están asignados desde el arranque.
    await new Promise((resolve, reject) => client.subscribe('siappc/+/asignacion', { qos: 1 }, (err) => (err ? reject(err) : resolve())));
    if (!primera) return;
    primera = false;
    await new Promise((r) => setTimeout(r, ESPERA_AVISOS_MS));
    console.log(`Equipos asignados: ${resumenAsignados()}`);
    if (UNA_VEZ) {
      // Con --historia: rellena la historia una sola vez y termina, sin repetirla en cada reinicio del servicio.
      if (HISTORIA_MS) await historia();
      await ronda();
      if (ONDA) onda();
      client.end(false, () => process.exit(0));
      return;
    }
    if (HISTORIA_MS) await historia();
    await ronda();
    timers.push(setInterval(() => ronda().catch((e) => console.error('No se pudo publicar:', e.message)), PERIODO_S * 1000));
    if (ONDA) timers.push(setInterval(onda, 1000));
    // Cada 2 minutos, en el registro, qué está simulando (docker logs).
    timers.push(setInterval(() => console.log(`${new Date().toISOString()} simulando: ${resumenAsignados()}`), 120_000));
  } catch (e) {
    console.error('No se pudo publicar:', e.message);
  }
});
client.on('reconnect', () => console.log('Reconectando al broker…'));
client.on('error', (e) => console.error('MQTT:', e.message));

async function salir() {
  timers.forEach(clearInterval);
  timers = [];
  console.log('Saliendo: equipos en offline.');
  try {
    if (client.connected) await Promise.all([...asignados.keys()].map((device) => estado(device, 'offline')));
  } finally {
    client.end(false, () => process.exit(0));
    setTimeout(() => process.exit(0), 3_000).unref();
  }
}
process.on('SIGINT', salir);
process.on('SIGTERM', salir);
