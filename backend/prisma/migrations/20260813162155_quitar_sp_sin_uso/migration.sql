-- Elimina los dos procedimientos que nadie llamaba.
--
-- `sp_kpi_tablero` y `sp_rep_actividad_clinica` devolvían filas, y el adaptador
-- de MariaDB de Prisma entrega los resultados de un `CALL` sin nombres de
-- columna: no eran invocables desde la API. Lo que la aplicación necesita leer
-- vive en vistas —`v_rep_actividad_clinica` alimenta el informe en CSV— y el
-- panel consulta sus cifras por su cuenta.
--
-- Un objeto que nadie usa no es una reserva para el futuro: es código que
-- envejece sin que nada avise cuando deja de cuadrar con el esquema.
DROP PROCEDURE IF EXISTS `sp_kpi_tablero`;
DROP PROCEDURE IF EXISTS `sp_rep_actividad_clinica`;
