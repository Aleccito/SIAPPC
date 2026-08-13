-- Lo que el esquema de Prisma no sabe expresar.
--
-- Este archivo SÍ se edita a mano. `npm run schema:build` lo pega al final de
-- `db/schema.sql`, y cada sentencia de aquí tiene además que existir en alguna
-- migración de `prisma/migrations/` para que las bases ya creadas la reciban.
--
-- Regla para agregar: solo va aquí lo que Prisma no puede representar (CHECK,
-- triggers, vistas, particiones). Todo lo demás se modela en schema.prisma.

-- Una alerta no se puede resolver antes de haberse abierto.
ALTER TABLE `alerta`
  ADD CONSTRAINT `ck_alerta_resolucion`
  CHECK (`fecha_resolucion` IS NULL OR `fecha_resolucion` >= `fecha_hora`);

-- Dimensión de paciente para Power BI, sin identidad.
--
-- Power BI se conecta directo a MariaDB (ver el README de la raíz). Si lee la
-- tabla `paciente`, saca del hospital el nombre, la cédula y el contacto de
-- emergencia de cada persona atendida, y eso ya no es un informe: es una copia
-- de datos identificables viviendo en el portátil de quien abra el archivo.
--
-- Esta vista responde las mismas preguntas —cuántos, de qué edad, en qué
-- unidad, en qué estado— sin ninguno de esos campos. Lo que NO expone, y es
-- deliberado:
--
--   nombre, cedula, contacto_emergencia  identidad directa
--   motivo_consulta                      texto libre, donde acaban colándose
--                                        nombres de familiares y detalles que
--                                        nadie previó al escribirlos
--
-- `fecha_llegada` se recorta a la fecha: la hora exacta de llegada, cruzada con
-- una sola noticia local, vuelve a señalar a una persona concreta.
--
-- La edad se CALCULA y no se guarda, que es lo mismo que hace la interfaz: una
-- edad almacenada envejece mal y a los seis meses contradice a la fecha de
-- nacimiento de la que salió.
--
-- La unidad sale del ingreso activo, no de una columna: un paciente está donde
-- está su cama ahora, y `ingreso` es quien lo sabe.
CREATE OR REPLACE VIEW `v_dim_paciente` AS
SELECT
  p.`paciente_id`,
  p.`hospital_id`,
  TIMESTAMPDIFF(YEAR, p.`fecha_nacimiento`, CURDATE()) AS `edad`,
  p.`sexo`,
  p.`tipo_sangre`,
  p.`modulo`,
  p.`estado`,
  CAST(p.`fecha_llegada` AS DATE) AS `fecha_llegada`,
  p.`activo`,
  u.`unidad_id`,
  u.`nombre` AS `unidad`,
  c.`codigo` AS `cama`
FROM `paciente` p
LEFT JOIN `ingreso` i
  ON i.`paciente_id` = p.`paciente_id` AND i.`estado` = 'activo'
LEFT JOIN `cama` c ON c.`cama_id` = i.`cama_id`
LEFT JOIN `unidad` u ON u.`unidad_id` = c.`unidad_id`;

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

-- Detalle de actividad clínica: una fila por nota SOAP, con su autor resuelto.
--
-- Existe porque el BACKEND NO PUEDE LLAMAR PROCEDIMIENTOS. El adaptador de
-- MariaDB de Prisma devuelve las filas de un `CALL` sin nombres de columna, así
-- que `sp_rep_actividad_clinica` sirve desde el cliente de MariaDB o desde
-- Power BI, pero no desde la API. Una vista sí se consulta como una tabla.
--
-- Es DETALLE y no resumen a propósito: el rango de fechas cambia en cada
-- informe, y una vista no admite parámetros. Agregar aquí obligaría a una vista
-- por rango. Así, la vista fija QUÉ cuenta —qué notas, con qué autor, qué es
-- una adenda— y quien la consulta pone el rango y el GROUP BY.
CREATE OR REPLACE VIEW `v_rep_actividad_clinica` AS
SELECT
  n.`nota_id`,
  u.`hospital_id`,
  u.`usuario_id`,
  u.`nombre` AS `medico`,
  r.`nombre` AS `rol_clave`,
  r.`etiqueta` AS `rol`,
  COALESCE(un.`nombre`, '') AS `unidad`,
  n.`paciente_id`,
  n.`fecha_hora`,
  n.`estado`,
  n.`nota_padre_id` IS NOT NULL AS `es_adenda`,
  CASE WHEN n.`firmada_en` IS NOT NULL
    THEN TIMESTAMPDIFF(MINUTE, n.`fecha_hora`, n.`firmada_en`) END AS `minutos_hasta_firma`
FROM `nota_soap` n
JOIN `usuario` u ON u.`usuario_id` = n.`usuario_id`
JOIN `rol` r ON r.`rol_id` = u.`rol_id`
LEFT JOIN `unidad` un ON un.`unidad_id` = u.`unidad_id`;

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
