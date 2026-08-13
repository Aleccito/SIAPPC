# Despliegue de SIAPPC en Google Cloud

Documento basado en lectura directa del repositorio (`docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile`, `backend/src/env.ts`, `.env.example`, `backend/prisma/schema.prisma`, `backend/db/schema.sql`, `backend/etl/scheduler.ts`, `backend/src/services/mqttIngest.ts`, `infra/mosquitto/`, `backend/src/lib/eventos.ts`, `backend/src/routes/alertsStream.ts`, `.github/workflows/ci.yml`). No se ejecutó ni modificó nada.

## 1. Piezas a desplegar y su equivalente en GCP

`docker-compose.yml` define seis servicios: `mariadb`, `mosquitto`, `redis`, `backend`, `etl`, `frontend`.

| Servicio | Qué hace hoy | Opción GCP | Por qué |
|---|---|---|---|
| MariaDB | `mariadb:11.4`, esquema en `backend/db/schema.sql` | Ver sección "Base de datos" — Cloud SQL solo ofrece MySQL, no MariaDB | requiere análisis de compatibilidad, ver abajo |
| Redis | pub/sub de alertas + caché de sensores + rate limit, sin persistencia (`--save '' --appendonly no`) | Memorystore for Redis | equivalente gestionado directo; no necesita persistencia porque el propio compose ya la desactiva |
| Mosquitto (MQTT + TLS) | broker MQTT 8883 con TLS, `allow_anonymous false`, sin listener sin cifrar | Compute Engine (VM) o GKE, no Cloud Run | Cloud Run no expone puertos TCP arbitrarios (solo HTTP/HTTPS en el puerto asignado por la plataforma); MQTT sobre TLS en 8883 necesita un socket TCP persistente con IP/puerto estables para que las Raspberry se conecten |
| Backend (Fastify) | HTTP en 3001, SSE en `/alerts/stream`, cliente MQTT persistente hacia el broker | GKE o Compute Engine; **Cloud Run con reservas si se usa** | ver razonamiento debajo — es la decisión más delicada |
| ETL | proceso aparte, mismo Dockerfile e imagen que backend, `command: ['node', 'etl/scheduler.ts']`, demonio con `setTimeout` propio | dejar como está (VM/GKE) o partir en Cloud Scheduler + Cloud Run Job | ver sección dedicada |
| Frontend (nginx) | build estático servido por `nginx:1.29-alpine`, puerto 80 | Cloud Run (sin estado, sin conexiones largas) o Cloud Storage + Cloud CDN | candidato ideal para Cloud Run, es el único de los seis sin restricción de conexión larga |

### Conexiones largas del backend: por qué importa

El backend hace dos cosas que no toleran bien un entorno "sin servidor" con escalado a cero o corte de conexiones ociosas:

- `backend/src/routes/alertsStream.ts` mantiene SSE abierto por request, con heartbeat cada 25 segundos (`LATIDO_MS = 25_000`) para no ser cortado por proxies intermedios. Si la instancia se apaga o escala a cero entre eventos, el cliente pierde el aviso de alertas críticas y necesita reconectar.
- `backend/src/services/mqttIngest.ts` abre una conexión MQTT persistente hacia el broker (`mqtt.connect`, `reconnectPeriod: 2000`) que vive durante todo el proceso, no por request. Si el backend corre en una plataforma que apaga instancias inactivas, esa suscripción se cae y hay que reconectar — y mientras está caída, no se ingiere telemetría.

Implicación al elegir plataforma:

- **Cloud Run**: soporta streaming HTTP y permite fijar `min-instances >= 1` para evitar escalado a cero, y tiene timeout de request configurable (hasta 60 minutos en la generación actual). Es viable, pero exige configurarlo explícitamente así — la configuración por defecto (escala a cero, timeout corto) rompe ambas conexiones largas. Además cada instancia de Cloud Run solo debería tener una conexión MQTT activa a la vez para no duplicar el consumo de mensajes; con más de una instancia corriendo simultáneamente (autoscaling normal) esto es un problema no resuelto por el código actual.
- **GKE**: un `Deployment` con 1 réplica (o control explícito de duplicados si son más) resuelve esto de forma directa, sin depender de flags de "no escalar a cero". Es lo más parecido al comportamiento actual de docker-compose.
- **VM (Compute Engine)**: es el camino de menor cambio — básicamente correr `docker compose` tal como está hoy, sobre una instancia con IP fija. No requiere adaptar código, pero tampoco da autoscaling ni gestión declarativa.

No se puede afirmar desde el código cuál de las tres es "la correcta": eso depende del apetito operativo del proyecto (pregunta abierta, ver sección 7).

### ETL: demonio propio vs Cloud Scheduler + Job

`backend/etl/scheduler.ts` no usa cron del sistema ni `node-cron`: calcula manualmente el tiempo hasta el próximo minuto objetivo (`ETL_MINUTO`, default `5`) con `setTimeout` recursivo, corre una vez al levantar el proceso y luego cada hora en ese minuto, con una bandera (`corriendo`) para evitar solapamiento.

Dos caminos:

1. **Dejarlo como está**: se necesita un proceso de larga duración (VM o GKE) igual que hoy. Cero cambios de código.
2. **Partirlo en Cloud Scheduler + Cloud Run Job**: Cloud Scheduler dispara un job una vez por hora (cron real, `5 * * * *`), y el job ejecuta el tick del ETL y termina. Esto sí exige cambio de código: hoy `scheduler.ts` es un daemon (`programar()` se reinvoca a sí mismo, maneja `SIGINT`/`SIGTERM`); habría que extraer la función `tick()` a un entrypoint de un solo disparo que reciba la llamada, ejecute y termine con código de salida, sin el bucle de re-programación. El costo es bajo (es refactor de entrada/salida, no de lógica de negocio), pero no es "sin tocar nada".

Dado que el ETL ya no necesita mantener conexiones abiertas de la forma en que sí las necesita el backend (no hace SSE ni MQTT), es el candidato natural a moverse a un modelo serverless si el objetivo es reducir infraestructura de larga duración. El backend, con SSE y MQTT, no tiene ese mismo margen.

### MariaDB en Cloud SQL

Cloud SQL ofrece **MySQL**, no MariaDB, como motor gestionado. `backend/db/schema.sql` fue inspeccionado buscando features específicos de MariaDB (tipos `JSON` nativo con validación distinta, `ENGINE=` explícito, secuencias, `RETURNING`, etc.): usa `AUTO_INCREMENT` en las llaves primarias y `DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci` por tabla — ambos son sintaxis común a MySQL y MariaDB, sin hallazgo de motor de almacenamiento forzado distinto del default (InnoDB) ni de construcciones exclusivas de MariaDB en lo revisado.

Con esa evidencia, el esquema **parece** portable a MySQL/Cloud SQL, pero esto no es una garantía completa: no se auditó línea por línea la totalidad del archivo (748 líneas) ni el comportamiento en tiempo de ejecución de Prisma con el adaptador `mariadb` declarado en `src/lib/prisma.ts`, ni las 1050 líneas de `schema.prisma`. Se declara como punto a verificar antes de migrar, no como hecho confirmado. Si se prefiere evitar el riesgo, la alternativa es correr MariaDB en una VM de Compute Engine o en GKE con un volumen persistente, en vez de Cloud SQL.

## 2. Variables de entorno y secretos

De `backend/src/env.ts`:

**Obligatorias (el proceso corta con `process.exit(1)` si faltan):**
- `JWT_SECRET`
- `ALLOWED_ORIGINS` (lista separada por comas)
- `MQTT_CA_FILE` — obligatoria solo si `MQTT_TLS` no es `"false"` (o sea, obligatoria por default)

**Opcionales con valor por defecto:**
- `PORT` (`3001`)
- `MQTT_HOST` (`localhost`)
- `MQTT_PORT` (`8883`)
- `MQTT_TELEMETRY_TOPIC` (`siappc/+/telemetry`)
- `MQTT_STATUS_TOPIC` (`siappc/+/status`)
- `MQTT_TLS` (`true`)
- `SENSORS_CACHE_TTL` (`10`)
- `RATE_LIMIT_MAX` (`100`)

**Opcionales sin default (pueden quedar sin definir):**
- `MQTT_USER`, `MQTT_PASSWORD`
- `MQTT_CLIENT_CERT_FILE`, `MQTT_CLIENT_KEY_FILE` (deben declararse juntas o ninguna, hay validación XOR en el código)
- `REDIS_URL` (si falta, el backend cae a caché en memoria y pub/sub local de un solo proceso, sin coordinación entre instancias)

De `.env.example` (raíz), variables que docker-compose consume además de las de arriba:
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_ROOT_PASSWORD`, `DB_PORT`
- `BACKEND_PORT`, `FRONTEND_PORT`
- `MQTT_USER`, `MQTT_PASSWORD`, `MQTT_TLS_PORT`
- `REDIS_PASSWORD` (obligatoria en compose: `${REDIS_PASSWORD:?falta REDIS_PASSWORD en el .env de la raiz}`)
- `ETL_MINUTO` (default `5` en compose)

**Van a Secret Manager**: `DB_PASSWORD`, `DB_ROOT_PASSWORD`, `JWT_SECRET`, `MQTT_PASSWORD`, `REDIS_PASSWORD`, y las claves privadas TLS si se usa mTLS de cliente (`MQTT_CLIENT_KEY_FILE`).

**Van como configuración normal (no secreta)**: `ALLOWED_ORIGINS`, `PORT`, `MQTT_HOST`, `MQTT_PORT`, tópicos MQTT, `RATE_LIMIT_MAX`, `SENSORS_CACHE_TTL`, `ETL_MINUTO`, nombres de usuario no sensibles (`DB_USER`, `MQTT_USER` — aunque su exposición conjunta con la contraseña también amerita cuidado).

## 3. Certificados del broker MQTT

Hoy `infra/mosquitto/gen-certs.sh` genera una CA de desarrollo autofirmada (`DAYS_CA=3650`) y certificados de broker/cliente (`DAYS_LEAF=825`) con SANs por defecto `DNS:mosquitto,DNS:localhost,DNS:host.docker.internal,IP:127.0.0.1`. El propio script indica que no es para producción.

`mosquitto.conf` exige TLS siempre (`listener 8883`, `cafile`/`certfile`/`keyfile`, sin listener sin cifrar) y `mqttIngest.ts` valida con `rejectUnauthorized: true` contra esa CA — nunca se desactiva la verificación.

Para producción hace falta:
- Reemplazar la CA autofirmada de desarrollo por una cadena de confianza real: certificado emitido por una CA pública (si el broker va a tener nombre DNS público, algo como Let's Encrypt sirve) o mantener una CA privada propia pero con proceso de distribución serio.
- Definir un dominio o IP estable para el broker (hoy los SAN apuntan a nombres internos de docker-compose).
- **Implicación directa para las Raspberry**: cada dispositivo verifica el certificado del broker contra el archivo `ca.crt` que tiene embebido/instalado. Cambiar de CA significa **redistribuir el nuevo `ca.crt` a cada Raspberry desplegada en campo** antes o junto con el corte del broker viejo, o el dispositivo dejará de poder conectar (falla de verificación TLS). Esto es un problema operativo de logística de dispositivos, no solo de configuración de servidor.
- Definir el mecanismo de rotación antes de que expire el certificado de 825 días, si se reutiliza el mismo esquema de vida útil.

## 4. Base de datos: creación de esquema y migraciones

Hoy, según `docker-compose.yml`, el esquema (`backend/db/schema.sql`, generado desde `backend/prisma/schema.prisma` + `backend/db/extra.sql` vía `npm run schema:build`, comentario explícito de "NO EDITAR A MANO") se aplica en el **primer arranque del contenedor MariaDB** — es el mecanismo estándar de la imagen oficial `mariadb`, que ejecuta scripts `.sql` montados en `/docker-entrypoint-initdb.d/` solo cuando el volumen de datos está vacío.

Las migraciones posteriores corren aparte: `backend/package.json` define `"migrate": "node --env-file=.env node_modules/prisma/build/index.js migrate deploy"`, es decir, Prisma Migrate en modo `deploy` (no interactivo, apto para producción), separado del arranque del contenedor.

Con una base de datos gestionada (Cloud SQL), ese patrón de "inicialización automática por volumen vacío" no aplica igual: Cloud SQL no ejecuta scripts de init al crear la instancia. El esquema inicial tendría que aplicarse explícitamente en el primer despliegue — por ejemplo corriendo `backend/db/schema.sql` una vez contra la instancia recién creada, o directamente `prisma migrate deploy` si el historial de migraciones de Prisma está completo y es equivalente al `schema.sql` generado (esto no se verificó en el código leído). Después, `npm run migrate` se integraría como paso previo al despliegue de una nueva versión del backend (por ejemplo, un job de un solo disparo que corre antes de actualizar el servicio), igual que en cualquier pipeline de CD con Prisma.

## 5. Red y seguridad

Puertos publicados al host hoy, según `docker-compose.yml`:
- MariaDB: `${DB_PORT}:3306`
- Mosquitto: `${MQTT_TLS_PORT:-8883}:8883`
- Backend: `${BACKEND_PORT:-3001}:3001`
- Frontend: `${FRONTEND_PORT:-8080}:80`
- Redis: **no publica puerto al host**, solo accesible en la red interna de Compose

En un despliegue en GCP:
- **MariaDB** (o Cloud SQL) no debería tener IP pública ni puerto expuesto a internet — solo alcanzable desde la red privada donde vive el backend/ETL (VPC + Cloud SQL Private IP, o firewall de VM restringido a los otros servicios).
- **Redis/Memorystore** ya es privado por naturaleza (Memorystore no tiene IP pública) — coherente con que hoy tampoco publica puerto.
- **Mosquitto** es el único de los backend internos que sí necesita ser alcanzable desde fuera de la red privada, porque las Raspberry en campo se conectan a él directamente. Requiere IP pública o un balanceador con el puerto 8883 abierto, con firewall limitado a ese puerto y protocolo.
- **Backend** debería quedar detrás de HTTPS. Hoy expone HTTP plano en 3001 dentro de docker-compose (TLS no está en el código del backend). Falta terminación TLS: Cloud Run la da gratis y automática en su URL `*.run.app`, o si se usa GKE/VM hace falta un Load Balancer de GCP con certificado gestionado (Google-managed certificate) o un proxy (Cloud Load Balancing / Ingress) que termine TLS antes de llegar al Fastify en 3001.
- **Frontend**: mismo caso, HTTPS debe terminarse en un load balancer o en Cloud Run, no en el nginx interno que hoy solo escucha 80.

## 6. Lo que falta en el repositorio para desplegar

Constatado por ausencia en el repo:
- No hay manifiestos de Kubernetes (`.yaml` de Deployment/Service/Ingress) en ningún lado del repo.
- No hay Terraform (ni carpeta `infra/terraform`, ni `.tf` en ninguna ruta revisada) — no hay definición de infraestructura como código para GCP.
- `.github/workflows/ci.yml` **solo construye y prueba**: corre `npm ci`, `npm run generate` (cliente Prisma), `npm run typecheck` y `npm test` para el backend, y `npm ci` + `npm run build` para el frontend. **No hay paso de `docker build` ni `docker push`** — ninguna imagen se publica en Artifact Registry, Docker Hub, ni ningún otro registro. No existe workflow de despliegue (`cd.yml` o similar) en `.github/workflows/`.

Para desplegar hace falta, como mínimo: un workflow (o pipeline manual) que construya las imágenes de `backend/Dockerfile` y `frontend/Dockerfile` y las suba a Artifact Registry, más la definición de la infraestructura elegida (Terraform, manifiestos de GKE, o scripts de Compute Engine) — nada de eso existe hoy en el repositorio.

## 7. Preguntas abiertas (solo el dueño del proyecto puede responderlas)

- **Dominio**: no hay ningún dominio declarado en el repositorio (ni en `.env.example`, ni en configuración de nginx, ni en CI). ¿Existe uno reservado para el backend y el frontend?
- **Presupuesto**: no hay forma de derivarlo del código. Sin esa cifra no se puede recomendar tamaño de instancia de Cloud SQL, de Memorystore, ni el modelo de cómputo (Cloud Run vs VM vs GKE) con criterio de costo.
- **Conectividad de las Raspberry**: el código no dice si los dispositivos en campo salen a internet directo o pasan por VPN. Esto cambia por completo el diseño de red del broker MQTT — expuesto públicamente con TLS y autenticación (como hoy), o accesible solo dentro de una VPN/red privada.
- **Requisitos legales por datos clínicos**: el esquema (`backend/prisma/schema.prisma`) modela pacientes, admisiones, expediente clínico. El repositorio no contiene ninguna mención de marco legal (HIPAA, LFPDPPP, GDPR u otro) ni de requisitos de residencia de datos. Si los datos son de pacientes reales, esto condiciona directamente la elección de región de GCP, cifrado en reposo, retención y control de acceso, y debe resolverse antes de decidir infraestructura.

## Orden de magnitud de costo mensual (estimación, con supuestos explícitos)

No se puede dar un precio cerrado sin las respuestas de la sección 7. Con los supuestos abajo, la estimación es orientativa y en USD, precios de referencia de GCP a la fecha de este documento, para un despliegue pequeño (un hospital, tráfico bajo-moderado):

- **Cloud SQL (MySQL, si el esquema resulta portable)**: instancia pequeña (`db-f1-micro` o equivalente compartido, ~10-20 GB disco) — del orden de 15-40 USD/mes.
- **Memorystore for Redis**: tier básico, 1 GB (más que suficiente dado que el compose actual limita Redis a 128 MB) — del orden de 35-40 USD/mes (Memorystore cobra por GB reservado incluso en el tier más chico).
- **Mosquitto en una VM pequeña** (`e2-small` o similar, con IP pública): del orden de 15-25 USD/mes.
- **Backend + ETL**: si van en la misma VM que Mosquitto o en una VM/GKE similar, costo adicional marginal (misma orden de magnitud que la VM de Mosquitto si se comparte, o +15-25 USD/mes si es instancia separada). Si el backend va en Cloud Run con `min-instances=1` para sostener las conexiones largas, el costo pasa a ser por CPU/memoria asignada de forma continua, similar o algo mayor a una VM pequeña.
- **Frontend en Cloud Run**: tráfico bajo, con escalado a cero permitido (no tiene el problema de conexiones largas) — probablemente unos pocos USD/mes o dentro de la capa gratuita.
- **Egreso de red, Secret Manager, Artifact Registry**: costos menores, del orden de unos pocos USD/mes en esta escala.

Total orientativo: **del orden de 100 a 200 USD/mes** para un despliegue mínimo de un hospital con tráfico bajo. Esto es una estimación de orden de magnitud, no una cotización — cambia según región, compromiso de uso, tráfico real de sensores, y las decisiones de la sección 7.
