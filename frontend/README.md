# CHAMBAFINAL

Sistema modular para optimizar la atención al paciente: simulación hospitalaria,
seguimiento de pacientes y reportes.

La fase 1 es solo frontend. Cada llamada al servidor es una implementación falsa
con la firma real, así que la fase 2 reemplaza cuerpos de funciones, no pantallas.

## Stack

| Capa | Elección |
|---|---|
| Build | Vite |
| UI | React 19 + TypeScript |
| Componentes | MUI + `@mui/icons-material` |
| Rutas | React Router (SPA data router) |
| Estado del servidor | TanStack Query |

Paleta blanca en [`src/shared/theme.ts`](src/shared/theme.ts).

## Ejecutar

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run lint
```

## Iniciar sesión

La fase 1 acepta cualquier correo y contraseña. El rol sale del correo: si
contiene `admin` entra como administrador, cualquier otro como usuario.

- `admin@plant.local` — ve todos los módulos, incluido Usuarios
- `lucia@plant.local` — sin Usuarios, y `/admin/users` lo redirige

La sesión vive en `sessionStorage` y muere con la pestaña.

## Idioma

Español por defecto, con interruptor `EN`/`ES` en la barra superior y en el login.
La elección se guarda en `localStorage` y actualiza `<html lang>`.

Todo el texto vive en [`src/shared/i18n/dictionary.ts`](src/shared/i18n/dictionary.ts).
El diccionario inglés está tipado contra el español, así que una traducción
faltante rompe la compilación en vez de fallar en silencio.

## Estructura

```
src/
  app/                 App.tsx (providers), router.tsx, AppLayout.tsx
  shared/
    theme.ts           paleta blanca
    i18n/              diccionario, provider, hook, interruptor
  modules/
    registry.ts        aquí se registra cada módulo
    auth/              tipos, useAuth, authContext, AuthProvider,
                       ProtectedRoute, RequireRole, LoginPage
    dashboard/         MainPage
    powerbi/           placeholder de incrustación
    flexsim/           encolar corrida, sondear estado, leer resultados
    patients/          registro, ficha y filtro por módulo de atención
    reports/           lista de reportes
    admin/             UsersPage (asignación de roles)
```

Un módulo es dueño de `types.ts`, `api/` y `pages/`. Los módulos importan de
`auth` y `shared`; no se importan entre sí.

## Módulos de atención

El hospital atiende en módulos numerados: `KY-001`, `KY-004`, `KY-012`, `KY-019`.
Están tipados en [`src/modules/patients/types.ts`](src/modules/patients/types.ts),
así que un código desconocido es error de compilación.

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

El router y la barra de navegación leen el registro. Ninguno se edita.
`lazy` mantiene la página fuera del bundle inicial.

## Puntos de reemplazo para la fase 2

Cada API falsa lleva un comentario `PHASE 2:` en la línea exacta.

| Archivo | Se convierte en |
|---|---|
| `modules/auth/api/authApi.ts` | login real; el rol viene del servidor |
| `modules/admin/api/usersApi.ts` | `GET/PATCH /api/admin/users` |
| `modules/powerbi/api/powerbiApi.ts` | `GET /api/powerbi/embed-token` |
| `modules/flexsim/api/flexsimApi.ts` | `POST/GET /api/flexsim/runs` |
| `modules/patients/api/patientsApi.ts` | `GET/POST /api/patients` |
| `modules/reports/api/reportsApi.ts` | `GET /api/reports` |

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

## Seguridad

`ProtectedRoute` y `RequireRole` esconden interfaz. **No** son control de acceso:
cualquiera edita `sessionStorage` y llega a cualquier ruta. Aceptable mientras
los datos son fixtures, deja de serlo con un servidor real. En la fase 2:

- todo endpoint `/api/admin/*` revalida el rol en el servidor, leído de la
  sesión, nunca de lo que manda el cliente
- los datos de pacientes exigen control de acceso real y bitácora de quién
  consultó qué ficha
- la regla "el último admin no puede degradarse" es un invariante de datos y
  también se aplica en el servidor
- el token de sesión pasa a una cookie httpOnly
- ningún secreto va en una variable `VITE_*`; esas se empaquetan y viajan al
  navegador

## Pendientes conocidos

- El sondeo de FlexSim se pausa con la pestaña oculta (comportamiento de
  TanStack Query). Usar `refetchIntervalInBackground: true` si corre en pantalla
  de pared.
- Los fixtures de Reportes y los modelos de FlexSim siguen en lenguaje de
  fábrica (`line-a.fsm`, "Downtime by station"), no de hospital.
- `npm audit` reporta un aviso de react-router que afecta modo RSC. Esta app es
  SPA data router sin RSC, así que la ruta no es alcanzable.
