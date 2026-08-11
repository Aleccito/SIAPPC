-- CreateTable
CREATE TABLE `hospital` (
    `hospital_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `direccion` VARCHAR(255) NULL,
    `telefono` VARCHAR(30) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `uq_hospital_nombre`(`nombre`),
    PRIMARY KEY (`hospital_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rol` (
    `rol_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(60) NOT NULL,
    `etiqueta` VARCHAR(80) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `es_sistema` BOOLEAN NOT NULL DEFAULT false,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `uq_rol_nombre`(`nombre`),
    PRIMARY KEY (`rol_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permiso` (
    `permiso_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(80) NOT NULL,
    `modulo` VARCHAR(60) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    UNIQUE INDEX `uq_permiso_modulo_nombre`(`modulo`, `nombre`),
    PRIMARY KEY (`permiso_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rol_permiso` (
    `rol_permiso_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `rol_id` INTEGER UNSIGNED NOT NULL,
    `permiso_id` INTEGER UNSIGNED NOT NULL,
    `puede_ver` BOOLEAN NOT NULL DEFAULT false,
    `puede_crear` BOOLEAN NOT NULL DEFAULT false,
    `puede_editar` BOOLEAN NOT NULL DEFAULT false,
    `puede_eliminar` BOOLEAN NOT NULL DEFAULT false,

    INDEX `ix_rol_permiso_permiso`(`permiso_id`),
    UNIQUE INDEX `uq_rol_permiso`(`rol_id`, `permiso_id`),
    PRIMARY KEY (`rol_permiso_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `unidad` (
    `unidad_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `hospital_id` INTEGER UNSIGNED NOT NULL,
    `nombre` VARCHAR(80) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `uq_unidad_hospital_nombre`(`hospital_id`, `nombre`),
    PRIMARY KEY (`unidad_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `usuario_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `hospital_id` INTEGER UNSIGNED NOT NULL,
    `rol_id` INTEGER UNSIGNED NOT NULL,
    `unidad_id` INTEGER UNSIGNED NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `tipo_personal` VARCHAR(50) NOT NULL,
    `registro_profesional` VARCHAR(60) NULL,
    `email` VARCHAR(150) NOT NULL,
    `password_hash` CHAR(60) NOT NULL,
    `telefono` VARCHAR(30) NULL,
    `ultimo_acceso` DATETIME(0) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    INDEX `ix_usuario_hospital`(`hospital_id`),
    INDEX `ix_usuario_rol`(`rol_id`),
    INDEX `ix_usuario_unidad`(`unidad_id`),
    UNIQUE INDEX `uq_usuario_email`(`email`),
    UNIQUE INDEX `uq_usuario_registro`(`registro_profesional`),
    PRIMARY KEY (`usuario_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `especializacion` (
    `especializacion_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(120) NOT NULL,
    `area` VARCHAR(80) NULL,

    UNIQUE INDEX `uq_especializacion_nombre`(`nombre`),
    PRIMARY KEY (`especializacion_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario_especializacion` (
    `usuario_especializacion_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER UNSIGNED NOT NULL,
    `especializacion_id` INTEGER UNSIGNED NOT NULL,
    `fecha_obtencion` DATE NULL,
    `certificado` VARCHAR(255) NULL,

    INDEX `ix_ue_especializacion`(`especializacion_id`),
    UNIQUE INDEX `uq_usuario_espec`(`usuario_id`, `especializacion_id`),
    PRIMARY KEY (`usuario_especializacion_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paciente` (
    `paciente_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `hospital_id` INTEGER UNSIGNED NOT NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `cedula` VARCHAR(30) NOT NULL,
    `fecha_nacimiento` DATE NOT NULL,
    `sexo` ENUM('M', 'F', 'O') NOT NULL,
    `tipo_sangre` ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NULL,
    `contacto_emergencia` VARCHAR(150) NULL,
    `modulo` VARCHAR(10) NULL,
    `estado` ENUM('waiting', 'inService', 'discharged') NOT NULL DEFAULT 'waiting',
    `motivo_consulta` VARCHAR(255) NULL,
    `fecha_llegada` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `activo` BOOLEAN NOT NULL DEFAULT true,

    INDEX `ix_paciente_hospital`(`hospital_id`),
    INDEX `ix_paciente_estado`(`estado`),
    UNIQUE INDEX `uq_paciente_cedula`(`cedula`),
    PRIMARY KEY (`paciente_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medico_paciente` (
    `medico_paciente_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER UNSIGNED NOT NULL,
    `paciente_id` INTEGER UNSIGNED NOT NULL,
    `fecha_asignacion` DATE NOT NULL DEFAULT (curdate()),
    `motivo` VARCHAR(255) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    INDEX `ix_mp_paciente`(`paciente_id`),
    UNIQUE INDEX `uq_medico_paciente`(`usuario_id`, `paciente_id`, `fecha_asignacion`),
    PRIMARY KEY (`medico_paciente_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historia_clinica` (
    `historia_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `paciente_id` INTEGER UNSIGNED NOT NULL,
    `usuario_id` INTEGER UNSIGNED NOT NULL,
    `fecha_hora` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `diagnostico` TEXT NULL,
    `tratamiento` TEXT NULL,
    `observaciones` TEXT NULL,

    INDEX `ix_hc_paciente_fecha`(`paciente_id`, `fecha_hora`),
    INDEX `ix_hc_usuario`(`usuario_id`),
    PRIMARY KEY (`historia_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dispositivo` (
    `dispositivo_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `hospital_id` INTEGER UNSIGNED NOT NULL,
    `paciente_id` INTEGER UNSIGNED NULL,
    `codigo` VARCHAR(50) NOT NULL,
    `modelo` VARCHAR(80) NULL,
    `microcontrolador` VARCHAR(80) NULL,
    `estado` ENUM('activo', 'inactivo', 'mantenimiento', 'baja') NOT NULL DEFAULT 'activo',
    `fecha_instalacion` DATETIME(0) NULL,

    INDEX `ix_disp_hospital`(`hospital_id`),
    INDEX `ix_disp_paciente`(`paciente_id`),
    UNIQUE INDEX `uq_dispositivo_codigo`(`codigo`),
    PRIMARY KEY (`dispositivo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sensor` (
    `sensor_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `dispositivo_id` INTEGER UNSIGNED NOT NULL,
    `modelo` VARCHAR(80) NULL,
    `variable_medida` VARCHAR(60) NOT NULL,
    `unidad` VARCHAR(20) NOT NULL,
    `estado` ENUM('activo', 'inactivo', 'fallo') NOT NULL DEFAULT 'activo',

    UNIQUE INDEX `uq_sensor_disp_var`(`dispositivo_id`, `variable_medida`),
    PRIMARY KEY (`sensor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lectura` (
    `lectura_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `sensor_id` INTEGER UNSIGNED NOT NULL,
    `valor` DECIMAL(12, 4) NOT NULL,
    `fecha_hora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `hash_sha256` CHAR(64) NOT NULL,
    `sincronizada` BOOLEAN NOT NULL DEFAULT false,

    INDEX `ix_lectura_sensor_fecha`(`sensor_id`, `fecha_hora`),
    INDEX `ix_lectura_pendiente`(`sincronizada`, `fecha_hora`),
    UNIQUE INDEX `uq_lectura_hash`(`hash_sha256`),
    PRIMARY KEY (`lectura_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alerta` (
    `alerta_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `lectura_id` BIGINT UNSIGNED NOT NULL,
    `tipo` VARCHAR(60) NOT NULL,
    `severidad` ENUM('baja', 'media', 'alta', 'critica') NOT NULL,
    `mensaje` VARCHAR(255) NULL,
    `estado` ENUM('abierta', 'reconocida', 'resuelta') NOT NULL DEFAULT 'abierta',
    `fecha_hora` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_resolucion` DATETIME(0) NULL,

    INDEX `ix_alerta_lectura`(`lectura_id`),
    INDEX `ix_alerta_estado_sev`(`estado`, `severidad`, `fecha_hora`),
    PRIMARY KEY (`alerta_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notificacion` (
    `notificacion_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `alerta_id` BIGINT UNSIGNED NOT NULL,
    `usuario_id` INTEGER UNSIGNED NOT NULL,
    `canal` ENUM('email', 'sms', 'push', 'panel') NOT NULL,
    `fecha_envio` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `estado_envio` ENUM('pendiente', 'enviado', 'fallido', 'leido') NOT NULL DEFAULT 'pendiente',

    INDEX `ix_notif_alerta`(`alerta_id`),
    INDEX `ix_notif_usuario_estado`(`usuario_id`, `estado_envio`),
    PRIMARY KEY (`notificacion_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auditoria` (
    `auditoria_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER UNSIGNED NULL,
    `entidad` VARCHAR(60) NOT NULL,
    `registro_id` BIGINT UNSIGNED NOT NULL,
    `accion` ENUM('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'LOGIN_BLOCKED') NOT NULL,
    `fecha_hora` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `observacion` TEXT NULL,

    INDEX `ix_audit_entidad_registro`(`entidad`, `registro_id`),
    INDEX `ix_audit_usuario_fecha`(`usuario_id`, `fecha_hora`),
    PRIMARY KEY (`auditoria_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `rol_permiso` ADD CONSTRAINT `fk_rolperm_rol` FOREIGN KEY (`rol_id`) REFERENCES `rol`(`rol_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rol_permiso` ADD CONSTRAINT `fk_rolperm_permiso` FOREIGN KEY (`permiso_id`) REFERENCES `permiso`(`permiso_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `unidad` ADD CONSTRAINT `fk_unidad_hospital` FOREIGN KEY (`hospital_id`) REFERENCES `hospital`(`hospital_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `fk_usuario_hospital` FOREIGN KEY (`hospital_id`) REFERENCES `hospital`(`hospital_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`rol_id`) REFERENCES `rol`(`rol_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `fk_usuario_unidad` FOREIGN KEY (`unidad_id`) REFERENCES `unidad`(`unidad_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_especializacion` ADD CONSTRAINT `fk_ue_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`usuario_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_especializacion` ADD CONSTRAINT `fk_ue_especializacion` FOREIGN KEY (`especializacion_id`) REFERENCES `especializacion`(`especializacion_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paciente` ADD CONSTRAINT `fk_paciente_hospital` FOREIGN KEY (`hospital_id`) REFERENCES `hospital`(`hospital_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medico_paciente` ADD CONSTRAINT `fk_mp_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`usuario_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medico_paciente` ADD CONSTRAINT `fk_mp_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `paciente`(`paciente_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historia_clinica` ADD CONSTRAINT `fk_hc_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `paciente`(`paciente_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historia_clinica` ADD CONSTRAINT `fk_hc_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`usuario_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dispositivo` ADD CONSTRAINT `fk_disp_hospital` FOREIGN KEY (`hospital_id`) REFERENCES `hospital`(`hospital_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dispositivo` ADD CONSTRAINT `fk_disp_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `paciente`(`paciente_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sensor` ADD CONSTRAINT `fk_sensor_dispositivo` FOREIGN KEY (`dispositivo_id`) REFERENCES `dispositivo`(`dispositivo_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lectura` ADD CONSTRAINT `fk_lectura_sensor` FOREIGN KEY (`sensor_id`) REFERENCES `sensor`(`sensor_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alerta` ADD CONSTRAINT `fk_alerta_lectura` FOREIGN KEY (`lectura_id`) REFERENCES `lectura`(`lectura_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificacion` ADD CONSTRAINT `fk_notif_alerta` FOREIGN KEY (`alerta_id`) REFERENCES `alerta`(`alerta_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificacion` ADD CONSTRAINT `fk_notif_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`usuario_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auditoria` ADD CONSTRAINT `fk_audit_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`usuario_id`) ON DELETE SET NULL ON UPDATE CASCADE;


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
