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

### 3. Arrancar

```bash
docker compose up -d --build
```

Eso es todo. Compose levanta MariaDB, el backend y el frontend, en ese orden.

| Servicio | URL | Notas |
|---|---|---|
| Frontend | http://localhost:8080 | Build estático servido por nginx |
| Backend | http://localhost:3001 | API Fastify (`/health` responde `{"status":"ok"}`) |
| MariaDB | localhost:3306 | Solo para conectarse con un cliente de base de datos |

Los puertos publicados salen del `.env` (`FRONTEND_PORT`, `BACKEND_PORT`,
`DB_PORT`). Dentro de la red de Compose la base siempre escucha en 3306, así que
cambiar `DB_PORT` no afecta al backend.

El navegador nunca llama al backend en otro origen: nginx sirve el frontend y
hace proxy de `/api/` hacia `backend:3001`, así que no hay CORS que configurar.

La primera vez MariaDB aplica `backend/db/schema.sql` y después
`backend/db/seed.sql`, y tarda unos 30 segundos en quedar sana. El backend
espera a que el healthcheck pase antes de arrancar, así que ver el frontend
antes que el backend es normal.

### 4. Entrar

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

## Comandos

| Comando | Qué hace |
|---|---|
| `docker compose up -d --build` | Levanta todo, reconstruyendo imágenes |
| `docker compose down` | Apaga todo, conserva los datos |
| `docker compose down -v` | Apaga todo y borra el volumen de la base |
| `docker compose logs -f backend` | Sigue los logs del backend |
| `docker compose ps` | Estado de los tres servicios |

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

**Falta `JWT_SECRET`.** El backend arranca y se apaga de inmediato con
`Falta JWT_SECRET en el entorno (.env)`. Revísalo con
`docker compose logs backend`.

**El `.env` de la raíz no es el mismo que `backend/.env`.** Compose sustituye los
`${VAR}` del `docker-compose.yml` leyendo el `.env` que está junto a ese archivo,
o sea el de la raíz. Nunca mira dentro de `backend/`. Además `backend/.env` está
en `backend/.dockerignore`, así que tampoco entra en la imagen.

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
aparte que publica por MQTT hacia el backend. Su `.env` también se pide a
Ing.Adrian. Ver [iot/README.md](iot/README.md).

El backend se suscribe al broker que indiquen `MQTT_HOST`/`MQTT_PORT` en el
`.env` de la raíz. Si no hay broker arriba, el backend sigue respondiendo
normal — solo reintenta la conexión en segundo plano y el tablero de sensores se
queda vacío.
