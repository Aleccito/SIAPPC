-- Vista de detalle de actividad clínica. Ver db/extra.sql.

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
