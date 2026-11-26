# Publicador de demo (SIMULADO)

Hace de los monitores a pie de cama de demo (`DEMO-*`) **que están asignados a un paciente**, mientras no haya
equipos de verdad. Así, en el prototipo, los signos vitales, las alertas y la onda del ECG cambian solos, también los
de un paciente recién admitido desde la app principal.

> **En el servidor corre uno solo: este.** `tools/telemetria-demo/` de la raíz (PR #64) es una copia anterior que
> publica siempre los mismos equipos; si corren los dos, las lecturas y las alertas salen duplicadas.

Publica por MQTT, igual que la Raspberry (`iot/monitor/net/publisher.py`): por TLS, con el usuario del `.env` de la
raíz y con el mismo formato que valida `backend/src/services/mqttIngest.ts`.

| Tema | Qué hace | Cuándo |
| --- | --- | --- |
| `siappc/<equipo>/asignacion` | **Lo escucha**: el backend avisa si el equipo tiene paciente, con el motivo y los diagnósticos (sin nombre ni cédula) | Retenido: al arrancar recibe el de todos; después, cada cambio y una sincronía cada 2 min |
| `siappc/<equipo>/status` | `online` al empezar a simularlo y `offline` al liberarlo o al salir (retenido) | — |
| `siappc/<equipo>/telemetry` | `hr`, `spo2`, `resp` y `temp`, una lectura de cada uno | `PERIODO_S` (30 s) |
| `siappc/<equipo>/waveform` | la onda del ECG (`ecg`), un segundo de muestras | 1 s |

- **Qué equipos:** los `DEMO-*` asignados (`backend/src/services/mqttAsignacion.ts`). Un equipo real asignado (como
  una Raspberry) nunca se simula. Al asignar un monitor en la app principal empieza a publicarlo en segundos; al
  liberarlo o dar el egreso, manda `offline` y deja de publicar. **No hace falta reiniciarlo.**
- **Los valores:**
  - DEMO-DEV-01 a 15: su caso de `casos.json`.
  - Los demás (DEMO-DEV-16 a 20, los monitores libres que carga `tools/base/base.sh cargar`): un perfil de
    `perfiles.json` según los **diagnósticos activos** o, mientras el médico no registre uno, el **motivo de consulta**.
    Si el médico registra un diagnóstico, el perfil cambia con el siguiente aviso del backend (2 min como mucho).
  - Cada signo oscila despacio alrededor del valor de su perfil, con un poco de ruido de medición. En los críticos el
    centro queda cerca del umbral del backend, así que lo cruzan en episodios cortos y no en cada lectura.
- **Las alertas** las crea el backend, no el publicador. Hoy el backend crea una alerta, y una notificación para
  cada usuario a cargo, por cada lectura fuera de rango; no agrupa ni enfría. Por eso conviene no bajar mucho
  `PERIODO_S` (pedido 28 de prototipo/docs/CONEXION-BACKEND.md).
- **La temperatura** se guarda como `temp` (está en el catálogo `variable` y no tiene umbral). El prototipo la
  muestra en lugar de la simulada cuando hay una lectura de los últimos 10 minutos.
- **La presión arterial no se manda**: `lectura.valor` es un número y la PA es un par (pedido 10). Tampoco los
  paneles del monitoreo detallado: no son telemetría. Esos siguen simulados en el navegador (`src/api/simulacion.ts`).
- **La onda** no se guarda en la base: el backend la reparte en vivo por `GET /monitoring/:device/waveform`.
- **Cada 2 minutos** escribe en su registro qué está simulando y con qué perfil (`docker logs`).

## Correrlo

Desde la raíz del repositorio, con el Compose levantado (la red es `siappc_default`). **Solo recibe `MQTT_USER` y
`MQTT_PASSWORD`**: no se le pasa el `.env` entero (antes recibía también las contraseñas de la base y de Redis y el
secreto de los tokens, que no usa).

```bash
docker build -t siappc-telemetria-demo prototipo/tools/telemetria-demo
docker run -d --name siappc-telemetria-demo --restart unless-stopped --network siappc_default --env-file <(grep -E '^MQTT_(USER|PASSWORD)=' .env) -e PERIODO_S=60 -v "$PWD/infra/mosquitto/certs/ca.crt:/certs/ca.crt:ro" siappc-telemetria-demo
docker logs -f siappc-telemetria-demo
```

En Windows (Git Bash), donde `<(...)` no le llega a Docker, se pasan con `-e` desde el entorno del propio comando:

```bash
( set -a; eval "$(grep -E '^MQTT_(USER|PASSWORD)=' .env | tr -d '\r')"; set +a; docker run -d --name siappc-telemetria-demo --restart unless-stopped --network siappc_default -e MQTT_USER -e MQTT_PASSWORD -e PERIODO_S=60 -v "$PWD/infra/mosquitto/certs/ca.crt:/certs/ca.crt:ro" siappc-telemetria-demo )
```

No imprime las contraseñas. En el servidor corre con `-e PERIODO_S=60` (una lectura por minuto). Para pararlo (marca
los equipos `offline`):

```bash
docker stop siappc-telemetria-demo && docker rm siappc-telemetria-demo
```

Para probar sin dejarlo corriendo, una sola ronda de los asignados: el mismo `docker run --rm …` con
`node publicador.mjs --una-vez`.

Para mostrar una alerta crítica en vivo sin esperar a que un caso cruce su umbral, una sola lectura de FC 150 lpm del
equipo que digas (en el prototipo aparecen el aviso, la campana y la alerta sin recargar):

```bash
docker run --rm --network siappc_default --env-file <(grep -E '^MQTT_(USER|PASSWORD)=' .env) -v "$PWD/infra/mosquitto/certs/ca.crt:/certs/ca.crt:ro" siappc-telemetria-demo node publicador.mjs --alerta DEMO-DEV-06
```

### Historia para las tendencias

Recién levantado, el monitor no tiene lecturas viejas y las tendencias de 24 h muestran un solo punto. `--historia`
manda las lecturas de ese tiempo hacia atrás, con su fecha pasada, cada `PASO_HISTORIA_MIN` minutos (5), de los equipos
**asignados de `casos.json`**. Se carga **una sola vez**, junto con `--una-vez`, para que el servicio normal no la
repita en cada reinicio:

```bash
docker run --rm --network siappc_default --env-file <(grep -E '^MQTT_(USER|PASSWORD)=' .env) -v "$PWD/infra/mosquitto/certs/ca.crt:/certs/ca.crt:ro" siappc-telemetria-demo node publicador.mjs --historia 24h --una-vez
```

- Acepta horas o minutos: `24h`, `6h`, `90m`. Con 15 equipos y 24 h son unas 17.000 lecturas y tarda un par de
  minutos.
- El backend las guarda como atrasadas (más de 60 s): no manda avisos en vivo por ellas.
- **Quedan dentro de los umbrales a propósito.** El backend fecha cada alerta cuando la guarda y no con la hora de la
  lectura (pedido 34 de prototipo/docs/CONEXION-BACKEND.md): una lectura fuera de rango de hace 20 h aparecería como una alerta de
  ahora. Por eso la historia de los críticos se ve más tranquila que su presente.
- Correrla dos veces duplica la historia (con otras horas): no hace falta repetirla mientras la base no se borre.
- En el servidor escribe en la base que también usa la app principal: avisar antes.

No es un servicio del Compose a propósito: el Compose no es parte del prototipo (pedido 32 de prototipo/docs/CONEXION-BACKEND.md).

## Opciones

| Variable | Por defecto | Qué hace |
| --- | --- | --- |
| `PERIODO_S` | `30` | Segundos entre lecturas de cada signo (mínimo 5). |
| `ONDA` | `1` | `0` para no mandar la onda del ECG. |
| `ONDA_HZ` | `125` | Muestras por segundo de la onda (10 a 250). |
| `EQUIPOS` | todos los asignados | Lista separada por comas para simular solo algunos, por ejemplo `DEMO-DEV-01,DEMO-DEV-16`. |
| `PREFIJO` | `DEMO-` | Solo se simulan los equipos con este prefijo. |
| `PASO_HISTORIA_MIN` | `5` | Minutos entre lecturas de la historia de `--historia`. |
| `MQTT_HOST`, `MQTT_PORT`, `MQTT_CA_FILE` | `mosquitto`, `8883`, `/certs/ca.crt` | Dónde está el broker. |

Se pasan con `-e`, por ejemplo `-e PERIODO_S=60`.

## Perfiles (`perfiles.json`)

Un perfil por tipo de caso (TEP, sepsis, respiratorio, arritmia, cardíaco, coronario, trauma, abdominal, metabólico,
neurológico, obstétrico y general), con las palabras que lo eligen y el centro y la amplitud de cada signo, como en
`casos.json`. Se elige el primero cuyas palabras aparezcan en un diagnóstico activo (texto o código CIE-10); si
ninguno, en el motivo de consulta; si tampoco, `general`.
