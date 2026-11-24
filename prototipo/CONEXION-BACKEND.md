# Conectar el prototipo con el backend real — plan

> **Estado: plan; la base ya está en el código (PRs 2 y 3 de `REVISION-IA.md`).** Existen `src/api/` (con `ai.ts`,
> copia del `aiApi.ts` de los PRs #54–#58), el interruptor `VITE_API_MODE` (`src/api/mode.ts`, `.env.example`) y el
> proxy de `/api` en `vite.config.ts`. Falta conectar grupo por grupo (sección 6). Hasta entonces el prototipo corre
> en modo `mock` y lo publicado en https://prototipo.melo-coton.uk no necesita backend.

Fuentes: `backend/src/routes/*.ts`, `backend/src/plugins/auth.ts`, `backend/prisma/schema.prisma`,
`backend/db/seed.sql`, `docker-compose.yml` y, en `frontend/`, `src/shared/api/http.ts`, `src/modules/registry.ts`,
`src/modules/auth/*` y los `api/*.ts` y `types.ts` de cada módulo.

Punto de partida (hecho en el PR 2): las pantallas solo hablan con `src/api/`, cuyos servicios son copias de los de
`frontend/`; el interruptor `VITE_API_MODE=mock|real|mixto` decide si `send()` va al simulador o a `/api`.

---

## 1. `/api` en el mismo dominio

El navegador siempre llama a `/api/...` en el mismo origen, como `frontend/`: sin CORS y sin `ALLOWED_ORIGINS`.
El backend sirve sus rutas en la raíz, así que el proxy quita el prefijo.

### En desarrollo: proxy de Vite

Ya está en `prototipo/vite.config.ts` (igual que en `frontend/`); en modo mock no llega nada a `/api`:

```ts
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
},
```

El proxy de Vite no guarda los flujos SSE, así que `/ai/assist/stream`, `/alerts/stream` y la onda del ECG llegan
trozo a trozo sin configurar nada más. Las cabeceras COOP/COEP que ya tiene el `vite.config.ts` no afectan a `/api`,
que es del mismo origen.

### En el contenedor: nginx del servicio `prototipo`

```nginx
# prototipo/nginx.conf — dentro de server { … }

# DNS interno de Docker. Con el nombre en una variable, nginx lo vuelve a resolver
# en cada petición (cada 10 s como mucho) en lugar de una sola vez al arrancar.
resolver 127.0.0.11 valid=10s ipv6=off;

location /api/ {
  set $backend http://backend:3001;
  # Con una variable en proxy_pass, nginx ya no recorta el prefijo solo.
  rewrite ^/api/(.*)$ /$1 break;
  proxy_pass $backend;

  proxy_http_version 1.1;
  proxy_set_header Connection "";
  proxy_set_header Host $host;
  # $remote_addr y no $proxy_add_x_forwarded_for: ver el comentario de frontend/nginx.conf
  # (el límite de intentos de login se saltaba inventando la cabecera).
  proxy_set_header X-Forwarded-For $remote_addr;
  proxy_set_header X-Forwarded-Proto $scheme;

  # Flujos SSE: /ai/assist/stream, /alerts/stream y /monitoring/:device/waveform.
  proxy_buffering off;
  proxy_cache off;
  # La IA tarda hasta LLM_TIMEOUT_SECONDS=180; los flujos de alertas y ECG mandan un latido cada 25 s.
  proxy_read_timeout 300s;
  proxy_send_timeout 300s;
}
```

**Por qué no da 502 al reconstruir:** `frontend/nginx.conf` usa `proxy_pass http://backend:3001/` fijo. nginx resuelve
`backend` una vez al arrancar y guarda la IP; `docker compose up -d --build backend` crea un contenedor con otra IP y
nginx sigue mandando a la vieja (502) hasta reiniciarlo. Con `resolver` y la variable se resuelve en cada petición.
Además, si `backend` no existe al arrancar, la forma fija no arranca ("host not found in upstream") y la de la
variable sí: el prototipo sigue sirviendo sus pantallas y solo `/api` responde 502. Es lo que hace falta para que la
misma imagen funcione con o sin backend. (Conviene llevar el mismo cambio a `frontend/nginx.conf`; eso es aparte.)

`backend` ya resuelve desde `prototipo`: los dos servicios están en la red por defecto del mismo `docker-compose.yml`.

### Compilar en modo real

Vite fija las variables al compilar, así que el modo va como argumento de construcción:

```dockerfile
# prototipo/Dockerfile, etapa build, antes de `npm run build`
ARG VITE_API_MODE=mock
ENV VITE_API_MODE=$VITE_API_MODE
```

```yaml
# docker-compose.yml, servicio prototipo (fuera de prototipo/: lo cambia el PR de conexión)
prototipo:
  build:
    context: ./prototipo
    args:
      VITE_API_MODE: ${PROTOTIPO_API_MODE:-mock}
```

Sin `depends_on: backend`: el prototipo tiene que arrancar aunque el backend no esté.

### Detrás del túnel de Cloudflare

- **IP real.** El túnel entra por `localhost:8082`, así que para nginx todas las visitas vienen de la misma IP y el
  límite de login (5 intentos en 15 min por IP + correo; 100/min global) se reparte entre todos. Se arregla con
  `set_real_ip_from <IP de cloudflared>;` y `real_ip_header CF-Connecting-IP;` en el `server`.
- **Corte a los 100 s.** Cloudflare corta una respuesta que pasa 100 s sin mandar nada (error 524). Los flujos de
  alertas y ECG mandan latido cada 25 s, pero `/ai/assist/stream` manda `inicio` y después nada hasta el primer
  trozo; en CPU puede pasar del minuto. Pedido al backend (sección 7): un latido mientras piensa.

---

## 2. Login y sesión reales

### Flujo

| Paso | Llamada | Qué hace la app |
|---|---|---|
| Entrar | `POST /auth/login` `{ email, password }` → `{ token, user }` | Guarda `auth.token` y `auth.user` en sessionStorage (mismas claves que `frontend/`; son orígenes distintos, no chocan) y va al Dashboard |
| Recargar | `GET /auth/me` → `User` | Con token, confirma que la sesión sigue viva y refresca el usuario. `frontend/` no lo hace (confía en lo guardado); aquí sí, porque el token vence a las 12 h y una cuenta suspendida deja de entrar en el acto |
| Salir | `POST /auth/logout` → 204 | Revoca el token (`jti`) y deja `LOGOUT` en la bitácora. Si falla, se sale igual. Ya centralizado en `useLogout()` |

### Errores

| Código | Dónde | Qué ve el usuario |
|---|---|---|
| 401 en el login | Credenciales malas o cuenta suspendida (el backend no distingue, a propósito) | "Correo o contraseña incorrectos" |
| 429 en el login | 5 intentos en 15 min | "Demasiados intentos. Espere 15 minutos." |
| 401 en cualquier otra llamada | Token vencido, revocado o cuenta suspendida | Un solo manejador en `http.ts`: borra la sesión, aviso "Su sesión terminó", Login con `?volver=<ruta>` |
| 403 | Falta el permiso del módulo | Esa pantalla muestra "No tiene permiso para ver esto"; la tarjeta de IA no se dibuja (como `frontend/`) |

### Menú y acciones por rol, desde los permisos

El backend decide con `rol_permiso` (módulo × ver/crear/editar/eliminar), consultado en cada petición. Pero
**`/auth/me` no devuelve los permisos**, y `GET /roles/:id/permissions` exige `usuarios:ver`, que solo tiene el admin.
`frontend/` lo resuelve a medias con `requiredRole` fijo en `registry.ts`.

Propuesta:
1. Pedir que `POST /auth/login` y `GET /auth/me` incluyan `permissions: Record<modulo, {ver, crear, editar, eliminar}>`
   (sección 7).
2. Mientras tanto, `can(modulo, accion)` usa una copia de la matriz de `seed.sql` según `user.role`. Si un
   administrador cambia la matriz, el menú puede mostrar algo que el servidor rechace con 403: se ve el aviso de
   permiso, nada se rompe.

| Entrada / acción | Permiso |
|---|---|
| Dashboard, Mis Pacientes, expediente | `pacientes:ver` y `historia_clinica:ver` |
| Monitoreo | `monitoreo:ver` (umbrales: `monitoreo:editar`) |
| Alertas (atender: `alertas:editar`) | `alertas:ver` |
| Reportes | `reportes:ver` |
| Dispositivos | `dispositivos:ver` |
| Nueva Nota SOAP, firmar | `notas_soap:crear` / `notas_soap:editar` |
| Registrar diagnóstico, antecedentes, indicaciones | `historia_clinica:crear` |
| Asistente IA (menú, botón, tarjetas) | `asistente_ia:ver`, **y el rol no es `admin`** |

Con la matriz de hoy: el **médico** ve todo; la **enfermera** ve el expediente y las notas sin escribirlas, puede
atender alertas y no ve la IA; el **administrativo** no tiene pantallas clínicas (su trabajo es Admisión, que el
prototipo no tiene: ve un aviso); el **admin** entra a su sección (`Admin*`). El seed le da `asistente_ia` al admin;
la interfaz se la oculta por rol, como pediste. Conviene quitarla del seed para que el servidor diga lo mismo.

### Lo que el backend no tiene

| Pantalla | Qué pasa en modo real mientras no exista |
|---|---|
| **Código MFA** (`LoginMfa`) | El login real entra directo al Dashboard; la pantalla se queda solo en modo mock |
| **Recuperar contraseña** (`RecuperarContrasena`, `RecuperacionEnviada`) | "¿Olvidó su contraseña?" muestra "Pídale al administrador que restablezca su contraseña" |
| **Mi Perfil**: cambiar contraseña, activar MFA, sesiones abiertas | Se ven desactivados, con "Disponible cuando el sistema lo permita" |

---

## 3. Pantalla por pantalla

**Inventado en Parte 1** = lo que hoy sale de `src/api/mock/seed/` con `// no viene del seed` o de `sinBackend.ts`.
Al pasar a real, lo marcado como "falta en el backend" sigue saliendo del simulador o se oculta (se decide en el PR
de cada pantalla).

| Pantalla | Endpoints reales | Tipo de `frontend/` | Falta en el backend | Inventado en Parte 1 |
|---|---|---|---|---|
| Login | `POST /auth/login` | `User`, `Credentials` (auth/types) | — | — |
| LoginMfa | — | — | MFA entero | Todo |
| Recuperar / Recuperación enviada | — | — | Recuperación por correo | Todo |
| Dashboard | `GET /dashboard/assigned-patients`, `GET /sensors/alerts?status=abierta`, `GET /sensors/readings?device&variable` | `AssignedPatient`, `SensorAlert`, `SensorReading` | PA (el tipo dice que no cabe en el modelo) | PA; Glasgow y "evaluado" (vienen de la exploración inventada) |
| Mis Pacientes | `GET /dashboard/assigned-patients` | `AssignedPatient` | Diagnóstico principal en la fila | — |
| Central Grid / Lista | `GET /monitoring/beds?unitId` (las unidades salen de la respuesta) | `MonitoredBed` | PA y temperatura | PA, temperatura, curvas antes de 40 min |
| Comparativa | `GET /sensors/readings?device&variable&limit` por paciente | `SensorReading` | Histórico agregado (`lectura_hora` existe sin endpoint) | Curvas antes de 40 min |
| Resumen | `GET /patients/:id`, `/patients/:id/assignments`, `/historia/:id`, `/soap/notes?patientId`, `/sensors/alerts?device`, `/monitoring/beds`, `/dashboard/devices` | `Patient`, `CareAssignment`, `Expediente`, `SoapNote`, `SensorAlert`, `MonitoredBed`, `DeviceStatus` (`bedApi.ts` ya junta casi todo) | Seguro médico; señal y tiempo encendido del equipo; PA y temperatura | Seguro, PA, temperatura, señal |
| Historia clínica general | `GET /historia/:id`, `GET /historia/:id/cambios` | `Expediente`, `HistoriaChange` | — | Hospitalizaciones, documentos y notas (el seed no trae) |
| Antecedentes | `GET`/`POST /historia/:id/antecedentes` | `Antecedente`, `NuevoAntecedente` | — | — |
| Datos personales | `GET /patients/:id` | `Patient` | Dirección, estado civil, ocupación, aseguradora | Esos campos |
| Diagnósticos activos | `GET /historia/:id` (`diagnosticos`), `POST /historia/:id/evoluciones` (nota correlativa) | `HistoriaEntry` | — | — |
| Registro de diagnóstico | `POST /historia/:id/diagnosticos` | `HistoriaEntry` | Catálogo CIE-10 | Catálogo CIE-10 local (ya existía) |
| Documentos | `GET /historia/:id` (`documentos`), `POST /historia/:id/documentos` | `HistoriaEntry` | Guardar el archivo (el esquema solo guarda la ficha; `PENDIENTE`) | Lista de documentos |
| Exploración física | `GET`/`PUT /historia/:id/exploracion-fisica` | `ExploracionDto` | Signos de la exploración (PA, temperatura) | La exploración de 6 de los 8 |
| Hospitalizaciones | `GET /historia/:id` (`hospitalizaciones`, `procedimientos`) | `HistoriaEntry` | — | Todo (el seed no trae) |
| Indicaciones médicas | `GET /historia/:id` (`medicamentos`), `POST`/`PATCH /historia/:id/medicamentos` | `HistoriaEntry` | Órdenes que no son fármacos (dieta, laboratorios, cuidados) | Esas órdenes |
| Interrogatorio por aparatos | — | — | No existe | Todo |
| Nota de ingreso | — (¿`POST /historia/:id/evoluciones`?) | — | No existe como tal | Todo |
| Monitoreo detallado | `GET /monitoring/beds`, `/sensors/readings`, `/sensors/alerts?device`, SSE `/monitoring/:device/waveform` | `MonitoredBed`, `SensorReading`, `SensorAlert` | Neurológico, ventilación, balance, laboratorios, perfusión; PA y temperatura | Todos esos paneles |
| Notas SOAP (historial, detalle, nueva) | `GET /soap/notes?patientId`, `GET /soap/notes/:id`, `POST /soap/notes` (`sign`), `PUT`/`PATCH /soap/notes/:id`, `POST /soap/notes/:id/sign`, `POST /soap/notes/:id/addendum` | `SoapNote`, `NewSoapNote` | — | Las notas (el seed no trae) |
| Tendencias | `GET /sensors/readings?device&variable&limit` | `SensorReading` | Histórico agregado; PA y temperatura | Curvas antes de 40 min |
| Umbrales | — | — | Umbrales por paciente (hoy fijos en `mqttIngest.ts`) | Todo |
| Centro de alertas | `GET /sensors/alerts?status&severity`, SSE `/alerts/stream` | `SensorAlert` | `patientId` en la alerta (solo trae `device`) | Agrupación (es de la pantalla) |
| Confirmación de atención | — | — | Reconocer o resolver una alerta | Todo |
| Notificaciones (centro y bandeja) | `GET /notifications?page&pageSize`, `POST /notifications/:id/read`, `POST /notifications/read-all` | `Notification`, `NotificationPage` | Tipos que no son alertas | Esos tipos |
| Dispositivos y detalle | `GET /dashboard/devices` | `DeviceStatus` | Firmware, calibraciones, eventos, batería | Esos datos |
| Reportes | `GET /reports/actividad-clinica.csv?desde&hasta` (`descargarActividadClinica`) | — | Reportes clínicos por paciente y su historial (`GET /reports` es otra cosa: las corridas del ETL, tipo `Report`) | Historial de reportes |
| Turno (entrega, historial, recibido) | — | — | No existe | Todo |
| Búsqueda | `GET /search?q` | `SearchResponse` | — | — |
| Mi Perfil | `GET /auth/me` | `User` | Cambio de contraseña, MFA, sesiones, especialidad (la tabla `usuario_especializacion` existe sin endpoint) | Esos datos |
| Ayuda y soporte | — | — | Envío de solicitudes | Todo |
| Asistente IA (nueva) | `POST /ai/assist/stream` (`patientId` obligatorio desde el PR #55) | `AiAssistInput`, `AiStreamHandlers` (aiApi) | Latido mientras piensa | "Lo que verá la IA": se arma en el navegador con `src/lib/aiTemas.ts`, copia de `services/aiTemas.ts`; un endpoint con el contexto evitaría copiar las reglas |
| Ideas de la IA (tarjeta) | `GET /ai/assist/:patientId` y `POST /ai/assist/:patientId/ideas` (a pedido, severidad `solicitado`) | `AiAnalysis`, `AiAnalysisResponse` | `expiresAt` (hoy se calcula con los 15 min de la configuración) | — |

El paciente va en la URL por cédula. En real, `src/api/patients.ts` traduce cédula → id con `GET /patients` (una
llamada en caché) hasta que exista `GET /patients?document=` (sección 7).

---

## 4. Cómo se pasa cada servicio de mock a real

Como el simulador está en la capa HTTP, los servicios **no cambian**: lo que cambia es a dónde va `send()`. Para
conectar por partes (sección 6) el interruptor admite una lista:

```
VITE_API_MODE=mock                    # todo simulado (lo publicado hoy)
VITE_API_MODE=real                    # todo al backend
VITE_API_MODE=mixto
VITE_API_REAL=auth,dashboard,patients # solo estos grupos de rutas van al backend; el resto, al simulador
```

`http.ts` decide por el inicio de la ruta (`/auth`, `/dashboard`, `/patients`, `/historia`, `/soap`, `/monitoring`,
`/sensors`, `/alerts`, `/notifications`, `/reports`, `/search`, `/ai`). En modo mixto los ids del simulador y los del
backend no coinciden, pero las pantallas se hablan por cédula, que es la misma en los dos (DEMO-0001…). Con `auth`
en el backend, el simulador acepta el JWT real y toma el rol de su carga (`src/api/mock/session.ts`), así que los
grupos que siguen simulados responden con los permisos de quien entró.

Para cada grupo, el PR que lo conecta:
1. Lo agrega a `VITE_API_REAL` en `.env.development` y prueba contra el backend con el seed de demo.
2. Compara la respuesta real con la del simulador (mismo tipo); si difieren, se corrige **el simulador**.
3. Revisa los estados de carga, vacío y error de esas pantallas con datos reales.
4. Decide qué hacer con lo que el backend no tiene (seguir simulado con una marca, u ocultarlo).

Al terminar el último grupo, `VITE_API_MODE=real` y el modo mixto se puede quitar.

### React Query: sí

Se agrega en el paso de IA (`REVISION-IA.md`, D7), así que la conexión no lo estrena. Razones:
- `frontend/` ya lo usa: mismas claves (`['patients']`, `['aiAnalysis', id]`…) y los mismos tiempos de recarga, y
  sus componentes se pueden traer casi tal cual.
- Con datos reales hace falta caché entre pestañas del expediente, recargar al volver a la ventana, reintentos
  (salvo 403, como `AiIdeasCard`) e invalidar tras escribir (firmar una nota refresca la lista y el Resumen).
- El flujo de alertas solo tiene que invalidar consultas; no hace falta un estado global aparte.

---

## 5. Tiempo real

| Qué | Cómo llega | Cómo lo usa el prototipo |
|---|---|---|
| **Alertas** | `GET /api/alerts/stream` (SSE). Marcos: `listo`, `alerta` (solo alta y crítica, del hospital del usuario), `notificacion` (cuando el usuario estaba entre los notificados); latido cada 25 s | Una sola conexión para toda la app (copia de `frontend/src/shared/api/alertStream.ts`, `suscribirEventos`). Con `fetch` y no `EventSource`, para mandar `Authorization`; se reconecta a mano. Cada `alerta` invalida alertas, Dashboard, monitoreo y el análisis IA de ese paciente; las críticas muestran un aviso; `notificacion` sube el contador de la campana |
| **Onda del ECG** | `GET /api/monitoring/:device/waveform` (SSE). Marcos: `listo`, `onda` `{ variable, hz, ts, samples }` | Monitor de Resumen y Monitoreo detallado, en un `<canvas>` que avanza a `hz`. Solo llega si el equipo la publica; si no, "Sin señal de ECG". Se cierra al salir de la pantalla (cuesta ancho de banda) |
| **Signos vitales** | No hay flujo: `GET /monitoring/beds` y `GET /sensors/readings` | Se vuelven a pedir cada 15 s (como el tablero de `frontend/`) y en cuanto llega una `alerta`. Un flujo de signos es opcional (sección 7) |
| **Análisis IA** | `GET /ai/assist/:patientId` | Cada 30 s y al llegar una `alerta` de ese paciente (como `AiIdeasCard`) |

---

## 6. Orden de los PRs

Cada uno conecta un grupo, deja lo demás en el simulador y no rompe lo publicado (que sigue en `mock` hasta el final).

| # | PR | Grupos que pasan a real | Qué se prueba |
|---|---|---|---|
| 1 | Login y menú por rol | `/auth` | nginx y proxy de Vite (sección 1), `VITE_API_MODE`, entrar con las 4 cuentas del seed, 401/403/429, salir revoca el token, menú por permisos |
| 2 | Dashboard | `/dashboard`, `/sensors` (lectura) | KPI y tabla contra el seed; qué pasa sin PA |
| 3 | Pacientes y expediente | `/patients`, `/historia` | Cédula → id; las 8 fichas y sus pestañas; altas en antecedentes, diagnósticos, indicaciones y exploración |
| 4 | Notas SOAP | `/soap` | Borrador, firma, adenda, nota firmada no editable; la enfermera solo lee |
| 5 | Monitoreo | `/monitoring` | Unidades desde la respuesta, camas libres, la onda del ECG |
| 6 | Alertas | `/alerts/stream`, `/notifications` | El flujo en vivo a través de nginx y del túnel; contador de la campana. Atender sigue simulado hasta que exista el endpoint |
| 7 | Reportes | `/reports` | Exportar actividad clínica (CSV); el resto sigue simulado |
| 8 | Dispositivos | `/dashboard/devices` | Estados y última lectura reales |
| 9 | Administración | `/users`, `/roles`, `/permissions`, `/audit` | Lo hace quien lleva la sección `Admin*` |
| 10 | IA real | `/ai` | Consulta con el modelo local (tiempos reales, cancelar corta la generación), análisis automático, 403 de la enfermera, 503 con el modelo apagado, el latido detrás de Cloudflare |

Al final: `VITE_API_MODE=real` en el `docker-compose.yml` del servidor y `docker compose … up -d --build prototipo`.

---

## 7. Pedidos para el equipo de backend (Adrian)

**Necesarios para conectar sin perder pantallas**

1. **Permisos en la sesión:** que `POST /auth/login` y `GET /auth/me` devuelvan `permissions` del rol. Sin esto el
   menú depende de una copia de la matriz.
2. **Atender una alerta:** `PATCH /sensors/alerts/:id` con `{ status: 'reconocida' | 'resuelta', nota? }`
   (enfermería tiene `alertas:editar` en el seed, pero no hay ruta). Y `patientId` en `SensorAlert`.
3. **Latido en `/ai/assist/stream`:** un comentario `: pensando` cada 15 s hasta el primer trozo, para que Cloudflare
   no corte a los 100 s.
4. **`expiresAt` en el análisis IA** (`GET /ai/assist/:patientId`), para mostrar "caduca en X min" sin copiar la
   configuración.
5. **`GET /patients?document=DEMO-0001`** (o por cédula en `/patients/:id`), para abrir un paciente desde la URL sin
   pedir la lista entera.
6. **Diagnóstico principal en `/dashboard/assigned-patients`**, como ya hace `/search`.
7. **Decidir `asistente_ia` del admin:** el seed se lo da; la interfaz no se lo muestra.

**Pantallas que hoy no tienen dónde guardar** (siguen simuladas hasta que existan)

8. Umbrales por paciente (`GET`/`PUT /patients/:id/thresholds`); hoy están fijos en `mqttIngest.ts`.
9. Histórico agregado de lecturas (`lectura_hora` ya existe): `GET /sensors/readings/hourly?device&variable&desde`.
10. Presión arterial y temperatura: si el monitor no las mide, una captura manual (en la exploración o como lectura
    con dos valores).
11. Entrega de turno (modelo y rutas).
12. Interrogatorio por aparatos y nota de ingreso (o decidir que son evoluciones o notas SOAP de un tipo).
13. Órdenes médicas que no son fármacos (dieta, laboratorios, cuidados).
14. Reportes clínicos por paciente (PDF) y su historial.
15. Guardar el archivo de un documento clínico (el esquema lo deja `PENDIENTE`).
16. Catálogo CIE-10 (`GET /catalogs/cie10?q=`).
17. MFA (TOTP), recuperar contraseña por correo y cambiar la propia.
18. Detalle de dispositivo: firmware, calibraciones, eventos.
19. Datos personales que faltan en `paciente`: dirección, estado civil, ocupación, aseguradora.

**Opcionales**

20. Marca `asistidaPorIa` en la nota SOAP, para auditar qué notas usaron texto de la IA.
21. Flujo SSE de signos vitales, para no repreguntar cada 15 s.
22. Buscar pacientes también por diagnóstico en `/search`.

---

## 8. Qué pasa con `frontend/` mientras tanto

- **Sigue siendo la app real** (puerto 8080, servicio `frontend` de `docker-compose.yml`). Solo recibe arreglos: lo
  nuevo se hace en el prototipo (decisión del paso 0, Tailwind), para no hacer todo dos veces.
- **El prototipo es la segunda app** (puerto 8082, https://prototipo.melo-coton.uk). No comparten código: el
  prototipo copia tipos y servicios de `frontend/` y anota de dónde salen. Si un tipo cambia en `frontend/` o en el
  backend, se actualiza la copia en el PR de conexión de ese grupo.
- **Cuándo lo reemplaza:** cuando estén conectados los 10 PRs de la sección 6 y el prototipo cubra lo que `frontend/`
  hace hoy y él no:
  - Admisión: camas, ingresos, egresos y citas (rol administrativo).
  - Ronda en tablet (`/ronda`) y la bandeja de Sensores.
  - Idiomas EN/DE fuera del acceso (`frontend/` traduce todo).
  - Cambios de permisos y bitácora (los lleva la sección `Admin*`).
- **Cómo se reemplaza:** el servicio `frontend` de `docker-compose.yml` pasa a construir `./prototipo` (o se renombra
  la carpeta), en el mismo puerto 8080, con `VITE_API_MODE=real` y el nginx de la sección 1. `frontend/` queda en el
  historial de git y se borra en un PR aparte, cuando nadie lo necesite.
