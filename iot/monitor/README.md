# Monitor de signos vitales — Raspberry Pi

> ## Estado dentro de SIAPPC — leer antes de usarlo
>
> Este directorio es el proyecto `Rasp-main` incorporado como módulo aparte, con
> **la capa de red reemplazada**: ya no habla HTTP contra `/api/v1/ingest` (un
> endpoint que el backend de SIAPPC no tiene), sino que **publica por MQTT** en
> `siappc/<dispositivo>/telemetry`, el mismo camino que [`../src/`](../src/) y
> el mismo consumidor (`backend/src/services/mqttIngest.ts`). Las lecturas
> terminan en las tablas `sensor` y `lectura`.
>
> Consecuencias de esa decisión:
>
> - Broker, credenciales y CA salen de **`iot/.env`**, el mismo archivo que usa
>   `../src/` (ver [`iot_env.py`](iot_env.py)). No hay una segunda copia de la
>   contraseña del broker.
> - `device.device_id` tiene que existir como `dispositivo.codigo` en la base, o
>   el backend descarta las lecturas por no saber de quién son. Por defecto vale
>   el `DEVICE_CODE` del `.env`.
> - **Las ondas (ECG, pleth, resp) no se publican.** El backend guarda una fila
>   por lectura y el ECG son ~250 muestras por segundo: no entra en ese modelo.
>   Se dibujan en pantalla y ahí se quedan. Graficar la onda necesita su propia
>   tabla y su propio tema MQTT.
> - Tampoco viajan las alarmas, la calidad de señal ni el diagnóstico del
>   equipo: el payload es una lectura suelta y no tiene dónde meterlos. Las
>   alarmas las vuelve a evaluar el backend sobre las cinco variables, con los
>   mismos límites que usa esta pantalla; las que suenan acá se quedan acá.
> - Lo que sí sabe el backend es si el equipo está vivo: el tema `status` va
>   retenido y como Last Will, y del otro lado mueve `dispositivo.estado`.
> - El contrato viejo, documentado en [JSON.md](JSON.md), quedó como histórico,
>   y `tools/receptor_prueba.py` con él: no reciben nada de lo que el monitor
>   manda hoy.
>
> `../src/` sigue existiendo y no se tocó: son dos programas sobre el mismo
> hardware que ahora publican por el mismo sitio.

Monitor de cabecera hecho con **MAX30102** (SpO2 y pulso), **AD8232** (ECG) y
**ADS1115** (conversor A/D). Hace dos cosas:

1. **Muestra** en la pantalla del Pi un monitor de paciente a pantalla completa:
   ECG con papel milimetrado, pletismografia, respiracion, numeros grandes y
   alarmas.
2. **Publica** los signos vitales por MQTT (TLS) al backend de SIAPPC, una
   lectura por mensaje.

En pantalla **solo aparece lo que estos tres modulos pueden medir**. Cada caja
del panel numerico lleva escrito de que sensor sale, y lo que es una estimacion
esta rotulado como tal.

![Pantalla del monitor](docs/pantalla-normal.png)

![Con alarma activa](docs/pantalla-alarma.png)

Panel de diagnostico (tecla `D`): la salud del **equipo**, separada de los
signos vitales del paciente.

![Panel de diagnostico](docs/pantalla-diagnostico.png)

> ⚠️ **Esto no es un equipo medico.** No esta certificado ni calibrado contra
> ningun patron. La curva de SpO2 es una aproximacion generica y la deteccion
> de QRS no es de grado diagnostico. Sirve para aprender, prototipar y ver
> tendencias. No lo uses para diagnosticar ni para decidir nada sobre la salud
> de una persona.

---

## Que mide cada modulo (y que no)

| Modulo | Que mide de verdad | Lo que sale en pantalla |
|---|---|---|
| **AD8232** | un canal de ECG analogico + LO+/LO- de electrodo suelto | traza de ECG, **FC**, intervalo R-R, RMSSD de corto plazo |
| **ADS1115** | nada propio: es el conversor A/D del AD8232 | digitaliza el ECG y avisa si la senial satura |
| **MAX30102** | luz roja e infrarroja reflejada, y la temperatura de su propio chip | pletismografia, **SpO2**, **PR**, **indice de perfusion** |

**Lo que este equipo no mide**, y por eso no aparece como signo vital:
temperatura corporal, presion arterial, capnografia, y respiracion por
impedancia toracica o por flujo.

Dos casos de frontera, marcados en la pantalla en vez de disimulados:

- **RESP** sale de como la respiracion mueve la linea de base del
  pletismografo. Es una tecnica real, pero es una **estimacion**: el numero va
  con un `~` adelante y la caja dice ESTIMADA. Si preferis no mostrarlo,
  `resp.enabled: false` en la configuracion lo saca junto con su carril.
- **La temperatura del MAX30102** es la de su propio chip, que el fabricante
  expone para compensar la deriva de los LED. No tiene nada que ver con la
  temperatura del paciente, asi que **no esta en el panel de signos vitales**:
  vive en el panel de diagnostico (tecla `D`) junto al resto de la salud del
  equipo.

Un par de aclaraciones sobre precision, para que nadie lea de mas:

- Los **mV del ECG** salen de dividir por la ganancia nominal del modulo
  (1100 en el diseno de referencia del AD8232). Es una conversion nominal, no
  una calibracion contra un patron.
- El **SpO2** usa una curva empirica generica. Un oximetro comercial se calibra
  contra co-oximetria en personas reales.
- La traza dice **`ECG`** a secas y no `ECG II`: con 3 electrodos la derivacion
  depende de donde los pegues, y el modulo no tiene forma de saberlo. Si los
  ubicas para derivacion II, poné `ecg.lead_label: "ECG II"` en la config.

---

## Probarlo ya, sin hardware

Anda en Windows, Mac o Linux, con seniales simuladas:

```bash
pip install pygame paho-mqtt
python main.py --demo --windowed --no-backend
```

Con `--no-backend` no toca la red. Sin esa opción intenta publicar en el broker
que diga `iot/.env`, y si no está, acumula las lecturas en su cola local.

En modo demo, las teclas **F1..F6** mueven la senial (bajar SpO2, subir la
frecuencia, sacar el dedo, despegar un electrodo) para ver las alarmas sin
tener que provocarlas de verdad.

---

## Cableado

Todo por I2C, los dos sensores comparten el mismo bus. Las direcciones no
chocan: ADS1115 en `0x48` y MAX30102 en `0x57`.

| Desde | Hasta | Pin fisico del Pi |
|---|---|---|
| ADS1115 VDD | 3V3 | 1 |
| ADS1115 GND | GND | 6 |
| ADS1115 SDA | GPIO2 (SDA1) | 3 |
| ADS1115 SCL | GPIO3 (SCL1) | 5 |
| ADS1115 ADDR | GND (→ 0x48) | 6 |
| **AD8232 OUTPUT** | **ADS1115 A0** | — |
| AD8232 3.3V | 3V3 | 17 |
| AD8232 GND | GND | 9 |
| AD8232 LO+ | GPIO17 | 11 |
| AD8232 LO- | GPIO27 | 13 |
| MAX30102 VIN | 3V3 | 1 |
| MAX30102 GND | GND | 6 |
| MAX30102 SDA | GPIO2 | 3 |
| MAX30102 SCL | GPIO3 | 5 |

**Alimenta el AD8232 con 3.3 V, no con 5 V.** Su salida esta centrada en
VCC/2, asi que con 5 V las puntas pueden superar lo que tolera la entrada del
ADS1115 alimentado a 3.3 V.

### Electrodos (derivacion II)

| Cable | Donde va |
|---|---|
| RA (rojo) | debajo de la clavicula derecha |
| LA (amarillo) | costilla inferior izquierda / cadera |
| RL (verde, referencia) | abdomen inferior derecho |

Electrodos nuevos y con gel. Los secos dan una linea de base que se va a
cualquier lado y el detector de QRS se vuelve loco.

---

## Instalacion en el Pi

Raspberry Pi OS Bookworm o mas nuevo:

```bash
sudo raspi-config nonint do_i2c 0     # habilita I2C
sudo apt install -y python3-pygame python3-smbus i2c-tools
```

Subir el bus I2C a 400 kHz (viene a 100 kHz, que es lento para leer el ECG a
250 Hz). Agregar a `/boot/firmware/config.txt`:

```
dtparam=i2c_arm=on,i2c_arm_baudrate=400000
```

Reiniciar y verificar que aparezcan los dos chips:

```bash
i2cdetect -y 1
```

Tienen que salir `48` y `57`. Si falta alguno, revisa cableado y alimentacion
antes de seguir.

Dependencias de Python (Bookworm no deja instalar con pip en el sistema, asi
que va un entorno virtual):

```bash
python3 -m venv --system-site-packages .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## Uso

```bash
python main.py                                    # pantalla completa, con hardware
python main.py --mqtt 192.168.0.50                # apuntando a otro broker
python main.py --mqtt 192.168.0.50:8883           # con puerto explícito
python main.py --device CAMA-3                    # código del dispositivo en la base
python main.py --no-backend                       # solo pantalla, sin red
python main.py --demo --windowed                  # sin sensores
python main.py --notch 60                         # zona de 60 Hz
python main.py --captura pantalla.png             # guarda una imagen y sale
```

### Teclas

| Tecla | Que hace |
|---|---|
| `ESC` / `Q` | salir |
| `M` | silenciar alarmas 2 minutos |
| `S` | sonido on/off |
| `1` `2` `3` | velocidad de barrido: 12.5 / 25 / 50 mm/s |
| `+` `-` | ganancia del ECG |
| `C` | limpiar las trazas |
| `D` | panel de debug |
| `F` | alternar pantalla completa |
| `F1`..`F6` | controles del modo demo |

---

## Configuracion

Todo esta en [config.py](config.py) con valores por defecto razonables. Para
cambiar algo sin tocar el codigo:

```bash
python main.py --save-config config.json   # genera el archivo con todo
nano config.json                           # editas lo que quieras
python main.py --config config.json
```

Tambien se puede por variables de entorno, util para el arranque automatico:

```bash
MONITOR_MQTT_HOST=192.168.0.50 MONITOR_DEVICE_ID=CAMA-3 python main.py
```

Las **credenciales del broker no se configuran aca**: usuario, contrasena y CA
salen de `iot/.env` con los nombres de siempre (`MQTT_HOST`, `MQTT_USER`,
`MQTT_PASSWORD`, `MQTT_CA_FILE`...), que es de donde tambien las lee `../src/`.
Ver [`../README.md`](../README.md) para como se arma ese archivo y como se copia
el `ca.crt` a la Pi.

Lo que mas se suele tocar:

| Donde | Que |
|---|---|
| `backend.host` / `port` | broker MQTT, si no es el del `.env` |
| `backend.vitals_interval_s` | cada cuanto se publica (1 s por defecto) |
| `device.device_id` | codigo del dispositivo, como esta en la tabla `dispositivo` |
| `ecg.notch_hz` | 50 en Argentina/Europa, 60 en Norteamerica |
| `ecg.sample_rate_hz` | 250 por defecto. El ADS1115 llega a 860 |
| `ecg.frontend_gain` | ganancia del modulo AD8232 (tipico 1100) |
| `ecg.lead_label` | como se rotula la traza: `ECG`, `ECG II`, `DI`... |
| `resp.enabled` | `false` saca la estimacion de respiracion y su carril |
| `alarms.*` | limites de FC, SpO2 y respiracion |
| `ppg.led_red_current` / `led_ir_current` | subilos si el indice de perfusion queda muy bajo |
| `ui.sweep_seconds` | cuantos segundos entran a lo ancho |

---

## Que manda al backend

Una vez por segundo (`backend.vitals_interval_s`), **un mensaje MQTT por
variable**, QoS 1:

```
siappc/<DEVICE_CODE>/telemetry   {device, variable, value, unit, ts, hash}
siappc/<DEVICE_CODE>/status      retenido: {"status": "online" | "offline"}
```

Las cinco variables, con el mismo redondeo que muestra la pantalla:

| `variable` | De donde sale | Unidad |
|---|---|---|
| `hr` | AD8232 -> ADS1115, intervalos R-R | bpm |
| `spo2` | MAX30102, relacion rojo/infrarrojo | % |
| `pr` | MAX30102, picos del pletismograma | bpm |
| `perfusion` | MAX30102, AC pico a pico sobre DC | % |
| `resp` | **estimada** del pleth, no medida | rpm |

`resp` es una estimacion y no una medicion: en pantalla va rotulada como tal,
pero el payload no tiene donde decirlo. Quien lea esa serie tiene que saberlo.

Lo que **no** viaja: las ondas (ECG, pleth, resp), las alarmas, la calidad de
senial y el diagnostico del equipo. La razon esta arriba, en el recuadro del
principio.

Una variable que todavia no se puede medir (el dedo fuera del sensor, el
detector de QRS asentandose) no se publica. Un hueco en la serie es mas honesto
que un cero que parece una medicion.

El tema `status` es retenido y ademas esta declarado como Last Will: si el Pi se
apaga o pierde la red sin avisar, el broker publica `offline` por el, y el
backend marca el dispositivo como `inactivo`.

### Cola local

Las lecturas se escriben en `iot/monitor-buffer.db` (SQLite, git-ignorado) antes
de publicarse, y solo se borran cuando el broker confirma la entrega. Es la
misma cola que usa `../src/`, en otro archivo: si los dos corren en el mismo Pi
no se pisan. El bucle de pantalla nunca toca la red — encola y sigue, y un hilo
aparte vacia la cola — asi que una WiFi lenta no le baja los FPS.

Cada lectura lleva un `hash` SHA-256 de `dispositivo|variable|ts|valor`,
construido igual que en `../src/publisher.py`. El backend tiene un indice unico
sobre esa columna, asi que un reenvio tras una caida, o un duplicado de QoS 1,
se descarta en vez de contarse dos veces.

### Verlo llegar

```bash
docker run --rm --network siappc_default   -v "$PWD/infra/mosquitto/certs/ca.crt:/ca.crt:ro"   eclipse-mosquitto:2 mosquitto_sub --cafile /ca.crt   -h mosquitto -p 8883 -t 'siappc/#' -v -u siappc -P '...'
```

(desde la raiz del repo, con el Compose levantado). `tools/receptor_prueba.py`
era el equivalente cuando esto hablaba HTTP; ya no recibe nada.

---

## Arranque automatico

### Con escritorio (lo mas simple)

```bash
mkdir -p ~/.config/autostart
cp scripts/monitor.desktop ~/.config/autostart/
```

### Sin escritorio, directo a la consola

Va mas fluido porque no hay compositor en el medio. SDL dibuja sobre KMS/DRM:

```bash
sudo cp scripts/monitor.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now monitor
journalctl -u monitor -f          # para ver que pasa
```

El usuario tiene que estar en los grupos `video`, `render`, `i2c` y `gpio`:

```bash
sudo usermod -aG video,render,i2c,gpio $USER
```

---

## Si algo no anda

**No aparece nada en `i2cdetect`**
I2C deshabilitado, o SDA/SCL cruzados, o el modulo sin alimentacion. El
MAX30102 de las placas moradas a veces necesita resistencias de pull-up de 4.7k
a 3.3 V en SDA y SCL.

**`PART_ID inesperado: 0x11`**
Es un MAX30100, no un MAX30102. Los registros son distintos y este driver no
le sirve.

**El ECG es una linea plana**
Casi siempre son los electrodos. Si en pantalla dice ELECTRODO SUELTO, LO+/LO-
estan en alto: revisa el contacto. Si no dice nada pero igual esta plano, abri
el panel de diagnostico con la tecla `D` y mira `base AD8232`: tiene que dar
cerca de **1.65 V** (la mitad de 3.3 V). Si da casi 0 o casi 3.3, el modulo
esta pegado a un riel o mal alimentado, y no es un problema de software.

**Dice SENIAL DE ECG SATURADA**
La salida del AD8232 esta chocando contra su alimentacion. Suele ser el
paciente moviendose, un electrodo despegandose, o el modulo alimentado a 5 V
en vez de 3.3 V. Mientras dure eso, lo que se dibuja no es el corazon.

**El ECG es una senoide de 50 Hz**
Ruido de red. Verifica que `ecg.notch_hz` coincida con tu pais, aleja los
cables del cargador del Pi y no toques la parte metalica de los electrodos.

**La FC no aparece nunca**
El detector necesita unos 4 segundos para asentarse y aprender el umbral. Si
despues de eso sigue en `---`, la senial esta muy ruidosa o muy chica.

**El SpO2 tarda o salta**
Necesita 3 latidos limpios (unos 6 segundos). El dedo tiene que estar apoyado
firme y quieto, sin apretar. Si el indice de perfusion queda por debajo de 0.2
subi `ppg.led_red_current` y `led_ir_current`.

**Va a pocos fps**
Baja `ui.fps` a 30, o `ecg.sample_rate_hz` a 128. Un Pi 4 con HDMI 1080p tiene
que ir a 60 sin despeinarse.

**`SIN SERVIDOR` en el pie**
El Pi no llega al broker. Mira la consola: ahi sale el motivo real.

- `no se encuentra la CA del broker` — falta `iot/certs/ca.crt`. Se copia desde
  `infra/mosquitto/certs/ca.crt`, ver [`../README.md`](../README.md).
- `conexion rechazada: 5` (o `Not authorized`) — usuario o contrasena del `.env`
  que no coinciden con los del broker.
- Error de certificado — el nombre del certificado del broker tiene que
  coincidir con `MQTT_HOST`. Si llegas por IP, esa IP va como SAN al reemitirlo
  (`MQTT_EXTRA_SANS`); no se desactiva la validacion.
- Se conecta pero no aparece nada en la base — revisa que `device_id` exista
  como `dispositivo.codigo`: el backend descarta lo que no puede atribuir a un
  dispositivo, y lo deja escrito en su log.

Mientras tanto no se pierde nada: las lecturas se acumulan en la cola local y
salen al reconectar. El contador `cola N` del pie dice cuantas hay.

---

## Como esta organizado

```
config.py           toda la configuracion, en un solo lugar
main.py             arma todo y corre el bucle principal
state.py            la foto del estado que comparten UI, alarmas y red
alarms.py           limites, antirrebote, prioridades y silencio

sensors/
  max30102.py       driver I2C del pulsioximetro
  ecg_ads1115.py    driver del ADS1115 + deteccion de electrodo suelto
  simulator.py      seniales sinteticas para el modo demo
  acquisition.py    hilos que leen los sensores a ritmo constante

processing/
  filters.py        biquads (pasa-altos, pasa-bajos, notch) y buffers
  ecg.py            deteccion de onda R y frecuencia cardiaca
  ppg.py            SpO2, pulso, perfusion y respiracion

iot_env.py          puente a iot/src/config.py: broker, credenciales y CA

net/
  publisher.py      publicacion MQTT, cola local y reintentos

ui/
  monitor.py        pantalla: barrido de ondas, panel numerico, alarmas
  theme.py          colores, tipografias, grilla
  sound.py          bip de latido y tonos de alarma

tools/
  receptor_prueba.py  receptor del contrato HTTP viejo; ya no se usa
```

El bucle principal es de un solo hilo: los sensores producen en hilos aparte y
la red consume en otro, pero **todo el procesamiento y el dibujado pasan por el
mismo hilo**. Por eso no hay locks en los filtros ni en los detectores. Lo unico
compartido entre el bucle y el hilo de red es la cola en SQLite, y esa si tiene
su lock.
