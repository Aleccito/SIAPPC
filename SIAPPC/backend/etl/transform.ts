// TRANSFORMACIÓN — de renglones crudos a los renglones del datamart.
//
// Todo lo de este archivo son funciones puras: entra un arreglo, sale otro. No
// tocan la base. Es a propósito: la agregación es la única parte del ETL con
// reglas que se pueden equivocar (qué cae en qué bucket, cómo se promedia), y
// probarla no debería necesitar una base de datos.
//
// Los buckets se truncan sobre el objeto Date tal como lo devolvió el driver, no
// recalculando con UTC: así el bucket queda en la misma zona horaria en la que
// se guardó la fecha, y el ETL no desplaza los datos una hora al correr en un
// contenedor con otro TZ.

import type { AlertaCruda, LecturaCruda } from "./extract.ts";

export type FilaLecturaHora = {
  sensor_id: number;
  hora: Date;
  muestras: number;
  valor_min: number;
  valor_max: number;
  valor_prom: number;
};

export type FilaAlertaDia = {
  dia: Date;
  sensor_id: number;
  severidad: "baja" | "media" | "alta" | "critica";
  total: number;
};

/** Inicio de la hora a la que pertenece `fecha`. */
export function inicioDeHora(fecha: Date): Date {
  const hora = new Date(fecha);
  hora.setMinutes(0, 0, 0);
  return hora;
}

/** Inicio del día al que pertenece `fecha`. */
export function inicioDeDia(fecha: Date): Date {
  const dia = new Date(fecha);
  dia.setHours(0, 0, 0, 0);
  return dia;
}

/**
 * Agrupa las lecturas por sensor y hora.
 *
 * `valor` llega como Decimal del driver. Se pasa por Number para promediar: son
 * DECIMAL(12,4), o sea a lo sumo doce dígitos, y eso entra exacto en un double.
 * Guardar el promedio de vuelta como DECIMAL(12,4) es lo que redondea.
 */
export function agruparLecturasPorHora(lecturas: LecturaCruda[]): FilaLecturaHora[] {
  const buckets = new Map<string, FilaLecturaHora & { suma: number }>();

  for (const lectura of lecturas) {
    const hora = inicioDeHora(lectura.fecha_hora);
    const clave = `${lectura.sensor_id}|${hora.getTime()}`;
    const valor = Number(lectura.valor);

    const bucket = buckets.get(clave);
    if (!bucket) {
      buckets.set(clave, {
        sensor_id: lectura.sensor_id,
        hora,
        muestras: 1,
        valor_min: valor,
        valor_max: valor,
        valor_prom: valor,
        suma: valor,
      });
      continue;
    }

    bucket.muestras += 1;
    bucket.suma += valor;
    if (valor < bucket.valor_min) bucket.valor_min = valor;
    if (valor > bucket.valor_max) bucket.valor_max = valor;
  }

  return [...buckets.values()].map(({ suma, ...fila }) => ({
    ...fila,
    valor_prom: suma / fila.muestras,
  }));
}

/** Cuenta las alertas por día, sensor y severidad. */
export function contarAlertasPorDia(alertas: AlertaCruda[]): FilaAlertaDia[] {
  const buckets = new Map<string, FilaAlertaDia>();

  for (const alerta of alertas) {
    const dia = inicioDeDia(alerta.fecha_hora);
    const sensorId = alerta.lectura.sensor_id;
    const clave = `${dia.getTime()}|${sensorId}|${alerta.severidad}`;

    const bucket = buckets.get(clave);
    if (bucket) {
      bucket.total += 1;
      continue;
    }
    buckets.set(clave, { dia, sensor_id: sensorId, severidad: alerta.severidad, total: 1 });
  }

  return [...buckets.values()];
}
