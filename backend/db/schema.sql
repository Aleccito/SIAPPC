-- SIAPPC / Monitoreo Hospitalario - MariaDB 11.4
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
CREATE TABLE `variable` (
    `codigo` VARCHAR(60) NOT NULL,
    `unidad` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sensor` (
    `sensor_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `dispositivo_id` INTEGER UNSIGNED NOT NULL,
    `modelo` VARCHAR(80) NULL,
    `variable_medida` VARCHAR(60) NOT NULL,
    `estado` ENUM('activo', 'inactivo', 'fallo') NOT NULL DEFAULT 'activo',

    INDEX `ix_sensor_variable`(`variable_medida`),
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
CREATE TABLE `umbral_alerta` (
    `umbral_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `variable_codigo` VARCHAR(60) NOT NULL,
    `paciente_id` INTEGER UNSIGNED NULL,
    `severidad` ENUM('baja', 'media', 'alta', 'critica') NOT NULL,
    `valor_min` DECIMAL(12, 4) NULL,
    `valor_max` DECIMAL(12, 4) NULL,
    `tipo` VARCHAR(60) NOT NULL,
    `plantilla_mensaje` VARCHAR(200) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    INDEX `ix_umbral_paciente`(`paciente_id`),
    UNIQUE INDEX `uq_umbral_variable_paciente_sev`(`variable_codigo`, `paciente_id`, `severidad`),
    PRIMARY KEY (`umbral_id`)
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
    INDEX `ix_notif_usuario_fecha`(`usuario_id`, `fecha_envio`),
    UNIQUE INDEX `uq_notif_alerta_usuario_canal`(`alerta_id`, `usuario_id`, `canal`),
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

-- CreateTable
CREATE TABLE `exploracion_fisica` (
    `exploracion_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `expediente_id` INTEGER UNSIGNED NOT NULL,
    `peso_kg` DECIMAL(5, 2) NULL,
    `talla_cm` DECIMAL(5, 1) NULL,
    `perimetro_abdominal_cm` DECIMAL(5, 1) NULL,
    `glasgow` TINYINT UNSIGNED NULL,
    `registrado_por` INTEGER UNSIGNED NULL,
    `actualizado_en` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_exploracion_expediente`(`expediente_id`),
    PRIMARY KEY (`exploracion_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hallazgo_exploracion` (
    `hallazgo_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `exploracion_id` INTEGER UNSIGNED NOT NULL,
    `region` ENUM('cabeza_cuello', 'torax', 'abdomen', 'extremidades_superiores', 'extremidades_inferiores', 'neurologico') NOT NULL,
    `tecnica` ENUM('inspeccion', 'palpacion', 'percusion', 'auscultacion') NOT NULL,
    `estado` ENUM('normal', 'anormal') NOT NULL DEFAULT 'normal',
    `descripcion` TEXT NULL,

    UNIQUE INDEX `uq_hallazgo_region_tecnica`(`exploracion_id`, `region`, `tecnica`),
    PRIMARY KEY (`hallazgo_id`)
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
ALTER TABLE `sensor` ADD CONSTRAINT `fk_sensor_variable` FOREIGN KEY (`variable_medida`) REFERENCES `variable`(`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lectura` ADD CONSTRAINT `fk_lectura_sensor` FOREIGN KEY (`sensor_id`) REFERENCES `sensor`(`sensor_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alerta` ADD CONSTRAINT `fk_alerta_lectura` FOREIGN KEY (`lectura_id`) REFERENCES `lectura`(`lectura_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `umbral_alerta` ADD CONSTRAINT `fk_umbral_variable` FOREIGN KEY (`variable_codigo`) REFERENCES `variable`(`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `umbral_alerta` ADD CONSTRAINT `fk_umbral_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `paciente`(`paciente_id`) ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE `exploracion_fisica` ADD CONSTRAINT `fk_exploracion_expediente` FOREIGN KEY (`expediente_id`) REFERENCES `expediente_clinico`(`expediente_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hallazgo_exploracion` ADD CONSTRAINT `fk_hallazgo_exploracion` FOREIGN KEY (`exploracion_id`) REFERENCES `exploracion_fisica`(`exploracion_id`) ON DELETE CASCADE ON UPDATE CASCADE;


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

-- Poda de notificaciones ya leídas.
--
-- Gemela de `sp_purgar_lecturas` y con el mismo `lote` por la misma razón: un
-- DELETE masivo bloquea la tabla y deja esperando a la ingesta, que escribe aquí.
--
-- Solo borra las LEÍDAS. Una sin leer es trabajo pendiente de alguien y no la
-- puede tirar un mantenimiento por antigüedad.
--
-- `notificacion` cuelga de `alerta` con ON DELETE CASCADE, y `alerta` de
-- `lectura` igual, así que podar lecturas viejas ya se lleva estas filas por
-- delante. Esto existe para el caso contrario: bandejas que crecen más rápido de
-- lo que se poda la serie cruda, y para vaciarlas sin tocar el histórico.
CREATE OR REPLACE PROCEDURE `sp_purgar_notificaciones`(IN `dias` INT UNSIGNED, IN `lote` INT UNSIGNED)
  DELETE FROM `notificacion`
  WHERE `estado_envio` = 'leido'
    AND `fecha_envio` < NOW() - INTERVAL `dias` DAY
  LIMIT `lote`;

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
('7f0f4013ec91368cdfb1a0654792a8f79e0b', 'aefa97accd3bda09148a3ceb56fd0c9c7538e88341c4fe5954652500c1eb37db', NOW(3), '20260812142520_admision_camas_ingresos_citas', NOW(3), 1),
('077d801e3f5787adb6af147a5a579c89bb27', 'b100116d735347663e30dc277cb7ed7eebb1eed5cb88e230249a98cf57b099d3', NOW(3), '20260812161308_variable_catalogo_unidad', NOW(3), 1),
('fbad8c4c792dea91ac2b74a5a0b82f47ef51', '792a7ddea535394bf4b0b218c4fcd25d08a437593666aa6154664a6c4881240b', NOW(3), '20260813134114_exploracion_fisica', NOW(3), 1),
('2453830be7454d6a99cf090cf1f537907b4d', '93cc26c7ff45d465aa9170825e4ec9d31545797a8f7d5128843f70e37909a4e4', NOW(3), '20260813143754_vista_dim_paciente', NOW(3), 1),
('b6d3272b32ad90a6207a67295ca946f3ab7e', 'dac3cde6cb1827a0dde61da8b183062353826ecffe6378a38d431b95b7e4b9b8', NOW(3), '20260813144326_procedimientos_reportes', NOW(3), 1),
('830fd95a9efb819b8449be55d9f609b84694', 'ac3c659c7559105c80cbced51eb8d7ad14519444c9c0accdb90e13235ee5aea6', NOW(3), '20260813144909_sp_actividad_clinica', NOW(3), 1),
('905a3a8f2e37674e479c247e585c2a28590a', '27caa1d2ec4696b538f1675998bda5ecf38d31fe52650917b4f45ecc993b8134', NOW(3), '20260813144959_sp_actividad_clinica_having', NOW(3), 1),
('f4399f27c54c69933237a0130a66ae60324e', 'e08a99f08a4c145de213fa05b39ed865f7cb58f060fb661bff106d2c58113b21', NOW(3), '20260813145348_vista_actividad_clinica', NOW(3), 1),
('0faf8b9df763f51d88fd02ee14d409e4545c', '10b7d17b7e79a85329a708619addbb84b0d46ad70c49210d066d78be7876d77e', NOW(3), '20260813160554_sp_alertas_dia_y_purga', NOW(3), 1),
('d31b51cca5f2cf8b71579ab2c8eeeb88c99a', '180508d1762e9c58f10ffa00499ee9216234b22e98c5345bfbd19453b1e6af25', NOW(3), '20260813162155_quitar_sp_sin_uso', NOW(3), 1),
('7465372b9d098bcf3d2735d036613a25925d', 'f4b310c780ec6cd98606cd91e6ea2d82b74aeec23864cb330deda5aa2177d2d9', NOW(3), '20260813170500_notificaciones_indices_y_purga', NOW(3), 1),
('db110ddd207d3c846af9cb26acd7b6b37c35', '9d6c9c768f7e6b9feff0adc35306519c59d965af0289896617b93119b2ff27af', NOW(3), '20260814120000_umbrales_alerta_configurables', NOW(3), 1);
