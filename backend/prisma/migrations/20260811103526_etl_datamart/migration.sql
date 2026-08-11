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

-- AddForeignKey
ALTER TABLE `lectura_hora` ADD CONSTRAINT `fk_lechora_sensor` FOREIGN KEY (`sensor_id`) REFERENCES `sensor`(`sensor_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alerta_dia` ADD CONSTRAINT `fk_alertadia_sensor` FOREIGN KEY (`sensor_id`) REFERENCES `sensor`(`sensor_id`) ON DELETE CASCADE ON UPDATE CASCADE;

