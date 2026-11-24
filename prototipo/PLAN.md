# Prototipo médico — estado y plan de trabajo

Documento de traspaso para seguir el trabajo en Claude Code. Léelo completo antes de tocar código.

## Qué es

`prototipo/` contiene las **35 pantallas de la página MEDICO** y las **4 de la página LOGIN** del Figma de
SIAPPC, convertidas a React a partir del código que genera Figma (codegen). Es una **segunda app**, aparte de
`frontend/`: las pantallas piden sus datos a `src/api/` (copias de los servicios de `frontend/`), y un simulador en el
navegador responde con los **8 pacientes de `backend/db/seed-demo.sql`**. Hoy no se conecta al backend; el interruptor
para hacerlo está listo (`.env.example`, `CONEXION-BACKEND.md`).

- Stack: React 19, Vite 7, Tailwind CSS 3.4, react-router-dom 6, TypeScript.
- Una carpeta por pantalla: `src/pages/<Nombre>/index.tsx`. Rutas en `src/App.tsx` (`/` abre el `Login`).
  Además de las de Figma hay una pantalla nueva del paso 2 (`MedDispositivoDetalle`).
- Roles (README de la raíz, "5. Entrar"): el prototipo es la aplicación del **médico**. Lo que es de Admisión
  (registrar pacientes, asignar camas, egresos) o de enfermería no aparece; ver `REVISION.md`, parte 2.1.
- Datos: `src/api/` (servicios, tipos, hooks de React Query en `queries.ts`, permisos por rol en `permisos.ts`);
  el simulador en `src/api/mock/` (rutas como las del backend, sesión, retrasos) con un archivo por paciente en
  `src/api/mock/seed/`; lo que el backend aún no tiene, en `src/api/sinBackend.ts`. `src/data/` adapta esos datos a
  las pantallas; utilidades en `src/lib/` (`patientLink.ts`: el paciente en la URL; `clinical.ts`: fechas y estados).
- Componentes compartidos en `src/components/` (se importan desde `src/components/index.ts`). Ver "Componentes" abajo.
- Íconos e imágenes exportados de Figma en `src/assets/`.
- Fuentes (Google Fonts en `index.html`): Plus Jakarta Sans (`font-jakarta`), Inter (`font-inter`), Geist (`font-geist`), definidas en `tailwind.config.js`.
  Las pantallas del médico usan Plus Jakarta Sans; las de acceso, Geist (como en Figma).
- Es **independiente de `frontend/`**, que es la app real (MUI + React Query + backend). No comparten código.

## Dónde está publicado

- URL pública: https://prototipo.melo-coton.uk (túnel de Cloudflare → `http://localhost:8082` en el servidor).
- Servidor: Oracle Linux, repo en `/opt/siappc`, rama `dev`, usuario `siappc`.
- Servicio `prototipo` en `docker-compose.yml`, en su propio perfil (el `up` normal no lo levanta).
- En el servidor, `docker-compose.prod.yml` (solo existe ahí, no está en git) fija el puerto a `127.0.0.1:8082`.
- Para actualizar después de mezclar en `dev`:

  ```bash
  cd /opt/siappc
  git pull
  docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build prototipo
  ```

## Problemas conocidos (por qué hace falta este plan)

- ~~El código salió de Figma pantalla por pantalla: menú lateral, barra superior, botones, tarjetas y tablas
  copiados en las 35 páginas~~ y ~~medidas fijas (1440×900, `h-[900px]`, columnas fijas)~~ → **resuelto en el paso 1.**
- ~~~129 botones sin acción y ~85 pestañas que no cambiaban de vista~~ → **resuelto en el paso 2** (ver `BOTONES.md`).
- ~~Sin pantallas de acceso, acciones de otros roles y textos cortados o tablas aplastadas en celular y 1024 px~~ →
  **resuelto en la revisión de acceso y roles** (ver `REVISION.md`).
- Los campos de texto de los formularios (notas, textareas, Mín/Máx, fechas) siguen siendo dibujos: quedan para el
  paso 3. Buscadores, listas desplegables, filtros, interruptores, casillas y opciones ya funcionan.

## Plan (en este orden)

0. ~~**Decisión pendiente con el equipo:** ¿la app real (`frontend/`) va a adoptar este diseño con Tailwind o se
   queda con MUI?~~ **Decidido (22 nov 2026): Tailwind.** El prototipo es la base: sus componentes
   (`src/components/`) se escriben portables (TypeScript, props `variant`/`size`/`tone`, colores como tokens, sin
   clases sueltas de Figma) para pasarlos a `frontend/` más adelante.
1. ~~**Componentes compartidos + diseño adaptable.**~~ **Hecho (rama `feature/prototipo-componentes`).**
   Las 35 pantallas usan `AppLayout` (o `PatientLayout` en las 18 del expediente) y los componentes base; los
   colores son tokens en `tailwind.config.js`. Se verificó con capturas a 1440 (comparadas contra las originales),
   1024, 768 y 390 px: ninguna pantalla se sale de lado. Decisiones tomadas para que todo sea igual:
   - Menú de 240 px en todas; el usuario del pie es siempre "Dr. Carlos Méndez · Médico Intensivista".
   - Opción marcada del menú según la ruta: `MedPaciente*` → Pacientes, `MedMonitoreo*` → Monitoreo,
     `MedTurno*` → Reportes; Notificaciones, Búsqueda, Ayuda y Perfil no marcan ninguna.
   - Barra superior de 72 px en todas (el Dashboard tenía una de 56 px sin título; ahora es "Dashboard Principal").
     Las pantallas del paciente llevan "Volver" a la derecha.
   - Cabecera del paciente única: María González · Crítico · Cama C-03 · ID PT-8821 (desde el paso 4, el paciente
     de la URL).
   - Texto en Plus Jakarta Sans (Figma mezclaba Geist e Inter en algunas pantallas).
   - Contenido con 32 px de margen en todas (algunas tenían 16 o 24).
   - Se corrigieron errores del código generado: textos que eran imágenes (Reportes), signos vitales encimados y
     botón "Guardar" encima del contenido (Exploración física), botones de 100 px de alto (Detalle SOAP), tarjetas
     cortadas al final de la pantalla (Resumen, Reportes, Monitoreo detallado).
   - Las gráficas de líneas se redibujan con `LineChart` (SVG) a partir de los puntos de Figma para que se estiren.
   - Ya funcionan como enlace: "Nueva Nota SOAP" (cabecera del paciente), pestañas del paciente, pestañas
     Nueva entrega/Historial de turno y Grid/Lista de monitoreo, porque son parte de componentes compartidos.
2. ~~**Clicable.**~~ **Hecho (rama `feature/prototipo-clicable`).** Nada que se pueda tocar se queda sin hacer
   algo. El inventario completo (antes / ahora, elemento por elemento) está en `BOTONES.md`. Resumen:
   - Cada elemento lleva a una pantalla, abre un modal o menú, abre sus opciones y filtra los datos de ejemplo,
     cambia algo en la misma pantalla (marcar, silenciar, ordenar, plegar, paginar) o muestra un aviso corto.
   - Componentes nuevos: `Select` (lista desplegable real, varias variantes con el dibujo de Figma), `Popover`,
     `Menu`, `ToastProvider`/`useToast`, `ConfirmDialog`, `ModalHeader`, `DocumentPreview`, `EmptyState`,
     `useRowLink`/`rowButton` (filas tocables), `AssignBedModal` (se quitó en la revisión) y `UploadDocumentModal`. `Modal` se cierra con X,
     Escape o el fondo; `BackButton` acepta `to`.
   - Un solo paciente de ejemplo (hasta el paso 4): todo expediente abre las pantallas de María González. Se agregaron datos de ejemplo
     solo donde la paginación o los filtros los necesitan (12 monitores, 12 pacientes, 18 reportes, 24 entregas…).
   - El estado es local y se pierde al recargar; lo que cruza de pantalla viaja en la navegación (alerta atendida,
     entrega de turno confirmada, diagnóstico registrado, nota SOAP elegida con `?nota=`, monitor con `?cama=`).
   - Pantallas nuevas (no vienen de Figma, lo dice un comentario al inicio): **Registro de Paciente**
     (`MedPacienteNuevo`, se quitó en la revisión porque es de Admisión) y **Detalle de Monitor**
     (`MedDispositivoDetalle`), adaptables a celular.
   - `/` abre el Dashboard; el logo del menú lleva al Dashboard; cerrar sesión pide confirmación.
   - Verificado: `npm run build` pasa; las 35 pantallas de Figma se ven igual a 1440 px (comparadas píxel a píxel
     con las del paso 1); las nuevas no se salen de lado a 390, 768 y 1024 px; pruebas automáticas de filtros,
     menús, modales, avisos y navegación con estado.
2b. ~~**Acceso y revisión.**~~ **Hecho (rama `feature/prototipo-login-revision`).** Detalle y decisiones en `REVISION.md`:
   - **Pantallas de acceso** (página LOGIN de Figma): `Login` (`/` y `/Login`), `LoginMfa`, `RecuperarContrasena`
     y `RecuperacionEnviada`, con un layout común (`AuthLayout`: barra con ES/EN/DE, fondo de puntos, barra de
     estado y pie) y una tarjeta común (`AuthCard`). Flujo: Entrar → código de 6 dígitos → Dashboard; ¿Olvidó su
     contraseña? → Recuperar → Revisa tu correo → Login; "Cerrar sesión" → Login. Campos y código reales; cualquier
     dato sirve. ES/EN/DE traducen las cuatro pantallas. Se unificaron las inconsistencias de Figma (15 minutos,
     `@institucion.org`, un solo "Volver al inicio de sesión", la tarjeta, la barra y el campo del Login en todas);
     a 1440 el Login se ve igual a su captura.
   - **Roles:** se quitaron "Nuevo Paciente" y la pantalla Registro de Paciente, "Asignar paciente" en la cama libre
     y "Guardar cambios" de Datos Personales; "Dar de alta" pasó a "Indicar alta médica", "Programar calibración" a
     "Solicitar calibración"; Reportes solo genera reportes clínicos; "Gestión de Pacientes" se llama "Mis Pacientes".
   - **Visual:** títulos en dos líneas y ruta corta en celular; tablas y pestañas con sombra cuando hay más a la
     derecha; columnas que ya no se aplastan; cabecera del paciente ordenada; arreglos por pantalla a 1024 px
     (Datos Personales, Exploración, Umbrales, Comparativa, CIE-10); "Atender", selector de periodo, la X de las
     ventanas y la paginación iguales en todas; la confirmación de atención se abre sobre la pantalla de origen.
   - Verificado: `npm run build`; capturas a 1440 comparadas con las del paso 2 (solo cambia lo aprobado); revisión
     automática a 1440, 1024, 768 y 390; pruebas de interacción del acceso y de los roles.
3. ~~**Formularios.**~~ **Hecho (rama `feature/prototipo-formularios`).** Detalle y reglas en `REVISION.md`, "Paso 3":
   - Todos los campos que eran dibujos se pueden escribir y se validan, sin backend: Nueva nota SOAP (con "Guardar
     borrador" y "Guardar y firmar"), Confirmación de atención, Entrega de turno, Umbrales Mín/Máx, Registro de
     diagnóstico (CIE-10 buscando por código o texto), Nota de ingreso, Exploración física, nota correlativa de
     Diagnósticos, observaciones del Interrogatorio, medicamento libre en Indicaciones, contraseña y código MFA en
     Mi Perfil y el mensaje de Ayuda. Datos Personales y los datos de admisión siguen de solo lectura (rol).
   - Componentes nuevos en `src/components/form/`: `TextArea` (reproduce cada dibujo de Figma), `NumberField`,
     `DateField`, `Combobox`, `FieldError` y `useValidation`; reglas en `src/lib/validate.ts` (largos, rangos de
     signos vitales, presión "120/80", fechas, contraseña).
   - Errores al salir del campo o al guardar; con errores no se guarda y el cursor va al primero. Lo guardado vive
     en memoria hasta recargar (notas SOAP nuevas, umbrales, borrador de entrega, nota de ingreso, exploración).
   - A 1440 px solo cambian los tres puntos aprobados (botones de la nota SOAP, "Nota firmada" en el detalle,
     "+ Agregar indicación"); el CIE-10 elegido ya no se corta a 390 px.
   - Verificado: `npm run build`; capturas a 1440 comparadas con las de antes del paso; pruebas automáticas de cada
     formulario (errores, rangos, Mín < Máx, búsqueda CIE-10, borrador y firma de la nota SOAP).
4. **Pacientes del seed, capa `src/api/` e IA.** *En curso.* Propuesta aprobada en `REVISION-IA.md`, en tres PRs:
   - ~~**PR 1 — Cerrar sesión.**~~ **Hecho (rama `feature/prototipo-cerrar-sesion`).** El diálogo no se veía a 1440
     ni a 1024 (quedaba dentro del menú `sticky` y la pantalla lo tapaba). Ahora `Modal` se dibuja en `body` (portal),
     hay una escala de capas en `tailwind.config.js` (`z-drawer`, `z-modal`, `z-popover`, `z-toast`), la confirmación
     la dibuja `AppLayout` (en celular cierra el menú antes) y el cierre vive en `useLogout()`. Verificado con capturas
     a 1440, 1024 y 390 (`docs/revision-ia/`), pruebas de Cancelar, Escape y confirmar, y las 40 pantallas iguales a
     1440.
   - ~~**PR 2 — Los 8 pacientes del seed y la capa `src/api/`.**~~ **Hecho (rama `feature/prototipo-pacientes-ia`).**
     Detalle y desviaciones en `REVISION-IA.md`, sección 9:
     - Ya no hay María González ni datos escritos en las pantallas: todo sale de `src/api/` con los 8 pacientes del
       seed (DEMO-0001…0008) tal cual; lo inventado lleva "no viene del seed" en el código.
     - El paciente va en la URL (`?paciente=DEMO-0005`) y sobrevive a recargar; sin él se abre DEMO-0002 y una
       cédula que no existe muestra "Paciente no encontrado". Iniciales en lugar de foto; "Atención" en vez de
       "Monitoreo"; selector de unidad (`?unidad=`) en la central de monitoreo; alertas agrupadas.
     - Sesión por rol: el simulador entra solo como el médico; tras cerrar sesión las pantallas mandan al Login
       (también con Atrás). Con `enfermero@institucion.org` no se ve "Nueva Nota SOAP".
     - Lo escrito (notas SOAP, diagnósticos, umbrales, borradores) se guarda en la pestaña del navegador
       (`sessionStorage`) y sobrevive a recargar. `?retraso=0` quita las esperas simuladas; `?sesion=vencida` prueba
       el 401.
     - Verificado: `npm run build`; capturas a 1440 comparadas con la línea base (cambia el contenido, no la
       estructura); revisión automática a 1440, 1024, 768 y 390; pruebas automáticas de las 8 fichas en sus 18
       pantallas, recarga, cédula inexistente, listas con los 8, cerrar sesión y entrar como enfermero.
   - **PR 3 — Módulos de IA** (consulta libre y análisis automático).
5. **Conectar con el backend.** Plan en `CONEXION-BACKEND.md`: el prototipo sigue como segunda app, aparte de
   `frontend/`, y se conecta por grupos de rutas.

## Componentes (`src/components/`)

| Componente | Para qué |
|---|---|
| `AppLayout`, `PageBody` | Estructura de toda pantalla: menú + barra superior + contenido. Menú fijo desde 1024 px, plegable abajo de eso. |
| `AuthLayout`, `AuthCard`, `AuthField`, `AuthButton`, `AuthBackLink`, `useAuthText`, `useCountdown` | Pantallas de acceso: layout, tarjeta, campo y botón del login, enlace de volver, textos ES/EN/DE y contador de "Reenviar". |
| `Sidebar`, `TopBar`, `TopBarDate`, `NotificationBell` | Partes del layout (la lista del menú y su regla de marcado están en `layout/nav.ts`). |
| `PatientLayout`, `PatientHeader`, `PatientTabs`, `SoapSections` | Pantallas del expediente del paciente. |
| `Button`, `BackButton` | Botones: `primary`, `secondary`, `outline`, `soft`, `ghost`, `danger`, `warning`, `success`, `link`; tamaños `sm`/`md`/`lg`; con `to` es enlace. |
| `Card`, `CardHeader`, `CardTitle`, `Divider` | Tarjetas blancas con borde y la línea divisoria de Figma. |
| `Badge`, `KpiCard` | Etiquetas de estado (`tone`) e indicadores. |
| `Tabs`, `SegmentedControl` | Pestañas (subrayado o `pills`) y grupos tipo Grid/Lista. |
| `Table`, `Pagination` | Tablas con desplazamiento lateral propio (con sombra en el borde cuando hay más columnas) y paginación con números. |
| `ScrollShadows`, `useScrollEdges` | Sombras de borde para cualquier contenedor que se desplaza de lado (las usan `Table` y `Tabs`). |
| `Input`, `SearchBox`, `InfoField` | Campo de una línea (con `error`), buscador y dato de solo lectura. |
| `TextArea`, `NumberField`, `DateField`, `Combobox` | Campos de formulario (`src/components/form/`): texto largo que crece y reproduce el dibujo de Figma, número con rango (caja o en línea), fecha "02 Ago 2026" con el calendario del navegador y lista en la que se escribe para buscar. |
| `useValidation`, `FieldError`, `focusFirst`, `errorProps` | Errores de formulario: cuándo mostrarlos, mensaje bajo el campo, foco en el primero y atributos de accesibilidad. |
| `Select` | Lista desplegable con `options`/`value`/`onChange`. Variantes con el dibujo de cada filtro de Figma: `field`, `stacked`, `chip`, `soft`, `button`, `input`, `input-plain`, `compact`. |
| `Popover`, `Menu` | Panel flotante (no lo cortan las tablas con desplazamiento) y menú de acciones "•••". |
| `Modal`, `ModalHeader`, `CloseButton`, `ConfirmDialog`, `DocumentPreview` | Ventanas emergentes (se dibujan en `body` y se cierran con X, Escape o el fondo; la X es `CloseButton` en todas), confirmación corta y vista previa de documentos. |
| `useLogout`, `LogoutDialog` | Cierre de sesión en un solo lugar y su confirmación (la dibuja `AppLayout`). |
| `ToastProvider`, `useToast` | Avisos cortos que sobreviven al cambio de pantalla. |
| `EmptyState` | "Sin resultados con estos filtros" + Quitar filtros. |
| `useRowLink`, `rowButton`, `rowLinkClass` | Filas de tabla que llevan a otra pantalla o abren algo (mouse y Enter). |
| `UploadDocumentModal` | Subir documento (archivo de ejemplo). |
| `LineChart` | Gráficas de líneas con los puntos de Figma que se estiran al ancho. |
| `icons.tsx` | Íconos de Lucide (los mismos trazos que exportó Figma) que toman el color del texto. |

Reglas al usarlos: los colores van con tokens (`text-muted`, `bg-primary-soft`…), `leading-[normal]` (no
`leading-normal`, que en Tailwind es 1.5) y `className` en componentes solo para ancho/márgenes (no hay
`tailwind-merge`, así que dos clases del mismo tipo chocan).

## Reglas

- Solo tocar `prototipo/` en los pasos 1–3. No modificar `frontend/`, `backend/` ni el resto del repo.
- Ramas y PRs según `BRANCHING.md` (ej. `feature/prototipo-componentes`), PR hacia `dev`.
- `npm run build` dentro de `prototipo/` tiene que pasar antes de cada commit.
- No subir `backend/db/demo.sql` (archivo local sin revisar).

## Fuente en Figma

Archivo `GwGOudaXL4tlIjddTkI6be` (SIAPPC), página MEDICO (`0:1`). Para comparar una pantalla con su diseño
original, usa el nodo de la tabla (con el conector de Figma, si está disponible).

| Página (`src/pages/…`) | Marco en Figma | Nodo |
|---|---|---|
| `MedAlertasCentro` | `med/alertas/centro` | `48:7` |
| `MedAlertasConfirmacionAtencion` | `med/alertas/confirmacion-atencion` | `245:631` |
| `MedAyudaSoporte` | `med/ayuda/soporte` | `331:1578` |
| `MedBusquedaGlobal` | `med/busqueda/global` | `245:498` |
| `MedDashboardPrincipal` | `med/dashboard/principal` | `245:22` |
| `MedDispositivosMonitores` | `med-dispositivos-monitores` | `265:4` |
| `MedMonitoreoComparativa` | `med/monitoreo/comparativa` | `245:895` |
| `MedMonitoreoGridUci` | `med/monitoreo/grid-uci` | `45:984` |
| `MedMonitoreoListaUci` | `med/monitoreo/lista-uci` | `127:11` |
| `MedNotificacionesCentro` | `med-notificaciones-centro` | `333:4` |
| `MedPacienteAntecedentes` | `med/paciente/antecedentes` | `183:421` |
| `MedPacienteConfigUmbrales` | `med/paciente/config-umbrales` | `140:259` |
| `MedPacienteDatosPersonales` | `med/paciente/datos-personales` | `191:17` |
| `MedPacienteDiagnosticosActivos` | `med/paciente/diagnosticos-activos` | `191:230` |
| `MedPacienteDocumentosClinicos` | `med/paciente/documentos-clinicos` | `191:553` |
| `MedPacienteExploracionFisica` | `med/paciente/exploracion-fisica` | `183:234` |
| `MedPacienteHistoriaClinicaGeneral` | `med/paciente/historia-clinica-general` | `45:505` |
| `MedPacienteHistorialHospitalizaciones` | `med/paciente/historial-hospitalizaciones` | `191:397` |
| `MedPacienteIndicacionesMedicas` | `med/paciente/indicaciones-medicas` | `183:782` |
| `MedPacienteInterrogatorioAparatos` | `med/paciente/interrogatorio-aparatos` | `183:6` |
| `MedPacienteMonitoreoDetallado` | `med/paciente/monitoreo-detallado` | `6:267` |
| `MedPacienteNotaIngreso` | `med/paciente/nota-ingreso` | `183:603` |
| `MedPacienteNotasSoapDetalle` | `med/paciente/notas-soap-detalle` | `217:211` |
| `MedPacienteNotasSoapHistorial` | `med/paciente/notas-soap-historial` | `29:1308` |
| `MedPacienteNotasSoapNueva` | `med/paciente/notas-soap-nueva` | `29:1881` |
| `MedPacienteRegistroDiagnostico` | `med/paciente/registro-diagnostico` | `140:499` |
| `MedPacienteResumen` | `med/paciente/resumen` | `100:256` |
| `MedPacienteTendenciasVitales` | `med/paciente/tendencias-vitales` | `140:6` |
| `MedPacientesLista` | `med/pacientes/lista` | `45:79` |
| `MedPerfilMiPerfil` | `med/perfil/mi-perfil` | `137:9` |
| `MedReportesPanel` | `med/reportes/panel` | `48:241` |
| `MedTurnoEntregaHandoff` | `med/turno/entrega-handoff` | `137:356` |
| `MedTurnoHistorial` | `med-turno-historial` | `259:15` |
| `MedTurnoResumenRecibido` | `med/turno/resumen-recibido` | `245:729` |
| `Notificaciones` | `notificaciones` | `48:447` |
| `MedDispositivoDetalle` | — (pantalla nueva del paso 2) | — |
| `Login` | `siappc-login` (página LOGIN, `344:2`) | `345:1264` |
| `LoginMfa` | `SIAPPC - MFA` | `345:426` |
| `RecuperarContrasena` | `SIAPPC - Recovery` | `345:849` |
| `RecuperacionEnviada` | `siappc-recovery-confirmation` | `345:19` |
