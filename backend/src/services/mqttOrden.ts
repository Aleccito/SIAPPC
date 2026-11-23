// Piezas puras de la ingesta MQTT para que los datos sean consistentes en
// tiempo real. Sin base, Redis ni broker: se prueban solas.

/**
 * Cola en serie por clave (aquí, por equipo).
 *
 * mqtt.js entrega cada mensaje en cuanto llega y la ingesta es asíncrona: sin
 * esto, dos lecturas seguidas de la misma cama se procesan en paralelo y la
 * segunda puede terminar antes que la primera. Con la cola, los mensajes de un
 * equipo se procesan en el orden de llegada; equipos distintos siguen en
 * paralelo.
 */
export class ColaPorClave {
  private colas = new Map<string, Promise<void>>();

  /** Encadena `tarea` detrás de lo pendiente de `clave`. Nunca rechaza: los errores van a `alFallar`. */
  encolar(clave: string, tarea: () => Promise<void>, alFallar: (err: unknown) => void): Promise<void> {
    const previa = this.colas.get(clave) ?? Promise.resolve();
    const siguiente = previa.then(tarea).catch(alFallar);
    this.colas.set(clave, siguiente);
    // Al vaciarse se borra la entrada: sin esto el mapa crece con cada equipo
    // que alguna vez publicó.
    void siguiente.finally(() => {
      if (this.colas.get(clave) === siguiente) this.colas.delete(clave);
    });
    return siguiente;
  }

  /** Equipos con trabajo pendiente (para pruebas y métricas). */
  get pendientes(): number {
    return this.colas.size;
  }
}

export type Frescura = "en_vivo" | "atrasada" | "futura";

/**
 * Clasifica una lectura por su hora (`ts`, en segundos, la pone el reloj de la Pi):
 * - `futura`: más adelantada que la tolerancia → reloj de la Pi mal; se descarta.
 * - `atrasada`: más vieja que `maxAtrasoMs` → viene del buffer tras un corte;
 *   se guarda, pero no dispara avisos en vivo.
 * - `en_vivo`: el resto.
 */
export function clasificarLectura(
  tsSegundos: number,
  ahoraMs: number,
  maxAtrasoMs: number,
  maxAdelantoMs: number,
): Frescura {
  const diff = tsSegundos * 1000 - ahoraMs;
  if (diff > maxAdelantoMs) return "futura";
  if (-diff > maxAtrasoMs) return "atrasada";
  return "en_vivo";
}

/** Antepone el grupo de suscripción compartida (`$share/<grupo>/`) si hay uno. */
export function topicCompartido(topic: string, grupo: string | undefined): string {
  return grupo ? `$share/${grupo}/${topic}` : topic;
}
