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
ALTER TABLE `exploracion_fisica` ADD CONSTRAINT `fk_exploracion_expediente` FOREIGN KEY (`expediente_id`) REFERENCES `expediente_clinico`(`expediente_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hallazgo_exploracion` ADD CONSTRAINT `fk_hallazgo_exploracion` FOREIGN KEY (`exploracion_id`) REFERENCES `exploracion_fisica`(`exploracion_id`) ON DELETE CASCADE ON UPDATE CASCADE;
