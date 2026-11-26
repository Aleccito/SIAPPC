# SIAPPC · Prototipo (segunda app)

La interfaz nueva de SIAPPC, en React + Tailwind, hecha desde el diseño de Figma: el módulo del médico y las
pantallas de acceso. Es una **segunda app**, aparte de `frontend/` y sin código compartido, sobre el mismo backend y la
misma base. La meta es que reemplace a `frontend/` ([hoja de ruta](../docs/PROYECTO-FUTURO.md)).

| Sitio | Qué es |
|---|---|
| https://prototipo.melo-coton.uk | Este prototipo, conectado al backend real |
| https://siappc.melo-coton.uk | La app principal (`frontend/`), con admisión, sensores y administración |

## Correrlo

El origen de los datos lo decide `VITE_API_MODE`:

| Modo | De dónde salen los datos |
|---|---|
| `mock` | Todo simulado en el navegador, sin backend. Es el de `npm run dev` sin `.env.local` |
| `mixto` | Solo lo que diga `VITE_API_REAL` va al backend; el resto sigue simulado. Acepta grupos (`auth,patients`) o rutas (`dashboard/assigned-patients`) |
| `real` | Todo va al backend por `/api`. Es lo publicado |

**En tu PC:**

```bash
cd prototipo
npm install
npm run dev
```

- Se abre en http://localhost:5173.
- Para usar el backend local (el del Compose, en http://localhost:3001):
  - Copia `.env.example` a `.env.local`.
  - Pon `VITE_API_MODE=real`, o `mixto` con `VITE_API_REAL`.
  - Vite reenvía `/api` al backend (`vite.config.ts`).

**Con Docker**, desde la raíz:

```bash
docker compose up -d --build prototipo
```

- Queda en http://localhost:8082 (lo cambia `PROTOTIPO_PORT`).
- Va en su propio perfil: `docker compose up -d --build` sin nombrarlo no lo levanta.
- El modo se fija al construir, con `PROTOTIPO_API_MODE` y `PROTOTIPO_API_REAL` en el `.env` de la raíz. Por defecto
  es `real`, y su nginx reenvía `/api` al backend.
- Si el backend no está, las pantallas cargan igual y solo `/api` responde 502.

**Para probar estados en `mock`:**
- `?retraso=0` quita la espera.
- `?sesion=vencida` hace que la siguiente petición responda 401.
- `?ia=lenta`, `caida`, `corte` o `sin-analisis` prueban la IA; `?ia=normal` vuelve a lo normal.

## Cuentas de prueba

Son las cuatro del seed, una por rol. Las contraseñas están en el
[README de la raíz, "5. Entrar"](../README.md#5-entrar). Después de la contraseña se pide un código: mientras el
backend no tenga MFA, es **000000**.

| Cuenta | Qué ve en el prototipo |
|---|---|
| `medico@institucion.org` | Todo lo clínico. Es el único que firma notas y usa la IA |
| `enfermero@institucion.org` | El expediente en solo lectura, sin IA |
| `administrativo@institucion.org` | Monitoreo, alertas, dispositivos y reportes, sin abrir el expediente |
| `admin@institucion.org` | Nada clínico: entra a Mi Perfil |

En `mock` sirve cualquier contraseña (las cuentas del seed entran con su rol) y el código también es 000000. Si se entra
directo a una pantalla, se abre sesión como el médico. El paciente va en la URL: `/MedPacienteResumen?paciente=DEMO-0005`.

## Estructura

| Carpeta | Qué tiene |
|---|---|
| `src/pages/` | Una carpeta por pantalla. El nombre es la ruta (`/MedPacienteResumen`) |
| `src/components/` | Lo compartido: menú y barra (`layout/`), acceso y sesión (`auth/`), fichas del paciente (`patient/`), monitor y ECG (`monitor/`), IA (`ai/`), formularios (`form/`), piezas (`ui/`) e íconos SVG (`icons.tsx`) |
| `src/api/` | La capa de datos. Un archivo por área, el cliente HTTP (`http.ts`), el modo (`mode.ts`) y las consultas de React Query (`queries.ts`) |
| `src/api/mock/` | El simulador del modo `mock`: responde las mismas rutas que el backend, con los 8 pacientes de `backend/db/seed-demo.sql` |
| `src/api/sinBackend.ts` | Lo que el backend todavía no tiene, marcado `SIMULADO`. `simulacion.ts` hace que cambie con el tiempo |
| `src/data/` | Lo que arman las listas a partir de la capa de datos: pacientes con sus alertas, monitores, avisos y notas |
| `src/lib/` | Funciones sin pantalla: cálculos clínicos, alertas, ECG, impresión, validación y textos |
| `src/assets/` | Las imágenes de Figma que se usan |
| `tools/base/` | Scripts de la base de demo (`base.sh revisar` o `cargar`), que corren dentro del contenedor de MariaDB |
| `tools/telemetria-demo/` | El publicador de demo, que hace de los monitores por MQTT ([LEEME](tools/telemetria-demo/LEEME.md)) |
| `docs/` | Los documentos (ver el índice) |

## Qué es real y qué sigue simulado

**Viene del backend:**
- login, sesión y permisos por rol;
- los pacientes y su expediente: diagnósticos, antecedentes, alergias, medicamentos y la ficha de los documentos;
- notas SOAP, con firma y adenda;
- la búsqueda;
- la central de monitoreo;
- FC, SpO2, FR y temperatura del monitor, y el ECG en vivo;
- las alertas en vivo, la campana y los dispositivos;
- los informes del ETL y el CSV;
- la IA, que corre en el servidor y solo la usan los médicos.

**Sigue simulado** (en `src/api/sinBackend.ts`). No son números fijos: cambian con el tiempo.
- la presión arterial;
- la temperatura sin monitor;
- los datos personales y los signos de ingreso;
- los paneles del monitoreo detallado;
- la nota de ingreso y el interrogatorio;
- las indicaciones que no son fármacos;
- la entrega de turno;
- los umbrales por paciente;
- los reportes por paciente;
- la batería y las calibraciones de los equipos.

Lo que se edita de esto se guarda en el navegador, y el aviso de la pantalla lo dice.

Los monitores son de demo: 15 asignados y 5 libres, que mueve el publicador. Qué falta en el backend para cada cosa
simulada: [docs/CONEXION-BACKEND.md](docs/CONEXION-BACKEND.md), sección 11.2.

## Despliegue y servidor

Al mezclar en `dev`, GitHub Actions despliega solo en el servidor. Lo demás se corre a mano, como `siappc` en
`/opt/siappc`, un comando por bloque.

1. **Si el despliegue no reconstruyó el prototipo:**

   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build prototipo
   ```

2. **Datos de demo.** `revisar` solo lee. `cargar` agrega lo que falte y se puede repetir.
   - ⚠️ `cargar` cambia la base del servidor, que también usa la app principal: avisa antes.
   - El primer comando borra la copia anterior dentro del contenedor (no toca la base). Se copia con `/.` porque,
     sin eso, Docker mete la carpeta dentro de la anterior y `base.sh` corre scripts viejos.

   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml exec mariadb rm -rf /tmp/db /tmp/base
   docker compose -f docker-compose.yml -f docker-compose.prod.yml cp backend/db/. mariadb:/tmp/db
   docker compose -f docker-compose.yml -f docker-compose.prod.yml cp prototipo/tools/base/. mariadb:/tmp/base
   docker compose -f docker-compose.yml -f docker-compose.prod.yml exec mariadb sh /tmp/base/base.sh revisar
   ```

   Si falta algo, el último comando se corre otra vez con `cargar` en lugar de `revisar`.

3. **El publicador de demo.** Tiene que correr **uno solo, el de `prototipo/tools/telemetria-demo/`**.
   - `tools/telemetria-demo/` de la raíz es una copia anterior. Si corren los dos, las lecturas y las alertas salen
     duplicadas.
   - Se corre solo con las variables de MQTT y con `PERIODO_S=60`.

   ```bash
   docker build -t siappc-telemetria-demo prototipo/tools/telemetria-demo
   docker stop siappc-telemetria-demo && docker rm siappc-telemetria-demo
   docker run -d --name siappc-telemetria-demo --restart unless-stopped --network siappc_default --env-file <(grep -E '^MQTT_(USER|PASSWORD)=' .env) -e PERIODO_S=60 -v "$PWD/infra/mosquitto/certs/ca.crt:/certs/ca.crt:ro" siappc-telemetria-demo
   ```

   Para comprobar que corre uno solo, este comando debe dar una sola línea:

   ```bash
   docker ps --format '{{.Names}} {{.Image}}' | grep -i telemetria
   ```

   - La historia de 24 h para las tendencias se carga una sola vez, con la base nueva (`--historia 24h --una-vez`,
     en su [LEEME](tools/telemetria-demo/LEEME.md)).

4. **La IA:** el backend apunta al Ollama del servidor, con `LLM_URL` y `LLM_MODEL` en el `.env`.

## Documentos

En los documentos, las rutas entre comillas (`src/...`, `docs/...`) son desde `prototipo/`.

| Documento | Qué tiene |
|---|---|
| [docs/CONEXION-BACKEND.md](docs/CONEXION-BACKEND.md) | Cómo se conectó con el backend, qué es real y los pedidos al backend |
| [docs/BOTONES.md](docs/BOTONES.md) | Qué hace cada botón y enlace, pantalla por pantalla |
| [tools/telemetria-demo/LEEME.md](tools/telemetria-demo/LEEME.md) | El publicador de demo: qué manda y opciones |
| [docs/historial/](docs/historial/) | Los informes de cada paso, ya cerrados |
| [../docs/PROYECTO-FUTURO.md](../docs/PROYECTO-FUTURO.md) | Hoja de ruta de todo el proyecto |

Los informes del historial son estos:
- `PLAN.md`: el plan por pasos y cómo terminó cada uno.
- `REVISION.md`: las pantallas de acceso, lo que no le toca al médico y las reglas de los formularios.
- `REVISION-IA.md`: los 8 pacientes, la capa `src/api/`, dónde va la IA y cerrar sesión.
- `REVISION-MEDICO.md`: el recorrido como médico contra el backend real y lo que se arregló.
- `REVISION-IA-RESPUESTAS.md`: la calidad de las respuestas de la IA, antes y después. Los textos y datos del set de
  prueba están en `ia-respuestas/`.
- `REVISION-DETALLES.md`: columnas, íconos, admisión con monitor, alergias y la IA de pronóstico.
- `REVISION-TABLAS-Y-VOLVER.md`: tablas que se encimaban, "Volver", la miga de pan con enlaces, el cursor y la central
  por unidades (con "Todas").

Las capturas de los informes se quitaron del repositorio. Siguen en el historial de git, en el commit c314f64.

## Estado y pendientes

- Publicado y conectado al backend real. Lo que el backend todavía no tiene son los pedidos 1 a 38 de
  [docs/CONEXION-BACKEND.md](docs/CONEXION-BACKEND.md), en las secciones 7, 9.5, 11.6, 12.3 y 13.3. Los que más se
  notan:
  - la presión arterial como lectura (10);
  - la entrega de turno (11);
  - el MFA (17);
  - no repetir alertas (28).
- La IA de pronóstico quedó detenida a pedido, con lo hecho y lo que falta en
  [docs/historial/REVISION-DETALLES.md](docs/historial/REVISION-DETALLES.md) (A5).
- Sin verificar: capturas a 1024 y 390 px después de la ronda de detalles (el mismo informe, 8.4).
- Lo que sigue para todo el proyecto: [PROYECTO-FUTURO.md](../docs/PROYECTO-FUTURO.md).
