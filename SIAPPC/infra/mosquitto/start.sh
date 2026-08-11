#!/bin/sh
#
# Arranque del broker dentro del contenedor (ver el servicio `mosquitto` en
# docker-compose.yml). Existe para una sola cosa: crear el archivo de
# contraseñas a partir de MQTT_USER/MQTT_PASSWORD antes de levantar mosquitto.
#
# Así las credenciales viven únicamente en el `.env` de la raíz —el mismo que
# leen el backend y la Pi— y no hay ningún hash commiteado que se desincronice.

set -eu

PASSWD=/mosquitto/config/passwd

if [ -z "${MQTT_USER:-}" ] || [ -z "${MQTT_PASSWORD:-}" ]; then
  echo "Faltan MQTT_USER/MQTT_PASSWORD: el broker no acepta conexiones anónimas." >&2
  exit 1
fi

# mosquitto_passwd -c se niega a sobrescribir un archivo existente, y este
# directorio persiste entre reinicios del contenedor.
rm -f "$PASSWD"
mosquitto_passwd -b -c "$PASSWD" "$MQTT_USER" "$MQTT_PASSWORD"

# El archivo se crea como root, pero mosquitto baja a su propio usuario nada
# más leer la configuración y entonces ya no podría abrirlo.
chown mosquitto:mosquitto "$PASSWD"
chmod 600 "$PASSWD"

exec mosquitto -c /mosquitto/config/mosquitto.conf
