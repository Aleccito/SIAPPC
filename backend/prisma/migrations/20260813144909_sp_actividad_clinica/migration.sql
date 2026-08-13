-- Procedimiento del informe de actividad clínica. Ver db/extra.sql.

-- Actividad clínica por profesional, para exportar a hoja de cálculo.
--
-- Un renglón por médico. Incluye a los que NO escribieron nada en el periodo
-- —de ahí el LEFT JOIN y el filtro por rol en el HAVING—: un informe de
-- actividad que solo lista a quien trabajó no sirve para ver quién no lo hizo.
--
-- Las fechas son DATE y el rango incluye el día `hasta` completo: por eso el
-- corte superior es `< hasta + 1 día` y no `<= hasta`, que dejaría fuera todo
-- lo escrito ese día después de medianoche.
--
-- `minutos_hasta_firma` es la mediana de nada: es un PROMEDIO, y solo sobre las
-- notas que llegaron a firmarse. Una nota en borrador no tiene tiempo de firma
-- y no debe contar como cero, que bajaría el promedio y diría lo contrario de
-- lo que pasa.
CREATE OR REPLACE PROCEDURE `sp_rep_actividad_clinica`(
  IN `hospital` INT UNSIGNED,
  IN `desde` DATE,
  IN `hasta` DATE
)
  SELECT
    u.`nombre` AS `medico`,
    r.`etiqueta` AS `rol`,
    COALESCE(un.`nombre`, '') AS `unidad`,
    COUNT(n.`nota_id`) AS `notas_total`,
    COUNT(CASE WHEN n.`estado` = 'firmada' THEN 1 END) AS `notas_firmadas`,
    COUNT(CASE WHEN n.`estado` = 'borrador' THEN 1 END) AS `notas_borrador`,
    COUNT(CASE WHEN n.`nota_padre_id` IS NOT NULL THEN 1 END) AS `adendas`,
    COUNT(DISTINCT n.`paciente_id`) AS `pacientes_distintos`,
    ROUND(AVG(CASE WHEN n.`firmada_en` IS NOT NULL
      THEN TIMESTAMPDIFF(MINUTE, n.`fecha_hora`, n.`firmada_en`) END), 1) AS `minutos_hasta_firma`,
    (SELECT COUNT(*) FROM `historia_clinica` h
      WHERE h.`usuario_id` = u.`usuario_id`
        AND h.`fecha_hora` >= `desde`
        AND h.`fecha_hora` < DATE_ADD(`hasta`, INTERVAL 1 DAY)) AS `evoluciones`
  FROM `usuario` u
  JOIN `rol` r ON r.`rol_id` = u.`rol_id`
  LEFT JOIN `unidad` un ON un.`unidad_id` = u.`unidad_id`
  LEFT JOIN `nota_soap` n
    ON n.`usuario_id` = u.`usuario_id`
   AND n.`fecha_hora` >= `desde`
   AND n.`fecha_hora` < DATE_ADD(`hasta`, INTERVAL 1 DAY)
  WHERE u.`hospital_id` = `hospital`
  GROUP BY u.`usuario_id`, u.`nombre`, r.`etiqueta`, r.`nombre`, un.`nombre`
  HAVING `notas_total` > 0 OR r.`nombre` = 'medico'
  ORDER BY `notas_total` DESC, `medico` ASC;
