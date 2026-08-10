# SIAPPC

Sistema integral de simulación hospitalaria para pacientes politraumatizados:
simulación de eventos discretos, monitoreo IoT en tiempo real y tablero web con
alertas automáticas.

## Levantar el proyecto

Docker es la **única** forma soportada de correr SIAPPC. No hace falta instalar
Node, npm ni MariaDB en la máquina: todo vive en contenedores.

### 1. Requisitos

Docker Desktop (o Docker Engine) con Compose v2. Nada más.

```bash
docker compose version
```

### 2. Pedir el `.env` a Ing.Adrian

**El archivo `.env` de la raíz no está en el repositorio y no se puede
reconstruir a partir de él.** Pídeselo a **Ing.Adrian** (dueño del proyecto) y
colócalo en la raíz del repo, junto a `docker-compose.yml`.

En el repo solo vive [`.env.example`](.env.example): documenta **qué** variables
existen, con valores de relleno. Sirve como referencia, no para arrancar — los
valores reales (usuario y contraseña de la base, `JWT_SECRET`, credenciales del
broker MQTT) los entrega Ing.Adrian.

`.env` está en `.gitignore` y ahí se queda: nunca se commitea, y nunca se pegan
sus valores en este README, en un issue ni en el chat del equipo.

### 3. Generar los certificados del broker

El broker MQTT solo acepta conexiones por TLS, así que necesita un certificado
antes de arrancar. Como no hay una CA de verdad, el repo trae un script que crea
una CA de desarrollo y con ella firma el certificado del broker:

```bash
sh infra/mosquitto/gen-certs.sh
```

En Windows, desde **Git Bash** (hace falta `openssl`, que Git Bash ya trae).

Todo queda en `infra/mosquitto/certs/`, que está en `.gitignore`: son
certificados de desarrollo, se regeneran cuando haga falta y **ninguna clave
privada se commitea**. Basta con correrlo una vez; si borras la carpeta o el
certificado caduca, vuelve a correrlo y reinicia el broker.

Si la Raspberry va a alcanzar el broker por la IP de la red, esa IP tiene que ir
dentro del certificado o la Pi lo rechazará:

```bash
MQTT_EXTRA_SANS="IP:192.168.1.50" sh infra/mosquitto/gen-certs.sh
```

En producción esto no aplica: ahí va un certificado de una CA real y la clave
privada no sale de la máquina del broker.

### 4. Arrancar

```bash
docker compose up -d --build
```

Eso es todo. Compose levanta MariaDB, Redis, el broker MQTT, el backend y el
frontend.

| Servicio | URL | Notas |
|---|---|---|
| Frontend | http://localhost:8080 | Build estático servido por nginx |
| Backend | http://localhost:3001 | API Fastify (`/health` responde `{"status":"ok"}`) |
| MariaDB | localhost:3306 | Solo para conectarse con un cliente de base de datos |
| Mosquitto | mqtts://localhost:8883 | Broker MQTT, **solo TLS y con usuario** |
| Redis | — | Sin puerto en el host: solo la red de Compose. Con contraseña |

Los puertos publicados salen del `.env` (`FRONTEND_PORT`, `BACKEND_PORT`,
`DB_PORT`). Dentro de la red de Compose la base siempre escucha en 3306, así que
cambiar `DB_PORT` no afecta al backend.

El navegador nunca llama al backend en otro origen: nginx sirve el frontend y
hace proxy de `/api/` hacia `backend:3001`, así que no hay CORS que configurar.

La primera vez MariaDB aplica `backend/db/schema.sql` y después
`backend/db/seed.sql`, y tarda unos 30 segundos en quedar sana. Cada servicio
espera a que el anterior responda, no solo a que su contenedor exista: el
backend arranca cuando MariaDB pasa su healthcheck, y el frontend cuando el
backend contesta `/health`. Por eso el primer `up` tarda: si el tablero ya
carga, la API detrás ya está viva.

El broker no tiene puerto en texto plano: no existe el 1883, ni siquiera dentro
de la red de Compose. Tampoco acepta clientes anónimos — crea su usuario al
arrancar con el `MQTT_USER`/`MQTT_PASSWORD` del `.env`, así que backend, broker y
Pi leen las credenciales de un solo sitio y no pueden desincronizarse.

Redis guarda dos cosas, ninguna de ellas dato del hospital: los contadores del
límite de peticiones (`siappc-rl:`) y la caché de `/sensors/*` (`siappc-cache:`).
Por eso arranca sin persistencia (`--save "" --appendonly no`) y con techo de
memoria y desalojo LRU: todo lo que guarda es reconstruible, y un dump en disco
solo sumaría una copia de datos que ya viven en MariaDB. No publica puerto al
host, pero exige contraseña igual — un contenedor comprometido dentro de la red
de Compose no debe poder vaciar los contadores del rate limit.

### 5. Entrar

El seed crea el hospital, las unidades, los cuatro roles (`medico`, `enfermero`,
`administrativo`, `admin`) y una cuenta para entrar:

| Correo | Contraseña |
|---|---|
| `admin@institucion.org` | `Admin12345` |

Es la única forma de entrar la primera vez: crear usuarios por la API exige un
admin ya autenticado. **Esa contraseña está en `backend/db/seed.sql`, o sea en el
repositorio**, así que sirve solo para desarrollo local. Cámbiala antes de
exponer el sistema a cualquier red.

El seed corre una sola vez, cuando el volumen está vacío. Para volver a
aplicarlo hay que borrar el volumen con `docker compose down -v`.

## Stack y versiones

Lo que realmente corre, tomado de `docker-compose.yml`, los `Dockerfile` y los
`package.json`. Si algún documento del proyecto dice otra cosa, esta tabla gana.

| Pieza | Versión | Dónde se fija |
|---|---|---|
| MariaDB | 11.4 | `docker-compose.yml` |
| Mosquitto | 2 (2.1.x) | `docker-compose.yml` |
| Redis | 7 (alpine) | `docker-compose.yml` |
| Node | 24 (alpine) | `backend/Dockerfile`, `frontend/Dockerfile` |
| nginx | 1.29 (alpine) | `frontend/Dockerfile` |
| Fastify | 5 | `backend/package.json` |
| mysql2 · Zod · bcryptjs · mqtt · ioredis | 3 · 3 · 2 · 5 · 6 | `backend/package.json` |
| TypeScript | 6 | ambos `package.json` |
| React · React Router | 19 · 7 | `frontend/package.json` |
| Vite · MUI · TanStack Query | 8 · 9 · 5 | `frontend/package.json` |
| Python (Raspberry) | 3, con `paho-mqtt` | `iot/requirements.txt` |

El backend no tiene paso de build: Node corre los `.ts` directamente por type
stripping, y por eso `typescript` solo aparece como dependencia de desarrollo.

## Cambios de esquema

`backend/db/schema.sql` es el esquema completo y **solo corre en el primer
arranque**, cuando el volumen está vacío. Sobre una base que ya tiene tablas
falla a propósito, así que para cambiar el esquema de una base con datos:

```bash
docker compose exec backend node db/migrate.ts
```

Eso aplica los archivos de `backend/db/migrations/` que falten y los anota en la
tabla `migracion`. Correrlo dos veces no hace nada la segunda. Los detalles y la
regla para agregar una migración están en
[backend/README.md](backend/README.md).

## Comandos

| Comando | Qué hace |
|---|---|
| `docker compose up -d --build` | Levanta todo, reconstruyendo imágenes |
| `docker compose down` | Apaga todo, conserva los datos |
| `docker compose down -v` | Apaga todo y borra el volumen de la base |
| `docker compose logs -f backend` | Sigue los logs del backend |
| `docker compose logs -f mosquitto` | Sigue los logs del broker MQTT |
| `docker compose exec backend node db/migrate.ts` | Aplica migraciones pendientes de esquema |
| `docker compose ps` | Estado de los cinco servicios |
| `sh infra/mosquitto/gen-certs.sh` | Regenera los certificados de desarrollo del broker |

Después de cambiar código hay que reconstruir: `docker compose up -d --build`.
Las imágenes son multi-stage y solo conservan lo necesario — el frontend termina
en nginx con el `dist` (sin `node_modules`), el backend en Node con dependencias
de producción y las fuentes.

## Errores comunes

**Falta el `.env` de la raíz.** Compose sustituye cadena vacía y avisa con
`variable is not set`. MariaDB se crea con usuario y contraseña en blanco, el
backend no logra conectarse y el login falla. Consigue el `.env` con Ing.Adrian,
borra el volumen y vuelve a empezar:

```bash
docker compose down -v
```

**Falta `JWT_SECRET` o `ALLOWED_ORIGINS`.** El backend arranca y se apaga de
inmediato diciendo cuál falta. Revísalo con `docker compose logs backend`.
`ALLOWED_ORIGINS` es la lista blanca de orígenes del navegador, separada por
coma; en Compose el tablero va por nginx en el mismo origen, así que solo
importa si sirves el frontend desde otro sitio o lo corres con Vite.

**Todo responde 429.** Es el límite de peticiones: 100 por minuto para la API en
general y 5 cada 15 minutos para `POST /auth/login`, contados por IP (y para el
login, por IP + correo intentado). Los bloqueos de login quedan en `auditoria`
con `accion='LOGIN_BLOCKED'`. El contador vive en Redis, así que **reiniciar el
backend ya no lo borra**. Si te bloqueaste a ti mismo probando, espera la
ventana o bórralo a mano:

```bash
docker compose exec redis redis-cli -a "$REDIS_PASSWORD" --no-auth-warning KEYS 'siappc-rl:*'
```

**El `.env` de la raíz no es el mismo que `backend/.env`.** Compose sustituye los
`${VAR}` del `docker-compose.yml` leyendo el `.env` que está junto a ese archivo,
o sea el de la raíz. Nunca mira dentro de `backend/`. Además `backend/.env` está
en `backend/.dockerignore`, así que tampoco entra en la imagen.

**El broker reinicia en bucle diciendo `illegal option -` o `: not found`.** No
son los certificados: es Windows. Con `core.autocrlf=true`, git convierte
`infra/mosquitto/start.sh` a CRLF al hacer checkout y el `sh` del contenedor lee
`set -eu\r`. El repositorio trae un `.gitattributes` que fija `eol=lf` para
`*.sh` y `*.conf`, pero un archivo ya convertido en tu copia de trabajo sigue
mal. Para reescribir solo ese archivo, sin tocar nada más:

```bash
git add --renormalize infra/mosquitto && rm infra/mosquitto/start.sh && git checkout infra/mosquitto/start.sh
```

(El `git rm --cached -r . && git reset --hard` que suele recomendarse hace lo
mismo para todo el repositorio, pero **descarta los cambios sin commitear**.)

**El broker reinicia en bucle.** Casi siempre faltan los certificados: sin
`infra/mosquitto/certs/` mosquitto no arranca, porque no tiene modo sin TLS.
`docker compose logs mosquitto` lo dice (`OpenSSL Error … BIO routines::no such
file`, seguido de `mosquitto … terminating`).
Corre `sh infra/mosquitto/gen-certs.sh` y `docker compose up -d mosquitto`. Si
lo que falta son `MQTT_USER`/`MQTT_PASSWORD` en el `.env`, Compose ni siquiera
llega a arrancar el servicio y avisa por nombre.

**El backend no se conecta al broker.** Mira `docker compose logs backend`:

- `unable to verify the first certificate` o `self-signed certificate in
  certificate chain` — el backend y el broker no están usando la misma CA.
  Regenera los certificados y reinicia **los dos** servicios.
- `Hostname/IP does not match certificate's altnames` — el certificado no
  cubre el nombre por el que se llama al broker. Se reemite con el SAN que
  falte (`MQTT_EXTRA_SANS`), nunca desactivando la validación.
- `Connection refused: not authorised` — las credenciales del backend y las del
  broker no coinciden; ambas salen del `.env` de la raíz, así que reinicia el
  broker después de cambiarlas.
- `Falta MQTT_CA_FILE` o `No se puede leer MQTT_CA_FILE=…` — el proceso se apaga
  al arrancar. Es configuración, no red: el backend no se conecta en claro como
  alternativa.

**Redis no arranca o el backend se queja de él.** Si Compose se detiene diciendo
`falta REDIS_PASSWORD`, agrégala al `.env` de la raíz. Si el backend registra
`redis: error de conexión`, sigue respondiendo —la caché va directo a MariaDB y
el límite de peticiones deja pasar todo (`skipOnError`)— pero **mientras tanto
no hay rate limit, ni siquiera en el login**: no es un estado en el que dejar el
sistema. Revisa `docker compose logs redis` y que `REDIS_PASSWORD` sea la misma
que la del `REDIS_URL` del backend; las dos salen del `.env` de la raíz.

**El puerto 3306 ya está ocupado.** Casi siempre es otro MariaDB corriendo:
`backend/docker-compose.yml` levanta uno propio y no es la ruta soportada. Apaga
ese contenedor o cambia `DB_PORT` en el `.env`.

**El frontend carga pero todo da error 401 o 500.** Revisa que el backend esté
sano: `docker compose logs -f backend`. Si la base se creó con credenciales
vacías de un arranque anterior, `docker compose down -v` y arrancar de nuevo con
el `.env` correcto.

## Estructura

| Carpeta | Qué es | Estado |
|---|---|---|
| `backend/` | API Fastify + esquema MariaDB — ver [backend/README.md](backend/README.md) | Funcionando |
| `frontend/` | Tablero web React + Vite — ver [frontend/README.md](frontend/README.md) | Funcionando, con módulos aún simulados |
| `iot/` | Firmware y scripts de los sensores — ver [iot/README.md](iot/README.md) | Funcionando, corre en la Raspberry, fuera de Compose |
| `infra/` | Configuración del broker MQTT y generación de certificados | Funcionando |
| `simulation/` | Modelos de FlexSim | Pendiente |

## Qué está funcionando

Con `docker compose up` quedan operativos, contra la base real:

- **Autenticación** — login con JWT, `/auth/me`, sesión en `sessionStorage`
- **Usuarios** — alta, edición, cambio de rol, actividad por usuario
- **Roles y permisos** — matriz de permisos por módulo, historial de cambios
- **Auditoría** — bitácora de acciones, filtrable por entidad
- **Pacientes** — la API existe (`GET/POST /patients`); la pantalla todavía usa
  datos de prueba en el navegador
- **Sensores y alertas** — lecturas y alertas que entran por MQTT desde la Pi

Siguen siendo maquetas sin servidor detrás: **Power BI**, **FlexSim**,
**Reportes**, **recuperación de contraseña** y la pantalla de **Pacientes**. El
detalle está en [frontend/README.md](frontend/README.md).

## IoT

La Raspberry Pi con los sensores **no** forma parte de Compose: es hardware
aparte que publica por MQTT hacia el broker. Su `.env` también se pide a
Ing.Adrian. Ver [iot/README.md](iot/README.md).

El broker sí es parte de Compose (servicio `mosquitto`), así que el backend lo
tiene siempre en `mosquitto:8883` por la red interna y eso no se configura. Lo
que sí hay que dar a la Pi son dos cosas: las credenciales del `.env` y una
copia de `infra/mosquitto/certs/ca.crt`, que es como comprueba que está hablando
con el broker de verdad y no con cualquiera que responda en ese puerto.
`MQTT_TLS_PORT` controla el puerto publicado al host, que es por donde entra la
Pi.

Si el broker está caído, el backend sigue respondiendo normal — solo reintenta
la conexión en segundo plano y el tablero de sensores se queda vacío. Lo que no
hace nunca es caer a texto plano.
