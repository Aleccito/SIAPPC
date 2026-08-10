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
`MQTT_HOST` apunta a la máquina donde corre el broker. El `.env` está en
`.gitignore` y ahí se queda.

### Certificado del broker

El broker solo acepta MQTT sobre TLS (puerto 8883) y con usuario, así que además
del `.env` la Pi necesita la CA que firma el certificado del broker. Se genera en
la máquina del Compose (ver [../README.md](../README.md)) y se copia a la Pi:

```bash
mkdir -p iot/certs
scp usuario@maquina-del-broker:.../infra/mosquitto/certs/ca.crt iot/certs/ca.crt
```

Solo el `ca.crt`, que es público. La clave de la CA no sale de donde se generó, y
`iot/certs/` está en `.gitignore`.

Con eso, `MQTT_CA_FILE` puede quedar vacío en el `.env`: por defecto se busca ahí.
Si falta el archivo, el proceso no arranca y lo dice; lo que no hace es publicar
en claro.

La Pi valida además que el nombre del certificado coincida con `MQTT_HOST`. Si
llegas al broker por IP, esa IP tiene que estar dentro del certificado — se
reemite con `MQTT_EXTRA_SANS`, no se desactiva la comprobación.

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

El broker ya no es un contenedor desechable y anónimo: lo levanta el Compose de
la raíz (`docker compose up -d`), con TLS y con usuario. Para ver lo que entra,
desde la raíz del repo:

```bash
docker run --rm --network siappc_default \
  -v "$PWD/infra/mosquitto/certs/ca.crt:/ca.crt:ro" \
  eclipse-mosquitto:2 mosquitto_sub --cafile /ca.crt \
  -h mosquitto -p 8883 -t 'siappc/#' -v \
  -u siappc -P 'la MQTT_PASSWORD del .env de la raíz'
```

Sin `--cafile` la conexión falla, y sin `-u`/`-P` el broker responde
`not authorised`. Es lo esperado: no hay puerto en claro ni acceso anónimo.

Para publicar desde la laptop, `python3 src/main.py --simulate` con un `.env`
que apunte a esa máquina y con `iot/certs/ca.crt` en su sitio. `DEVICE_CODE`
tiene que existir en la tabla `dispositivo`, o el backend descarta las lecturas
por no saber de quién son.
