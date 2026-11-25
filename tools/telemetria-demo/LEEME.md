# Publicador de demo (SIMULADO)

> Copia del publicador de `prototipo/tools/telemetria-demo`, traída a la app principal para que el
> sistema genere telemetría de demo por sí mismo, sin depender del prototipo. Simula los mismos
> equipos del seed y usa el mismo contrato del backend. No modifica nada de `prototipo/`.

Hace de los 15 monitores a pie de cama del seed de demo (`DEMO-DEV-01` a `DEMO-DEV-15`) mientras no haya
equipos de verdad. Así los signos vitales, las alertas y la onda del ECG cambian solos.

Publica por MQTT, igual que la Raspberry (`iot/monitor/net/publisher.py`): por TLS, con el usuario del `.env`
de la raíz y con el mismo formato que valida `backend/src/services/mqttIngest.ts`.

| Tema | Qué manda | Cada cuánto |
| --- | --- | --- |
| `siappc/<equipo>/status` | `online` al arrancar y `offline` al salir (retenido) | — |
| `siappc/<equipo>/telemetry` | `hr`, `spo2`, `resp` y `temp`, una lectura de cada uno | `PERIODO_S` (30 s) |
| `siappc/<equipo>/waveform` | la onda del ECG (`ecg`), un segundo de muestras | 1 s |

- **Los valores** salen de `casos.json`: cada signo oscila despacio alrededor del valor de su caso, con un poco
  de ruido de medición. En los pacientes críticos el centro queda cerca del umbral del backend, así que lo cruzan
  en episodios cortos y no en cada lectura.
- **Las alertas** las crea el backend, no el publicador. Hoy el backend crea una alerta, y una notificación para
  cada usuario a cargo, por cada lectura fuera de rango; no agrupa ni enfría. Por eso conviene no bajar mucho `PERIODO_S`.
- **La temperatura** se guarda como `temp` (está en el catálogo `variable` y no tiene umbral).
- **La presión arterial no se manda**: `lectura.valor` es un número y la PA es un par. Tampoco los paneles del
  monitoreo detallado: no son telemetría.
- **La onda** no se guarda en la base: el backend la reparte en vivo por `GET /monitoring/:device/waveform`.

## Correrlo

Desde la raíz del repositorio, con el Compose levantado (la red es `siappc_default`):

```bash
docker build -t siappc-telemetria-demo tools/telemetria-demo
docker run -d --name siappc-telemetria-demo --restart unless-stopped \
  --network siappc_default --env-file .env \
  -v "$PWD/infra/mosquitto/certs/ca.crt:/certs/ca.crt:ro" \
  siappc-telemetria-demo
docker logs -f siappc-telemetria-demo
```

Solo lee `MQTT_USER` y `MQTT_PASSWORD` del `.env` y no los imprime. Para pararlo (marca los equipos `offline`):

```bash
docker stop siappc-telemetria-demo && docker rm siappc-telemetria-demo
```

Para probar sin dejarlo corriendo, una sola ronda: `docker run --rm ... siappc-telemetria-demo node publicador.mjs --una-vez`.

Para mostrar una alerta crítica en vivo sin esperar a que un caso cruce su umbral, una sola lectura de FC 150 lpm
del equipo que digas (aparecen el aviso, la campana y la alerta sin recargar):

```bash
docker run --rm --network siappc_default --env-file .env \
  -v "$PWD/infra/mosquitto/certs/ca.crt:/certs/ca.crt:ro" \
  siappc-telemetria-demo node publicador.mjs --alerta DEMO-DEV-06
```

### Historia para las tendencias

Recién levantado, el monitor no tiene lecturas viejas y las tendencias de 24 h muestran un solo punto. `--historia`
manda las lecturas de ese tiempo hacia atrás, con su fecha pasada, cada `PASO_HISTORIA_MIN` minutos (5). Se carga
**una sola vez**, junto con `--una-vez`, para que el servicio normal no la repita en cada reinicio:

```bash
docker run --rm --network siappc_default --env-file .env \
  -v "$PWD/infra/mosquitto/certs/ca.crt:/certs/ca.crt:ro" \
  siappc-telemetria-demo node publicador.mjs --historia 24h --una-vez
```

- Acepta horas o minutos: `24h`, `6h`, `90m`. Con 15 equipos y 24 h son unas 17.000 lecturas y tarda un par de minutos.
- El backend las guarda como atrasadas (más de 60 s): no manda avisos en vivo por ellas.
- **Quedan dentro de los umbrales a propósito.** El backend fecha cada alerta cuando la guarda y no con la hora de la
  lectura: una lectura fuera de rango de hace 20 h aparecería como una alerta de ahora. Por eso la historia de los
  críticos se ve más tranquila que su presente.
- Correrla dos veces duplica la historia (con otras horas): no hace falta repetirla mientras la base no se borre.

No es un servicio del Compose a propósito: es una herramienta de demo que se corre aparte con `docker run`.

## Opciones

| Variable | Por defecto | Qué hace |
| --- | --- | --- |
| `PERIODO_S` | `30` | Segundos entre lecturas de cada signo (mínimo 5). |
| `ONDA` | `1` | `0` para no mandar la onda del ECG. |
| `ONDA_HZ` | `125` | Muestras por segundo de la onda (10 a 250). |
| `EQUIPOS` | todos | Lista separada por comas, por ejemplo `DEMO-DEV-01,DEMO-DEV-06`. |
| `PASO_HISTORIA_MIN` | `5` | Minutos entre lecturas de la historia de `--historia`. |
| `MQTT_HOST`, `MQTT_PORT`, `MQTT_CA_FILE` | `mosquitto`, `8883`, `/certs/ca.crt` | Dónde está el broker. |

Se pasan con `-e`, por ejemplo `-e PERIODO_S=60`.
