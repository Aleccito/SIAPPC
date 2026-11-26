#!/bin/sh
# Datos de la base para el prototipo conectado (prototipo/docs/CONEXION-BACKEND.md, 9.3). Corre DENTRO del contenedor de MariaDB,
# con sus variables (MARIADB_*), así que no hace falta escribir contraseñas ni pelear con comillas en PowerShell.
#
#   docker compose exec mariadb rm -rf /tmp/db /tmp/base   # sin esto, cp mete la carpeta dentro de la anterior
#   docker compose cp backend/db/. mariadb:/tmp/db
#   docker compose cp prototipo/tools/base/. mariadb:/tmp/base
#   docker compose exec mariadb sh /tmp/base/base.sh revisar   # solo lee
#   docker compose exec mariadb sh /tmp/base/base.sh cargar    # carga lo que falte; se puede repetir
set -e
db() { mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" --default-character-set=utf8mb4 "$MARIADB_DATABASE" "$@"; }

case "$1" in
  revisar)
    db -t < /tmp/base/revisar.sql
    ;;
  cargar)
    n=$(db -N -e "SELECT COUNT(*) FROM paciente WHERE cedula LIKE 'DEMO-%'")
    if [ "$n" = "0" ]; then
      db < /tmp/db/seed-demo.sql
      echo "seed-demo.sql cargado"
    else
      # seed-demo.sql falla si las cédulas DEMO ya existen: no se vuelve a cargar.
      echo "seed-demo.sql ya estaba ($n pacientes DEMO)"
    fi
    db < /tmp/db/parches/2026-11-23-permiso-asistente-ia.sql
    db < /tmp/db/parches/2026-11-24-notas-soap-demo.sql
    db < /tmp/db/parches/2026-11-25-permiso-asignar-monitor.sql
    db -t < /tmp/base/asignar-enfermeria.sql
    db -t < /tmp/base/monitores-libres.sql
    echo "Parches, asignaciones de enfermería y monitores libres al día."
    db -t < /tmp/base/revisar.sql
    ;;
  *)
    echo "Uso: sh /tmp/base/base.sh revisar|cargar" >&2
    exit 1
    ;;
esac
