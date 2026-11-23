# Inventario de elementos tocables — paso 2 (prototipo clicable)

> **Estado: hecho.** El paso 2 quedó implementado como se describe aquí (rama `feature/prototipo-clicable`).
> La columna **Antes** es cómo estaba cada elemento al empezar el paso; **Ahora** es lo que hace. Lo que se
> agregó además de la propuesta aprobada va marcado con *(extra)*.
>
> **Actualizado con la revisión de acceso y roles** (rama `feature/prototipo-login-revision`, ver `REVISION.md`):
> pantallas de acceso nuevas, se quitó lo que no le corresponde al médico (marcado **[R1]**…**[R7]**) y se
> unificaron botones y paginación (**[C1]**…**[C8]**). Esas filas dicen cómo quedaron después de la revisión.

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

- **Un solo paciente de ejemplo.** Todo lo que abre un expediente (de cualquier paciente) lleva a las pantallas de
  María González, que son las únicas que existen en Figma.
- **Datos de ejemplo extra** solo donde hacen falta para que funcionen la paginación y los filtros (ej. "Mostrando 5
  de 12" necesita 12 pacientes). Se agregan con el mismo formato que los de Figma.
- **El estado es local**: se pierde al recargar. Lo que cruza de pantalla (ej. confirmar una alerta y volver al
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
vuelta), `src/data/devices.ts` (12 monitores) y `src/data/soap.ts` (5 notas SOAP). Búsqueda sin tildes ni
mayúsculas: `src/lib/text.ts`.

---

## Partes compartidas (aparecen en todas o varias pantallas)

| Elemento | Antes | Ahora |
|---|---|---|
| Menú lateral: 6 opciones | ✅ llevan a su pantalla | Se queda igual. |
| Menú lateral: logo "SIAPPC" | ❌ | **Pantalla**: Dashboard. |
| Menú lateral: "?" (ayuda) | ✅ Ayuda y Soporte | Se queda igual. |
| Menú lateral: tarjeta del médico | ✅ Mi Perfil | Se queda igual. |
| Menú lateral: ícono de cerrar sesión | ⚠️ está dentro del enlace al perfil, lleva a Mi Perfil | **Modal**: botón aparte → "¿Cerrar sesión?" → **Aviso** "Sesión cerrada" y lleva al **Login**. |
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

## Queda para el paso 3 (campos de texto)

Confirmación de atención (acción tomada, notas) · Entrega de turno (notas generales) · Umbrales (Mín/Máx) ·
Diagnósticos activos (nota correlativa) · Nueva nota SOAP (S/O/A/P) · Registro de diagnóstico (descripción, fecha,
notas, búsqueda de CIE-10) · Nota de ingreso, Datos personales y Exploración física (si se quieren editables).

## Informativo (no se toca)

Tarjetas de indicadores (salvo las del Dashboard), badges de estado, gráficas y monitores, leyendas de color
(Estable / Monitoreo / Crítico), tarjetas de la línea de tiempo de hospitalizaciones, "Última nota SOAP" y
"Dispositivo IoT" del Resumen, filas de tablas clínicas (antecedentes, diagnósticos, medicamentos, estudios,
resumen métrico de la comparativa) y "Diagnósticos previos". No tienen apariencia de botón (no cambian el cursor).
