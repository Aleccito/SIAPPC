# SIAPPC
Sistema integral de simulación hospitalaria para pacientes politraumatizados: simulación de eventos discretos monitoreo IoT en tiempo real y tablero web con alertas automáticas.

## Levantar con Docker

Requiere Docker con Compose v2. Un solo comando levanta MariaDB, el backend y el
frontend.

```bash
cp .env.example .env
```

Llena `DB_USER`, `DB_PASSWORD`, `DB_ROOT_PASSWORD` y `JWT_SECRET`. El `.env` está
en `.gitignore` y ahí se queda: nunca se commitea.

```bash
openssl rand -hex 32
```

Usa esa salida como `JWT_SECRET`.

### En Windows

Los comandos de arriba son de shell POSIX. En `cmd` o PowerShell no existen `cp`
ni `openssl`, así que:

| En vez de | Usa en `cmd` | Usa en PowerShell |
|---|---|---|
| `cp .env.example .env` | `copy .env.example .env` | `Copy-Item .env.example .env` |

Para el `JWT_SECRET`, en PowerShell:

```powershell
$b=[byte[]]::new(32);[System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes($b);($b|ForEach-Object{'{0:x2}' -f $_}) -join ''
```

`RandomNumberGenerator::Fill` **no** sirve aquí: Windows PowerShell 5.1 corre
sobre .NET Framework y ese método solo existe en .NET Core. Tampoco envuelvas el
comando en `powershell -Command "..."` desde PowerShell: las comillas dobles
expanden `$b` y `$_` antes de que PowerShell los vea, y la línea llega rota.

```bash
docker compose up -d --build
```

| Servicio | URL | Notas |
|---|---|---|
| Frontend | http://localhost:8080 | Build estático servido por nginx |
| Backend | http://localhost:3001 | API Fastify |
| MariaDB | localhost:3306 | Solo para conectarse con un cliente |

La primera vez MariaDB aplica `backend/db/schema.sql` y después
`backend/db/seed.sql`, y tarda unos 30 segundos en quedar sano. El backend
espera a que el healthcheck pase antes de arrancar.

### Usuario inicial

El seed crea el hospital, los roles `admin` y `user`, y una cuenta para entrar:

| Correo | Contraseña |
|---|---|
| `admin@institucion.org` | `Admin12345` |

Es la única forma de entrar la primera vez: crear usuarios por la API exige un
admin ya autenticado. **Esa contraseña está en el repositorio**, así que sirve
solo para desarrollo. Cámbiala antes de exponer el sistema a cualquier red.

El seed corre una sola vez, cuando el volumen está vacío. Para volver a
aplicarlo hay que borrar el volumen con `docker compose down -v`.

Los puertos publicados salen del `.env`: `FRONTEND_PORT`, `BACKEND_PORT` y
`DB_PORT`. Dentro de la red de Compose la base siempre escucha en 3306, así que
cambiar `DB_PORT` no afecta al backend.

| Comando | Qué hace |
|---|---|
| `docker compose up -d --build` | Levanta todo, reconstruyendo imágenes |
| `docker compose down` | Apaga todo, conserva los datos |
| `docker compose down -v` | Apaga todo y borra el volumen de la base |
| `docker compose logs -f backend` | Sigue los logs del backend |
| `docker compose ps` | Estado de los tres servicios |

Las imágenes son multi-stage y solo conservan lo necesario: el frontend termina en
nginx con el `dist` (sin `node_modules`), el backend en Node con dependencias de
producción y las fuentes.

### Errores comunes

**El `.env` de la raíz no es el mismo que `backend/.env`.** Compose sustituye los
`${VAR}` del `docker-compose.yml` leyendo el `.env` que está junto a ese archivo,
o sea el de la raíz. Nunca mira dentro de `backend/`. Además `backend/.env` está
en `backend/.dockerignore`, así que tampoco entra en la imagen. `backend/.env`
sigue sirviendo solo para correr el backend en local con `npm run dev`.

**Falta `JWT_SECRET`.** El backend arranca y se apaga de inmediato con
`Falta JWT_SECRET en el entorno (.env)`. Revísalo con
`docker compose logs backend`.

**Variables vacías.** Si el `.env` de la raíz no existe, Compose sustituye cadena
vacía y avisa con `variable is not set`. MariaDB se crea con usuario y contraseña
en blanco y el backend no logra conectarse. Borra el volumen y vuelve a empezar:

```bash
docker compose down -v
```

**El puerto 3306 ya está ocupado.** Es `npm run db:up` corriendo en paralelo:
levanta su propio MariaDB con el Compose de `backend/`. Apaga uno de los dos.

### Desarrollo

Para trabajar en el frontend con recarga en caliente conviene levantar solo la
base y el backend en Docker, y correr Vite en local:

```bash
docker compose up -d mariadb backend
```

```bash
npm run dev --prefix frontend
```

## Estructura

| Carpeta | Qué es |
|---|---|
| `backend/` | API Fastify y esquema de MariaDB — ver [backend/README.md](backend/README.md) |
| `frontend/` | Tablero web en React + Vite |
| `iot/` | Firmware y scripts de los sensores |
| `simulation/` | Modelos de simulación de eventos discretos |
