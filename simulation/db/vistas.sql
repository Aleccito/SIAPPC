-- Vistas de analisis de SIAPPC.
-- Se crean o reemplazan cada vez que corre el simulador, asi que este archivo
-- es la fuente de verdad de como se leen los resultados.
--
-- Convencion: todo lo que empieza por v_ es de solo lectura y se puede
-- consultar directamente desde Adminer.

-- Corridas con el nombre de su escenario, para no andar cruzando ids a mano.
CREATE OR REPLACE VIEW v_corrida AS
SELECT
    c.id                AS corrida_id,
    e.id                AS escenario_id,
    e.nombre            AS escenario,
    e.hash_config       AS hash_config,
    c.replica           AS replica,
    c.semilla           AS semilla,
    c.horizonte_min     AS horizonte_min,
    c.calentamiento_min AS calentamiento_min,
    (c.horizonte_min - c.calentamiento_min) / 1440 AS dias_utiles,
    c.segundos_computo  AS segundos_computo,
    c.iniciada_en       AS iniciada_en
FROM corrida c
JOIN escenario e ON e.id = c.escenario_id;

-- Indicador por escenario: media entre replicas con su intervalo de confianza.
-- El 1.96 es la aproximacion normal; con 30 o mas replicas es aceptable, con
-- menos conviene usar la t de Student (queda anotado a proposito).
CREATE OR REPLACE VIEW v_kpi_escenario AS
SELECT
    v.escenario                                     AS escenario,
    k.metrica                                       AS metrica,
    k.dimension                                     AS dimension,
    k.entidad                                       AS entidad,
    k.unidad                                        AS unidad,
    COUNT(*)                                        AS replicas,
    ROUND(AVG(k.valor), 4)                          AS media,
    ROUND(STDDEV_SAMP(k.valor), 4)                  AS desviacion,
    ROUND(AVG(k.valor) - 1.96 * STDDEV_SAMP(k.valor) / SQRT(COUNT(*)), 4) AS ic95_inf,
    ROUND(AVG(k.valor) + 1.96 * STDDEV_SAMP(k.valor) / SQRT(COUNT(*)), 4) AS ic95_sup,
    ROUND(MIN(k.valor), 4)                          AS minimo,
    ROUND(MAX(k.valor), 4)                          AS maximo
FROM kpi_corrida k
JOIN v_corrida v ON v.corrida_id = k.corrida_id
GROUP BY v.escenario, k.metrica, k.dimension, k.entidad, k.unidad;

-- Resumen de una linea por escenario: lo primero que hay que mirar.
CREATE OR REPLACE VIEW v_resumen_escenario AS
SELECT
    escenario,
    MAX(replicas)                                                     AS replicas,
    MAX(CASE WHEN metrica = 'pacientes_atendidos'  THEN media END)    AS pacientes_atendidos,
    MAX(CASE WHEN metrica = 'throughput_dia'       THEN media END)    AS pacientes_por_dia,
    MAX(CASE WHEN metrica = 'tiempo_sistema_medio' THEN media END)    AS tiempo_sistema_medio_min,
    MAX(CASE WHEN metrica = 'tiempo_sistema_p95'   THEN media END)    AS tiempo_sistema_p95_min,
    MAX(CASE WHEN metrica = 'espera_total_media'   THEN media END)    AS espera_total_media_min,
    MAX(CASE WHEN metrica = 'prop_muerte'          THEN media END)    AS prop_muerte,
    MAX(CASE WHEN metrica = 'prop_alta_directa'    THEN media END)    AS prop_alta_directa,
    MAX(CASE WHEN metrica = 'pacientes_en_sistema_final' THEN media END) AS en_sistema_al_final
FROM v_kpi_escenario
WHERE dimension = 'global'
GROUP BY escenario;

-- Una fila por zona y escenario, con todo lo que hace falta para juzgarla.
CREATE OR REPLACE VIEW v_zonas AS
SELECT
    escenario,
    entidad                                                        AS zona,
    MAX(CASE WHEN metrica = 'capacidad'       THEN media END)       AS capacidad,
    MAX(CASE WHEN metrica = 'utilizacion'     THEN media END)       AS utilizacion_pct,
    MAX(CASE WHEN metrica = 'ocupacion_media' THEN media END)       AS ocupacion_media,
    MAX(CASE WHEN metrica = 'ocupacion_max'   THEN media END)       AS ocupacion_max,
    MAX(CASE WHEN metrica = 'espera_media'    THEN media END)       AS espera_media_min,
    MAX(CASE WHEN metrica = 'espera_p95'      THEN media END)       AS espera_p95_min,
    MAX(CASE WHEN metrica = 'espera_max'      THEN media END)       AS espera_max_min,
    MAX(CASE WHEN metrica = 'espera_media_si_espera' THEN media END) AS espera_media_si_espera_min,
    MAX(CASE WHEN metrica = 'cola_media'      THEN media END)       AS cola_media,
    MAX(CASE WHEN metrica = 'cola_max'        THEN media END)       AS cola_max,
    MAX(CASE WHEN metrica = 'prop_con_espera' THEN media END)       AS prop_con_espera,
    MAX(CASE WHEN metrica = 'n_atenciones'    THEN media END)       AS atenciones
FROM v_kpi_escenario
WHERE dimension = 'zona'
GROUP BY escenario, entidad;

-- Ranking de cuellos de botella. Criterio principal: minutos de espera que la
-- zona le impone al paciente promedio. Se acompana de la utilizacion porque una
-- zona con espera alta y utilizacion baja indica un problema distinto (llegadas
-- a rafagas o capacidad mal distribuida, no falta de recurso).
CREATE OR REPLACE VIEW v_cuellos_botella AS
SELECT
    escenario,
    zona,
    capacidad,
    ROUND(espera_media_min, 2) AS espera_media_min,
    ROUND(espera_p95_min, 2)   AS espera_p95_min,
    ROUND(utilizacion_pct, 2)  AS utilizacion_pct,
    ROUND(cola_media, 3)       AS cola_media,
    cola_max,
    RANK() OVER (PARTITION BY escenario ORDER BY espera_media_min DESC) AS puesto
FROM v_zonas;

-- Espera y servicio por actividad. Sirve para separar Rx de FAST, que comparten
-- ZonaRadiologia y por lo tanto no se distinguen en la vista de zonas.
CREATE OR REPLACE VIEW v_actividades AS
SELECT
    escenario,
    entidad                                                    AS actividad,
    MAX(CASE WHEN metrica = 'espera_actividad'   THEN media END) AS espera_media_min,
    MAX(CASE WHEN metrica = 'servicio_actividad' THEN media END) AS servicio_medio_min,
    MAX(CASE WHEN metrica = 'n_actividad'        THEN media END) AS veces_por_replica
FROM v_kpi_escenario
WHERE dimension = 'actividad'
GROUP BY escenario, entidad;

-- Trazabilidad: de donde salen los numeros que alimentan cada escenario.
CREATE OR REPLACE VIEW v_parametros AS
SELECT
    e.nombre        AS escenario,
    p.ruta          AS parametro,
    p.valor_texto   AS valor,
    p.fuente        AS fuente,
    p.nota          AS nota
FROM parametro p
JOIN escenario e ON e.id = p.escenario_id;

CREATE OR REPLACE VIEW v_parametros_fuente AS
SELECT
    e.nombre                     AS escenario,
    p.fuente                     AS fuente,
    COUNT(*)                     AS parametros,
    ROUND(100 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY e.nombre), 1) AS porcentaje
FROM parametro p
JOIN escenario e ON e.id = p.escenario_id
GROUP BY e.nombre, p.fuente;

-- Serie temporal de ocupacion y cola, lista para graficar.
CREATE OR REPLACE VIEW v_serie_zona AS
SELECT
    v.escenario,
    v.replica,
    s.zona,
    s.t_min,
    s.t_min / 1440 AS dia,
    s.ocupados,
    s.en_cola
FROM serie_zona s
JOIN v_corrida v ON v.corrida_id = s.corrida_id;

-- Comprobacion independiente de la utilizacion, calculada directamente en SQL
-- desde la tabla de ocupaciones. Si no coincide con v_zonas.utilizacion_pct,
-- hay un error en kpis.py. Es la forma de auditar el simulador sin leer Python.
-- Los minutos ocupados se recortan a la ventana util igual que en kpis.py: una
-- estancia de UCI que empezo durante el calentamiento solo aporta su parte
-- posterior. Sin ese recorte la diferencia con el KPI llega al 2% en las zonas
-- de estancia larga.
CREATE OR REPLACE VIEW v_utilizacion_sql AS
SELECT
    v.escenario,
    v.replica,
    o.zona,
    SUM(CASE WHEN o.t_inicio >= v.calentamiento_min THEN 1 ELSE 0 END) AS adquisiciones,
    ROUND(SUM(GREATEST(0,
        LEAST(o.t_fin, v.horizonte_min) - GREATEST(o.t_inicio, v.calentamiento_min)
    )), 1) AS minutos_zona_ocupada,
    ROUND(AVG(CASE WHEN o.t_inicio >= v.calentamiento_min THEN o.espera_min END), 2)
        AS espera_media_min,
    ROUND(MAX(CASE WHEN o.t_inicio >= v.calentamiento_min THEN o.espera_min END), 2)
        AS espera_max_min
FROM ocupacion o
JOIN v_corrida v ON v.corrida_id = o.corrida_id
GROUP BY v.escenario, v.replica, o.zona;

-- Recorrido individual de cada paciente, util para verificar rutas a mano.
CREATE OR REPLACE VIEW v_recorrido_paciente AS
SELECT
    v.escenario,
    v.replica,
    ev.paciente_idx,
    ev.secuencia,
    ev.actividad,
    ev.zona,
    ROUND(ev.espera_min, 2)   AS espera_min,
    ROUND(ev.servicio_min, 2) AS servicio_min,
    ROUND(ev.t_inicio, 2)     AS t_inicio_min,
    ROUND(ev.t_fin, 2)        AS t_fin_min
FROM evento ev
JOIN v_corrida v ON v.corrida_id = ev.corrida_id;
