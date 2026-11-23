-- Permiso `asistente_ia` para bases creadas antes de que existiera.
--
-- seed.sql solo corre al crear el volumen de MariaDB, así que una base ya
-- sembrada no lo tiene. Este script es idempotente: se puede correr varias veces.
--
--   docker compose exec -T mariadb sh -c 'mariadb -u"$MARIADB_USER" -p"$MARIADB_PASSWORD" "$MARIADB_DATABASE"' \
--     < backend/db/parches/2026-11-23-permiso-asistente-ia.sql

INSERT IGNORE INTO permiso (modulo, nombre, descripcion)
VALUES ('asistente_ia', 'Asistente IA', 'Consultas al asistente clínico con IA');

INSERT IGNORE INTO rol_permiso (rol_id, permiso_id, puede_ver, puede_crear, puede_editar, puede_eliminar)
SELECT r.rol_id, p.permiso_id, TRUE, FALSE, FALSE, FALSE
FROM rol r
JOIN permiso p ON p.modulo = 'asistente_ia'
WHERE r.nombre IN ('medico', 'admin');
