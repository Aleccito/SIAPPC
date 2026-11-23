# Prototipo médico — estado y plan de trabajo

Documento de traspaso para seguir el trabajo en Claude Code. Léelo completo antes de tocar código.

## Qué es

`prototipo/` contiene las **35 pantallas de la página MEDICO** del Figma de SIAPPC, convertidas a
React a partir del código que genera Figma (codegen). Es un **prototipo visual con datos de ejemplo
escritos en las pantallas**; no se conecta al backend.

- Stack: React 19, Vite 7, Tailwind CSS 3.4, react-router-dom 6, TypeScript.
- Una carpeta por pantalla: `src/pages/<Nombre>/index.tsx`. Rutas en `src/App.tsx` (`/` abre `MedDashboardPrincipal`).
  Además de las 35 de Figma hay 2 pantallas nuevas del paso 2 (`MedPacienteNuevo`, `MedDispositivoDetalle`).
- Datos de ejemplo que comparten varias pantallas en `src/data/`; utilidades en `src/lib/`.
- Componentes compartidos en `src/components/` (se importan desde `src/components/index.ts`). Ver "Componentes" abajo.
- Íconos e imágenes exportados de Figma en `src/assets/`.
- Fuentes (Google Fonts en `index.html`): Plus Jakarta Sans (`font-jakarta`), Inter (`font-inter`), Geist (`font-geist`), definidas en `tailwind.config.js`.
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
   - Cabecera del paciente única: María González · Crítico · Cama C-03 · ID PT-8821.
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
     `useRowLink`/`rowButton` (filas tocables), `AssignBedModal` y `UploadDocumentModal`. `Modal` se cierra con X,
     Escape o el fondo; `BackButton` acepta `to`.
   - Un solo paciente de ejemplo: todo expediente abre las pantallas de María González. Se agregaron datos de ejemplo
     solo donde la paginación o los filtros los necesitan (12 monitores, 12 pacientes, 18 reportes, 24 entregas…).
   - El estado es local y se pierde al recargar; lo que cruza de pantalla viaja en la navegación (alerta atendida,
     entrega de turno confirmada, diagnóstico registrado, nota SOAP elegida con `?nota=`, monitor con `?cama=`).
   - Pantallas nuevas (no vienen de Figma, lo dice un comentario al inicio): **Registro de Paciente**
     (`MedPacienteNuevo`) y **Detalle de Monitor** (`MedDispositivoDetalle`), adaptables a celular.
   - `/` abre el Dashboard; el logo del menú lleva al Dashboard; cerrar sesión pide confirmación.
   - Verificado: `npm run build` pasa; las 35 pantallas de Figma se ven igual a 1440 px (comparadas píxel a píxel
     con las del paso 1); las nuevas no se salen de lado a 390, 768 y 1024 px; pruebas automáticas de filtros,
     menús, modales, avisos y navegación con estado.
3. **Formularios.** Campos de texto reales donde hoy hay dibujos (lista en `BOTONES.md`, "Queda para el paso 3"):
   notas y textareas, Mín/Máx de umbrales, fechas, búsqueda escribiendo en CIE-10 y validación. Sin backend.
4. **Backend.** No se hace en el prototipo: se hace en `frontend/`, según lo que se decida en el paso 0.

## Componentes (`src/components/`)

| Componente | Para qué |
|---|---|
| `AppLayout`, `PageBody` | Estructura de toda pantalla: menú + barra superior + contenido. Menú fijo desde 1024 px, plegable abajo de eso. |
| `Sidebar`, `TopBar`, `TopBarDate`, `NotificationBell` | Partes del layout (la lista del menú y su regla de marcado están en `layout/nav.ts`). |
| `PatientLayout`, `PatientHeader`, `PatientTabs`, `SoapSections` | Pantallas del expediente del paciente. |
| `Button`, `BackButton` | Botones: `primary`, `secondary`, `outline`, `soft`, `ghost`, `danger`, `warning`, `success`, `link`; tamaños `sm`/`md`/`lg`; con `to` es enlace. |
| `Card`, `CardHeader`, `CardTitle`, `Divider` | Tarjetas blancas con borde y la línea divisoria de Figma. |
| `Badge`, `KpiCard` | Etiquetas de estado (`tone`) e indicadores. |
| `Tabs`, `SegmentedControl` | Pestañas (subrayado o `pills`) y grupos tipo Grid/Lista. |
| `Table`, `Pagination` | Tablas con desplazamiento lateral propio y paginación. |
| `Input`, `TextArea`, `SearchBox`, `InfoField`, `TextBlock` | Campos de texto y datos de solo lectura. |
| `Select` | Lista desplegable con `options`/`value`/`onChange`. Variantes con el dibujo de cada filtro de Figma: `field`, `stacked`, `chip`, `soft`, `button`, `input`, `input-plain`, `compact`. |
| `Popover`, `Menu` | Panel flotante (no lo cortan las tablas con desplazamiento) y menú de acciones "•••". |
| `Modal`, `ModalHeader`, `ConfirmDialog`, `DocumentPreview` | Ventanas emergentes (se cierran con X, Escape o el fondo), confirmación corta y vista previa de documentos. |
| `ToastProvider`, `useToast` | Avisos cortos que sobreviven al cambio de pantalla. |
| `EmptyState` | "Sin resultados con estos filtros" + Quitar filtros. |
| `useRowLink`, `rowButton`, `rowLinkClass` | Filas de tabla que llevan a otra pantalla o abren algo (mouse y Enter). |
| `AssignBedModal`, `UploadDocumentModal` | Asignar paciente a cama libre; subir documento (archivo de ejemplo). |
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
| `MedPacienteNuevo` | — (pantalla nueva del paso 2) | — |
| `MedDispositivoDetalle` | — (pantalla nueva del paso 2) | — |
