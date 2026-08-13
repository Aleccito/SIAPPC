-- Vista de dimensión de paciente para Power BI, sin campos identificables.
--
-- Va también en db/extra.sql, que es de donde `npm run schema:build` la copia a
-- db/schema.sql para las bases que nacen de cero. Esta migración es para las que
-- ya existen.
--
-- `CREATE OR REPLACE` en vez de `CREATE`: reaplicar la migración sobre una base
-- que ya la tiene no falla, y cambiar la vista más adelante es reemplazarla.

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
