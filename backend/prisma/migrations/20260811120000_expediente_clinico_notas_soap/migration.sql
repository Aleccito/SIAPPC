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
