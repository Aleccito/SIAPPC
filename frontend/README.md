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
| Pacientes (`/patients`) | **Simulado** | La API ya existe (`GET/POST /patients`); falta cambiar `patientsApi.ts` |
| Reportes (`/reports`) | **Simulado** | Fixtures en el navegador, sin endpoint |
| FlexSim (`/flexsim`) | **Simulado** | Estado derivado del tiempo transcurrido |
| Power BI (`/powerbi`) | **Simulado** | Placeholder, sin token de incrustación |
| Recuperar contraseña | **Simulado** | `passwordResetApi.ts` no llama a nada |
| Panel principal (`/`) | **Simulado** | Tres tarjetas de texto, sin datos |

Cada API simulada lleva un comentario `PHASE 2:` en la línea exacta que hay que
reemplazar. Las reales pasan todas por
[`src/shared/api/http.ts`](src/shared/api/http.ts), que agrega el token y
normaliza los errores del backend.

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

Español por defecto, con interruptor `EN`/`ES` en la barra superior y en el
login. La elección se guarda en `localStorage` y actualiza `<html lang>`.

Todo el texto vive en [`src/shared/i18n/dictionary.ts`](src/shared/i18n/dictionary.ts).
El diccionario inglés está tipado contra el español, así que una traducción
faltante rompe la compilación en vez de fallar en silencio.

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
    dashboard/         MainPage
    admin/             usuarios, roles, matriz de permisos, auditoría
    sensors/           lecturas y alertas de la Pi
    patients/          registro, ficha y filtro por módulo de atención
    reports/           lista de reportes
    flexsim/           encolar corrida, sondear estado, leer resultados
    powerbi/           placeholder de incrustación
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

### Power BI

El navegador nunca emite un token de incrustación. El servidor guarda el service
principal y entrega un token corto por petición. Confirmar qué SKU tiene la
organización antes de diseñar la pantalla: "embed for your organization" exige
licencia Pro/PPU por usuario, "embed for your customers" exige capacidad F/EM.
Nunca usar publish-to-web; es público.

### FlexSim

FlexSim es una aplicación de escritorio de Windows sin API web. Nunca se llama
desde el navegador. El servidor encola un trabajo, corre FlexSim headless por
CLI, y FlexSim escribe resultados en MariaDB por ODBC. La interfaz encola
corridas y sondea el estado. La simulación es batch asíncrono, siempre.

Los nombres de modelo que manda el cliente se validan en el servidor antes de
llegar a una invocación por CLI.

## Pendientes conocidos

- La tarjeta "Datos" del panel principal todavía dice que MariaDB llega en la
  fase 2 (`dashboard.data.body` en el diccionario). Ya llegó; falta reescribir
  ese texto.
- El sondeo de FlexSim se pausa con la pestaña oculta (comportamiento de TanStack
  Query). Usar `refetchIntervalInBackground: true` si corre en pantalla de pared.
- Los fixtures de Reportes y los modelos de FlexSim siguen en lenguaje de fábrica
  (`line-a.fsm`, "Downtime by station"), no de hospital.
- `npm audit` reporta un aviso de react-router que afecta modo RSC. Esta app es
  SPA data router sin RSC, así que la ruta no es alcanzable.
