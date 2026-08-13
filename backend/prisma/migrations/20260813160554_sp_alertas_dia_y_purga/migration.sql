-- Agregación de alertas por día y poda de lecturas crudas. Ver db/extra.sql.

-- Agrega `alerta` en `alerta_dia`. Gemelo de `sp_etl_lecturas_hora`.
--
-- La severidad y el día salen de la alerta; el sensor, de la lectura que la
-- disparó. Reemplaza el conteo del día en vez de sumarlo, que es lo que permite
-- reprocesar una ventana ya cargada sin inflar los totales.
CREATE OR REPLACE PROCEDURE `sp_etl_alertas_dia`(IN `desde` DATETIME(3), IN `hasta` DATETIME(3))
  INSERT INTO `alerta_dia` (`dia`, `sensor_id`, `severidad`, `total`)
  SELECT
    DATE(a.`fecha_hora`) AS `dia`,
    l.`sensor_id`,
    a.`severidad`,
    COUNT(*)
  FROM `alerta` a
  JOIN `lectura` l ON l.`lectura_id` = a.`lectura_id`
  WHERE (`desde` IS NULL OR a.`fecha_hora` >= `desde`)
    AND (`hasta` IS NULL OR a.`fecha_hora` <= `hasta`)
  GROUP BY DATE(a.`fecha_hora`), l.`sensor_id`, a.`severidad`
  ON DUPLICATE KEY UPDATE `total` = VALUES(`total`);

-- Poda lecturas crudas ya agregadas.
--
-- `lectura` crece una fila por segundo y por sensor: con diez sensores son
-- 864 000 filas al día. Una vez que la hora está en `lectura_hora`, la fila
-- cruda no la consulta nadie —el tablero lee las últimas por índice, y los
-- informes leen el agregado—.
--
-- Tres condiciones, y las tres son para no borrar nada que no esté a salvo:
--
--   1. más antigua que `dias`;
--   2. su bucket horario EXISTE en `lectura_hora`;
--   3. si la lectura disparó alertas, el día de esas alertas ya está contado en
--      `alerta_dia`. Sin esto la poda las borraría de rebote: `alerta` cuelga de
--      `lectura` con ON DELETE CASCADE, y el histórico de alertas se perdería.
--
-- `lote` acota cuántas filas se borran por llamada: un DELETE de millones de
-- renglones bloquea la tabla y deja la ingesta MQTT esperando.
CREATE OR REPLACE PROCEDURE `sp_purgar_lecturas`(IN `dias` INT UNSIGNED, IN `lote` INT UNSIGNED)
  DELETE FROM `lectura`
  WHERE `fecha_hora` < NOW() - INTERVAL `dias` DAY
    AND EXISTS (
      SELECT 1 FROM `lectura_hora` h
      WHERE h.`sensor_id` = `lectura`.`sensor_id`
        AND h.`hora` = DATE_FORMAT(`lectura`.`fecha_hora`, '%Y-%m-%d %H:00:00')
    )
    AND NOT EXISTS (
      SELECT 1 FROM `alerta` a
      WHERE a.`lectura_id` = `lectura`.`lectura_id`
        AND NOT EXISTS (
          SELECT 1 FROM `alerta_dia` d
          WHERE d.`dia` = DATE(a.`fecha_hora`)
            AND d.`sensor_id` = `lectura`.`sensor_id`
            AND d.`severidad` = a.`severidad`
        )
    )
  LIMIT `lote`;
