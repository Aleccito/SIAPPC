# Backend

API REST Fastify 5 sobre MariaDB 11.4, en TypeScript 6 y Node 24. Node corre las
fuentes `.ts` directamente (type stripping), así que no hay paso de build ni
`dist/`. Prisma 7 como ORM —con `$queryRaw` donde el SQL a mano gana—; validación
con Zod.

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
| `REDIS_URL` | Contadores del límite de peticiones y caché de `/sensors/*`. Sin ella el límite cae a un contador en memoria y arranca igual |
| `SENSORS_CACHE_TTL` | Segundos que vive cada respuesta cacheada de `/sensors/*`. 10 por defecto; `0` desactiva la caché |
| `THRESHOLDS_CACHE_TTL` | Segundos que el proceso conserva su copia de `umbral_alerta`. 60 por defecto. Ver [Umbrales de alerta](#umbrales-de-alerta) |
| `RATE_LIMIT_MAX` | Techo de peticiones por minuto y por IP. 100 por defecto; solo se sube para medir con JMeter |
| `ETL_RETENCION_DIAS` | Días de lecturas crudas que conserva el ETL. **`0` por defecto = no se borra nada.** Lo lee `etl/scheduler.ts`, no la API |

## Endpoints

Todo cuelga de la raíz del servicio. El frontend los llama con prefijo `/api`,
que nginx quita al hacer proxy.

| Ruta | Qué hace |
|---|---|
| `GET /health` | Sonda de vida, `{"status":"ok"}` |
| `POST /auth/login` | Credenciales por token JWT; registra el acceso en auditoría |
| `POST /auth/logout` | Revoca el token de la sesión |
| `GET /auth/me` | Usuario de la sesión |
| `GET /users` · `GET /users/:id` · `POST /users` · `PATCH /users/:id` · `DELETE /users/:id` | CRUD de usuarios |
| `GET /users/:id/activity` | Actividad reciente de un usuario |
| `GET /roles` · `GET /roles/:id` · `POST /roles` · `PATCH /roles/:id` · `DELETE /roles/:id` | CRUD de roles |
| `GET /roles/:id/permissions` · `PUT /roles/:id/permissions` | Matriz de permisos del rol |
| `GET /roles/changes` | Historial de cambios de rol |
| `GET /permissions` | Catálogo de permisos |
| `GET /audit` · `GET /audit/entities` | Bitácora, paginada y filtrable |
| `GET /units` · `GET /units/:id` · `POST /units` · `PUT|PATCH /units/:id` · `DELETE /units/:id` | CRUD de unidades |
| `GET /patients` · `GET /patients/:id` · `POST /patients` · `PUT|PATCH /patients/:id` · `DELETE /patients/:id` | CRUD de pacientes |
| `GET /patients/:id/assignments` · `POST /patients/:id/assignments` · `DELETE /patients/:id/assignments/:userId` | Personal a cargo del paciente. Ver [Personal a cargo](#personal-a-cargo) |
| `GET /sensors/readings` | Lecturas, filtrables por `device`, `variable`, `limit` |
| `GET /sensors/alerts` | Alertas, además por `severity` y `status` |
| `GET /alerts/stream` | Alertas en vivo por Server-Sent Events. Ver [Alertas en vivo](#alertas-en-vivo-sse) |
| `GET /alert-thresholds` · `POST /alert-thresholds` · `PATCH /alert-thresholds/:id` · `DELETE /alert-thresholds/:id` | Umbrales que deciden si una lectura abre alerta, filtrables por `variable` y `patientId`. Ver [Umbrales de alerta](#umbrales-de-alerta) |
| `GET /alert-thresholds/effective` | Las bandas que se aplicarían AHORA a un paciente (`?patientId`), ya resuelta la vuelta atrás al valor por defecto |
| `GET /search` | Búsqueda global (pacientes, notas SOAP, dispositivos), acotada por hospital |
| `GET /beds` · `GET /beds/:id` · `POST /beds` · `PUT|PATCH /beds/:id` · `DELETE /beds/:id` | CRUD de camas (fábrica `crud.ts`) |
| `GET /beds/occupancy` | Ocupación agregada por unidad |
| `GET /admissions` · `GET /admissions/:id` · `POST /admissions` · `PATCH /admissions/:id` | Ingresos: alta ocupa la cama, egreso la manda a `limpieza` |
| `GET /discharges` | Listado de egresos |
| `GET /appointments` · `GET /appointments/:id` · `POST /appointments` · `PATCH /appointments/:id` | Citas |
| `GET /soap/notes` · `GET /soap/notes/:id` · `POST /soap/notes` · `PUT|PATCH /soap/notes/:id` | Notas SOAP |
| `POST /soap/notes/:id/sign` | Firma la nota; a partir de ahí solo admite adenda |
| `POST /soap/notes/:id/addendum` | Adenda a una nota ya firmada |
| `GET/POST /historia/:pacienteId/{antecedentes,alergias,medicamentos,diagnosticos,hospitalizaciones,procedimientos,documentos}` · `PATCH .../:id` | Historia clínica por categoría (mismo patrón repetido por categoría) |
| `GET /historia/:pacienteId/evoluciones` · `POST /historia/:pacienteId/evoluciones` | Notas de evolución |
| `PATCH /historia/:pacienteId/observaciones` | Observaciones generales del expediente |
| `GET /historia/:pacienteId/cambios` | Historial de cambios del expediente |
| `GET /historia/:pacienteId` | Expediente clínico consolidado |
| `GET /historia/:pacienteId/exploracion-fisica` · `PUT /historia/:pacienteId/exploracion-fisica` | Exploración física (tablas `exploracion_fisica` y `hallazgo_exploracion`) |
| `GET /dashboard/assigned-patients` | Pacientes del usuario de la sesión; **todos los del hospital** si es `admin` o `administrativo`. Ver [Personal a cargo](#personal-a-cargo) |
| `GET /dashboard/devices` | Dispositivos y su última lectura |
| `GET /reports` | Últimas corridas del ETL desde `etl_ejecucion` |
| `GET /reports/actividad-clinica.csv` | Informe de actividad clínica por profesional, en CSV. Ver [Informes en CSV](#informes-en-csv) |

Salvo `/health` y `/auth/login`, todas exigen `Authorization: Bearer <token>`.
Las de usuarios, roles y auditoría además revalidan el permiso concreto contra
`rol_permiso` en el servidor — no basta con el rol que venga en el token.

### Convenciones REST

| | |
|---|---|
| `GET /recurso` | Arreglo de recursos. `?page` y `?pageSize` paginan; el total va en la cabecera `X-Total-Count`, no en el cuerpo. Sin `pageSize` sale la lista completa |
| `GET /recurso/:id` | El recurso, o 404 |
| `POST /recurso` | 201 con el recurso creado y la cabecera `Location` |
| `PUT /recurso/:id` | Reemplaza: exige el cuerpo completo |
| `PATCH /recurso/:id` | Modifica solo lo que venga |
| `DELETE /recurso/:id` | 204 sin cuerpo. Es baja lógica (`activo = FALSE`) en todo lo que la bitácora referencia |

Los errores salen siempre con la misma forma: `{ "error": "mensaje" }`, o
`{ "error": [ ...incidencias de zod... ] }` cuando falla la validación de la
entrada. Lo arma `src/lib/http.ts`, que además traduce los códigos de Prisma:
`P2002` (llave duplicada) → 409, `P2003` (referencia rota) → 409, `P2025`
(no encontrado) → 404. Un error no previsto responde 500 con un mensaje
genérico y el detalle solo en el log — el texto de una excepción interna puede
llevar SQL o datos de otro registro.

### CRUD genérico

`src/lib/crud.ts` genera las seis rutas de arriba a partir de una descripción
del recurso: modelo de Prisma, permiso exigido por acción, esquemas de zod,
cómo se ve desde afuera y qué texto deja en la bitácora. Lo usan `/patients` y
`/units`.

Cada alta, cambio y baja se escribe en `auditoria` **dentro de la misma
transacción** que el cambio. Si no se puede dejar constancia, el cambio no se
hace.

No todo pasa por ahí, a propósito: `/users`, `/roles` y `/alert-thresholds`
siguen escritos a mano porque tienen reglas que no caben en una configuración
—la contraseña temporal del alta, no poder suspender al último administrador,
derivar el `nombre` del rol de su etiqueta, los roles del sistema en solo
lectura, comprobar que el `patientId` de un umbral sea de este hospital—.
Meterlas a la fuerza convertiría la fábrica en un caso especial por recurso.

### Consultas crudas

Lo que va con `$queryRaw` y por qué, para que no se "arregle" pasándolo al ORM:

| Dónde | Motivo |
|---|---|
| `GET /audit` | El `NOW() - INTERVAL ? DAY` lo resuelve MariaDB, y el total y la página salen de la misma cláusula `WHERE` |
| `GET /sensors/readings` · `/alerts` | Tres JOIN sobre las tablas que crecen sin techo; el plan del `LIMIT` sobre `ix_lectura_sensor_fecha` es lo que hace que la pantalla responda |
| `GET /roles/:id/permissions` | `LEFT JOIN` con la condición del rol dentro del `ON`, más `COALESCE` por columna |
| `POST /roles` con `baseRole` | Copia la matriz del rol base en una sola sentencia en vez de N+1 viajes |
| `app.requirePermission` | La columna a leer (`puede_ver`, `puede_crear`, …) se decide en tiempo de ejecución |
| Ingesta MQTT | `INSERT IGNORE`, que Prisma no expone |
| `GET /reports/actividad-clinica.csv` | Agregación sobre la vista `v_rep_actividad_clinica`, con el rango de fechas y el `HAVING` que mantiene en el informe a los médicos sin actividad |
| ETL (`etl/run.ts`) | `$executeRaw` para llamar a los procedimientos de agregación; ver [Vistas y procedimientos](#vistas-y-procedimientos-almacenados) |

Los valores siempre van parametrizados por la plantilla de `$queryRaw`; lo único
que se arma como texto son fragmentos fijos escritos en el propio código.

## Multi-hospital

El hospital de la sesión sale de `req.hospitalId`, resuelto en
`src/plugins/auth.ts` a partir de la cuenta autenticada — no del cuerpo ni de la
query de la petición. Camas, ingresos, citas, pacientes y expediente quedan
acotados a ese hospital.

**Lo que todavía NO está acotado por hospital:** `/sensors/*` y
`/dashboard/devices`. Es una limitación real, no una omisión del README: la
clave de caché de Redis (`src/lib/cache.ts`) no incluye el hospital ni el
usuario, así que un filtro por hospital en esas rutas exigiría además meter el
identificador en la clave de caché — si no, un hospital vería en caché la
respuesta calculada para otro.

## Alertas en vivo (SSE)

`GET /alerts/stream` empuja alertas nuevas al navegador por Server-Sent Events
en cuanto se insertan (`src/lib/eventos.ts` como bus interno del proceso; lo
consume `frontend/src/modules/dashboard/useAlertStream.ts`). Es un canal
aparte del ETL: el ETL (`backend/etl/`) agrega lecturas y alertas por lotes,
una vez por hora, para alimentar reportes; el SSE no agrega nada ni toca la
base de reportes, solo avisa en el instante en que ocurre la alerta.

## Personal a cargo

`medico_paciente` dice quién tiene a cada paciente bajo su cuidado. No es una
tabla decorativa: decide qué lista `GET /dashboard/assigned-patients` —lo que
el usuario ve en la pantalla de Pacientes— y a quién le llegan las
notificaciones (`src/lib/notificaciones.ts`).

Durante un tiempo solo se leía. Sin endpoints de escritura la tabla únicamente
se llenaba con SQL a mano, así que en una instalación recién sembrada estaba
vacía y la pantalla de Pacientes salía sin nada para todo el mundo, aunque el
hospital tuviera gente ingresada. Los tres endpoints la cierran:

| Ruta | Permiso | Qué hace |
|---|---|---|
| `GET /patients/:id/assignments` | `pacientes.ver` | Quién está a cargo ahora, con nombre y rol |
| `POST /patients/:id/assignments` | `pacientes.editar` | Pone a alguien a cargo. `201`, o `409` si ya lo estaba |
| `DELETE /patients/:id/assignments/:userId` | `pacientes.editar` | Lo quita. `204` |

Tres detalles que no se deducen del esquema:

- **La llave única es `(usuario, paciente, fecha)`**, no `(usuario, paciente)`:
  el historial de quién llevó a quién se conserva. Por eso quitar a alguien es
  `activo = false` y no un `DELETE`, y por eso volver a asignarlo el MISMO día
  reactiva su renglón en vez de insertar otro — un `INSERT` chocaría contra
  `uq_medico_paciente`.
- **La fecha se compara a medianoche UTC.** `fecha_asignacion` es `@db.Date` y
  Prisma la compara contra ese instante; pasarle la medianoche con el desfase
  del hospital cae en el día anterior y nunca encuentra el renglón de hoy.
- **La tabla no es exclusiva de médicos.** Su llave es `usuario_id`, así que
  enfermería usa el mismo mecanismo y ve su propia lista.

### Quién ve todos los pacientes

`GET /dashboard/assigned-patients` devuelve, por contrato, "los míos": el
identificador sale del token y nunca de la query, así que pedir los de otro no
es expresable.

La excepción son `admin` y `administrativo`: no atienden pacientes, nunca
tendrán asignaciones, y con la regla estricta su pantalla salía vacía. Para
esos dos roles el endpoint devuelve **todos los pacientes activos del
hospital**, con la misma forma; para ellos `assignedAt` es la fecha de llegada,
porque no hay asignación que fechar.

Se decide por el **rol** y no por un permiso a propósito: `pacientes.ver` lo
tienen los cuatro roles, así que no distingue. La invariante se mantiene: o son
los tuyos, o son todos los de tu hospital, nunca los de otra persona.

## Informes en CSV

`GET /reports/actividad-clinica.csv` (`src/routes/reportesCsv.ts`) devuelve el
informe de actividad clínica por profesional como archivo descargable. Exige
`desde` y `hasta` en formato `YYYY-MM-DD`, con `desde <= hasta`, y el permiso
`reportes:ver`.

CSV y no XLSX a propósito: un XLSX de verdad exige una biblioteca y solo compensa
con varias hojas o formato. Tres detalles del formato son para que Excel abra el
archivo bien a la primera en un equipo en español: **BOM** al inicio (sin él,
`Médico` sale como `MÃ©dico`), **`;`** como separador y **coma decimal** (con
punto, `70.5` se lee como texto). Las líneas van con CRLF.

Tres reglas de la consulta que no son evidentes:

- El `LEFT JOIN` contra `usuario` mantiene en el informe a los médicos que **no**
  escribieron nada en el periodo: un informe de actividad que solo lista a quien
  trabajó no deja ver quién no lo hizo.
- El corte superior es `< hasta + 1 día`, no `<= hasta`: si no, se pierde todo lo
  escrito ese último día después de medianoche.
- El hospital sale de `req.hospitalId`, nunca de la petición. Un informe es la
  vía más cómoda para sacar datos de otra institución de una sola vez.

Del lado del navegador lo descarga `frontend/src/modules/reports/api/exportApi.ts`:
no se puede usar un `<a href>` porque un enlace no manda la cabecera
`Authorization`, así que pide el archivo con `fetch`, lo pasa a blob y dispara la
descarga con un enlace temporal. **El nombre del archivo lo decide el servidor**
en `Content-Disposition`; el frontend solo lo lee.

## Vistas y procedimientos almacenados

Viven en [`db/extra.sql`](db/extra.sql), cada uno con su migración en
`prisma/migrations/`. Son lo que Prisma no sabe expresar.

| Objeto | Tipo | Para qué |
|---|---|---|
| `v_dim_paciente` | Vista | Dimensión de paciente **sin identidad**, para Power BI: edad calculada, sexo, tipo de sangre, módulo, estado, unidad y cama del ingreso activo. No expone nombre, cédula, contacto de emergencia ni motivo de consulta, y recorta `fecha_llegada` a la fecha |
| `v_rep_actividad_clinica` | Vista | Detalle de notas SOAP con su autor, rol, unidad, si es adenda y los minutos hasta la firma. Es **detalle y no resumen**: una vista no admite parámetros, y el rango cambia en cada informe, así que la vista fija *qué* cuenta y quien la consulta pone el rango y el `GROUP BY` |
| `sp_etl_lecturas_hora(desde, hasta)` | Procedimiento | Agrega `lectura` en `lectura_hora`. Lo llama el ETL |
| `sp_etl_alertas_dia(desde, hasta)` | Procedimiento | Agrega `alerta` en `alerta_dia`. Lo llama el ETL |
| `sp_purgar_lecturas(dias, lote)` | Procedimiento | Borra lecturas crudas ya agregadas. Lo llama el ETL |

### Un `CALL` que devuelve filas NO sirve desde el backend

El adaptador de MariaDB de Prisma entrega las filas de un `CALL` **sin nombres de
columna**. Por eso la regla del proyecto es:

- **Lo que la API lee va en una VISTA**, que se consulta como una tabla.
- **Un procedimiento solo se usa si escribe** y no devuelve resultados, y se
  invoca con `$executeRaw`, nunca con `$queryRaw`.

Es la razón de que existan `v_rep_actividad_clinica` y `v_dim_paciente` en lugar
de procedimientos de informe: hubo `sp_kpi_tablero` y `sp_rep_actividad_clinica`,
y la migración `20260813162155_quitar_sp_sin_uso` los eliminó precisamente porque
la API no podía llamarlos. Un procedimiento que devuelve filas sigue sirviendo
desde el cliente de MariaDB o desde Power BI, pero no desde aquí.

### Cómo se escriben

El cuerpo de cada procedimiento es **una sola sentencia, sin `BEGIN … END`**. No
es estilo: `extra.sql` se carga con `multipleStatements`, que parte el texto por
punto y coma, y un cuerpo con varias sentencias quedaría cortado por la mitad.
Un procedimiento que necesite `BEGIN` obliga a cambiar antes cómo se carga el
esquema.

## Roles

Los cuatro roles del seed (`medico`, `enfermero`, `administrativo`, `admin`)
llevan `es_sistema = TRUE`: se editan —etiqueta, permisos— pero no se pueden
borrar (`DELETE /roles/:id` responde 409 sobre un rol de sistema). Aparte de
eso, `admin` está además protegido: ni su etiqueta ni su matriz de permisos se
pueden tocar, y el intento responde 403 (`src/routes/roles.ts`). Recortarle
permisos a `admin` dejaría el sistema sin ningún rol capaz de devolvérselos.

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

El contador vive en Redis, no en la memoria del proceso. Eso es lo que permite
correr más de una réplica del backend: con el contador en memoria cada réplica
aplicaba el límite por su cuenta, así que dos instancias dejaban pasar diez
intentos de login en vez de cinco, y reiniciar el proceso borraba los bloqueos.

Las claves van con prefijo `siappc-rl:` y las escribe `@fastify/rate-limit`
solo, contra el cliente de `src/lib/redis.ts`.

Si Redis se cae, `skipOnError: true` deja pasar las peticiones en vez de
responder 500 — pero eso significa que **mientras Redis esté abajo no hay
límite de peticiones, ni siquiera en `/auth/login`**. Es un compromiso
deliberado a favor de la disponibilidad, no un modo de operación: por eso el
backend depende de `redis` con `condition: service_healthy` en
`docker-compose.yml` y cada fallo queda en el log.

Sin `REDIS_URL` el plugin cae a su contador en memoria y arranca igual. Ese es
el camino de `npm run dev` con una sola instancia; en Compose la variable
siempre viene puesta.

## Caché de lecturas y alertas

`GET /sensors/readings` y `GET /sensors/alerts` pasan por una caché en Redis
(`src/lib/cache.ts`, prefijo `siappc-cache:`). Son las consultas que alimentan
el tablero de sensores y los reportes, y las únicas que barren tablas que crecen
sin techo —una lectura por segundo y por sensor— con tres JOIN y un `ORDER BY`.
El tablero además las repite en cada refresco, para todos los usuarios
conectados a la vez.

`SENSORS_CACHE_TTL` (10 s por defecto) fija cuánto vive cada respuesta; `0`
desactiva la caché sin tocar el límite de peticiones.

**TTL corto en vez de invalidar al escribir.** La ingesta MQTT inserta una
lectura por segundo y por sensor: invalidar en cada `INSERT` dejaría la caché
siempre fría, con toda la complejidad de la invalidación y ninguno de los
aciertos. El precio es que una respuesta puede venir hasta `SENSORS_CACHE_TTL`
segundos vieja — aceptable para el tablero y los reportes; si algún día un
endpoint dispara una acción clínica inmediata, ese debe saltarse la caché.

La clave se arma con los parámetros ya validados por zod y ordenados alfabé-
ticamente, así que `?device=A&limit=50` y `?limit=50&device=A` comparten
entrada. **No incluye al usuario**, porque estas consultas todavía no filtran
por hospital ni por unidad: la respuesta es idéntica para cualquiera que pase el
`authenticate`. El día que se agregue ese filtro, el identificador tiene que
entrar en la clave, o un usuario leería la respuesta cacheada de otro hospital.

Cualquier fallo de Redis se degrada a consultar MariaDB: la caché nunca
convierte una API que funciona en una que responde 500.

## Ingesta MQTT

`src/services/mqttIngest.ts` se suscribe a `siappc/+/telemetry` y por cada
mensaje válido:

1. Busca el `dispositivo` por `codigo`. Si no está dado de alta, descarta la
   lectura en vez de inventarle dueño.
2. Da de alta el `sensor` (dispositivo + variable) si no existía. La unidad de
   medida vive en el catálogo `variable`, no en `sensor`: `sensor` solo
   referencia `variable.codigo`.
3. Inserta la `lectura` con `INSERT IGNORE`: el índice único sobre
   `hash_sha256` descarta reenvíos del buffer de la Pi y duplicados de QoS 1.
4. Evalúa los umbrales de `umbral_alerta` y, si toca, inserta la `alerta`. Ver
   [Umbrales de alerta](#umbrales-de-alerta).

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

## Umbrales de alerta

Qué convierte una lectura en alerta vive en la tabla `umbral_alerta`, no en el
código. Antes eran cuatro `if` dentro de `mqttIngest.ts` y ajustarlos exigía
recompilar: un paciente con EPOC, que vive por debajo del 90 % de saturación,
disparaba alertas de SpO2 todo el día y la única salida era enseñar al personal a
ignorarlas.

**Una fila es una banda:** la variable, la severidad que le corresponde y los
límites fuera de los cuales salta. `valor_min` y `valor_max` son nulables porque
hay bandas de un solo lado — un SpO2 no alerta por alto. Las bandas de una
variable se evalúan **de mayor a menor severidad** y gana la primera que salta,
que es el orden en el que estaban los `if`.

`db/seed.sql` siembra ocho bandas con exactamente los mismos números y los mismos
textos que tenía el código, y la migración `20260814120000_umbrales_alerta_configurables`
hace lo propio en una base que ya existía: desplegar esto **no cambia ni una
alerta**. `Pruebas/backend/umbrales.test.ts` lo comprueba barriendo cada variable
contra una copia literal de la función anterior.

| Variable | `critica` | `alta` | `baja` |
|---|---|---|---|
| `hr` | fuera de 40–140 | fuera de 50–120 | |
| `pr` | fuera de 40–140 | fuera de 50–120 | |
| `spo2` | bajo 85 | bajo 90 | |
| `resp` | — | fuera de 8–30 | |
| `perfusion` | | | bajo 0.2 |

`resp` no tiene banda crítica y no es un hueco: es una estimación sacada de cómo
la respiración mueve la línea de base del pletismógrafo, no una respiración
medida por flujo ni por impedancia, y no es un número sobre el que despertar a
nadie. Ahora que esto es configuración, nada impide que un hospital se la añada
—el modelo no puede saber cómo se midió el dato—, pero sembrarla sería tomar esa
decisión por él. `perfusion` va en `baja` porque no es un signo vital: mide
cuánta señal le llega al sensor, y de quien hay que desconfiar por debajo de 0.2
es del SpO2 que sale de ahí. `ecg` no tiene banda ninguna — una muestra
instantánea de voltaje no dice nada sin la onda completa.

### Por paciente

`umbral_alerta.paciente_id` nulo es el valor por defecto general; con paciente es
el ajuste de esa persona. La vuelta atrás es **por variable y no por banda**: si
un paciente tiene filas propias de `spo2`, esas sustituyen a todas las generales
de `spo2`, no se mezclan con ellas.

Es deliberado y es lo que hace que el ajuste sirva. Mezclarlas rompería
exactamente el caso del EPOC: bajarle solo la banda `alta` dejaría viva la
`critica` general en 85, que se evalúa primero y volvería a taparlo todo. Un
juego de bandas por variable es una decisión clínica completa y se aplica
completa. El coste es que afinar una variable obliga a declarar todas sus bandas;
`GET /alert-thresholds/effective?patientId=` existe para que eso se vea de un
vistazo, porque el listado de filas sueltas no lo enseña.

**No hay ajuste por sensor**, y también es deliberado. El umbral es un dato del
paciente, no del aparato: dos equipos midiendo la misma frecuencia en la misma
persona no pueden alertar con números distintos según cuál publique. Lo que sí es
del aparato —que mida mal— se arregla calibrándolo o marcándolo `fallo` en
`sensor.estado`, no ensanchándole los límites para que deje de quejarse. Y hay un
motivo práctico: las filas de `sensor` las crea sola la ingesta al llegar la
primera lectura, así que un umbral colgado de un sensor desaparecería en silencio
en cuanto al paciente le cambiaran de equipo.

El mensaje de la alerta sale de `plantilla_mensaje`, con `{valor}` donde va la
cifra medida. Vive en la fila y no en el código porque una banda que se puede
mover tiene que poder decir a qué número se movió.

### Caché

Por la evaluación pasa **cada lectura que entra por MQTT**, una por segundo y por
sensor, así que una consulta por mensaje está descartada.
`src/services/umbrales.ts` guarda la tabla entera en memoria —son unas pocas
decenas de filas— y la relee cada `THRESHOLDS_CACHE_TTL` segundos (60 por
defecto). Escribir por la API invalida la copia en el acto.

**Por qué no Redis**, teniéndolo ya: sería un viaje de red por mensaje, o sea el
mismo problema con otro sistema en medio; el caché en proceso haría falta igual y
Redis solo aportaría la invalidación entre réplicas. Con varias réplicas, un
cambio de umbral tarda hasta el TTL en llegar a las que no atendieron la
petición. Es el mismo trato que hace la caché de lecturas y por el mismo motivo:
un desfase acotado y conocido sale más barato de razonar que una invalidación
distribuida. Si algún día no bastara, el bus de `src/lib/eventos.ts` ya publica
por Redis y este módulo podría suscribirse.

**No hay valores por defecto escritos en el código**, a propósito: tenerlos sería
volver a las dos verdades que la tabla viene a unificar. La contrapartida es que
una tabla vacía significa que ninguna lectura alerta, así que ese caso se registra
como `error` en el log en cuanto se intenta cargar.

### Permisos y hospital

Todas las rutas exigen el módulo `alertas` de `rol_permiso`, que en `db/seed.sql`
se describe literalmente como "Umbrales y eventos críticos"; qué rol puede
escribirlo lo decide la matriz y no el código.

Los ajustes **por paciente** están acotados al hospital de la sesión: no se ven ni
se modifican los de un paciente ajeno, y el intento responde 404 —existir en otro
hospital es indistinguible de no existir—. Los valores por defecto **generales**
no lo están, y es una limitación conocida: son configuración del sistema, como el
catálogo `variable` del que cuelgan. Un despliegue con varios hospitales que
necesite defectos distintos por cada uno necesita un nivel más en la tabla
(`hospital_id`), y eso es un cambio de modelo.

## Base de datos

37 modelos en `prisma/schema.prisma`: hospital, unidades, roles y permisos,
usuarios y especializaciones, pacientes, dispositivos y variables, sensores,
lecturas, alertas con sus umbrales, notificaciones y auditoría, agregados por hora para
reportes (`LecturaHora`, `AlertaDia`, `EtlEjecucion`), expediente clínico
(antecedentes, alergias, medicamentos, diagnósticos, hospitalizaciones,
procedimientos, documentos, notas SOAP con firma y adenda, exploración física
y sus hallazgos) y admisión (`cama`, `ingreso`, `cita`).

**`prisma/schema.prisma` es la fuente de verdad.** Para cambiar una tabla se
edita ahí y solo ahí:

```bash
npm run db:migrate -- --name agrega_columna_x   # crea y aplica la migración
npm run schema:build                            # regenera db/schema.sql
npm run generate                                # regenera el cliente tipado
```

Los otros dos archivos de `db/` son consecuencia, no fuente:

| Archivo | Qué es |
|---|---|
| `db/schema.sql` | **Generado.** El DDL completo de una instalación nueva. Lo aplica MariaDB en el primer arranque (`docker-entrypoint-initdb.d`) y las pruebas para recrear la base. No se edita a mano |
| `db/extra.sql` | Hand-written. Lo que Prisma no sabe expresar: el `CHECK` de `alerta`, las dos vistas y los tres procedimientos (ver [Vistas y procedimientos](#vistas-y-procedimientos-almacenados)). `schema:build` lo pega al final de `schema.sql`, y **cada sentencia tiene que ir además en alguna migración** o las bases ya creadas nunca la reciben |
| `db/seed.sql` | Hand-written. Roles, hospital, el primer admin, el catálogo `variable` y los umbrales de alerta por defecto |

`schema.sql` incluye al final la tabla `_prisma_migrations` con todas las
migraciones ya marcadas como aplicadas, así que una base recién creada nace al
día y `migrate deploy` no intenta repetirlas.

`db/build-schema.ts` no necesita una base viva: el DDL sale del datamodel.

### Migraciones sobre una base existente

```bash
cd backend && npm run migrate     # prisma migrate deploy
```

Corre **desde el host**, no dentro del contenedor: la CLI de Prisma es una
dependencia de desarrollo y no entra en la imagen. Toma la conexión de las
mismas `DB_*` del `.env`, igual que los scripts `db:*`.

Es idempotente: la segunda corrida no hace nada.

> **Base creada antes de Prisma.** Tiene el esquema pero no `_prisma_migrations`,
> así que `migrate deploy` intentaría crear tablas que ya existen. Se marca la
> línea base una vez y queda arreglado:
>
> ```bash
> node --env-file=.env node_modules/prisma/build/index.js migrate resolve --applied 00000000000000_init
> ```
>
> La tabla `migracion` del mecanismo anterior queda huérfana; se puede borrar.

El esquema y el seed se aplican solos en el primer arranque, cuando el volumen
está vacío. Para rehacerlos hay que borrar el volumen desde la raíz del repo:

```bash
docker compose down -v
```

`db/schema.sql` usa `CREATE TABLE` sin `IF NOT EXISTS`, así que reaplicarlo sobre
una base que ya tiene tablas falla con `Table 'hospital' already exists`. Eso es
correcto, no un bug: para una base que ya existe están las migraciones.

### Tipos de las llaves

Son `INT UNSIGNED` (`Int @db.UnsignedInt`) y `BIGINT UNSIGNED`
(`BigInt @db.UnsignedBigInt` en `historia_clinica`, `lectura`, `alerta`,
`auditoria`). MariaDB rechaza una llave foránea cuyo tipo no coincida **incluido
el signo**, con un `errno: 150` que no explica nada, así que conviene copiar el
tipo de la columna referenciada.

Los `BIGINT UNSIGNED` llegan a JavaScript como `BigInt`, no como `number`: por
encima de 2^53 un `number` dejaría de representar el identificador exacto. Las
respuestas de la API los convierten a texto (`String(row.lectura_id)`).

Para entrar a la base con un cliente:

```bash
docker exec -it siappc-mariadb mariadb -u root -p
```

Para verla con interfaz: `npm run studio`.

## Pendiente

- Este esquema no tiene tablas para corridas de simulación, y ya no le hacen
  falta: viven en la base `siappc_sim`, que es del simulador y la crea él mismo
  (ver [simulation/README.md](../simulation/README.md)). La pantalla que había
  para eso se quitó. Reportes tampoco es maqueta: lista las corridas del ETL y
  exporta el informe de actividad clínica en CSV.
- El único informe exportable es el de actividad clínica. Cada informe nuevo
  necesita su propia vista y su ruta, porque un `CALL` con resultados no se puede
  consumir desde aquí.
- Los umbrales de alerta se configuran por API (ver
  [Umbrales de alerta](#umbrales-de-alerta)) pero **no tienen pantalla**: hoy solo
  se tocan con peticiones a `/alert-thresholds`. Y los valores por defecto
  generales son del sistema, no de cada hospital.
- El `origin` de CORS todavía apunta solo a `http://localhost:5173`. En Docker no
  estorba, porque nginx sirve el frontend y el backend en el mismo origen.
