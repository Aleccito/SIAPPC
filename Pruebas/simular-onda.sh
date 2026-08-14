#!/usr/bin/env sh
#
# Publica lotes de onda de ECG como si viniera de la Raspberry, para probar el
# camino completo: broker → backend → SSE → trazo en el navegador.
#
#   sh Pruebas/simular-onda.sh              10 lotes de 1 s a 250 Hz
#   LOTES=60 sh Pruebas/simular-onda.sh     un minuto
#   BPM=140 sh Pruebas/simular-onda.sh      taquicardia
#
# La onda NO se guarda en ninguna tabla: si nadie tiene esa cama abierta en el
# navegador, el backend la descarta al recibirla. Para ver algo hay que estar en
# el monitor de la cama (/monitoring/<device>) o en la Ronda.
#
# mosquitto_pub corre DENTRO del contenedor del broker: asi no hace falta
# instalar cliente MQTT ni copiar la CA a la máquina de desarrollo.

set -eu

MSYS_NO_PATHCONV=1
MSYS2_ARG_CONV_EXCL="*"
export MSYS_NO_PATHCONV MSYS2_ARG_CONV_EXCL

RAIZ=$(cd "$(dirname "$0")/.." && pwd)

DISPOSITIVO=${DISPOSITIVO:-RPI-SIM-01}
HZ=${HZ:-250}
BPM=${BPM:-72}
LOTES=${LOTES:-10}

MQTT_USER=$(grep -E '^MQTT_USER=' "$RAIZ/.env" | cut -d= -f2-)
MQTT_PASSWORD=$(grep -E '^MQTT_PASSWORD=' "$RAIZ/.env" | cut -d= -f2-)

echo "Publicando ${LOTES} lotes en siappc/${DISPOSITIVO}/waveform (${HZ} Hz, ${BPM} lpm)"

i=0
while [ "$i" -lt "$LOTES" ]; do
  # Un segundo de PQRST sintético. Es una prueba del TRANSPORTE, no del
  # procesamiento: lo que se comprueba es que las muestras llegan y se dibujan.
  CARGA=$(python -c "
import json, math, time
hz = ${HZ}
bpm = ${BPM}
n = hz
periodo = hz * 60.0 / bpm
muestras = []
for k in range(n):
    fase = (k % periodo) / periodo
    # Complejo QRS estrecho mas onda T, suficiente para reconocer la forma.
    if 0.10 <= fase < 0.14:   v = -0.10
    elif 0.14 <= fase < 0.18: v = 1.00
    elif 0.18 <= fase < 0.22: v = -0.25
    elif 0.32 <= fase < 0.45: v = 0.22 * math.sin((fase - 0.32) / 0.13 * math.pi)
    else:                     v = 0.0
    # Ruido de red y deriva de linea de base, como el AD8232 real.
    v += 0.012 * math.sin(2 * math.pi * 60 * k / hz)
    v += 0.04 * math.sin(2 * math.pi * 0.3 * k / hz)
    muestras.append(round(v, 3))
print(json.dumps({
  'device': '${DISPOSITIVO}',
  'variable': 'ecg',
  'hz': hz,
  'ts': time.time(),
  'samples': muestras,
}))
")

  docker compose exec -T mosquitto mosquitto_pub \
    -h localhost -p 8883 \
    --cafile /mosquitto/certs/ca.crt \
    -u "$MQTT_USER" -P "$MQTT_PASSWORD" \
    -t "siappc/${DISPOSITIVO}/waveform" \
    -q 0 \
    -m "$CARGA"

  i=$((i + 1))
  sleep 1
done

echo "Listo. ${LOTES} lotes publicados."
