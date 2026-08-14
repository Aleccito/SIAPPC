# Frontend

Tablero web de SIAPPC: administración de usuarios y roles, auditoría, pacientes
y monitoreo de sensores.

## Cómo se corre

Con el Compose de la raíz del repo, junto con la base y el backend:

```bash
docker compose up -d --build
```

Esa es la única ruta soportada, y queda en http://localhost:8080. Los pasos
completos —incluido pedirle el `.env` a **Ing.Adrian**, que es de donde salen las
credenciales reales— están en [../README.md](../README.md). Este directorio no se
levanta por separado.

El frontend no lee ninguna variable de entorno: no hay `VITE_*` ni `.env` aquí.
La imagen es multi-stage — Vite compila el bundle y nginx sirve el `dist`, sin
`node_modules`. `nginx.conf` hace proxy de `/api/` hacia `backend:3001`, así que
para el navegador todo es el mismo origen y no hay CORS que configurar.

Después de cambiar código hay que reconstruir la imagen:
`docker compose up -d --build`.

## Iniciar sesión

El login es real: pega contra `POST /api/auth/login` y el rol viene del servidor.
La cuenta inicial la crea el seed de la base
(`admin@institucion.org` / `Admin12345`, contraseña que está en el repositorio,
solo para desarrollo). El token vive en `sessionStorage` y muere con la pestaña.

## Qué está conectado y qué no

| Módulo | Estado | Contra qué |
|---|---|---|
| Autenticación | Real | `POST /auth/login`, `GET /auth/me` |
| Usuarios (`/admin/users`) | Real | `GET/POST /users`, `PATCH /users/:id`, `GET /users/:id/activity`, `GET /units` |
| Roles (`/admin/roles`) | Real | `GET/POST /roles`, `GET/PUT /roles/:id/permissions`, `GET /roles/changes` |
| Auditoría (`/admin/audit`) | Real | `GET /audit`, `GET /audit/entities` |
| Sensores (`/sensors`) | Real | `GET /sensors/readings`, `GET /sensors/alerts` |
| Pacientes (`/patients`) | Real | Lista: `GET /dashboard/assigned-patients`. Alta y ficha: `GET/POST /patients`, `GET/PATCH/DELETE /patients/:id` (total en `X-Total-Count`). Personal a cargo: `GET/POST /patients/:id/assignments`, `DELETE /patients/:id/assignments/:userId` |
| Admisión (`/admissions`, tres pestañas) | Real | `GET /beds`, `GET /beds/occupancy`, `GET/POST/PATCH /admissions`, `GET /discharges`, `GET/POST/PATCH /appointments` |
| Expediente (`/expediente`) | Real | Notas SOAP con firma y adenda, historia clínica por categoría, exploración física (`/historia/:pacienteId/exploracion-fisica`), antecedentes |
| Búsqueda global (`/search`) | Real | `GET /search` |
| Alertas en vivo (tablero) | Real | `GET /alerts/stream` (SSE), hook `src/modules/dashboard/useAlertStream.ts` |
| Reportes (`/reports`) | Real | `GET /reports` (bitácora de corridas del ETL, desde `etl_ejecucion`) y descarga en CSV con `GET /reports/actividad-clinica.csv` (`api/exportApi.ts`) |
| Simulación y Power BI | **Fuera del tablero** | Ya no son pantallas. Ver [Lo que se quitó](#lo-que-se-quitó-simulación-y-power-bi) |
| Recuperar contraseña | **Simulado** | `passwordResetApi.ts` no llama a nada |
| Panel principal (`/`) | **Simulado** | Tres tarjetas de texto, sin datos |

Cada API simulada lleva un comentario `PENDIENTE:` en la línea exacta que hay
que reemplazar. Las reales pasan todas por
[`src/shared/api/http.ts`](src/shared/api/http.ts), que agrega el token y
normaliza los errores del backend.

### Descargas autenticadas

La exportación de informes
([`src/modules/reports/api/exportApi.ts`](src/modules/reports/api/exportApi.ts))
es el único caso que no pasa por `http.ts`, y por un motivo concreto: **un
`<a href>` no manda la cabecera `Authorization`**, y la API la exige. El archivo
se pide con `fetch`, se convierte en blob y la descarga se dispara con un enlace
temporal que se revoca enseguida —si no, el blob queda en memoria hasta recargar
la página—.

El nombre del archivo lo decide el servidor en `Content-Disposition`; aquí solo
se lee. Repetirlo en el navegador es garantizar que un día digan cosas distintas.
La pantalla de Reportes propone el mes en curso como rango y deja cambiarlo:
un informe de actividad sin periodo no significa nada.

## Stack

| Capa | Elección |
|---|---|
| Build | Vite |
| UI | React 19 + TypeScript |
| Componentes | MUI + `@mui/icons-material` |
| Rutas | React Router (SPA data router) |
| Estado del servidor | TanStack Query |
| Servidor en producción | nginx (dentro del contenedor) |

Paleta blanca en [`src/shared/theme.ts`](src/shared/theme.ts).

## Idioma

Solo español. No hay diccionario en inglés ni selector de idioma: `Language`
en [`src/shared/i18n/dictionary.ts`](src/shared/i18n/dictionary.ts) es el tipo
`'es'` a secas. Todo el texto de la interfaz vive en ese diccionario.

## Estructura

```
src/
  app/                 App.tsx (providers), router.tsx, AppLayout.tsx
  shared/
    api/http.ts        fetch con token y errores normalizados
    theme.ts           paleta blanca
    i18n/              diccionario, provider, hook, interruptor
  modules/
    registry.ts        aquí se registra cada módulo
    auth/              login, recuperación, useAuth, ProtectedRoute, RequireRole
    dashboard/         MainPage, useAlertStream (SSE)
    admin/             usuarios, roles, matriz de permisos, auditoría
    sensors/           lecturas y alertas de la Pi
    patients/          registro, ficha, asignación de cama y de personal a cargo
    admissions/        camas, ingresos/egresos y citas — pantalla de tres pestañas
    clinical/          expediente: notas SOAP, historia por categoría, exploración física
    search/            búsqueda global
    notifications/     bandeja de notificaciones
    monitoring/        detalle de dispositivo
    reports/           corridas del ETL y exportación de informes a CSV
```

Un módulo es dueño de `types.ts`, `api/` y `pages/`. Los módulos importan de
`auth` y `shared`; no se importan entre sí.

## Agregar un módulo

Una entrada más en [`src/modules/registry.ts`](src/modules/registry.ts):

```ts
{
  path: '/thing',
  label: 'nav.thing',        // clave del diccionario
  icon: SomeIcon,
  lazy: async () => ({
    Component: (await import('./thing/pages/ThingPage')).ThingPage,
  }),
  requiredRole: 'admin',     // opcional
}
```

El router y la barra de navegación leen el registro. Ninguno se edita. `lazy`
mantiene la página fuera del bundle inicial. Las rutas que no son entradas de
navegación van en `detailRoutes`, en el mismo archivo.

## Módulos de atención

El hospital atiende en módulos numerados: `KY-001`, `KY-004`, `KY-012`, `KY-019`.
Están tipados en [`src/modules/patients/types.ts`](src/modules/patients/types.ts),
así que un código desconocido es error de compilación.

## Seguridad

`ProtectedRoute` y `RequireRole` esconden interfaz. **No** son control de acceso:
cualquiera edita `sessionStorage` y llega a cualquier ruta. Lo que sí protege son
los endpoints — el backend revalida el permiso concreto contra `rol_permiso` en
cada petición de usuarios, roles y auditoría, y la regla "no se puede suspender
al último administrador activo" se aplica del lado del servidor, no en la
pantalla.

Pendiente todavía:

- el token está en `sessionStorage`, no en una cookie `httpOnly`
- los datos de pacientes exigen bitácora de quién consultó qué ficha
- ningún secreto debe ir jamás en una variable `VITE_*`: se empaquetan en el
  bundle y viajan al navegador

## Lo que se quitó: simulación y Power BI

Había dos pantallas, `/flexsim` y `/powerbi`, y ya no están. Sus módulos, sus
entradas de menú, sus claves del diccionario y sus dos filas del widget de
integraciones se borraron.

No fue una limpieza de código muerto: es que **ninguna de las dos cosas pasa por
el navegador**, así que una pantalla solo podía ser una maqueta.

- **La simulación** corre por lotes desde Compose (`docker compose --profile sim
  run --rm sim ...`) y escribe en la base `siappc_sim`. Ver
  [simulation/README.md](../simulation/README.md). La pantalla que había
  encolaba corridas falsas y derivaba su estado del tiempo transcurrido; los
  resultados de verdad no salen de ahí.
- **Power BI** se conecta directo a MariaDB y lee vistas: `v_dim_paciente` para
  lo clínico, y las once vistas de `siappc_sim` para la simulación. La pantalla
  que había era un marcador de posición sin token de incrustación.

Si algún día se quiere incrustar un informe en el tablero, el diseño no cambia
por haber borrado la maqueta, y sigue valiendo lo que ya se sabía: el navegador
nunca emite el token de incrustación —lo emite el servidor desde el service
principal, corto y por petición—, hay que confirmar el SKU de la organización
antes de diseñar la pantalla ("embed for your organization" exige Pro/PPU por
usuario; "embed for your customers", capacidad F/EM), y nunca se usa
publish-to-web, que es público.

## Pendientes conocidos

- `npm audit` reporta un aviso de react-router que afecta modo RSC. Esta app es
  SPA data router sin RSC, así que la ruta no es alcanzable.
