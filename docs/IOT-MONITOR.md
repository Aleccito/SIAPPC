# Monitor de la Raspberry Pi

Qué es `iot/monitor/`, cómo encaja con el resto de SIAPPC y qué decisiones hay
detrás. Para instalarlo y operarlo, el manual es
[`iot/monitor/README.md`](../iot/monitor/README.md); esto explica el porqué.

---

## Dónde está en la cadena

```
Raspberry Pi                Mosquitto              Backend              MariaDB
iot/monitor/  ──MQTT/TLS──▶ infra/mosquitto ──▶ services/mqttIngest ──▶ lectura
                 :8883                                  │                 alerta
                                                        └──▶ notificacion ──▶ SSE
```

De `lectura` y `alerta` salen la Central de Monitoreo, la Ronda, la bandeja de
notificaciones y el ETL de reportes. Todo lo que ven esas pantallas nace aquí:
si la Pi no publica, no hay nada que mostrar y no se abre ninguna alerta.

---

## El contrato con el backend

Es lo que **no se puede cambiar de un lado sin cambiarlo del otro**. Verificado
leyendo `backend/src/services/mqttIngest.ts` y `iot/monitor/net/publisher.py`.

**Temas** (`iot/monitor/iot_env.py`):

| Tema | Qué lleva |
|---|---|
| `siappc/<device>/telemetry` | una lectura |
| `siappc/<device>/status` | `online` / `offline`, retenido |

`<device>` es el `dispositivo.codigo` de la base, no la cama: la cama es una
etiqueta que cuelga del paciente ingresado y puede cambiar.

**Payload de telemetría** — exactamente los siete campos que valida
`telemetrySchema`, ni uno más:

```json
{ "device": "…", "variable": "…", "value": 0, "unit": "…", "ts": 0, "hash": "…" }
```

`hash` son 64 caracteres. Es lo que permite que QoS 1 reentregue sin duplicar
filas: el backend descarta el repetido.

**Transporte**: TLS en el 8883 con `cert_reqs=CERT_REQUIRED`, QoS 1, y un Last
Will retenido en el tema de estado para que la desaparición del equipo se note
sin esperar un tiempo de espera. **No hay modo sin cifrar**: el broker solo
escucha en 8883.

**Variables**: `hr`, `spo2`, `pr`, `perfusion`, `resp`.

Por MQTT **no hace falta darlas de alta a mano**: `ingestReading` crea la
variable la primera vez que llega, con la unidad que reporta el equipo, y crea
también el `sensor` que une dispositivo y variable. Si la variable ya existe con
otra unidad, manda el catálogo: la lectura se guarda igual —el valor no se tira
por una etiqueta— y queda un aviso en el log.

Lo que **sí** tiene que estar dado de alta antes es el **dispositivo**. Sin una
fila en `dispositivo` con ese `codigo` no hay hospital al que colgar la lectura,
y se descarta con un `warn` en el log del backend. Es el fallo silencioso más
probable al conectar una Pi nueva: todo parece funcionar en la Pi y en el broker,
y en la base no aparece nada.

(El rechazo de variables fuera del catálogo que cubre
`Pruebas/backend/variable.test.ts` es del alta de sensores por la API REST, no
de esta ruta.)

No hay presión arterial ni temperatura corporal, y no es un hueco pendiente:
`lectura.valor` es un escalar y una PA es un par sistólica/diastólica. La única
temperatura del equipo es la del encapsulado del MAX30102, que no es la del
paciente. La onda de ECG tampoco entra: son ~250 muestras por segundo y el
modelo guarda una fila por lectura, que es también la razón por la que el
backend no evalúa alertas sobre `ecg`.

---

## Qué trae esta versión

- **`session.py`** — medición a demanda: ventana de 10 s con 3 s de
  estabilización previa, disparada por tecla. Ver la decisión de abajo.
- **`sensors/buzzer.py`** — buzzer pasivo por PWM.
- **`tools/diagnostico.py`** — diagnóstico de I2C y GPIO, separado de los signos
  vitales del paciente.
- **`net/buffer.py`** — cola SQLite propia. Antes cargaba la de `iot/src/` por
  ruta, que se rompía al mover carpetas.
- **`iot_env.py` bimodal** — funciona dentro de SIAPPC (toma la configuración
  compartida de `iot/src/config.py`) y también con el repo del monitor suelto
  (lee `MQTT_HOST`, `MQTT_PORT`, `MQTT_USER`, `MQTT_CA_FILE` del entorno). Antes
  moría al arrancar fuera del repo.
- **SpO2 fuera de rango ya no se recorta.** Es el cambio con más peso clínico:
  antes, un cálculo fuera de 70–100 % se fijaba en 70, y 70 % es una saturación
  crítica creíble. Ahora devuelve "sin dato" con su alarma. Un hueco dice que
  falta la medición; un 70 inventado manda a tratar una hipoxemia que no existe.
- **El publicador degrada en vez de morir**: sin CA, sin `paho` o sin
  credenciales avisa y sigue mostrando la pantalla. La pantalla a pie de cama no
  puede depender de que el broker esté bien configurado.
- **`swap_leds`** para clones del MAX30102 con rojo e IR invertidos, y pines
  nuevos (`int_pin`, `sdn_pin`; `lo_plus_pin` pasa de 17 a 22).

**Se pierde** respecto de la versión anterior: el flag `--device`, el campo
`sensor_die_temp_c` del snapshot, y `--mqtt HOST:PUERTO` se parte en `--broker`
y `--puerto-broker`.

---

## Decisiones

### 1. El modo por defecto es continuo

La versión nueva venía con `session.manual = True`: los sensores arrancan
apagados y cada medición la dispara una tecla. **Se cambió a continuo**
(`iot/monitor/config.py`).

No es preferencia, es para qué sirve el equipo. Esto se instala a pie de cama en
una UCI. Con medición a demanda, la Pi **no publica nada mientras nadie apriete
una tecla**: un paciente desatendido —que es justo el caso para el que existe el
sistema— no genera ni una lectura ni una alerta. La pantalla del monitor se
vería perfecta y detrás no habría nada: ni Central, ni Ronda, ni notificaciones.

El modo a demanda **no se quitó**, porque tiene un uso real: una toma puntual a
alguien que no está monitorizado. Se pide con `--a-demanda` o con
`session.manual: true` en el JSON de configuración.

`--continuo` se mantiene aunque ahora sea redundante: estaba documentado y puede
estar puesto en un `monitor.service` ya desplegado, y romperlo no aporta nada.

### 2. El backend no se tocó

La integración no exigió ningún cambio en `mqttIngest.ts` ni en el broker: los
temas, el payload, el hash, QoS, TLS y el Last Will ya coincidían. La regla que
se siguió fue adaptar el IoT a la infraestructura, no al revés.

### 3. Correcciones aplicadas al integrar

| Qué estaba mal | Por qué importaba |
|---|---|
| `monitor.service` con `MONITOR_BACKEND_URL` a un `http://…:8000` | Ese endpoint HTTP no existe y la variable no se lee: se ignoraba en silencio |
| `monitor.service` y `.desktop` apuntando a `/home/pi/monitor_vital` | El layout dentro de SIAPPC es `/home/pi/siappc/iot/monitor` |
| `config.save()` dejó de quitar `buffer_path` | Un `config.json` generado en Windows se llevaba una ruta `C:\…` a la Pi |
| README y `diagnostico.py` con rutas del repo suelto | Mandaban a carpetas que dentro de SIAPPC no existen |

---

## Para desplegar

1. Copiar `iot/` completa a la Pi (`/home/pi/siappc/iot`). No solo `monitor/`:
   `iot_env.py` toma la configuración compartida de `iot/src/config.py`.
2. Copiar `infra/mosquitto/certs/ca.crt` a `iot/certs/ca.crt`, o apuntar
   `MQTT_CA_FILE` a donde esté. Sin CA el publicador se apaga y solo queda la
   pantalla.
3. Poner `MQTT_USER` y `MQTT_PASSWORD` con los mismos valores del `.env` de la
   raíz, que es de donde `infra/mosquitto/start.sh` genera el archivo de
   contraseñas del broker.
4. Dar de alta el `dispositivo.codigo` en la base, con el mismo valor que
   `DEVICE_CODE`. Sin eso las lecturas se descartan en silencio. Las variables y
   los sensores se crean solos al llegar la primera lectura.
5. Si la Pi alcanza el broker por la IP de la red —y no por `localhost`—, el
   certificado del broker tiene que llevar esa IP como SAN:

   ```sh
   MQTT_EXTRA_SANS="IP:192.168.x.y" sh infra/mosquitto/gen-certs.sh
   ```

   Sin ese SAN la Pi rechaza el certificado, que es lo que debe hacer. Al
   regenerarlo cambia también `ca.crt`, así que hay que volver a copiarlo.
6. **`paho-mqtt` sube a `>=2.0`.** El código ya usaba `CallbackAPIVersion.VERSION2`,
   así que es lo correcto, pero obliga a reinstalar dependencias en la Pi.

---

## Qué no está verificado

- **Nada del hardware.** MAX30102, AD8232, buzzer y los pines nuevos no se
  pueden probar sin la Pi conectada. Lo comprobado es que el Python compila
  (`python -m compileall`) y que el contrato MQTT coincide con el backend leyendo
  los dos lados.
- **El código externo no se ejecutó** en ningún momento durante la integración.
- `iot/monitor/salida.png` quedó huérfano: ningún documento lo referencia. Se
  dejó por si es material de un informe.
