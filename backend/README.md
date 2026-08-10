# Backend

API Fastify 5 sobre MariaDB 11.4, en TypeScript 6 y Node 24. Node corre las
fuentes `.ts` directamente (type stripping), así que no hay paso de build ni
`dist/`. SQL crudo con `mysql2`, sin ORM; validación con Zod.

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
| `ALLOWED_ORIGINS` | Orígenes del navegador autorizados, separados por coma. **Sin esto el proceso se apaga al arrancar** |
| `MQTT_HOST`, `MQTT_PORT`, `MQTT_USER`, `MQTT_PASSWORD` | Broker del que se leen las lecturas de la Pi (en Compose, `mosquitto:8883`) |
| `MQTT_TELEMETRY_TOPIC` | Tema suscrito, por defecto `siappc/+/telemetry` |
| `MQTT_CA_FILE` | CA que firma el certificado del broker. **Sin esto el proceso se apaga al arrancar** |
| `MQTT_CLIENT_CERT_FILE`, `MQTT_CLIENT_KEY_FILE` | Certificado de cliente, solo si el broker exige mTLS. Vacíos por defecto |
| `MQTT_TLS` | Escape para un broker heredado sin TLS. Déjalo en `true` |

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

## Límite de peticiones

`@fastify/rate-limit`, registrado en `src/app.ts`:

| Alcance | Límite | Clave |
|---|---|---|
| Toda la API | 100 / minuto | IP |
| `POST /auth/login` | 5 / 15 minutos | IP + correo intentado |

La clave del login junta las dos cosas a propósito. Solo con la IP, un atacante
desde otra red deja fuera al usuario legítimo; solo con el correo, basta rotar
direcciones. El caso que queda —una IP probando muchos correos— lo tapa el techo
global.

Cada bloqueo escribe en `auditoria` con `accion='LOGIN_BLOCKED'` y guarda IP y
correo en `observacion`. Si el correo no existe, `usuario_id` va nulo y
`registro_id` en 0. Contar esos renglones por IP en una ventana de tiempo es lo
que permitirá detectar fuerza bruta sin agregar otra tabla.

Fastify corre con `trustProxy: true` porque en Compose todas las peticiones
llegan desde nginx: sin eso el límite contaría a todo el hospital como un solo
cliente. nginx ya reenvía `X-Forwarded-For`.

El contador vive en memoria del proceso, así que reiniciar el backend lo borra.
Para un despliegue con más de una instancia haría falta un store compartido
(Redis); con una sola instancia esto alcanza.

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

### TLS

La conexión es `mqtts://` y el certificado del broker se valida contra la CA de
`MQTT_CA_FILE`, con `rejectUnauthorized: true`. No hay interruptor para saltarse
esa validación: un `rejectUnauthorized: false` olvidado deja la conexión cifrada
pero suplantable, que es peor que no tener TLS porque parece que sí lo tienes.
Si el certificado no valida, la respuesta es reemitirlo con el SAN correcto
(`infra/mosquitto/gen-certs.sh`), no relajar el cliente.

Los certificados se leen una sola vez, al cargar `src/env.ts`. Un archivo que
falta apaga el proceso con un mensaje claro en vez de dejarlo reintentando: es
un error de configuración, no una caída del broker, y tampoco existe una vuelta
a texto plano si algo sale mal.

`MQTT_CLIENT_CERT_FILE`/`MQTT_CLIENT_KEY_FILE` están cableados para cuando el
broker exija certificado de cliente (`require_certificate true` en
`infra/mosquitto/mosquitto.conf`). Hoy no lo exige: la autenticación es por
usuario y contraseña.

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
correcto, no un bug: para una base que ya existe están las migraciones.

### Migraciones

`db/migrations/` guarda los cambios de esquema posteriores al arranque inicial,
un archivo `.sql` por cambio, numerados y aplicados en orden alfabético:

```bash
docker compose exec backend node db/migrate.ts
```

El script crea la tabla `migracion` si no está, aplica lo que falte y anota cada
archivo. Es idempotente: la segunda corrida no hace nada. Sobre una base creada
con el `schema.sql` actual tampoco hace nada, porque el propio `schema.sql` las
deja registradas.

**Al agregar una migración hay que tocar dos archivos**, y los dos importan:

1. `db/migrations/NNN-nombre.sql` con el `ALTER`/`CREATE` — es lo que reciben las
   bases que ya existen.
2. `db/schema.sql`, reflejando el cambio en el DDL **y** sumando el nombre del
   archivo al `INSERT INTO migracion` del final — es lo que recibe una
   instalación nueva, que nace al día y no debe reaplicar nada.

Si se olvida el paso 2, una instalación nueva queda con el esquema viejo o
intenta aplicar una migración que ya estaba incluida. Es la única duplicación
del mecanismo, y es a propósito: mantiene `schema.sql` legible como retrato
completo del esquema en vez de obligar a leer veinte parches para saber cómo es
una tabla.

Los tipos de las llaves son `INT UNSIGNED` (y `BIGINT UNSIGNED` en
`historia_clinica`, `lectura`, `alerta`, `auditoria`). MariaDB rechaza una llave
foránea cuyo tipo no coincida **incluido el signo**, con un `errno: 150` que no
explica nada, así que conviene copiar el tipo de la columna referenciada.

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
