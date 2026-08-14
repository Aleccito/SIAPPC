#!/bin/bash
# Crea la base de datos de la simulación en el MISMO servidor MariaDB que el
# resto del sistema, pero en un esquema aparte.
#
# POR QUÉ APARTE Y NO DENTRO DE `siappc`
#
# Los dos esquemas declaran una tabla `paciente`, con columnas que no tienen
# nada que ver: en el hospital es una persona con expediente; en la simulación
# es una entidad sintética de una réplica (`t_llegada`, `glasgow`, `desenlace`).
# El simulador crea su esquema con SQLAlchemy y `checkfirst=True`, así que
# apuntarlo a `siappc` NO daría un error: vería que `paciente` ya existe, se la
# saltaría en silencio y fallaría después, al insertar.
#
# Separar la base evita eso sin renombrar una sola tabla, y de paso deja cada
# cosa con la vida que le toca: los resultados de simulación son sintéticos y
# desechables —se reescriben en cada corrida—, mientras que la base clínica
# tiene respaldos, retención y permisos que no se le aplican a un experimento.
#
# Power BI no pierde nada con la separación: las dos bases viven en el mismo
# servidor, así que un informe las lee con una sola conexión y un solo gateway.
#
# CUÁNDO CORRE
#
# Solo la PRIMERA vez, cuando el volumen `mariadb_data` está vacío, igual que
# `01-schema.sql` y `02-seed.sql`. Sobre un volumen que ya existe hay que
# crearla a mano (una vez):
#
#   docker compose exec mariadb \
#     mariadb -uroot -p"$DB_ROOT_PASSWORD" -e \
#     "CREATE DATABASE IF NOT EXISTS siappc_sim CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
#      GRANT ALL PRIVILEGES ON siappc_sim.* TO '$DB_USER'@'%'; FLUSH PRIVILEGES;"
#
# Las tablas y las vistas no se crean aquí a propósito: las crea el propio
# simulador al arrancar, a partir de `src/siappc/bd.py` y `db/vistas.sql`. Así
# no hay dos definiciones del esquema que mantener sincronizadas a mano.

BASE_SIM="${SIM_DB_NAME:-siappc_sim}"

# `--protocol=socket` porque en este punto del arranque el servidor todavía no
# escucha en red: el entrypoint lo tiene levantado solo sobre el socket local.
mariadb --protocol=socket -uroot -p"${MARIADB_ROOT_PASSWORD}" <<SQL
CREATE DATABASE IF NOT EXISTS \`${BASE_SIM}\`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON \`${BASE_SIM}\`.* TO '${MARIADB_USER}'@'%';
FLUSH PRIVILEGES;
SQL

# Este archivo NECESITA el bit de ejecución. El entrypoint de MariaDB mira
# `test -x` y, si lo tiene, lo ejecuta; si no, lo *sourcea*. Sobre un bind mount
# de Docker Desktop esa comprobación no coincide siempre con lo que enseña
# `ls -l`, y un script sin el bit puesto se intentaba ejecutar igual y moría con
# "bad interpreter: Permission denied". Con el bit puesto no hay ambigüedad.
#
# Por eso tampoco hay `set -e` aquí: si el bit se pierde en el camino (un
# checkout en Windows, un zip de por medio) el archivo se sourcea, y un `set -e`
# se le quedaría pegado al entrypoint. El fallo se comprueba a mano, abajo.
#
# Salir con error aborta el arranque de MariaDB, que es lo que se quiere: si la
# base de la simulación no se pudo crear, mejor enterarse ahora que en la
# primera corrida.
if [ $? -ne 0 ]; then
  echo "[00-base-sim] No se pudo crear la base '${BASE_SIM}'." >&2
  exit 1
fi

echo "[00-base-sim] Base '${BASE_SIM}' lista para el simulador."
