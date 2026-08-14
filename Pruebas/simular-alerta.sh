#!/usr/bin/env sh
#
# Publica una lectura por MQTT como si viniera de la Raspberry, para ver el
# camino completo: broker → backend → `lectura` → `alerta` → SSE → pantalla.
#
#   sh Pruebas/simular-alerta.sh                 hr 165 (crítica)
#   VARIABLE=spo2 VALOR=82 sh Pruebas/simular-alerta.sh
#   VARIABLE=hr VALOR=75 sh Pruebas/simular-alerta.sh    lectura normal, sin alerta
#
# Umbrales (backend/src/services/mqttIngest.ts):
#   hr, pr   <40 o >140 crítica · <50 o >120 alta · resto sin alerta
#   spo2     <85 crítica · <90 alta
#
# El dispositivo tiene que existir en `dispositivo.codigo`: el backend descarta
# la lectura de un equipo no registrado. El sensor NO hace falta crearlo, lo da
# de alta el propio backend la primera vez que llega una variable nueva.
#
# mosquitto_pub corre DENTRO del contenedor del broker: así no hace falta
# instalar cliente MQTT ni copiar la CA a la máquina de desarrollo.

set -eu

# Git Bash reescribe cualquier argumento que empiece por "/" como ruta de
# Windows: `--cafile /mosquitto/certs/ca.crt` llegaba al contenedor convertido y
# mosquitto_pub respondía "Problem setting TLS options: File not found". En
# Linux y macOS estas dos variables no hacen nada.
MSYS_NO_PATHCONV=1
MSYS2_ARG_CONV_EXCL="*"
export MSYS_NO_PATHCONV MSYS2_ARG_CONV_EXCL

RAIZ=$(cd "$(dirname "$0")/.." && pwd)

DISPOSITIVO=${DISPOSITIVO:-RPI-SIM-01}
VARIABLE=${VARIABLE:-hr}
VALOR=${VALOR:-165}

case "$VARIABLE" in
  spo2) UNIDAD=${UNIDAD:-%} ;;
  *) UNIDAD=${UNIDAD:-bpm} ;;
esac

# Las credenciales salen del .env de la raíz, que es el mismo que usa el backend
# para conectarse al broker. No se imprimen.
MQTT_USER=$(grep -E '^MQTT_USER=' "$RAIZ/.env" | cut -d= -f2-)
MQTT_PASSWORD=$(grep -E '^MQTT_PASSWORD=' "$RAIZ/.env" | cut -d= -f2-)

# Marca de tiempo en segundos con milisegundos, como la manda la Pi.
TS=$(python -c 'import time; print(f"{time.time():.3f}")')

# El hash es la identidad de la lectura y el backend tiene un índice único
# sobre él: dos mensajes idénticos no se cuentan dos veces. La fórmula es la
# de iot/src/publisher.py:reading_hash y tiene que coincidir dígito a dígito.
HASH=$(python -c "
import hashlib
crudo = f'${DISPOSITIVO}|${VARIABLE}|${TS}|${VALOR}'
# El publicador formatea el valor con 4 decimales y la marca con 3.
crudo = '${DISPOSITIVO}|${VARIABLE}|%.3f|%.4f' % (${TS}, ${VALOR})
print(hashlib.sha256(crudo.encode('utf-8')).hexdigest())
")

CARGA=$(python -c "
import json
print(json.dumps({
  'device': '${DISPOSITIVO}',
  'variable': '${VARIABLE}',
  'value': float(${VALOR}),
  'unit': '${UNIDAD}',
  'ts': float(${TS}),
  'hash': '${HASH}',
}))
")

echo "Publicando en siappc/${DISPOSITIVO}/telemetry: ${VARIABLE}=${VALOR} ${UNIDAD}"

docker compose exec -T mosquitto mosquitto_pub \
  -h localhost -p 8883 \
  --cafile /mosquitto/certs/ca.crt \
  -u "$MQTT_USER" -P "$MQTT_PASSWORD" \
  -t "siappc/${DISPOSITIVO}/telemetry" \
  -q 1 \
  -m "$CARGA"

echo "Publicado. La alerta, si el valor está fuera de rango, sale por"
echo "GET /sensors/alerts y en vivo por GET /alerts/stream."
