import { z } from "zod";

// La onda cruda del ECG, de la Pi al navegador, SIN pasar por la base.
//
// Por qué no se guarda. `lectura` es una fila por muestra y el ECG se muestrea a
// 250 Hz: son 21,6 millones de filas por día y por cama. Ni diezmando a 100 Hz
// es defendible —8,6 millones—, y no serviría para nada: nadie consulta la onda
// de hace tres semanas, y el histórico clínico que sí importa (las cifras y las
// alertas) ya está guardado. Aquí solo se retransmite lo que está pasando.
//
// Por qué NO va por el bus de alertas (lib/eventos.ts). Aquel reparte a TODOS
// los tableros conectados y, con Redis, a todas las instancias. Mandar por ahí
// un caudal continuo de cientos de muestras por segundo y por cama inundaría el
// canal para que la reciba gente que está mirando otra pantalla. Esto se reparte
// por dispositivo y solo a quien pidió ESE dispositivo.
//
// Por qué no hace falta Redis. Cada réplica del backend abre su propia conexión
// MQTT con su propio `client_id`, así que el broker le entrega el mensaje a
// todas: cada una puede servir a sus propios navegadores sin coordinarse.

/**
 * Un lote de muestras tal como lo publica el equipo.
 *
 * `ts` es el instante de la PRIMERA muestra del lote. Las demás se sitúan
 * sumando 1/hz: mandar una marca por muestra multiplicaría por tres el tamaño
 * del mensaje para repetir un dato que se deduce.
 */
export const waveformSchema = z.object({
  device: z.string().min(1).max(50),
  // Qué señal es. Hoy solo llega `ecg`, pero el pletismógrafo del MAX30102 es
  // otra onda que cabe por el mismo camino sin cambiar nada.
  variable: z.string().min(1).max(60),
  // Techo de 250: es el muestreo del ADS1115 en el equipo. Un valor mayor
  // significa que alguien está mandando algo que ese hardware no produce.
  hz: z.number().int().min(10).max(250),
  ts: z.number().finite(),
  // 500 muestras son dos segundos a 250 Hz. Más que eso no es un lote, es un
  // volcado, y no cabe en el ritmo de una vez por segundo.
  samples: z.array(z.number().finite()).min(1).max(500),
});

export type WaveformBatch = z.infer<typeof waveformSchema>;

type Oyente = (lote: WaveformBatch) => void;

// Oyentes por dispositivo. Un `Map` de `Set` y no una lista plana: cada flujo
// abierto quiere UNA cama, y recorrer todos los oyentes para descartar el 95 %
// sería trabajo por mensaje y por conexión.
const oyentes = new Map<string, Set<Oyente>>();

/**
 * Reparte un lote a quien esté mirando ese dispositivo.
 *
 * Si no hay nadie mirando, el lote se tira aquí mismo. Es lo que hace que esto
 * no cueste nada cuando las veinte camas publican y el turno tiene abierta la
 * central: sin oyentes no se guarda ni se acumula nada.
 */
export function repartirOnda(lote: WaveformBatch): void {
  const suyos = oyentes.get(lote.device);
  if (!suyos || suyos.size === 0) return;
  // Copia: un oyente que se da de baja dentro de su propia llamada modificaría
  // el Set mientras se recorre.
  for (const oyente of [...suyos]) oyente(lote);
}

/** ¿Hay alguien mirando este dispositivo? La ingesta lo usa para no trabajar de más. */
export function hayOyentes(device: string): boolean {
  const suyos = oyentes.get(device);
  return suyos !== undefined && suyos.size > 0;
}

/** Escucha la onda de un dispositivo. Devuelve la función que cancela. */
export function alLlegarOnda(device: string, oyente: Oyente): () => void {
  let suyos = oyentes.get(device);
  if (!suyos) {
    suyos = new Set();
    oyentes.set(device, suyos);
  }
  suyos.add(oyente);

  return () => {
    const actuales = oyentes.get(device);
    if (!actuales) return;
    actuales.delete(oyente);
    // El Map se limpia solo: si no, un hospital con rotación de equipos acumula
    // una entrada vacía por cada dispositivo que alguna vez se miró.
    if (actuales.size === 0) oyentes.delete(device);
  };
}
