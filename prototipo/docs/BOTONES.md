# Inventario de elementos tocables — paso 2 (prototipo clicable)

> **Estado: hecho.** El paso 2 quedó implementado como se describe aquí (rama `feature/prototipo-clicable`).
> La columna **Antes** es cómo estaba cada elemento al empezar el paso; **Ahora** es lo que hace. Lo que se
> agregó además de la propuesta aprobada va marcado con *(extra)*.
>
> **Actualizado con la revisión de acceso y roles** (rama `feature/prototipo-login-revision`, ver `REVISION.md`):
> pantallas de acceso nuevas, se quitó lo que no le corresponde al médico (marcado **[R1]**…**[R7]**) y se
> unificaron botones y paginación (**[C1]**…**[C8]**). Esas filas dicen cómo quedaron después de la revisión.
>
> **Actualizado con el paso 4, PR 2** (`REVISION-IA.md`, sección 9): los datos ya no son los de Figma sino los 8
> pacientes del seed, y cada fila o tarjeta abre el expediente de **su** paciente. Lo que cambió por eso está en la
> sección "Paso 4 — datos del seed" al final; las filas de arriba siguen describiendo el paso 2.
>
> **Actualizado con la revisión del médico** (rama `feature/prototipo-revision-medico`, ver `REVISION-MEDICO.md`): se
> quitaron los botones que no hacían nada real y otros pasaron a funcionar con datos reales. Está en la sección
> "Revisión del médico (fase 2)" al final; donde una fila de arriba dice otra cosa, manda esa sección.

Objetivo: que en `prototipo/` no quede nada que se pueda tocar y no haga nada. Cada elemento hace una de estas cosas:

| Etiqueta | Qué hace |
|---|---|
| **Pantalla** | lleva a una pantalla que ya existe |
| **Modal** / **Menú** | abre una ventana, un panel o un menú |
| **Opciones** | abre sus opciones y, al elegir una, filtra los datos de ejemplo de esa pantalla |
| **Estado** | cambia algo en la misma pantalla (marcar, silenciar, ordenar, pestaña, paginar, plegar) |
| **Aviso** | muestra un aviso corto de confirmación ("Nota guardada") |

Columna **Antes**: ✅ ya funcionaba · ⚠️ hacía algo pero incompleto · ❌ no hacía nada.

## Criterios generales

- ~~**Un solo paciente de ejemplo.** Todo lo que abre un expediente (de cualquier paciente) lleva a las pantallas de
  María González, que son las únicas que existen en Figma.~~ Desde el paso 4: el paciente de cada fila, en la URL.
- ~~**Datos de ejemplo extra** solo donde hacen falta para que funcionen la paginación y los filtros (ej. "Mostrando 5
  de 12" necesita 12 pacientes).~~ Desde el paso 4 la paginación muestra lo que hay (8 pacientes: "5 de 8").
- **El estado es local**: se pierde al recargar (desde el paso 4, lo guardado sobrevive a recargar la pestaña). Lo que cruza de pantalla (ej. confirmar una alerta y volver al
  Centro de Alertas con esa alerta atendida) viaja en la navegación, sin backend.
- **Si un filtro deja la lista vacía**, se muestra "Sin resultados con estos filtros" y un botón "Quitar filtros".
- **Campos de texto de formularios** (notas, textareas, Mín/Máx, fechas) quedan para el **paso 3**. Los
  **buscadores** que filtran una lista sí se vuelven reales en este paso, porque son filtros.
- **Informativo**: tarjetas de indicadores, badges, gráficas, leyendas y filas de tablas clínicas (antecedentes,
  diagnósticos, medicamentos) no tienen apariencia de botón y se quedan sin acción. Ver el final del documento.

## Componentes nuevos o ampliados (en `src/components/`)

| Componente | Para qué |
|---|---|
| `ToastProvider` + `useToast` | Avisos cortos abajo a la derecha (abajo al centro en celular) que se cierran solos. Viven fuera de las rutas, así que un aviso sobrevive a un cambio de pantalla ("Nota guardada" al volver al historial). |
| `Select` (reescrito, en `ui/Select.tsx`) | Recibe `options`, `value` y `onChange`; abre una lista con las opciones, se cierra con Escape o al tocar fuera, y se maneja con flechas. Variantes según el dibujo de Figma: `field` ("Severidad: Todas"), `stacked` ("UNIDAD / Todas"), `chip`, `soft` ("Todos ⌄"), `button` ("Filtrar"), `input`, `input-plain` y `compact` (formularios). `highlighted` da el borde azul del buscador de CIE-10. |
| `Popover` | Panel flotante de `Select` y `Menu` (se dibuja encima de todo, así que las tablas con desplazamiento no lo cortan). |
| `Menu` | Menú de acciones para el botón "•••". |
| `Modal` (ampliado), `ModalHeader` | `open` y `onClose`: se cierra con X, Escape o tocando el fondo. `ModalHeader` = título + X. |
| `ConfirmDialog` | Modal corto de confirmación (título, texto, Cancelar / Confirmar). |
| `DocumentPreview` | Vista previa de un reporte o documento (hoja de ejemplo) con Cerrar / Descargar. |
| `EmptyState` | "Sin resultados con estos filtros" + Quitar filtros. |
| `useRowLink`, `rowButton`, `rowLinkClass` | Filas que llevan a otra pantalla o abren algo, con Enter y con el mouse, sin anidar enlaces. |
| `BackButton` (ampliado) | Acepta `to` para volver a una pantalla fija ("Volver al Mapa" → Grid UCI). |
| `UploadDocumentModal` | "Subir documento" (Documentos clínicos y Registro de diagnóstico). `AssignBedModal` se borró en la revisión: asignar camas es de Admisión **[R3]**. |
| `CloseButton` | La X de todas las ventanas (la de `ModalHeader`) **[C3]**. |
| `ScrollShadows` / `useScrollEdges` | Sombra en el borde de tablas y pestañas que se desplazan de lado (`Table` y `Tabs` ya la traen). |
| `AuthLayout`, `AuthCard`, `AuthField`, `AuthButton`, `AuthBackLink` | Pantallas de acceso: barra con ES/EN/DE, fondo de puntos, barra de estado, pie y tarjeta. |
| `Input` (ajustado) | 38 px de alto, igual que las listas de formulario. |

Datos de ejemplo que comparten varias pantallas: `src/data/alerts.ts` (alerta que viaja a la confirmación y de
vuelta), `src/data/devices.ts` (12 monitores; desde el paso 4, los 8 del seed) y `src/data/soap.ts` (5 notas SOAP;
desde el paso 4, rutas y formato: las notas vienen de `src/api/soapNote.ts`). Búsqueda sin tildes ni
mayúsculas: `src/lib/text.ts`.

---

## Partes compartidas (aparecen en todas o varias pantallas)

| Elemento | Antes | Ahora |
|---|---|---|
| Menú lateral: 6 opciones | ✅ llevan a su pantalla | Se queda igual. |
| Menú lateral: logo "SIAPPC" | ❌ | **Pantalla**: Dashboard. |
| Menú lateral: "?" (ayuda) | ✅ Ayuda y Soporte | Se queda igual. |
| Menú lateral: tarjeta del médico | ✅ Mi Perfil | Se queda igual. |
| Menú lateral: ícono de cerrar sesión | ⚠️ está dentro del enlace al perfil, lleva a Mi Perfil | **Modal**: botón aparte → "¿Cerrar sesión?" → **Aviso** "Sesión cerrada" y lleva al **Login**. La confirmación se ve sobre toda la pantalla (antes, a 1024 px o más, quedaba tapada); en celular se cierra el menú antes de abrirla (`REVISION-IA.md`, sección 6). |
| Barra superior: ☰ | ✅ abre el menú en pantallas angostas | Se queda igual. |
| Barra superior: campana | ✅ Centro de Notificaciones | Se queda igual. |
| Buscadores de la barra que llevan a Búsqueda (Confirmación de alerta, Dashboard, Comparativa, Turno historial, Resumen recibido) | ✅ llevan a Búsqueda Global | Se quedan igual. |
| "Volver" (pantallas del paciente) | ✅ regresa a la pantalla anterior | Se queda igual. |
| Cabecera del paciente: "Nueva Nota SOAP" | ✅ Nueva Nota SOAP | Se queda igual. |
| Cabecera del paciente: "Generar Reporte" | ❌ | **Aviso**: "Reporte de María González generado". |
| Pestañas del expediente | ✅ llevan a su pantalla | Se quedan igual. |
| Ruta `/` | abre Centro de Alertas | Abre el **Login** (pantallas de acceso, ver abajo). El Dashboard sigue en `/MedDashboardPrincipal`. |

## Dashboard Principal (`MedDashboardPrincipal`)

| Elemento | Antes | Ahora |
|---|---|---|
| Tarjeta "Pacientes Asignados" | ❌ | **Pantalla**: Mis Pacientes. |
| Tarjeta "Alertas Críticas" | ❌ | **Pantalla**: Centro de Alertas. |
| Tarjeta "Pendientes Evaluación" | ❌ | **Estado**: filtra la tabla a los pacientes en "Atención". |
| Filtro "Unidad: UCI" | ❌ | **Opciones**: UCI / Urgencias / Hospitalización (los de ejemplo son de UCI; las otras muestran la lista vacía con "Quitar filtros"). |
| Filtro "Estado: Todos" | ❌ | **Opciones**: Todos / Crítico / Atención / Estable → filtra la tabla. |
| Filas de la tabla (6) | ❌ | **Pantalla**: Resumen del paciente. |
| Íconos de acción por fila: ojo / corazón / documento / carpeta | ❌ | **Pantalla**: Resumen / Monitoreo detallado / Nueva Nota SOAP / Historia clínica. |
| "Ver todos →" | ❌ | **Pantalla**: Mis Pacientes. |
| Tarjetas de tendencias (2) | ❌ | **Pantalla**: Tendencias de signos vitales. |
| "Requiere tu atención": GCS Crítico, SpO2 Bajo | ❌ | **Pantalla**: Confirmación de atención con esa alerta. |
| "Requiere tu atención": Evaluación | ❌ | **Pantalla**: Resumen del paciente. |
| "Requiere tu atención": Pendiente nota SOAP | ❌ | **Pantalla**: Nueva Nota SOAP. |

## Centro de Alertas (`MedAlertasCentro`)

| Elemento | Antes | Ahora |
|---|---|---|
| "Severidad: Todas" | ❌ | **Opciones**: Todas / Crítica / Alta / Media → filtra las alertas. |
| "Estado: Activas" | ❌ | **Opciones**: Activas / Silenciadas / Atendidas / Todas → filtra. |
| "Hoy, 24 Oct 2025" | ❌ | **Opciones**: Hoy / Ayer / Últimos 7 días → filtra alertas e historial. |
| "Silenciar" (5) | ❌ | **Estado**: la tarjeta se atenúa y el botón cambia a "Reactivar" + **Aviso** "Alerta silenciada 15 min". |
| "Atender" (4) | ❌ | **Pantalla**: Confirmación de atención con los datos de esa alerta. |
| "Atendiendo" (C-09) | ❌ | **Pantalla**: Confirmación de atención (para cerrarla). |
| Al volver de Confirmación con "Confirmar" | — | **Estado**: la alerta pasa al historial como atendida, los contadores bajan + **Aviso** "Atención registrada". |
| Filas del historial (6) | ❌ | **Pantalla**: Resumen del paciente. |

## Confirmación de Atención (`MedAlertasConfirmacionAtencion`)

| Elemento | Antes | Ahora |
|---|---|---|
| X y "Cancelar" | ❌ | **Pantalla**: vuelve al Centro de Alertas sin cambios. |
| "Clasificación de Alerta" | ❌ | **Opciones**: Alerta verdadera atendida / Falsa alarma / Artefacto técnico / Escalada a otro servicio. |
| "Confirmar Atención" | ❌ | **Pantalla**: Centro de Alertas con la alerta atendida + **Aviso**. |
| "Acción tomada", "Notas adicionales" | ❌ | Paso 3 (campos de texto). |
| Datos de la alerta | fijos (María González) | Muestran la alerta desde la que se llegó; si se entra directo, la de Figma. |

## Ayuda y Soporte (`MedAyudaSoporte`)

| Elemento | Antes | Ahora |
|---|---|---|
| "Busca en la base de conocimiento…" | ❌ (dibujado) | **Estado**: buscador real que filtra las preguntas. |
| 4 categorías | ❌ | **Estado**: filtran las preguntas de esa categoría; tocar otra vez quita el filtro. |
| 6 preguntas frecuentes | ❌ (la primera fija abierta) | **Estado**: abren y cierran su respuesta (se agregan respuestas de ejemplo a las 5 que no tienen). |
| "+52 800 123 4567" | ❌ | Enlace `tel:` (llama en celular). |
| "Contactar Soporte Técnico" | ❌ | **Modal**: motivo y prioridad (listas) → "Enviar" → **Aviso** "Solicitud enviada · Folio #4821". |

## Búsqueda Global (`MedBusquedaGlobal`)

| Elemento | Antes | Ahora |
|---|---|---|
| Buscador de la barra ("González") | ⚠️ se escribe pero no filtra | **Estado**: filtra los resultados por texto. |
| Pestañas Todos / Pacientes / Notas SOAP / Documentos | ⚠️ cambian la marca pero no los resultados | **Estado**: filtran los resultados; los números se actualizan. |
| María González: "Ver Perfil" / "Monitoreo" | ❌ | **Pantalla**: Datos personales / Monitoreo detallado. |
| Roberto González: "Ver Perfil" / "Ver Historia" | ❌ | **Pantalla**: Datos personales / Historia clínica (paciente de ejemplo). |
| "Ver Nota" | ❌ | **Pantalla**: Detalle de nota SOAP. |
| "Ver Documento" | ❌ | **Pantalla**: Documentos clínicos. |

## Dispositivos — Monitores UCI (`MedDispositivosMonitores`)

| Elemento | Antes | Ahora |
|---|---|---|
| Buscador de la barra ("Buscar por serie/ID…") | ⚠️ se escribe pero no filtra | **Estado**: filtra la tabla (se agrega un número de serie de ejemplo a cada monitor). |
| Filtro "Estado / Todos" | ❌ | **Opciones**: Todos / Activo / Falla / Inactivo. |
| Filtro "Cama / Todas las UCI" | ❌ | **Opciones**: Todas las UCI / C-01 … C-12. |
| "Filtrar pacientes o modelo de equipo…" | ❌ (dibujado) | **Estado**: buscador real que filtra por paciente o modelo. |
| "Ver Detalle" y filas (8) | ❌ | **Pantalla nueva**: Detalle de monitor (ver abajo). |
| "Anterior" / "Siguiente" | ❌ | **Estado**: pagina (8 de 12: se agregan 4 monitores de ejemplo). Ahora con números de página (`Pagination`) **[C5]**. |

## Comparativa de Pacientes (`MedMonitoreoComparativa`)

| Elemento | Antes | Ahora |
|---|---|---|
| "Paciente A: María González" / "Paciente B: Juan García" | ❌ | **Opciones**: pacientes de UCI; al elegir cambian nombre, cama, estado y signos de esa columna (las gráficas siguen siendo de ejemplo). |
| "+ Agregar Paciente" | ❌ | **Aviso**: "La comparativa admite 2 pacientes; cambia A o B desde su lista". |
| "Últimas 4h / 12h / 24h" | ❌ | **Estado**: cambia la opción marcada y el título de las gráficas. Usa `SegmentedControl`, como Tendencias **[C2]**. |
| "Exportar" | ❌ | **Aviso**: "Comparativa exportada (PDF)". |
| Resumen métrico comparativo | fijo | *(extra)* Encabezados, valores y diferencias se recalculan con los pacientes A y B elegidos. |

## Central de Monitoreo — Grid (`MedMonitoreoGridUci`)

| Elemento | Antes | Ahora |
|---|---|---|
| Grid / Lista | ✅ | Se queda igual. |
| Tarjetas C-01, C-02, C-05, C-06 | ❌ (solo C-03 lleva al Resumen) | **Pantalla**: Resumen del paciente. |
| Tarjeta C-07 "Disponible" | ❌ | **Informativa** (sin cursor ni efecto): asignar camas es de Admisión **[R3]**. |

## Central de Monitoreo — Lista (`MedMonitoreoListaUci`)

| Elemento | Antes | Ahora |
|---|---|---|
| Grid / Lista | ✅ | Se queda igual. |
| Filas C-01 … C-06 | ❌ | **Pantalla**: Resumen del paciente. |
| Fila C-07 "Disponible" | ❌ | **Informativa**, igual que en el Grid **[R3]**. |

## Centro de Notificaciones (`MedNotificacionesCentro`) y Bandeja (`Notificaciones`)

| Elemento | Antes | Ahora |
|---|---|---|
| "Marcar todas como leídas" | ❌ | **Estado**: quita las marcas de no leída + **Aviso**. |
| "Tipo: Todas" | ❌ | **Opciones**: los tipos de cada pantalla (Clínica, Asignación, Laboratorio, Imagen, Recordatorio, Sistema) → filtra. |
| Cada notificación | ❌ | **Estado + Pantalla**: se marca leída y lleva a lo suyo: alertas → Centro de Alertas; asignación/traslado/alta → Resumen o Mis Pacientes; laboratorio/imagen → Documentos clínicos; nota SOAP → Notas SOAP; reporte → Reportes; mantenimiento → Dispositivos; actualización del sistema → solo se marca leída. |

## Mis Pacientes (`MedPacientesLista`) — antes "Gestión de Pacientes" **[R7]**

| Elemento | Antes | Ahora |
|---|---|---|
| "Nuevo Paciente" | ❌ | **Se quitó** (botón y pantalla Registro de Paciente): registrar pacientes es de Admisión **[R1]**. |
| Filtro "Unidad / Todas" | ❌ | **Opciones**: Todas / UCI / Urgencias / Hospitalización. |
| Filtro "Estado / Todos" | ❌ | **Opciones**: Todos / Crítico / Monitoreo / Estable. |
| Filtro "Rango de Admisión" | ❌ | **Opciones**: Cualquier fecha / Hoy / Últimos 7 días / Últimos 30 días (se agrega fecha de ingreso de ejemplo). |
| "Todos ⌄" (junto al buscador) | ❌ | **Opciones**: Todos (orden original) / Más críticos primero / Por cama / Por nombre. |
| "Filtrar por nombre o ID…" | ❌ (dibujado) | **Estado**: buscador real. |
| Filas (5) | ⚠️ solo Javier Mendoza lleva al Resumen | **Pantalla**: Resumen del paciente (todas). |
| "•••" de cada fila | ❌ | **Menú**: Ver expediente / Monitoreo / Nueva nota SOAP / **Indicar alta médica** → confirmación → **Aviso** "Alta médica indicada · Admisión completará el egreso" **[R2]**. |
| "Anterior" / "Siguiente" | ❌ | **Estado**: pagina (5 de 12: se agregan 7 pacientes de ejemplo). Ahora con números de página **[C5]**. |
| "Alertas Recientes" (4) | ❌ | **Pantalla**: Centro de Alertas. |

## Mi Perfil (`MedPerfilMiPerfil`)

| Elemento | Antes | Ahora |
|---|---|---|
| "Cambiar Contraseña" | ❌ | **Modal** con los campos (actual, nueva, confirmar) → "Guardar" → **Aviso** "Contraseña actualizada". |
| "Configurar MFA" | ❌ | **Modal** con QR de ejemplo (no escaneable), pasos y código → "Activar" → **Aviso**; el botón pasa a la etiqueta "MFA activo" y cambia el texto de seguridad. |
| "Cambiar Contraseña" → Guardar | — | *(extra)* El texto pasa a "Contraseña cambiada hoy." |
| 5 interruptores de notificaciones | ❌ | **Estado**: encender/apagar + **Aviso** "Preferencia guardada". |

## Módulo de Reportes (`MedReportesPanel`)

| Elemento | Antes | Ahora |
|---|---|---|
| "Generar Nuevo Reporte" | ❌ | **Modal**: paciente, tipo y formato (listas) → "Generar" → aparece primero en "Reportes por Paciente" + **Aviso**. |
| Pestañas Resumen / Historial de Entregas | ⚠️ cambian la marca pero no el contenido | **Estado**: "Historial" deja solo la tabla de reportes generados. |
| Tarjeta "Reporte de Entrega de Turno" | ✅ Entrega de turno | Se queda igual. |
| "Entregar" (3) | ❌ | **Modal** de confirmación → la fila sale de pendientes, sube el contador "Entregados" + **Aviso**. |
| Filas de pendientes y de reportes generados | ❌ | **Modal**: vista previa del reporte (hoja de ejemplo). |
| Lupa / descarga por fila | ❌ | **Modal** vista previa / **Aviso** "Descargando Reporte_…pdf". |
| "Anterior" / "Siguiente" | ❌ | **Estado**: pagina (5 de 18: se agregan 13 reportes de ejemplo). Ahora con números de página **[C5]**. |
| Tipos de "Generar Nuevo Reporte" | — | Solo reportes clínicos: Evolución Clínica, Reporte de Alta, Interconsulta. Se quitaron Ocupación UCI y Análisis de Alertas **[R6]**. |
| "Configurar y Generar" (2 plantillas) | ❌ | **Modal**: el de "Generar Nuevo Reporte" con el tipo ya elegido. |

## Entrega de Turno (`MedTurnoEntregaHandoff`)

| Elemento | Antes | Ahora |
|---|---|---|
| "Generar Reporte" (barra) | ❌ | **Aviso**: "Reporte de turno generado". |
| Pestañas Nueva Entrega / Historial | ✅ | Se quedan igual. |
| Filas de pacientes (5) | ❌ | **Pantalla**: Resumen del paciente. |
| "Guardar Borrador" | ❌ | **Aviso**: "Borrador guardado". |
| "Confirmar Entrega de Turno" | ❌ | **Modal** de confirmación (receptora: Dra. Ana Gómez) → **Pantalla** Historial de entregas + **Aviso**. *(extra)* La entrega confirmada aparece primera en el historial como "Pendiente". |
| Notas generales | ❌ | Paso 3 (campo de texto). |

## Historial de Entregas (`MedTurnoHistorial`)

| Elemento | Antes | Ahora |
|---|---|---|
| "Fecha: Últimos 7 días" | ❌ | **Opciones**: Hoy / Últimos 7 días / Últimos 30 días → filtra (Últimos 30 días agrega 9 entregas más antiguas). |
| "Turno: Todos los turnos" | ❌ | **Opciones**: Todos / Matutino / Vespertino / Nocturno → filtra. |
| "Ver Resumen" y filas (6) | ❌ | **Pantalla**: Resumen de turno recibido. |
| Paginación 1 · 2 · 3 · 4 | ❌ | **Estado**: pagina (24 entregas en los últimos 7 días: se agregan 18 de ejemplo). |

## Resumen de Turno Recibido (`MedTurnoResumenRecibido`)

| Elemento | Antes | Ahora |
|---|---|---|
| "Ver Paciente" (3) | ✅ Resumen del paciente | Se queda igual; la fila completa también lleva ahí. |
| "Pendientes para este turno" (5 casillas) | ❌ | **Estado**: marcar / desmarcar. |
| "Marcar como Leído ✓" | ❌ | **Estado**: la etiqueta "En revisión" pasa a "Leído", el botón queda deshabilitado + **Aviso**. |

## Expediente del paciente

### Resumen (`MedPacienteResumen`)

| Elemento | Antes | Ahora |
|---|---|---|
| "Volver al Mapa" | ⚠️ regresa a la pantalla anterior | **Pantalla**: Central de Monitoreo (Grid). |
| "Configurar Umbrales" | ✅ | Se queda igual. |
| "Atender" (2 alertas) | ❌ | **Pantalla**: Confirmación de atención con esa alerta (ahora en azul, como en el Centro de Alertas **[C1]**). *(extra)* Al confirmar se vuelve al Resumen y esa alerta sale de la lista. |

### Antecedentes (`MedPacienteAntecedentes`)

| Elemento | Antes | Ahora |
|---|---|---|
| Subpestañas (4) | ⚠️ cambian la marca, no la tabla | **Estado**: cada una muestra su tabla y su columna (se agregan datos de ejemplo de personales patológicos, no patológicos y gineco-obstétricos; los datos que no son "positivo/negado", como la menarca, llevan la etiqueta "Registrado"). |
| "+ Agregar Antecedente" | ❌ | **Modal**: condición, relación, estado (listas) → nueva fila + **Aviso**. |
| "Ver sección →" | ❌ | **Estado**: pasa a la siguiente subpestaña; la tarjeta anuncia la que sigue. |

### Configuración de Umbrales (`MedPacienteConfigUmbrales`)

| Elemento | Antes | Ahora |
|---|---|---|
| Severidad por defecto (6 listas) | ❌ | **Opciones**: Crítica / Alta / Media / Baja (Baja lleva punto verde). |
| Interruptores (6) | ❌ | **Estado**: encender/apagar (la fila se atenúa al apagar). |
| "Restablecer valores sugeridos" | ❌ | **Estado**: vuelve a los valores iniciales + **Aviso**. |
| "Guardar Configuración" | ❌ | **Aviso**: "Umbrales guardados". |
| Mín / Máx | ❌ | Paso 3 (campos). |

### Datos Personales (`MedPacienteDatosPersonales`)

| Elemento | Antes | Ahora |
|---|---|---|
| "Guardar cambios" | ❌ | **Se quitó**: la pantalla es de consulta, con la leyenda "Datos registrados por Admisión" **[R4]**. |

### Diagnósticos Activos (`MedPacienteDiagnosticosActivos`)

| Elemento | Antes | Ahora |
|---|---|---|
| "+ Nuevo Diagnóstico" | ❌ | **Pantalla**: Registro de nuevo diagnóstico. |
| "editar" (4) | ❌ | **Pantalla**: Registro de diagnóstico. |
| Al volver de "Registrar Diagnóstico" | — | *(extra)* El diagnóstico registrado aparece primero como "Presuntivo · Hoy". |
| "Actualizar Nota" | ❌ | **Aviso**: "Nota actualizada". |

### Documentos Clínicos (`MedPacienteDocumentosClinicos`)

| Elemento | Antes | Ahora |
|---|---|---|
| Filtros Todos / Laboratorio / Imagen / Consentimiento / Otro | ⚠️ cambian la marca, no filtran | **Estado**: filtran la lista. |
| "Subir documento" y zona "Arrastra archivos aquí" | ❌ | **Modal**: tipo (lista) y nombre de ejemplo → "Subir" → el documento aparece primero + **Aviso**. |
| "Ver" (4) | ❌ | **Modal**: vista previa del documento (hoja de ejemplo). |
| "Descargar" (4) | ❌ | **Aviso**: "Descargando …". |

### Exploración Física (`MedPacienteExploracionFisica`)

| Elemento | Antes | Ahora |
|---|---|---|
| Regiones (6) | ❌ (Tórax fijo) | **Estado**: cambian la exploración mostrada (Tórax conserva el texto de Figma; las demás llevan hallazgos de ejemplo). |
| "Guardar" | ❌ | **Aviso**: "Exploración guardada". |

### Historia Clínica General (`MedPacienteHistoriaClinicaGeneral`)

| Elemento | Antes | Ahora |
|---|---|---|
| "+ Agregar Diagnóstico" y enlaces "Ver …" (10) | ✅ | Se quedan igual. |
| Flechas de cada sección (11) | ❌ | **Estado**: plegar / desplegar la sección. |

### Historial de Hospitalizaciones (`MedPacienteHistorialHospitalizaciones`)

Sin elementos tocables además de "Volver" (las tarjetas de la línea de tiempo son informativas).

### Indicaciones Médicas (`MedPacienteIndicacionesMedicas`)

| Elemento | Antes | Ahora |
|---|---|---|
| "Nueva Indicación" (barra) | ❌ | **Modal**: tipo (Solución intravenosa / Medicamento) y tres listas de ejemplo que cambian con el tipo → nueva fila en su tabla + **Aviso**. |
| "+ Agregar Solución" / "+ Agregar Medicamento" | ❌ | **Modal**: el mismo, con el tipo ya elegido. |

### Interrogatorio por Aparatos (`MedPacienteInterrogatorioAparatos`)

| Elemento | Antes | Ahora |
|---|---|---|
| Casillas de síntomas (11) | ❌ | **Estado**: marcar / desmarcar. |
| Secciones abiertas (Respiratorio, Cardiovascular): flecha | ❌ | **Estado**: plegar. |
| Secciones cerradas (6): fila y flecha | ❌ | **Estado**: desplegar con sus síntomas (sin marcar) y "Sin hallazgos". |
| "Guardar Interrogatorio" | ❌ | **Aviso**: "Interrogatorio guardado". |

### Monitoreo Detallado (`MedPacienteMonitoreoDetallado`)

| Elemento | Antes | Ahora |
|---|---|---|
| Panel del monitor | ✅ Tendencias vitales | Se queda igual. |

### Nota de Ingreso (`MedPacienteNotaIngreso`)

| Elemento | Antes | Ahora |
|---|---|---|
| Pronóstico Bueno / Reservado / Grave | ❌ | **Estado**: elegir uno (verde / ámbar / rojo; Reservado es el de Figma). |
| "+ Agregar Diagnóstico" | ❌ | **Pantalla**: Registro de nuevo diagnóstico. |
| "Guardar Nota de Ingreso" | ❌ | **Aviso**: "Nota de ingreso guardada". |

### Notas SOAP — Historial (`MedPacienteNotasSoapHistorial`)

| Elemento | Antes | Ahora |
|---|---|---|
| Filas de notas (5) | ⚠️ solo la primera lleva al detalle | **Estado**: seleccionan la nota y la muestran en "Detalle de Nota Seleccionada" (se agregan O/A/P de ejemplo a las otras 4). |
| Flecha › de cada fila | ❌ | **Pantalla**: Detalle de nota SOAP de esa nota (`?nota=1…4`; la del 24 Oct conserva el texto de Figma). |
| "Buscar notas…" | ❌ (dibujado) | **Estado**: buscador real. |
| "Filtrar" | ❌ | **Opciones**: Todas / Completadas / En progreso. |

### Notas SOAP — Detalle (`MedPacienteNotasSoapDetalle`)

| Elemento | Antes | Ahora |
|---|---|---|
| X, "Cerrar", Escape y fondo | ❌ | **Pantalla**: Historial de notas SOAP. |
| "Editar Nota" | ❌ | **Pantalla**: Nueva Nota SOAP. |
| Lista de fondo | igual que el historial | Igual que el historial. |

### Notas SOAP — Nueva (`MedPacienteNotasSoapNueva`)

| Elemento | Antes | Ahora |
|---|---|---|
| X, "Cancelar", Escape y fondo | ❌ | **Pantalla**: Historial de notas SOAP. |
| "Guardar Nota" | ❌ | **Pantalla**: Historial de notas SOAP + **Aviso** "Nota guardada". |
| Campos S / O / A / P | ❌ | Paso 3 (campos de texto). |

### Registro de Diagnóstico (`MedPacienteRegistroDiagnostico`)

| Elemento | Antes | Ahora |
|---|---|---|
| "Tipo de Diagnóstico" | ❌ | **Opciones**: Principal / Secundario / Complicación. |
| "Código CIE-10" | ❌ | **Opciones**: códigos frecuentes de ejemplo (I50.9, J81, I10, E11.9, N39.0, J18.9); escribir para buscar queda para el paso 3. |
| Severidad Leve / Moderada / Severa / Crítica | ❌ | **Estado**: elegir una. |
| Zona "Haga clic para subir archivos…" | ❌ | **Modal**: el mismo de "Subir documento"; el archivo queda como etiqueta bajo la zona + **Aviso**. |
| "Cancelar" | ❌ | **Pantalla**: vuelve a la anterior. |
| "Registrar Diagnóstico" | ❌ | **Pantalla**: Diagnósticos activos (con el código elegido primero) + **Aviso** "Diagnóstico registrado". |
| Fecha, descripción, notas | ❌ | Paso 3 (campos). |

### Tendencias de Signos Vitales (`MedPacienteTendenciasVitales`)

| Elemento | Antes | Ahora |
|---|---|---|
| "Volver a Monitoreo en Vivo" | ⚠️ regresa a la pantalla anterior | **Pantalla**: Monitoreo detallado. |
| 6h / 12h / 24h / 48h / 7d | ❌ | **Estado**: cambia la opción marcada y las horas del eje (los puntos siguen siendo los de Figma). |

---

## Pantallas nuevas (no vienen de Figma)

Hechas con `AppLayout` y los componentes compartidos; se revisaron a 390, 768, 1024 y 1440 px sin desbordes. Cada
una lleva al inicio el comentario `// Pantalla nueva del paso 2: no viene de Figma.`

La primera pantalla nueva, **Registro de Paciente** (`MedPacienteNuevo`), se borró en la revisión: registrar
pacientes es de Admisión **[R1]**.

### Detalle de Monitor — `MedDispositivoDetalle`

Se llega desde "Ver Detalle" o la fila de un monitor (Dispositivos). La cama va en la ruta
(`/MedDispositivoDetalle?cama=C-06`) para mostrar el monitor elegido.

- **Barra superior**: "SIAPPC > Dispositivos > C-06" · "Monitor GE CARESCAPE B650" · "Volver a Dispositivos".
- **Tarjeta del equipo**: modelo, número de serie, cama, paciente, estado (badge), firmware, última conexión.
- **Batería y señales**: nivel de batería con barra, señales activas como etiquetas.
- **Calibraciones** (tabla): fecha, técnico, resultado.
- **Eventos recientes** (lista): desconexiones, fallas, cambios de batería.
- **Acciones**: "Solicitar calibración" **[R5]** (fecha preferida → aviso "Solicitud enviada a Ingeniería Biomédica" y
  la fecha aparece como "Solicitada" en la tabla),
  "Reportar falla" (confirmación → aviso, evento nuevo en la lista y el botón queda como "Falla reportada"),
  "Ver paciente" (Resumen del paciente; oculto si la cama está libre).

---

## Pantallas de acceso (página LOGIN de Figma)

| Pantalla | Ruta | Elementos |
|---|---|---|
| Iniciar sesión (`Login`) | `/` y `/Login` | Correo y contraseña reales (el ojo muestra u oculta, Enter envía); cualquier dato sirve. "¿Olvidó su contraseña?" → Recuperar (con el correo escrito). "Entrar a Central de Monitoreo" → Verificación. |
| Verificación de seguridad (`LoginMfa`) | `/LoginMfa` | 6 casillas: avanzan solas, Retroceso vuelve, flechas, pegar llena las seis, solo números. "Verificar" con casillas vacías las marca en rojo; con 6 dígitos → Dashboard + **Aviso** "Bienvenido, Dr. Carlos Méndez". "Reenviar" cuenta 0:45 de verdad y en 0 reenvía con aviso. |
| Recuperar contraseña (`RecuperarContrasena`) | `/RecuperarContrasena` | Correo real; "Enviar enlace de recuperación" → Revisa tu correo con ese correo. |
| Revisa tu correo (`RecuperacionEnviada`) | `/RecuperacionEnviada` | Muestra el correo escrito (o `medico@institucion.org`); "Reenviar (en 0:45)" cuenta y en 0 pasa a "Reenviar enlace". |
| Todas | — | ES / EN / DE cambian el idioma de las cuatro pantallas y se recuerda al pasar de una a otra; "Volver al inicio de sesión" → Login. |

---

## Verificación

- `npx tsc --noEmit` y `npm run build` pasan.
- Las 35 pantallas de Figma, capturadas a 1440 px y comparadas píxel a píxel con las del paso 1: sin cambios
  visibles (las únicas diferencias son de décimas de píxel en el texto de ejemplo de los buscadores que ahora son
  campos reales).
- Pantallas nuevas a 390, 768 y 1024 px: nada se sale de lado.
- Pruebas automáticas de interacción (Edge sin ventana): filtros que abren sus opciones y filtran, paginación,
  menú "•••", modales que se cierran con Escape, confirmaciones, avisos y el ida y vuelta Centro de Alertas →
  Confirmación → Centro de Alertas y Entrega de turno → Historial.
- Revisión de acceso y roles: el Login se ve igual a su captura de Figma (1.5 % de diferencia, la misma que la
  referencia). Las 35 pantallas del médico, comparadas a 1440 px con las del paso 2, solo cambian en lo aprobado en
  `REVISION.md`. Pruebas automáticas del flujo de acceso (escribir, pegar el código, ES/EN, recuperar contraseña,
  cerrar sesión) y de los cambios de roles.

## Campos de formulario (paso 3, hecho)

Todo lo que quedaba para el paso 3 ya se puede escribir y se valida (detalle en `REVISION.md`, "Paso 3"):

| Pantalla | Campos | Al guardar |
|---|---|---|
| Nueva Nota SOAP | S, O, A, P | **"Guardar borrador"** (una sección basta) → Historial, "En progreso". **"Guardar y firmar"** (las cuatro, 10–2000 caracteres) → confirmación → Historial, "Completada". Salir con texto pregunta si descartar. |
| Detalle de nota SOAP | — | "Editar Nota" sigue un borrador; en una nota firmada dice **"Nota firmada"** y está deshabilitado. |
| Confirmación de atención | Acción tomada (obligatoria), notas | Con errores no confirma. |
| Entrega de turno | Notas generales | Borrador guarda lo que haya; confirmar pide 20–2000 caracteres. |
| Configuración de umbrales | Mín / Máx | Al menos un límite por signo activo, en su rango posible y Mín < Máx. |
| Registro de diagnóstico | CIE-10 (se busca escribiendo), descripción, fecha, notas | Código de la lista, descripción 20–1000, fecha no futura ni anterior al ingreso. |
| Nota de ingreso | Motivo, padecimiento, plan (**"+ Agregar indicación"**) | Datos de admisión de solo lectura (Admisión). |
| Exploración física | Somatometría, signos vitales, hallazgos (Normal/Anormal se toca) | IMC automático; rangos de signos vitales; hallazgo anormal necesita texto. |
| Diagnósticos activos | Nota correlativa | 20–2000 caracteres. |
| Interrogatorio | Observaciones de cada aparato | Obligatorias si hay síntomas marcados. |
| Indicaciones médicas | Solución o medicamento (escribir o elegir) | 3–80 caracteres. |
| Mi Perfil | Contraseña actual, nueva y confirmación; código MFA | Nueva: 12+ con mayúscula, número y símbolo; código de 6 dígitos. |
| Ayuda | Mensaje a soporte | 10–1000 caracteres. |

**Sin cambio:** Datos Personales (solo lectura, rol); las pantallas de acceso aceptan cualquier dato (paso 2b).

## Informativo (no se toca)

Tarjetas de indicadores (salvo las del Dashboard), badges de estado, gráficas y monitores, leyendas de color
(Estable / Monitoreo / Crítico), tarjetas de la línea de tiempo de hospitalizaciones, "Última nota SOAP" y
"Dispositivo IoT" del Resumen, filas de tablas clínicas (antecedentes, diagnósticos, medicamentos, estudios,
resumen métrico de la comparativa) y "Diagnósticos previos". No tienen apariencia de botón (no cambian el cursor).

## Paso 4 — datos del seed (PR 2)

Los elementos hacen lo mismo que en el paso 2; cambia **a quién** y **con qué datos**. Todo sale de `src/api/` (el
simulador responde con los 8 pacientes de `backend/db/seed-demo.sql`).

| Dónde | Elemento | Ahora |
|---|---|---|
| Todas las del expediente | Pestañas, botones y enlaces | **Pantalla** del mismo paciente: el enlace conserva `?paciente=`. Recargar no lo pierde. |
| Cabecera del paciente | "Nueva Nota SOAP" | Solo con permiso de crear notas SOAP: enfermería no lo ve. |
| Cabecera del paciente | "Generar Reporte" | **Aviso** con el nombre del paciente. |
| Menú lateral | "Cerrar sesión" | Además de lo del PR 1: POST `/auth/logout`, borra la sesión y los datos en caché; Atrás o un enlace directo vuelven al Login. |
| Dashboard | Filas, "Requiere tu atención", tendencias | **Pantalla**: el expediente de ese paciente. KPIs calculados; unidad "Todas" por defecto (con "UCI" se verían 5 de 8). |
| Centro de Alertas | Tarjetas | Una por paciente, variable y gravedad (alertas agrupadas, D5). "Atender" abre la confirmación de **esa** alerta. |
| Confirmación de Atención | Datos de la alerta | La alerta desde la que se llegó; si se entra directo, la primera alerta activa sin atender. |
| Búsqueda Global | Buscador | GET `/search` con las reglas del backend (mínimo 2 letras); abre con "Batista" (paciente, nota y documento); acepta `?q=`. "Ver Nota" abre esa nota. |
| Central de Monitoreo | Selector "Unidad" | **Opciones**: UCI / Trauma / Piso 3 (`?unidad=`). Cada tarjeta o fila lleva al Resumen de su paciente; la cama libre dice "Disponible". |
| Comparativa | "Paciente A" / "Paciente B" | **Opciones**: los pacientes asignados; signos, tendencias, alertas, última nota y medicamentos de cada uno. |
| Mis Pacientes | Filtros y paginación | Unidad sale de los datos; Estado: Crítico / Atención / Estable; 5 por página, **2 páginas** (sin relleno). |
| Dispositivos | Tabla y paginación | Los 8 monitores del seed, 8 por página (1 página). "Ver Detalle" abre el monitor de esa cama. |
| Reportes | Tabla y "Generar Nuevo Reporte" | Un reporte de ejemplo por paciente (8, 5 por página); la lista de pacientes del modal son los 8. |
| Entrega de Turno | Filas, notas y "Guardar Borrador" | Entrega directa = pacientes con alertas; notas sugeridas con lo de cada uno; el borrador sobrevive a recargar. |
| Historial de Entregas | Paginación | Se quedan las 24 entregas de ejemplo: son registros de turno (3 por día), no pacientes. |
| Resumen de Turno Recibido | "Ver Paciente" y filas | Los 8 pacientes; pendientes y alergias salen de cada uno. |
| Notificaciones | Lista y "Marcar como leídas" | Avisos de alertas del simulador más avisos inventados (el seed no trae notificaciones); lo leído se recuerda. |
| Formularios del expediente | "Guardar", "Firmar", "Registrar" | Van al simulador (POST/PUT/PATCH como el backend) y se ven en las otras pantallas: notas SOAP, diagnósticos, antecedentes, documentos, umbrales, exploración, nota de ingreso, interrogatorio, indicaciones. |

## Paso 4 — IA (PR 3)

Todo es nuevo (en Figma no hay IA) y solo lo ve quien tiene `asistente_ia` y no es admin. Detalle en
`REVISION-IA.md`, secciones 10 y 11.

| Dónde | Elemento | Qué hace |
|---|---|---|
| Menú lateral | "Asistente IA" | **Pantalla**: `/MedAsistenteIa`. |
| Asistente IA | "Paciente" | **Opciones**: los 8; sin paciente no se puede consultar. |
| Asistente IA y panel | Preguntas rápidas (5) | **Estado**: envían la pregunta (Mayús+clic solo la copian al cuadro). |
| Asistente IA y panel | "Consultar" / "Detener" (Ctrl+Enter) | **Estado**: pensando → escribiendo → respuesta; "Detener" la corta y deja lo escrito. |
| Asistente IA y panel | "Llevar a la nota" | **Menú**: qué llevar (respuesta completa o una sección) y a dónde (A o P) → **Pantalla** Nueva Nota SOAP con la bandeja. |
| Asistente IA y panel | "Copiar" / "Nueva consulta" / "Reintentar" / "Volver a preguntar" | **Aviso** "Respuesta copiada" / **Estado**. |
| Cabecera del paciente | "Consultar IA" | **Modal**: panel lateral con el paciente elegido (Escape o el fondo lo cierran). |
| Resumen, Monitoreo detallado (críticos), Registro de diagnóstico | "Generar ideas" / "Actualizar" | **Estado**: pide ideas a la IA ("Generando…" → "A solicitud"). |
| Resumen | "Preguntar más" (en cada idea) | **Modal**: panel con "Profundiza en: {idea}", enviada sola. |
| Resumen | "Llevar a la nota" (ideas) | **Menú**: Evaluación (A) o Plan (P) → Nueva Nota SOAP. |
| Registro de diagnóstico | "Buscar en CIE-10" | **Estado**: escribe la hipótesis en el buscador de CIE-10 y lo abre. |
| Indicaciones médicas | "Revisar interacciones con IA" | **Modal**: panel que pregunta solo por alergias e interacciones. |
| Confirmación de atención, Nota SOAP | "Ideas de la IA para este paciente (n)" | **Estado**: despliega las ideas (solo lectura). |
| Nota SOAP | "Insertar en Evaluación (A)" / "Insertar en Plan (P)" / "Descartar" | **Estado**: agrega el texto al final de la sección o descarta la sugerencia. |
| Nota SOAP | Casilla "Revisé el texto sugerido por la IA" | **Estado**: sin marcarla, "Firmar" queda desactivado (solo si la nota tiene texto de la IA). |
| Dashboard | "La IA propuso N hipótesis · hace X" | **Pantalla**: Resumen de ese paciente. |

## Revisión del médico (fase 2)

Lo que cambió con la revisión del médico (`REVISION-MEDICO.md`, secciones 3 y 6). Donde una fila de arriba dice otra
cosa, manda esta tabla. Lo que no está aquí (navegación, pestañas, filtros, paginación, ventanas, notas,
diagnósticos, exploración, notificaciones y búsqueda) sigue igual.

| Dónde | Elemento | Antes | Ahora |
|---|---|---|---|
| Cabecera del paciente (18 fichas) | "Generar Reporte" | Aviso "Reporte de X generado"; no generaba nada | **Modal**: hoja del paciente con datos reales (identificación, diagnósticos, alergias, medicamentos, últimos signos, alertas activas, Glasgow y última nota). "Imprimir" abre la impresión del navegador (imprimir o guardar en PDF). Con `?imprimir=1` se abre sola. |
| Nueva Nota SOAP | "Nueva Nota SOAP" de la cabecera | Nada: ya se estaba ahí | **Se quitó** en esa pantalla. |
| Dashboard | Tarjeta "Pendientes Evaluación" | Filtraba la tabla sin que se notara | **Pantalla**: Mis Pacientes filtrado por "Pendientes de evaluación" (`?filtro=evaluacion`). Cada fila abre la Exploración física. Las cuatro tarjetas son enlaces. |
| Dashboard, Centro de alertas, Resumen, Monitoreo detallado, Mis Pacientes | Alertas "activas" | Todas las abiertas, aunque fueran de hace días | Activas son las de los **últimos 30 min**. Las más viejas van plegadas en "Anteriores sin atender" (**Estado**: desplegar). El indicador "Alertas activas" del Centro cuenta con la misma regla. |
| Centro de alertas | Quién atiende | "Dr. Carlos Méndez" fijo | El nombre de quien usa la sesión. |
| Monitoreo detallado, Dashboard (celda GCS), tarjetas de cama | Glasgow "Pendiente" o "—" | Texto | **Pantalla**: "Registrar exploración" abre la Exploración física de ese paciente. Solo aparece con permiso de editar la historia clínica. |
| Monitoreo detallado, Nueva Nota SOAP | Curvas del monitor | Imágenes fijas (líneas en diagonal) | Las lecturas reales del monitor de los últimos 30 min. La PA sigue simulada (pedido 10). |
| Tendencias | 6h / 12h / 24h / 48h / 7d | Cambiaban las horas del eje | Eje de tiempo real con las lecturas del monitor del rango. Dicen desde qué hora hay lecturas y qué es simulado. |
| Comparativa | "Exportar" | Aviso "Comparativa exportada (PDF)" | Impresión del navegador con la comparativa. |
| Comparativa | "+ Agregar Paciente" | Aviso "admite 2 pacientes" | **Se quitó**. |
| Entrega de turno | "Generar Reporte" | Aviso "Reporte de turno generado" | Impresión del navegador con la entrega. |
| Entrega de turno | Tarjeta del receptor | "Dra. Ana Gómez" (inventada) | "Quién entrega", con la persona de la sesión, y una nota: el sistema todavía no avisa al turno que recibe (pedido 11). |
| Entrega de turno | "Confirmar Entrega de Turno" | Aviso "se notificó a la Dra. Ana Gómez" | Guarda la entrega en este navegador (fecha, turno, quién entrega, todos los pacientes a cargo y notas) y lleva al Historial con el **Aviso** "Entrega registrada (en este navegador…)". Mientras cargan los pacientes, el botón y el cuadro de notas esperan. |
| Entrega de turno | Pestaña "Nueva Entrega" | — | Se queda: es la pestaña activa. El recorrido automático la contó como "nada" porque ya se está ahí. |
| Entrega de turno | Título y etiqueta del turno | Fijos | Salen de la hora: Matutino 07–15, Vespertino 15–23, Nocturno. |
| Historial de entregas | Tabla | 8 filas fijas de agosto de 2026 | Las entregas guardadas. Cada fila abre su resumen (`?entrega=`). Sin entregas, lo dice. |
| Resumen de turno recibido | Encabezado | Fijo | La entrega elegida, o la última: turno, fecha y quién entregó. Si no hay ninguna, lo explica. |
| Resumen de turno recibido | Pendientes | Casillas sin destino | Siguen siendo casillas (**Estado**: marcar). Cada pendiente tiene además "Abrir" (**Pantalla**: la ficha de su paciente). El recorrido automático contaba la casilla como "nada". |
| Resumen de turno recibido | "Marcar como leído" | Aviso | Marca la entrega como leída en este navegador + **Aviso** "(en este navegador)". |
| Reportes | Historial, vista previa, descarga, pendientes, "Entregar", "Generar Nuevo Reporte", "Configurar y Generar" | Archivos y avisos inventados | **Se quitaron**: el backend no tiene reportes clínicos (pedido 14). Quedan "Hoja del paciente" (**Opciones**: los pacientes que no están de alta; abre su hoja imprimible) y los Informes del Sistema. |
| Documentos clínicos | "Descargar" | Aviso "Descargando…" | **Se quitó**: el backend no guarda el archivo (pedido 15). "Ver" y "Subir documento" se quedan. |
| Registro de diagnóstico | "Estudios adjuntos" (zona para subir) | Aviso "Archivo adjuntado" | **Se quitó**: no se guardaba en ningún lado. |
| Configurar umbrales | Listas, interruptores, Mín / Máx, "Restablecer", "Guardar" | Guardaba en el navegador sin cambiar cuándo suena una alerta | **Solo lectura**: los umbrales reales del sistema, que son los mismos para todos los pacientes, hasta el pedido 8. En el Resumen el enlace se llama "Ver umbrales". |
| Detalle de monitor | "Solicitar calibración", "Reportar falla" | Avisos que no llegaban a nadie | **Se quitaron** (pedido 18). "Ver paciente" se queda. |
| Ayuda y soporte | Tarjeta "Contacto directo" (teléfono +52 800…, "Contactar Soporte Técnico") y etiqueta "Servicios Operativos" | Teléfono y folio inventados | **Se quitaron**: el proyecto no tiene correo ni teléfono de soporte. Las preguntas frecuentes de umbrales y turno dicen cómo funciona hoy. |
| Mi Perfil | Interruptores de notificaciones | 5, sin efecto | 3 que funcionan y se guardan en este navegador: aviso en pantalla de las alertas críticas, aviso de las altas y sonido con las críticas. Se quitaron "Nuevas asignaciones" y "Reportes de turno semanales", que no existían. |
| Mi Perfil | "Cambiar Contraseña", "Configurar MFA" | Desactivados con el login real | Con el backend **se quitaron**, y un texto dice que los gestiona el administrador (pedido 17). En modo mock siguen. |
| Mis Pacientes | "Indicar alta médica" | Aviso; no quedaba en ningún lado | Crea un borrador de nota SOAP con el alta en el plan (POST `/soap/notes`) y lo abre para revisarlo y firmarlo. El egreso sigue siendo de Admisión. |
| Confirmación de atención, Interrogatorio, Nota de ingreso | "Confirmar" / "Guardar" | Aviso | Igual, y el aviso dice "en este equipo" o "en este navegador" (pedidos 2 y 11 a 13). |
| Asistente IA y panel | Preguntas rápidas | 5 | 7: se agregan "Gravedad" y "Entrega de turno". Cada una manda un texto que el backend reconoce como su tipo de respuesta (`REVISION-IA-RESPUESTAS.md`). |
| Asistente IA | "Lo que verá la IA" | Médico a cargo fijo ("Carlos Méndez") | El médico a cargo real. Dice además el tipo de respuesta que se pide y los datos que no hay en el expediente. |

## Ronda de detalles (`REVISION-DETALLES.md`)

Todo ícono que es el contenido de un botón, enlace, menú o interruptor es ahora un SVG en línea de `icons.tsx` (antes
una imagen de Figma o un carácter de la fuente del sistema): si la imagen no carga o la fuente no trae el carácter, el
botón ya no queda vacío.

| Pantalla | Elemento | Antes | Ahora |
|---|---|---|---|
| Dashboard | Acciones de cada fila (perfil, monitoreo, nota SOAP, historia) | Imágenes SVG | SVG en línea; el corazón en rojo con el paciente crítico. Cada uno lleva a su ficha. |
| Dashboard | "⚠️ Hace…", "📈 Tendencias…", "Ver todos →", "↑ ↓" | Emojis y caracteres | Íconos en línea (alerta, tendencia, flecha, flechas de signo). |
| Dashboard | "Requiere tu atención ahora" | La evaluación pendiente más antigua primero | La del ingreso más reciente primero: un paciente recién admitido aparece aunque esté estable. |
| Mis Pacientes | "•••" del encabezado | Texto sin acción | **Se quitó**. |
| Mis Pacientes | "•••" de cada fila | Ver expediente, Monitoreo, Nueva nota SOAP, Indicar alta | Ícono en línea y: Abrir expediente, Ver monitoreo, Tendencias, Nueva nota SOAP, Registrar exploración física (si falta), Consultar IA (con permiso) e Indicar alta médica. Solo lo que permite el rol: la enfermera ve abrir, monitoreo y tendencias. |
| Lista UCI | GCS "—" | Sin acción | "Registrar" lleva a la Exploración física, como en el Dashboard y la central. |
| Resumen | "⚙ Ver umbrales" | Carácter | Engrane en línea. |
| Resumen | "Médico Responsable" | El primero del equipo (podía ser la enfermera) | El médico a cargo. |
| Resumen y Antecedentes → "Alergias" | "Registrar alergia", "Corregir", "Marcar inactiva" | No existían | Formulario con sustancia, reacción, severidad (leve, moderada, grave, anafilaxia), estado y fecha (POST y PATCH `/historia/:id/alergias`). Inactivar pide confirmar y elegir "resuelta" o "descartada"; nada se borra. Solo el médico. |
| Turno recibido | "Marcar como Leído ✓" | Carácter | Ícono en línea. |
| Historia clínica y Antecedentes | "Ver … →", "Ver sección →" | Carácter | Flecha en línea. |
| Comparativa, Documentos, Notas SOAP, Registro de diagnóstico, Mis Pacientes, Dispositivos | Flechas de las listas, descargar, subir, filtros | Imágenes | Íconos en línea. |
| Login, Tendencias, acceso | Ver contraseña, "Volver" | Imágenes | Íconos en línea. |
| Mi Perfil | Interruptores de avisos | Imagen del interruptor | Dibujado con CSS. |
| Registro de diagnóstico, Nota de ingreso | Opciones (radio) | Imágenes | Círculos con CSS. |
| Notificaciones | Punto "sin leer" | Imagen | Punto con CSS. |
