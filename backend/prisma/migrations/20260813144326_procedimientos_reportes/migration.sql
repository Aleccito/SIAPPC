-- Procedimientos almacenados para el ETL y el panel.
--
-- Van también en db/extra.sql, de donde `npm run schema:build` los copia a
-- db/schema.sql para las bases nuevas. Esta migración es para las que ya
-- existen.
--
-- El cuerpo de cada uno es UNA sentencia, sin `BEGIN … END`: el esquema se
-- carga con `multipleStatements`, que parte por punto y coma.

-- Procedimientos almacenados.
--
-- OJO con la forma: el cuerpo de cada uno es UNA sola sentencia, sin
-- `BEGIN … END`. No es estilo, es obligatorio aquí: este archivo se carga con
-- `multipleStatements`, que parte el texto por punto y coma, y un cuerpo con
-- varias sentencias quedaría cortado por la mitad. Un procedimiento que
-- necesite `BEGIN` exige cambiar antes cómo se carga el esquema.

-- Agrega `lectura` en `lectura_hora` dentro de una ventana.
--
-- Es la misma agregación que hoy hace etl/transform.ts, pero sin traer las
-- filas a Node: con una lectura por segundo y por sensor, mover millones de
-- renglones por la red solo para reducirlos es el grueso del trabajo del ETL.
--
-- `desde` NULL significa "desde el principio", que es la carga inicial y lo que
-- hace `--completo`.
--
-- Reemplaza, no suma: el bucket recalculado pisa al anterior. Es lo que permite
-- reprocesar una ventana ya cargada sin duplicar, igual que la carga en Node.
--
-- AVISO de zona horaria: aquí la hora se trunca con la zona de la SESIÓN de
-- MariaDB; en Node se truncaba con la del proceso. Si backend y base corren con
-- zonas distintas, los buckets salen desplazados. En Compose las dos son UTC.
CREATE OR REPLACE PROCEDURE `sp_etl_lecturas_hora`(IN `desde` DATETIME(3), IN `hasta` DATETIME(3))
  INSERT INTO `lectura_hora` (`sensor_id`, `hora`, `muestras`, `valor_min`, `valor_max`, `valor_prom`)
  SELECT
    l.`sensor_id`,
    DATE_FORMAT(l.`fecha_hora`, '%Y-%m-%d %H:00:00') AS `hora`,
    COUNT(*),
    MIN(l.`valor`),
    MAX(l.`valor`),
    AVG(l.`valor`)
  FROM `lectura` l
  WHERE (`desde` IS NULL OR l.`fecha_hora` >= `desde`)
    AND (`hasta` IS NULL OR l.`fecha_hora` <= `hasta`)
  GROUP BY l.`sensor_id`, DATE_FORMAT(l.`fecha_hora`, '%Y-%m-%d %H:00:00')
  ON DUPLICATE KEY UPDATE
    `muestras` = VALUES(`muestras`),
    `valor_min` = VALUES(`valor_min`),
    `valor_max` = VALUES(`valor_max`),
    `valor_prom` = VALUES(`valor_prom`);

-- Las cifras del panel de un hospital, en un solo viaje.
--
-- El tablero pide hoy cuatro cosas por separado —pacientes, alertas, camas,
-- ingresos— y cada una es una ida a la base. Aquí salen juntas y ya filtradas
-- por hospital, que es el recorte que la API aplica en todas sus consultas.
--
-- Cuerpo de una sola sentencia por lo dicho arriba: cada número es una
-- subconsulta escalar.
CREATE OR REPLACE PROCEDURE `sp_kpi_tablero`(IN `hospital` INT UNSIGNED)
  SELECT
    (SELECT COUNT(*) FROM `paciente` p
      WHERE p.`hospital_id` = `hospital` AND p.`activo` = TRUE) AS `pacientes_activos`,
    (SELECT COUNT(*) FROM `alerta` a
       JOIN `lectura` l ON l.`lectura_id` = a.`lectura_id`
       JOIN `sensor` s ON s.`sensor_id` = l.`sensor_id`
       JOIN `dispositivo` d ON d.`dispositivo_id` = s.`dispositivo_id`
      WHERE d.`hospital_id` = `hospital`
        AND a.`estado` <> 'resuelta'
        AND a.`severidad` IN ('alta', 'critica')) AS `alertas_abiertas`,
    (SELECT COUNT(*) FROM `cama` c
       JOIN `unidad` u ON u.`unidad_id` = c.`unidad_id`
      WHERE u.`hospital_id` = `hospital` AND c.`activo` = TRUE
        AND c.`estado` = 'ocupada') AS `camas_ocupadas`,
    (SELECT COUNT(*) FROM `cama` c
       JOIN `unidad` u ON u.`unidad_id` = c.`unidad_id`
      WHERE u.`hospital_id` = `hospital` AND c.`activo` = TRUE) AS `camas_totales`,
    (SELECT COUNT(*) FROM `ingreso` i
       JOIN `paciente` p ON p.`paciente_id` = i.`paciente_id`
      WHERE p.`hospital_id` = `hospital`
        AND i.`fecha_ingreso` >= CURDATE()) AS `ingresos_hoy`;
