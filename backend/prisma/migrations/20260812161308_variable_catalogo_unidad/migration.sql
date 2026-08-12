-- Cataloga la unidad de medida en `variable` y la saca de `sensor`.
--
-- El orden importa y por eso esta migración NO es la que generó Prisma: la
-- suya borraba `sensor.unidad` antes de copiar su contenido a ningún sitio, y
-- añadía la clave foránea contra una tabla vacía. Aquí se llena el catálogo
-- desde los datos que ya existen, DESPUÉS se ata la clave foránea, y solo al
-- final se suelta la columna vieja.

-- 1. El catálogo.
CREATE TABLE `variable` (
    `codigo` VARCHAR(60) NOT NULL,
    `unidad` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Traspaso de lo que ya hay. `MIN(unidad)` resuelve el caso que esta
--    migración existe para impedir: si dos sensores reportaban la misma
--    variable con unidades distintas —"bpm" y "lpm"— hay que quedarse con una,
--    y no hay forma de saber cuál es la correcta desde aquí. Si esto ocurre, la
--    fila del catálogo queda con la primera por orden alfabético y hay que
--    revisarla a mano:
--
--      SELECT codigo, unidad FROM variable;
INSERT INTO `variable` (`codigo`, `unidad`)
SELECT `variable_medida`, MIN(`unidad`)
FROM `sensor`
GROUP BY `variable_medida`;

-- 3. Las variables que publica la Raspberry, por si la base todavía no tiene
--    sensores dados de alta. Idempotente: sobre una base con datos, el paso
--    anterior ya insertó las que existían y estas no se duplican.
INSERT INTO `variable` (`codigo`, `unidad`)
SELECT * FROM (
  SELECT 'hr' AS codigo, 'lpm' AS unidad
  UNION ALL SELECT 'spo2', '%'
  UNION ALL SELECT 'pa', 'mmHg'
  UNION ALL SELECT 'temp', '°C'
) AS base
WHERE NOT EXISTS (SELECT 1 FROM `variable` v WHERE v.`codigo` = base.`codigo`);

-- 4. La clave foránea necesita su propio índice: el UNIQUE que ya existía
--    empieza por `dispositivo_id` y no sirve para resolverla.
CREATE INDEX `ix_sensor_variable` ON `sensor`(`variable_medida`);

ALTER TABLE `sensor` ADD CONSTRAINT `fk_sensor_variable`
  FOREIGN KEY (`variable_medida`) REFERENCES `variable`(`codigo`)
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- 5. Ahora sí: la unidad ya no es un dato del sensor.
ALTER TABLE `sensor` DROP COLUMN `unidad`;
