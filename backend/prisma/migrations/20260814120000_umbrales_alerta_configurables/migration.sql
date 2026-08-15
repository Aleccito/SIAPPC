-- Saca de `src/services/mqttIngest.ts` los umbrales que deciden si una lectura
-- se convierte en alerta y los pone en una tabla, ajustables por paciente.
--
-- Esta migración NO es la que generó Prisma tal cual: la suya crea la tabla y la
-- deja vacía, y una tabla de umbrales vacía significa que NINGUNA lectura
-- alerta. Por eso aquí, después del DDL, van los valores por defecto con
-- exactamente los mismos números y los mismos textos que hoy están escritos en
-- el código. El día que esto se despliegue no cambia ni una alerta.

-- 1. Las variables que faltaban en el catálogo.
--
--    `umbral_alerta.variable_codigo` es una clave foránea contra `variable`, y
--    tres de las que la Raspberry publica —`pr`, `perfusion`, `resp`— nunca
--    estuvieron sembradas: aparecían solas cuando la ingesta recibía la primera
--    lectura (ver el alta automática en src/services/mqttIngest.ts). Sin ellas
--    en el catálogo no se pueden sembrar sus umbrales, y un hospital recién
--    instalado se quedaría sin las bandas de tres variables hasta que alguien
--    conectara un equipo.
--
--    `WHERE NOT EXISTS` y no `REPLACE`: en una base con datos la unidad que ya
--    esté registrada es la que la operación tiene por buena, y esta migración no
--    tiene por qué pisarla. `pr` va en `lpm` como `hr` —es la misma frecuencia
--    por otra vía— aunque el equipo la publique como `bpm`; la ingesta ya avisa
--    de esa discrepancia y manda el catálogo.
--
--    `ecg` sigue fuera a propósito: no tiene umbral (una muestra suelta de
--    voltaje no dice nada sin la onda) y añadirla aquí no serviría de nada.
INSERT INTO `variable` (`codigo`, `unidad`)
SELECT * FROM (
  SELECT 'pr' AS codigo, 'lpm' AS unidad
  UNION ALL SELECT 'perfusion', '%'
  UNION ALL SELECT 'resp', 'rpm'
) AS base
WHERE NOT EXISTS (SELECT 1 FROM `variable` v WHERE v.`codigo` = base.`codigo`);

-- 2. La tabla. Ver el comentario largo del modelo en prisma/schema.prisma para
--    por qué el ajuste es por paciente y no por sensor, y por qué la vuelta
--    atrás al valor por defecto es por variable y no por banda suelta.
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

ALTER TABLE `umbral_alerta` ADD CONSTRAINT `fk_umbral_variable`
  FOREIGN KEY (`variable_codigo`) REFERENCES `variable`(`codigo`)
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- ON DELETE CASCADE: un ajuste es del paciente y con él se va. No es historia
-- clínica —el hecho clínico son las alertas que disparó, y esas cuelgan de
-- `lectura`—, así que no hay nada que conservar cuando el paciente desaparece.
ALTER TABLE `umbral_alerta` ADD CONSTRAINT `fk_umbral_paciente`
  FOREIGN KEY (`paciente_id`) REFERENCES `paciente`(`paciente_id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- 3. Los valores por defecto, copiados uno a uno de la función `evaluateAlert`
--    que había en src/services/mqttIngest.ts. Es la parte importante de esta
--    migración: sin ella, desplegar apagaría todas las alertas.
--
--    Las bandas se evalúan de mayor a menor severidad y gana la primera que
--    salta, que es el orden en el que estaban los `if`.
--
--    `resp` llega solo a `alta` y NO tiene banda `critica`, igual que antes: es
--    una estimación sacada de cómo la respiración mueve la línea de base del
--    pletismógrafo, no una respiración medida por flujo ni por impedancia, y no
--    es un número sobre el que despertar a nadie. Ahora que esto es
--    configuración, nada impide que un hospital le añada una banda `critica`
--    —el modelo no puede saber cómo se midió el dato—, pero sembrarla sería
--    tomar esa decisión por él.
--
--    `perfusion` va en `baja` y también a propósito: dice cuánta señal le llega
--    al sensor, no cómo está el paciente. De quien hay que desconfiar por debajo
--    de 0.2 es del SpO2 que sale de ahí.
INSERT INTO `umbral_alerta`
  (`variable_codigo`, `paciente_id`, `severidad`, `valor_min`, `valor_max`, `tipo`, `plantilla_mensaje`)
VALUES
  ('hr',        NULL, 'critica', 40,   140,  'hr_fuera_de_rango',   'Frecuencia cardiaca {valor} bpm fuera de rango crítico'),
  ('hr',        NULL, 'alta',    50,   120,  'hr_fuera_de_rango',   'Frecuencia cardiaca {valor} bpm fuera de rango'),
  ('spo2',      NULL, 'critica', 85,   NULL, 'spo2_bajo',           'SpO2 {valor}% crítico'),
  ('spo2',      NULL, 'alta',    90,   NULL, 'spo2_bajo',           'SpO2 {valor}% bajo'),
  ('pr',        NULL, 'critica', 40,   140,  'pr_fuera_de_rango',   'Frecuencia de pulso {valor} bpm fuera de rango crítico'),
  ('pr',        NULL, 'alta',    50,   120,  'pr_fuera_de_rango',   'Frecuencia de pulso {valor} bpm fuera de rango'),
  ('resp',      NULL, 'alta',    8,    30,   'resp_fuera_de_rango', 'Respiración estimada {valor} rpm fuera de rango'),
  ('perfusion', NULL, 'baja',    0.2,  NULL, 'perfusion_baja',      'Índice de perfusión {valor}%: señal débil, el SpO2 puede no ser fiable');
