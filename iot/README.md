# IoT - Sensores Biomédicos

Lectura de signos vitales mediante Raspberry Pi 4 + sensores biomédicos, y
publicación por MQTT hacia el backend.

## Sensores

- **MAX30102**: frecuencia cardíaca (HR) y saturación de oxígeno (SpO2)
- **AD8232 + ADS1115**: electrocardiograma (ECG)

## Setup

```bash
python3 -m venv ~/venv --system-site-packages
source ~/venv/bin/activate
pip install -r requirements.txt
```

El `.env` de la Pi se le pide a **Ing.Adrian**: ahí vienen las credenciales reales
del broker. [`.env.example`](.env.example) solo documenta qué variables existen.
`DEVICE_CODE` debe coincidir con `dispositivo.codigo` en la base de datos, y
`MQTT_HOST` apunta al broker. El `.env` está en `.gitignore` y ahí se queda.

Esta parte corre sobre la Raspberry Pi con los sensores conectados, así que no
va en Docker: el resto del sistema (base, backend, frontend) se levanta con
`docker compose up` desde la raíz del repo, ver [../README.md](../README.md).

## Ejecutar

```bash
python3 src/main.py
```

Sin hardware conectado, para probar la cadena completa desde una laptop:

```bash
python3 src/main.py --simulate
```

## Qué publica

Una vez por segundo, un mensaje por variable, QoS 1:

```
siappc/<DEVICE_CODE>/telemetry   {device, variable, value, unit, ts, hash}
siappc/<DEVICE_CODE>/status      retenido: {"status": "online" | "offline"}
```

Las variables son `hr` (bpm), `spo2` (%) y `ecg` (V). El ECG va como **muestra
instantánea**, no como onda: la señal completa son ~250 muestras por segundo y
no cabe en el modelo de una fila por lectura. Si más adelante hace falta
graficar la onda, necesita su propia tabla y su propio tema MQTT.

Un valor inválido (por ejemplo, el dedo fuera del sensor) no se publica. Un
hueco en la serie es más honesto que un cero que parece una medición.

El tema `status` es retenido y además está declarado como Last Will: si la Pi
se apaga o pierde la red sin avisar, el broker publica `offline` por ella y el
tablero puede marcar el dispositivo como caído.

## Buffer

Las lecturas se guardan en `buffer.db` (SQLite, git-ignorado) antes de
publicarse, y solo se borran cuando el broker confirma la entrega. Si la red se
cae, la lectura sigue y se acumula; al reconectar se vacía la cola. Con
`BUFFER_MAX_ROWS` (86400 por defecto, ~un día a una lectura por segundo) se
descartan las lecturas más viejas antes que las recientes.

Cada lectura lleva un `hash` SHA-256 de `dispositivo|variable|ts|valor`. El
backend tiene un índice único sobre esa columna, así que un reenvío tras una
caída, o un duplicado de QoS 1, se descarta en vez de contarse dos veces.

## Estructura

- `src/sensors/`: drivers y scripts de prueba individuales por sensor
- `src/main.py`: bucle de lectura y publicación
- `src/publisher.py`: cliente MQTT, reconexión y vaciado del buffer
- `src/buffer.py`: cola local en SQLite
- `src/config.py`: configuración por entorno

## Probar sin Raspberry

Levanta un broker desechable y observa los mensajes:

```bash
docker run -d --rm --name mqtt-test -p 1883:1883 eclipse-mosquitto:2 sh -c "printf 'listener 1883\nallow_anonymous true\n' > /mosquitto/config/mosquitto.conf; mosquitto -c /mosquitto/config/mosquitto.conf"
```

```bash
docker run --rm --network host eclipse-mosquitto:2 mosquitto_sub -h host.docker.internal -t 'siappc/#' -v
```
