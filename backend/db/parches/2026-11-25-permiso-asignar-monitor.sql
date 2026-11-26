-- El administrativo asigna y libera el monitor de un paciente (PUT/DELETE /patients/:id/device piden
-- `dispositivos: editar`). seed.sql ya lo trae para las bases nuevas; esto es para las ya sembradas.
--
-- Idempotente: se puede correr varias veces. Lo corre prototipo/tools/base/base.sh cargar, o a mano:
--
--   docker compose exec -T mariadb sh -c 'mariadb -u"$MARIADB_USER" -p"$MARIADB_PASSWORD" "$MARIADB_DATABASE"' \
--     < backend/db/parches/2026-11-25-permiso-asignar-monitor.sql

UPDATE rol_permiso rp
JOIN rol r ON r.rol_id = rp.rol_id
JOIN permiso p ON p.permiso_id = rp.permiso_id
SET rp.puede_editar = TRUE
WHERE r.nombre = 'administrativo' AND p.modulo = 'dispositivos';

-- Por si la base no tenía el renglón (una matriz editada a mano): se crea con ver y editar.
INSERT IGNORE INTO rol_permiso (rol_id, permiso_id, puede_ver, puede_crear, puede_editar, puede_eliminar)
SELECT r.rol_id, p.permiso_id, TRUE, FALSE, TRUE, FALSE
FROM rol r
JOIN permiso p ON p.modulo = 'dispositivos'
WHERE r.nombre = 'administrativo';
