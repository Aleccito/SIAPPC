-- ThermoTrace / Monitoreo Hospitalario - MariaDB 11.4
--
-- ARCHIVO GENERADO. NO EDITAR A MANO.
--   fuente:  prisma/schema.prisma  (+ db/extra.sql)
--   regenera: npm run schema:build
--
-- El nombre de la base viene de DB_NAME en el entorno: Docker la crea con
-- MARIADB_DATABASE y se conecta directo a ella. Por eso aquí no hay CREATE
-- DATABASE ni USE.
--
-- Corre una sola vez, en el primer arranque del contenedor con el volumen
-- vacío. Sobre una base que ya tiene tablas falla, y eso es correcto: para
-- cambiar el esquema de una base existente se usa `npm run migrate`.

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

-- CreateTable
CREATE TABLE `lectura_hora` (
    `sensor_id` INTEGER UNSIGNED NOT NULL,
    `hora` DATETIME(0) NOT NULL,
    `muestras` INTEGER UNSIGNED NOT NULL,
    `valor_min` DECIMAL(12, 4) NOT NULL,
    `valor_max` DECIMAL(12, 4) NOT NULL,
    `valor_prom` DECIMAL(12, 4) NOT NULL,

    INDEX `ix_lechora_hora`(`hora`),
    PRIMARY KEY (`sensor_id`, `hora`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alerta_dia` (
    `dia` DATE NOT NULL,
    `sensor_id` INTEGER UNSIGNED NOT NULL,
    `severidad` ENUM('baja', 'media', 'alta', 'critica') NOT NULL,
    `total` INTEGER UNSIGNED NOT NULL,

    INDEX `ix_alertadia_dia`(`dia`),
    PRIMARY KEY (`dia`, `sensor_id`, `severidad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etl_ejecucion` (
    `ejecucion_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `proceso` VARCHAR(60) NOT NULL,
    `estado` ENUM('ejecutando', 'completado', 'fallido') NOT NULL DEFAULT 'ejecutando',
    `marca_desde` DATETIME(3) NULL,
    `marca_hasta` DATETIME(3) NULL,
    `filas_leidas` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `filas_escritas` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `error` TEXT NULL,
    `inicio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fin` DATETIME(3) NULL,

    INDEX `ix_etl_proceso_estado`(`proceso`, `estado`, `inicio`),
    PRIMARY KEY (`ejecucion_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expediente_clinico` (
    `expediente_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `paciente_id` INTEGER UNSIGNED NOT NULL,
    `observaciones` TEXT NULL,
    `fecha_apertura` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `actualizado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_expediente_paciente`(`paciente_id`),
    PRIMARY KEY (`expediente_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `antecedente` (
    `antecedente_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `expediente_id` INTEGER UNSIGNED NOT NULL,
    `tipo` ENUM('personal', 'familiar', 'quirurgico', 'ginecoobstetrico', 'habito') NOT NULL,
    `descripcion` TEXT NOT NULL,
    `parentesco` VARCHAR(60) NULL,
    `anio` SMALLINT UNSIGNED NULL,
    `registrado_por` INTEGER UNSIGNED NULL,
    `fecha_registro` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `activo` BOOLEAN NOT NULL DEFAULT true,

    INDEX `ix_antecedente_exp_tipo`(`expediente_id`, `tipo`),
    PRIMARY KEY (`antecedente_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alergia` (
    `alergia_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `expediente_id` INTEGER UNSIGNED NOT NULL,
    `sustancia` VARCHAR(150) NOT NULL,
    `reaccion` TEXT NULL,
    `severidad` ENUM('leve', 'moderada', 'grave', 'anafilaxia') NOT NULL DEFAULT 'leve',
    `estado` ENUM('activa', 'resuelta', 'descartada') NOT NULL DEFAULT 'activa',
    `fecha_deteccion` DATE NULL,
    `registrado_por` INTEGER UNSIGNED NULL,
    `fecha_registro` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `ix_alergia_exp_estado`(`expediente_id`, `estado`),
    PRIMARY KEY (`alergia_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medicamento_paciente` (
    `medicamento_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `expediente_id` INTEGER UNSIGNED NOT NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `dosis` VARCHAR(80) NULL,
    `via` VARCHAR(40) NULL,
    `frecuencia` VARCHAR(80) NULL,
    `indicacion` VARCHAR(255) NULL,
    `estado` ENUM('activo', 'suspendido', 'finalizado') NOT NULL DEFAULT 'activo',
    `fecha_inicio` DATE NULL,
    `fecha_fin` DATE NULL,
    `motivo_suspension` VARCHAR(255) NULL,
    `registrado_por` INTEGER UNSIGNED NULL,
    `fecha_registro` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `ix_medicamento_exp_estado`(`expediente_id`, `estado`),
    PRIMARY KEY (`medicamento_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `diagnostico_clinico` (
    `diagnostico_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `expediente_id` INTEGER UNSIGNED NOT NULL,
    `cie10` VARCHAR(10) NULL,
    `descripcion` VARCHAR(255) NOT NULL,
    `tipo` ENUM('presuntivo', 'definitivo', 'diferencial') NOT NULL DEFAULT 'presuntivo',
    `estado` ENUM('activo', 'resuelto', 'descartado') NOT NULL DEFAULT 'activo',
    `fecha_diagnostico` DATE NULL,
    `notas` TEXT NULL,
    `registrado_por` INTEGER UNSIGNED NULL,
    `fecha_registro` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `ix_diagnostico_exp_estado`(`expediente_id`, `estado`),
    PRIMARY KEY (`diagnostico_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hospitalizacion` (
    `hospitalizacion_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `expediente_id` INTEGER UNSIGNED NOT NULL,
    `motivo` VARCHAR(255) NOT NULL,
    `servicio` VARCHAR(120) NULL,
    `establecimiento` VARCHAR(150) NULL,
    `fecha_ingreso` DATE NOT NULL,
    `fecha_egreso` DATE NULL,
    `resumen_egreso` TEXT NULL,
    `registrado_por` INTEGER UNSIGNED NULL,
    `fecha_registro` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `ix_hospitalizacion_exp_fecha`(`expediente_id`, `fecha_ingreso`),
    PRIMARY KEY (`hospitalizacion_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `procedimiento` (
    `procedimiento_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `expediente_id` INTEGER UNSIGNED NOT NULL,
    `nombre` VARCHAR(200) NOT NULL,
    `codigo` VARCHAR(20) NULL,
    `fecha` DATE NULL,
    `descripcion` TEXT NULL,
    `resultado` TEXT NULL,
    `registrado_por` INTEGER UNSIGNED NULL,
    `fecha_registro` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `ix_procedimiento_exp_fecha`(`expediente_id`, `fecha`),
    PRIMARY KEY (`procedimiento_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documento_clinico` (
    `documento_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `expediente_id` INTEGER UNSIGNED NOT NULL,
    `tipo` ENUM('laboratorio', 'imagenologia', 'consentimiento', 'interconsulta', 'receta', 'otro') NOT NULL DEFAULT 'otro',
    `titulo` VARCHAR(200) NOT NULL,
    `descripcion` TEXT NULL,
    `almacenamiento` VARCHAR(40) NULL,
    `ruta` VARCHAR(500) NULL,
    `mime` VARCHAR(120) NULL,
    `tamano_bytes` BIGINT UNSIGNED NULL,
    `hash_sha256` CHAR(64) NULL,
    `fecha_documento` DATE NULL,
    `registrado_por` INTEGER UNSIGNED NULL,
    `fecha_registro` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `ix_documento_exp_tipo`(`expediente_id`, `tipo`),
    PRIMARY KEY (`documento_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historia_cambio` (
    `cambio_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `expediente_id` INTEGER UNSIGNED NOT NULL,
    `categoria` VARCHAR(40) NOT NULL,
    `registro_id` BIGINT UNSIGNED NOT NULL,
    `accion` ENUM('alta', 'modificacion', 'baja') NOT NULL,
    `usuario_id` INTEGER UNSIGNED NULL,
    `fecha_hora` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `detalle` TEXT NULL,

    INDEX `ix_histcambio_exp_fecha`(`expediente_id`, `fecha_hora`),
    INDEX `ix_histcambio_usuario`(`usuario_id`),
    PRIMARY KEY (`cambio_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nota_soap` (
    `nota_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `paciente_id` INTEGER UNSIGNED NOT NULL,
    `usuario_id` INTEGER UNSIGNED NOT NULL,
    `nota_padre_id` BIGINT UNSIGNED NULL,
    `fecha_hora` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `subjetivo` TEXT NULL,
    `objetivo` TEXT NULL,
    `analisis` TEXT NULL,
    `plan` TEXT NULL,
    `estado` ENUM('borrador', 'firmada') NOT NULL DEFAULT 'borrador',
    `firmada_por` INTEGER UNSIGNED NULL,
    `firmada_en` DATETIME(0) NULL,

    INDEX `ix_nota_soap_paciente_fecha`(`paciente_id`, `fecha_hora`),
    INDEX `ix_nota_soap_autor`(`usuario_id`),
    INDEX `ix_nota_soap_padre`(`nota_padre_id`),
    INDEX `ix_nota_soap_firmante`(`firmada_por`),
    PRIMARY KEY (`nota_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- AddForeignKey
ALTER TABLE `lectura_hora` ADD CONSTRAINT `fk_lechora_sensor` FOREIGN KEY (`sensor_id`) REFERENCES `sensor`(`sensor_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alerta_dia` ADD CONSTRAINT `fk_alertadia_sensor` FOREIGN KEY (`sensor_id`) REFERENCES `sensor`(`sensor_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expediente_clinico` ADD CONSTRAINT `fk_expediente_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `paciente`(`paciente_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `antecedente` ADD CONSTRAINT `fk_antecedente_expediente` FOREIGN KEY (`expediente_id`) REFERENCES `expediente_clinico`(`expediente_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alergia` ADD CONSTRAINT `fk_alergia_expediente` FOREIGN KEY (`expediente_id`) REFERENCES `expediente_clinico`(`expediente_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medicamento_paciente` ADD CONSTRAINT `fk_medicamento_expediente` FOREIGN KEY (`expediente_id`) REFERENCES `expediente_clinico`(`expediente_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `diagnostico_clinico` ADD CONSTRAINT `fk_diagnostico_expediente` FOREIGN KEY (`expediente_id`) REFERENCES `expediente_clinico`(`expediente_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hospitalizacion` ADD CONSTRAINT `fk_hospitalizacion_expediente` FOREIGN KEY (`expediente_id`) REFERENCES `expediente_clinico`(`expediente_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `procedimiento` ADD CONSTRAINT `fk_procedimiento_expediente` FOREIGN KEY (`expediente_id`) REFERENCES `expediente_clinico`(`expediente_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documento_clinico` ADD CONSTRAINT `fk_documento_expediente` FOREIGN KEY (`expediente_id`) REFERENCES `expediente_clinico`(`expediente_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historia_cambio` ADD CONSTRAINT `fk_histcambio_expediente` FOREIGN KEY (`expediente_id`) REFERENCES `expediente_clinico`(`expediente_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historia_cambio` ADD CONSTRAINT `fk_histcambio_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`usuario_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nota_soap` ADD CONSTRAINT `fk_nota_soap_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `paciente`(`paciente_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nota_soap` ADD CONSTRAINT `fk_nota_soap_autor` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`usuario_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nota_soap` ADD CONSTRAINT `fk_nota_soap_firmante` FOREIGN KEY (`firmada_por`) REFERENCES `usuario`(`usuario_id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `nota_soap` ADD CONSTRAINT `fk_nota_soap_padre` FOREIGN KEY (`nota_padre_id`) REFERENCES `nota_soap`(`nota_id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

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

-- Migraciones ya incorporadas al DDL de arriba. Una base creada con este
-- archivo nace al día y `prisma migrate deploy` no repite ninguna.
CREATE TABLE `_prisma_migrations` (
    `id` VARCHAR(36) NOT NULL,
    `checksum` VARCHAR(64) NOT NULL,
    `finished_at` DATETIME(3) NULL,
    `migration_name` VARCHAR(255) NOT NULL,
    `logs` TEXT NULL,
    `rolled_back_at` DATETIME(3) NULL,
    `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `applied_steps_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `_prisma_migrations`
  (`id`, `checksum`, `finished_at`, `migration_name`, `started_at`, `applied_steps_count`)
VALUES
('90bb2ab5a35441c4669b07035d4f1fd5e235', '4212cf74b0755b136fc070be0a550194d86e83e3e22473a13194f71919d5c178', NOW(3), '00000000000000_init', NOW(3), 1),
('f3cbaf62868ea6bbdddb2410bc41b80737e1', 'be4a479ac3766dd673d710ed317271583e725d349023bf39bb53c7f8da88e7e5', NOW(3), '20260811103526_etl_datamart', NOW(3), 1),
('e1e3cbe10d726714b50f1f5db0775ab0592e', '9b3657248df7a9545b694e8d245c5a1f956b3d138e70c8a7752312dae295a968', NOW(3), '20260811120000_expediente_clinico_notas_soap', NOW(3), 1),
('7f0f4013ec91368cdfb1a0654792a8f79e0b', 'aefa97accd3bda09148a3ceb56fd0c9c7538e88341c4fe5954652500c1eb37db', NOW(3), '20260812142520_admision_camas_ingresos_citas', NOW(3), 1);
