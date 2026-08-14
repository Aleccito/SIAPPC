-- La tabla `notificacion` existía desde el esquema inicial y nadie escribía en
-- ella. Ahora la llena la ingesta (backend/src/lib/notificaciones.ts) y necesita
-- dos índices que antes no hacían falta, más una poda propia. Ver db/extra.sql.

-- Impide dos avisos de la MISMA alerta a la MISMA persona por el mismo canal.
--
-- No es cosmético: es la red de seguridad de la regla anti-inundación. Esa
-- regla consulta la ventana y escribe sin transacción, así que dos réplicas del
-- backend procesando lecturas a la vez pueden decidir las dos que toca avisar.
-- `createMany({ skipDuplicates })` se apoya en esta llave para que la segunda no
-- duplique en vez de reventar la ingesta con un error.
ALTER TABLE `notificacion`
  ADD UNIQUE INDEX `uq_notif_alerta_usuario_canal` (`alerta_id`, `usuario_id`, `canal`);

-- Las dos consultas calientes barren por usuario y fecha: la bandeja pagina por
-- `fecha_envio DESC`, y la ventana de agrupación pregunta por lo recibido en los
-- últimos minutos. `ix_notif_usuario_estado` no sirve para ninguna de las dos —el
-- estado casi no discrimina, todo cae en `enviado` o `leido`— y sin este índice
-- la ventana hace un escaneo por cada lectura fuera de rango, una por segundo y
-- por sensor.
CREATE INDEX `ix_notif_usuario_fecha` ON `notificacion` (`usuario_id`, `fecha_envio`);

-- Poda de notificaciones ya leídas.
--
-- Gemela de `sp_purgar_lecturas` y con el mismo `lote` por la misma razón: un
-- DELETE masivo bloquea la tabla y deja esperando a la ingesta, que escribe aquí.
--
-- Solo borra las LEÍDAS. Una sin leer es trabajo pendiente de alguien y no la
-- puede tirar un mantenimiento por antigüedad; que se acumulen viejas sin leer
-- es un problema de la persona, no de la base.
--
-- No hace falta comprobar nada más antes de borrar, al revés que en la poda de
-- lecturas: una notificación no alimenta ningún agregado ni es el único registro
-- de nada. El hecho clínico está en `alerta`, y su cuenta histórica en
-- `alerta_dia`; esto es solo el reparto.
--
-- Nota sobre el otro camino de borrado: `notificacion` cuelga de `alerta` con ON
-- DELETE CASCADE, y `alerta` de `lectura` igual. Podar lecturas viejas ya se
-- lleva por delante estas filas. Este procedimiento existe para el caso
-- contrario —bandejas que crecen más rápido de lo que se poda la serie cruda— y
-- para poder vaciarlas sin tocar el histórico de lecturas.
CREATE OR REPLACE PROCEDURE `sp_purgar_notificaciones`(IN `dias` INT UNSIGNED, IN `lote` INT UNSIGNED)
  DELETE FROM `notificacion`
  WHERE `estado_envio` = 'leido'
    AND `fecha_envio` < NOW() - INTERVAL `dias` DAY
  LIMIT `lote`;
