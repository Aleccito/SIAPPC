# Backend

API Fastify sobre MariaDB, en TypeScript. Node corre las fuentes `.ts`
directamente (type stripping), así que no hay paso de build.

## Cómo se corre

Con el Compose de la raíz del repo, junto con la base y el frontend:

```bash
docker compose up -d --build
```

Esa es la única ruta soportada. Los pasos completos —incluido pedirle el `.env`
a **Ing.Adrian**, que es de donde salen las credenciales reales— están en
[../README.md](../README.md). Este directorio no se levanta por separado.

El `backend/docker-compose.yml` y los scripts `db:*` de `package.json` son
restos de cuando la base se levantaba sola. Publican MariaDB en el mismo puerto
del host que el Compose de la raíz, así que correr los dos a la vez choca. Si
tienes un `3306 already in use`, casi siempre es eso.

Igual pasa con `backend/.env`: está en `.dockerignore` y no entra en la imagen.
El contenedor recibe su configuración del `docker-compose.yml` de la raíz, que
lee el `.env` de la raíz. [`.env.example`](.env.example) queda como referencia de
qué variables lee el backend, con valores de relleno.

| Variable | Para qué |
|---|---|
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Conexión a MariaDB (en Compose, `mariadb:3306`) |
| `PORT` | Puerto HTTP, 3001 |
| `JWT_SECRET` | Firma de los tokens. **Sin esto el proceso se apaga al arrancar** |
| `MQTT_HOST`, `MQTT_PORT`, `MQTT_USER`, `MQTT_PASSWORD` | Broker del que se leen las lecturas de la Pi |
| `MQTT_TELEMETRY_TOPIC` | Tema suscrito, por defecto `siappc/+/telemetry` |

## Endpoints

Todo cuelga de la raíz del servicio. El frontend los llama con prefijo `/api`,
que nginx quita al hacer proxy.

| Ruta | Qué hace |
|---|---|
| `GET /health` | Sonda de vida, `{"status":"ok"}` |
| `POST /auth/login` | Credenciales por token JWT; registra el acceso en auditoría |
| `GET /auth/me` | Usuario de la sesión |
| `GET /users` · `POST /users` · `PATCH /users/:id` | Alta, listado y edición de usuarios |
| `GET /users/:id/activity` | Actividad reciente de un usuario |
| `GET /roles` · `POST /roles` | Roles del sistema |
| `GET /roles/:id/permissions` · `PUT /roles/:id/permissions` | Matriz de permisos del rol |
| `GET /roles/changes` | Historial de cambios de rol |
| `GET /permissions` | Catálogo de permisos |
| `GET /audit` · `GET /audit/entities` | Bitácora, paginada y filtrable |
| `GET /units` | Catálogo de unidades |
| `GET /patients` · `POST /patients` | Pacientes activos y registro de llegada |
| `GET /sensors/readings` | Lecturas, filtrables por `device`, `variable`, `limit` |
| `GET /sensors/alerts` | Alertas, además por `severity` y `status` |

Salvo `/health` y `/auth/login`, todas exigen `Authorization: Bearer <token>`.
Las de usuarios, roles y auditoría además revalidan el permiso concreto contra
`rol_permiso` en el servidor — no basta con el rol que venga en el token.

## Ingesta MQTT

`src/services/mqttIngest.ts` se suscribe a `siappc/+/telemetry` y por cada
mensaje válido:

1. Busca el `dispositivo` por `codigo`. Si no está dado de alta, descarta la
   lectura en vez de inventarle dueño.
2. Da de alta el `sensor` (dispositivo + variable) si no existía.
3. Inserta la `lectura` con `INSERT IGNORE`: el índice único sobre
   `hash_sha256` descarta reenvíos del buffer de la Pi y duplicados de QoS 1.
4. Evalúa umbrales y, si toca, inserta la `alerta`.

Los umbrales viven en código (`hr` fuera de 50–120 / 40–140, `spo2` bajo 90 / 85).
Son un mínimo viable, no la lógica clínica final: todavía no hay tabla de
configuración por paciente o por sensor. El `ecg` no dispara alertas — una
muestra instantánea de voltaje no dice nada sin la onda completa.

La conexión al broker no bloquea el arranque: si no hay broker, mqtt.js reintenta
solo y el servidor HTTP sigue respondiendo.

## Base de datos

`db/schema.sql` son 17 tablas: hospital, unidades, roles y permisos, usuarios y
especializaciones, pacientes e historia clínica, dispositivos, sensores,
lecturas, alertas, notificaciones y auditoría.

El esquema y el seed se aplican solos en el primer arranque, cuando el volumen
está vacío. Para rehacerlos hay que borrar el volumen desde la raíz del repo:

```bash
docker compose down -v
```

`db/schema.sql` usa `CREATE TABLE` sin `IF NOT EXISTS`, así que reaplicarlo sobre
una base que ya tiene tablas falla con `Table 'hospital' already exists`. Eso es
correcto, no un bug.

Para entrar a la base con un cliente:

```bash
docker exec -it siappc-mariadb mariadb -u root -p
```

## Pendiente

- El esquema no tiene tablas para corridas de FlexSim ni para el estado del
  paciente en la fila de servicio; las pantallas de FlexSim y Reportes siguen
  siendo maquetas.
- Los umbrales de alerta son fijos y globales.
- El `origin` de CORS todavía apunta solo a `http://localhost:5173`. En Docker no
  estorba, porque nginx sirve el frontend y el backend en el mismo origen.
