-- CreateTable
CREATE TABLE `cama` (
    `cama_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `unidad_id` INTEGER UNSIGNED NOT NULL,
    `codigo` VARCHAR(20) NOT NULL,
    `tipo` VARCHAR(40) NULL,
    `estado` ENUM('disponible', 'ocupada', 'limpieza', 'mantenimiento') NOT NULL DEFAULT 'disponible',
    `activo` BOOLEAN NOT NULL DEFAULT true,

    INDEX `ix_cama_estado`(`estado`),
    UNIQUE INDEX `uq_cama_unidad_codigo`(`unidad_id`, `codigo`),
    PRIMARY KEY (`cama_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ingreso` (
    `ingreso_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `paciente_id` INTEGER UNSIGNED NOT NULL,
    `cama_id` INTEGER UNSIGNED NULL,
    `tipo` ENUM('urgencia', 'programado', 'traslado') NOT NULL DEFAULT 'urgencia',
    `estado` ENUM('activo', 'egresado', 'cancelado') NOT NULL DEFAULT 'activo',
    `motivo` VARCHAR(255) NOT NULL,
    `fecha_ingreso` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_egreso` DATETIME(0) NULL,
    `resumen_egreso` TEXT NULL,
    `registrado_por` INTEGER UNSIGNED NULL,

    INDEX `ix_ingreso_paciente_fecha`(`paciente_id`, `fecha_ingreso`),
    INDEX `ix_ingreso_estado`(`estado`),
    INDEX `ix_ingreso_fecha`(`fecha_ingreso`),
    INDEX `ix_ingreso_egreso`(`fecha_egreso`),
    INDEX `ix_ingreso_cama`(`cama_id`),
    INDEX `ix_ingreso_registrante`(`registrado_por`),
    PRIMARY KEY (`ingreso_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cita` (
    `cita_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `paciente_id` INTEGER UNSIGNED NOT NULL,
    `usuario_id` INTEGER UNSIGNED NOT NULL,
    `unidad_id` INTEGER UNSIGNED NULL,
    `fecha_hora` DATETIME(0) NOT NULL,
    `duracion_min` SMALLINT UNSIGNED NOT NULL DEFAULT 30,
    `motivo` VARCHAR(255) NOT NULL,
    `estado` ENUM('programada', 'confirmada', 'atendida', 'cancelada', 'no_asistio') NOT NULL DEFAULT 'programada',
    `notas` TEXT NULL,

    INDEX `ix_cita_fecha`(`fecha_hora`),
    INDEX `ix_cita_usuario_fecha`(`usuario_id`, `fecha_hora`),
    INDEX `ix_cita_paciente_fecha`(`paciente_id`, `fecha_hora`),
    INDEX `ix_cita_estado`(`estado`),
    INDEX `ix_cita_unidad`(`unidad_id`),
    PRIMARY KEY (`cita_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cama` ADD CONSTRAINT `fk_cama_unidad` FOREIGN KEY (`unidad_id`) REFERENCES `unidad`(`unidad_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ingreso` ADD CONSTRAINT `fk_ingreso_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `paciente`(`paciente_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ingreso` ADD CONSTRAINT `fk_ingreso_cama` FOREIGN KEY (`cama_id`) REFERENCES `cama`(`cama_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ingreso` ADD CONSTRAINT `fk_ingreso_registrante` FOREIGN KEY (`registrado_por`) REFERENCES `usuario`(`usuario_id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `cita` ADD CONSTRAINT `fk_cita_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `paciente`(`paciente_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cita` ADD CONSTRAINT `fk_cita_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`usuario_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cita` ADD CONSTRAINT `fk_cita_unidad` FOREIGN KEY (`unidad_id`) REFERENCES `unidad`(`unidad_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- El módulo de permiso del que cuelgan estas tres tablas.
--
-- Va aquí y no solo en db/seed.sql —que es lo que se hizo con `notas_soap`—
-- porque seed.sql corre UNA vez, en el primer arranque del contenedor. Una base
-- que ya existe recibe las tablas por esta migración y no la fila de `permiso`,
-- y sin esa fila `requirePermission("admisiones", ...)` no encuentra nada y
-- devuelve 403 a todo el mundo, incluido el administrador: el módulo quedaría
-- instalado y cerrado con llave.
--
-- Las dos sentencias son idempotentes (`WHERE NOT EXISTS`): sobre una base
-- creada desde schema.sql + seed.sql, que ya trae las filas, no insertan nada.
INSERT INTO `permiso` (`modulo`, `nombre`, `descripcion`)
SELECT 'admisiones', 'Admisión', 'Camas, ingresos, egresos y citas'
WHERE NOT EXISTS (SELECT 1 FROM `permiso` WHERE `modulo` = 'admisiones');

INSERT INTO `rol_permiso` (`rol_id`, `permiso_id`, `puede_ver`, `puede_crear`, `puede_editar`, `puede_eliminar`)
SELECT r.`rol_id`, p.`permiso_id`, m.`ver`, m.`crear`, m.`editar`, m.`eliminar`
FROM (
  SELECT 'medico' AS rol, TRUE AS ver, FALSE AS crear, FALSE AS editar, FALSE AS eliminar
  UNION ALL SELECT 'enfermero', TRUE, FALSE, TRUE, FALSE
  UNION ALL SELECT 'administrativo', TRUE, TRUE, TRUE, TRUE
  UNION ALL SELECT 'admin', TRUE, TRUE, TRUE, TRUE
) AS m
JOIN `rol` r ON r.`nombre` = m.rol
JOIN `permiso` p ON p.`modulo` = 'admisiones'
WHERE NOT EXISTS (
  SELECT 1 FROM `rol_permiso` rp
  WHERE rp.`rol_id` = r.`rol_id` AND rp.`permiso_id` = p.`permiso_id`
);
