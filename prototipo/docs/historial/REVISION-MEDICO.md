# Revisión como médico — informe

> **Estado: fase 2 hecha.** Las secciones 1 a 8 son el informe de la fase 1: cómo se usa el prototipo de punta a punta
> contra el backend real, qué se veía congelado, qué botones no servían y qué se propuso (aprobado). Lo que se hizo y
> cómo se verificó está en la sección 9. La calidad de las respuestas de la IA está aparte, en
> `REVISION-IA-RESPUESTAS.md`.

Las capturas y resultados (los archivos que se nombran abajo) se quitaron del repositorio; siguen en el historial de
git, en el commit c314f64 (`prototipo/docs/revision-medico/`).

## 1. Cómo se probó

- **Backend local** en Docker con los datos de demo (`prototipo/tools/base/base.sh revisar`: 18 pacientes, 16 a cargo
  del médico y 16 de la enfermera, permiso de IA).
- **Publicador de demo** corriendo (`prototipo/tools/telemetria-demo`: 15 monitores, lecturas cada 30 s y onda del
  ECG).
- **Prototipo en modo real** (`npm run dev` con `VITE_API_MODE=real`), con el médico del seed. Pocas entradas: una por
  prueba, dentro del límite de 5 cada 15 minutos.
- **Tres pruebas automáticas** (Edge sin ventana, con la página visible):
  1. **Recorrido de pantallas:** las 19 pantallas generales y las 18 fichas del paciente con **DEMO-0002** (crítico,
     sospecha de TEP), tocando todo lo que no escribe en la base. Las fichas de **DEMO-0011** (estable) y **DEMO-0009**
     (no es de los 8) se recorrieron con captura y revisión de datos. En total, 73 pantallas y 564 elementos tocables.
  2. **Nada congelado:** 9 pantallas de signos abiertas 3,5 minutos cada una. Se comparan los números, las gráficas y
     la onda del ECG al inicio y al final.
  3. **Recorrido de un médico:**
     - entrar, ver el dashboard y el turno;
     - atender una alerta;
     - abrir un paciente y ver sus signos y tendencias;
     - escribir y firmar una nota SOAP;
     - pedirle ayuda a la IA (con un Ollama local con el modelo del servidor);
     - entregar el turno.
- **Ojo, condición de prueba:** para los recorridos automáticos subí el techo general de peticiones del backend local
  de 100 a 1.000 por minuto, con un override temporal y sin tocar el `.env`. Con el techo normal, el recorrido recibió
  429 en 118 de 275 peticiones en 10 minutos y medía el límite, no la app. Eso también es un hallazgo (sección 5.1). El
  límite de login no se tocó.

## 2. Recorrido de un médico, de punta a punta

| # | Paso | Resultado | Captura |
|---|---|---|---|
| 1 | Entrar con el código | Funciona; llega al Dashboard | `jornada-01-…` |
| 2 | Ver su dashboard | Funciona, pero **"Requiere tu atención ahora" muestra alertas de hace 4, 7 y 13 h** como si fueran de ahora (problema 3) | `problema-dashboard-atencion.jpg` |
| 3 | Ver su turno (resumen recibido) | Se ve, pero los **pendientes no llevan a ningún lado** y el contenido es simulado (la entrega de turno no existe en el backend, pedido 11) | `problema-turno-recibido.jpg` |
| 4 | Atender una alerta | Funciona (Centro de alertas → Atender → acción → Confirmar), pero **solo queda en el navegador**: el backend no tiene cómo marcar una alerta atendida (pedido 2) y al recargar vuelve a aparecer | `jornada-04…`, `jornada-05…` |
| 5 | Abrir un paciente crítico desde el dashboard | Funciona (la prueba falló por buscar el nombre al revés: la tabla dice "Montenegro Sáez, Ileana") | `jornada-06…` |
| 6 | Ver sus signos en vivo | FC, SpO2 y FR reales, ECG en vivo. Pero **TEMP, SpO2, PA y FR son líneas rectas en diagonal** (problema 2), las **alertas activas incluyen de hace 7 h** (problema 3) y el **Glasgow está "Pendiente" sin forma de registrarlo** (problema 6) | `problema-monitor-de-cama.jpg` |
| 7 | Ver sus tendencias | Se ven, pero con **tres puntos en 24 h**, y en el servidor sería uno (problema 1). En 3,5 minutos **no cambian** (problema 7) | `problema-tendencias-24h.jpg` |
| 8 | Escribir y firmar una nota SOAP | Funciona contra el backend: se guarda, se firma y aparece en el historial | `jornada-10…`, `jornada-11…` |
| 9 | Pedir ayuda a la IA | Funciona con el modelo real. La calidad de la respuesta está en `REVISION-IA-RESPUESTAS.md` (salió la plantilla completa para "Diferenciales") | `jornada-12…` |
| 10 | Entregar el turno | Funciona como simulación, pero el aviso dice **"se notificó a la Dra. Ana Gómez"**: esa persona no existe y nadie recibe nada. El historial al que lleva tiene **filas fijas de agosto de 2026** | `jornada-13…`, `problema-historial-entregas.jpg` |

**Para que el recorrido sea completo de verdad faltan, del backend:**
- atender una alerta (pedido 2);
- la entrega de turno con su destinatario (pedido 11);
- que las alertas no se repitan cada 30 s (pedido 28).

Del prototipo: todo lo de la sección 3.

## 3. Problemas ya vistos y arreglo propuesto

### 3.1 Tendencias: un solo punto en 24 h

- **Qué pasa:** la gráfica parte las horas en **6 tramos fijos** y dibuja un punto por tramo con lecturas. Las
  lecturas reales son de las últimas horas, así que en 24 h hay uno a tres puntos, todos a la derecha.
  - `GET /sensors/readings` **no filtra por fecha** y devuelve como mucho **500 lecturas**: con el publicador cada
    30 s, son unas 4 horas.
  - En 3,5 minutos la pantalla casi no cambió: 1 número de 16 y ninguna gráfica.
- **Arreglo en el prototipo:**
  - El publicador de demo con `--historia 24h`: al arrancar manda las lecturas de las últimas 24 h con su fecha pasada,
    cada 5 minutos y siguiendo el caso de cada paciente. El backend las guarda como "atrasadas", sin avisos en vivo.
  - La gráfica dibuja **cada lectura en su hora real** sobre un eje de tiempo, con marcadores cuando hay pocas, y una
    nota "Sin lecturas antes de las HH:MM" cuando el rango empieza antes de la primera.
  - El último punto y el valor de la cabecera se actualizan con cada lectura nueva.
- **Depende del backend:** con el tope de 500 y sin filtro de fecha, **48 h y 7 d nunca van a estar completas**, y 24 h
  se van perdiendo a medida que llegan lecturas nuevas. Hace falta el histórico por hora o un filtro `desde`/`hasta`
  (pedido 9). Hasta entonces la gráfica dice desde cuándo hay datos.

### 3.2 Monitor de cama: TEMP, SpO2, PA y FR en diagonal

- **Qué pasa:** en Monitoreo detallado esas cuatro filas son **imágenes fijas de Figma** (`temp-wave.svg`,
  `spo2-wave.svg`, `bp-wave.svg`): una línea recta en diagonal. Lo mismo en el panel de signos de **Nueva Nota SOAP**
  (ECG, SpO2 y PA).
- **Arreglo en el prototipo:**
  - Cada fila es la curva de las **últimas lecturas**, de unos 15 a 30 minutos. FC, SpO2, FR y temperatura salen del
    backend; la PA, de la simulación.
  - Avanza con cada lectura nueva.
  - En la nota SOAP, lo mismo, con la onda real del ECG.

### 3.3 "Alertas activas" con alertas de hace días

- **Qué pasa:** se agrupan todas las alertas no resueltas, y **nadie puede resolverlas** (no hay ruta para atenderlas,
  pedido 2). Lo que se vio:
  - En Monitoreo detallado de DEMO-0002, 3 de las 4 "activas" tenían el último aviso **hace 7 h**.
  - En el Dashboard, "Requiere tu atención ahora" mostraba alertas de hace 4, 7 y 13 h.
  - Las nuevas del publicador sí aparecen ("el último hace 6 min"), pero mezcladas con las viejas.
- **Definición propuesta:** una alerta está **activa** si no está resuelta y su **último aviso es de los últimos
  30 minutos**.
  - Las demás sin atender van a una línea plegada: "Anteriores sin atender (N)".
  - Aplica igual en el Dashboard, Resumen, Monitoreo detallado y Centro de alertas.
  - Los 30 minutos quedan en una constante.
- **Depende del backend:** atender o resolver (pedido 2) y no repetir la alerta en cada lectura (pedido 28). Con eso
  la lista deja de crecer sola.

### 3.4 "Pendientes de evaluación" no lleva a ningún lado

- **Qué pasa:** la tarjeta del Dashboard solo filtra la tabla de abajo, sin aviso. El recorrido la marcó como "no hace
  nada" y en la pantalla no se nota.
- **Arreglo:**
  - Lleva a **Mis Pacientes filtrado a "Evaluación pendiente"**, donde cada fila abre la **Exploración física** del
    paciente para registrarla.
  - Al guardarla, el paciente sale de la lista (la exploración es real en el backend).

### 3.5 La onda del ECG

- **Monitoreo detallado y Resumen:**
  - El barrido empieza vacío y tarda 4 s en llenar el recuadro (en la captura, dos latidos a la izquierda).
  - La escala vertical es fija.
  - **Arreglo:** desplazamiento en vez de barrido (lo último a la derecha), con la ventana llena desde el primer lote,
    y la escala ajustada a la señal para que ocupe el alto del recuadro.
- **Tarjetas de la central:**
  - Las 5 tarjetas tienen **el mismo trazo con 6 latidos**, con FC 54 o 113. Solo cambia la velocidad de la animación.
  - **Arreglo:** el número de latidos en el recuadro sale de la FC de cada cama (54 lpm → unos 4, 113 lpm → unos 8);
    en la fibrilación auricular (DEMO-0005), intervalos irregulares. Sigue siendo un trazo simulado (pedido 29).

### 3.6 Glasgow "Pendiente / Sin exploración física"

- **Qué pasa:** en Monitoreo detallado, en la central (GCS "—") y en el Dashboard no hay forma de ir a registrarlo.
- **Arreglo:** el texto "Pendiente" es un enlace **"Registrar exploración física"** a la Exploración física del
  paciente. Al guardarla, el Glasgow aparece en todas esas pantallas (es real en el backend).

### 3.7 Nada congelado

Ver la sección 4.

### 3.8 Botones sin utilidad

Ver la sección 6.

## 4. Nada congelado: 3,5 minutos por pantalla

Cada pantalla se dejó abierta 3,5 minutos con el publicador corriendo. Los números se comparan uno por uno (sin fechas
ni conteos); las gráficas y la onda, por su trazo.

| Pantalla | Números que cambiaron | Lo que se quedó igual y no debería | Inicio / final |
|---|---|---|---|
| Dashboard | 13 de 26 (FC, SpO2 y PA de la tabla) | 2 de las 6 minigráficas de tendencias | `congelado-MedDashboardPrincipal__inicio/final.jpg` |
| Central — Grid | 28 de 31 | **Las 5 ondas de las tarjetas** (mismo trazo); la temperatura de una cama | `congelado-MedMonitoreoGridUci__…` |
| Central — Lista | 22 de 33 | Algunas temperaturas y FR | `congelado-MedMonitoreoListaUci__…` |
| Comparativa | 22 de 32 | — (las 8 gráficas cambiaron) | `congelado-MedMonitoreoComparativa__…` |
| Mis Pacientes | 17 de 30 | — | `congelado-MedPacientesLista__…` |
| Resumen (DEMO-0002) | 16 de 20 | — (la onda del ECG cambia) | `congelado-MedPacienteResumen-DEMO-0002__…` |
| Monitoreo detallado (DEMO-0002) | 15 de 34 | **Las 4 curvas de TEMP, SpO2, PA y FR** (imágenes fijas). **Todos los laboratorios**. FR 26 | `congelado-MedPacienteMonitoreoDetallado-DEMO-0002__…` |
| Tendencias (DEMO-0002) | **1 de 16** | **Las gráficas y los valores de cabecera** (FC 113, SpO2 91, temperatura 37,6) | `congelado-MedPacienteTendenciasVitales-DEMO-0002__…` |
| Monitoreo detallado (DEMO-0009) | 12 de 27 | Las 4 curvas; temperatura 36,7; laboratorios | `congelado-MedPacienteMonitoreoDetallado-DEMO-0009__…` |

**Causas y arreglo:**
- **Curvas del monitor de cama y de la nota SOAP:** imágenes fijas (3.2).
- **Ondas de las tarjetas:** el mismo trazo para todas (3.5).
- **Tendencias:**
  - Seis tramos fijos de 4 h en la vista de 24 h: una lectura nueva no mueve ningún punto, y se piden cada 60 s
    (3.1).
  - La cabecera usa el último tramo y no la última lectura.
- **Laboratorios con separador de miles por espacio** ("Dímero D 4 850"): la simulación solo reconoce "4" y el número
  no cambia nunca. Además, el periodo de los laboratorios es de horas.
  - Se arregla el reconocimiento.
  - Que un laboratorio "se mueva" cada pocos minutos no tiene sentido clínico. Propuesta: cambian solo **cuando llega
    un resultado nuevo simulado**, cada 1 a 2 horas, con su hora ("hace 40 min") a la vista, así se nota que es un
    resultado y no un monitor.
- **Temperatura y SpO2 que a veces no cambian en 3,5 minutos:** el publicador las mueve menos que el redondeo
  (temperatura ±0,04 entre lecturas). Más ruido de medición: temperatura ±0,1 y SpO2 ±1.
- **Valores que sí deben quedarse quietos** y no son problema: conteos (pacientes asignados, alertas críticas),
  pupilas, nivel de conciencia, ventilación mecánica.

## 5. Otros hallazgos, pantalla por pantalla

### 5.1 Peticiones al backend (afecta a todas las pantallas)

- **El flujo de alertas y la onda del ECG reintentan cada 3 s aunque el backend responda 429.** En 10 minutos hubo 38
  reconexiones rechazadas de `/alerts/stream` y 9 de la onda, y cada una gasta el mismo cupo de 100 por minuto. Así,
  un 429 genera más 429.
  - **Arreglo:** ante un 429, esperar lo que diga `Retry-After` o 30 s, y crecer la espera si se repite.
- React Query reintenta una vez ante un 429. **Arreglo:** no reintentar un 429 y mostrar "Demasiadas consultas,
  espere unos segundos" en lugar de "No se pudo cargar".
- Datos que casi no cambian (lista de pacientes, expediente) se piden cada vez que se vuelve a una pantalla, pasados
  30 s. **Arreglo:** 5 minutos de vigencia para esos datos; los signos siguen cada 15 s.
- **Depende del backend:** el techo de 100 por minuto por IP (pedido 33).

### 5.2 Dashboard

- "Requiere tu atención ahora" con alertas de horas atrás (3.3).
- "Pendientes Evaluación" sin destino (3.4).
- GCS "—" en todas las filas (3.6).

### 5.3 Central de monitoreo (Grid y Lista)

- Ondas iguales en las tarjetas (3.5).
- GCS "—" (3.6).
- Sin errores ni textos cortados.

### 5.4 Ficha del paciente

- **Resumen:**
  - ECG en vivo y signos que cambian.
  - **"Última Nota SOAP" puede mostrar una adenda**, que trae una sola sección: S, O y P quedan en "—"
    (`problema-ultima-nota-adenda.jpg`, DEMO-0009). Pasa desde que las listas incluyen las adendas. **Arreglo:** mostrar la última nota que no es adenda,
    con "N adendas" si las tiene.
  - Alertas con "hace 7 h" (3.3).
- **Monitoreo detallado:**
  - las curvas, las alertas viejas y el Glasgow (3.2, 3.3, 3.6);
  - laboratorios fijos (sección 4);
  - en DEMO-0009 (perfil generado) los paneles tienen datos; los "—" son campos que no aplican al caso (PEEP, EtCO2,
    hemoderivados) y el Glasgow (3.6). Se ve en `monitoreo-demo-0009.jpg`.
- **Tendencias:** 3.1.
- **Nueva Nota SOAP:**
  - curvas fijas en el panel de signos (3.2);
  - el botón "Nueva Nota SOAP" de la cabecera aparece dentro de la misma pantalla y no hace nada.
- **Configurar umbrales:** se guardan en el navegador, pero **las alertas siguen usando los umbrales fijos del
  backend** (pedido 8). Engaña: un médico que los cambia cree que cambió cuándo suena la alerta.
- **Documentos clínicos:** "Descargar" muestra "Descargando…" y no baja nada. El backend no guarda el archivo
  (pedido 15).
- **Registro de diagnóstico:** "Adjuntar archivo" muestra "Archivo adjuntado" y no se guarda nada.
- **Interrogatorio, Nota de ingreso, Indicaciones:** funcionan y se guardan en el navegador (simulado, pedidos 11 a
  13). No dicen que se guardan solo ahí.

### 5.5 Turno

- **Resumen recibido:** los 8 pendientes parecen tocables y no hacen nada.
- **Entrega:**
  - el aviso nombra a una "Dra. Ana Gómez" inventada;
  - "Nueva Entrega" no hace nada;
  - "Generar Reporte" solo muestra un aviso.
- **Historial:** filas fijas de agosto de 2026, que no son las entregas hechas.

### 5.6 Reportes

- Reportes por paciente, pendientes de entrega e historial **inventados**. "Descargar", "Entregar" y "Generar" solo
  muestran avisos. El backend no tiene reportes clínicos (pedido 14).
- La pestaña "Informes del Sistema" (bitácora del ETL y CSV) es real y funciona.

### 5.7 Otras pantallas

- **Ayuda y soporte:**
  - "Enviar solicitud" muestra un folio inventado (#4821).
  - El teléfono "+52 800 123 4567" es de relleno, con prefijo de México.
- **Mi Perfil:**
  - Las 5 preferencias de notificación cambian un interruptor que no afecta nada.
  - Cambiar contraseña y MFA están desactivados con el login real (pedido 17).
- **Detalle de monitor:** "Solicitar calibración" y "Reportar falla" solo muestran un aviso; no llegan a nadie
  (pedido 18).
- **Mis Pacientes:** "Indicar alta" muestra "Alta médica indicada · Admisión completará el egreso" y no queda en
  ningún lado.
- **Búsqueda, Notificaciones, Asistente IA y Dispositivos:** funcionan. La calidad de la IA está aparte.
- **Desbordes y textos cortados:** ninguno a 1440 px en las 73 pantallas. Las capturas a 1024 y 390 px van en la
  fase 2, con las verificaciones pendientes del PR de conexión.
- **Errores de consola:** ninguno con el techo de peticiones alto.

## 6. Botones sin utilidad: inventario y propuesta

El inventario completo de lo tocable (564 elementos, con lo que hizo cada uno) se quitó del repositorio con las
capturas; sigue en el commit c314f64 (`prototipo/docs/revision-medico/inventario-tocables.md`). Esta tabla es solo lo que **no hace nada real**, lo que **solo muestra
un aviso de relleno** o lo que **no tiene sentido para un médico**.

| Pantalla | Botón o elemento | Qué hace hoy | Propuesta | Motivo |
|---|---|---|---|---|
| Las 18 fichas (cabecera) | Generar Reporte | Aviso "Reporte de X generado"; no genera nada | **Funcionar** | Abre una hoja imprimible del paciente con datos reales: identificación, diagnósticos, alergias, medicamentos, últimos signos, alertas activas y última nota. Se imprime o se guarda en PDF desde el navegador |
| Nueva Nota SOAP | Nueva Nota SOAP (cabecera) | Nada: ya se está ahí | **Quitar** en esa pantalla | Redundante |
| Dashboard | Tarjeta "Pendientes Evaluación" | Filtra la tabla sin que se note | **Funcionar** | Lleva a Mis Pacientes filtrado; cada fila abre la Exploración física (3.4) |
| Monitoreo detallado, central, Dashboard | "Pendiente" / GCS "—" | Texto | **Funcionar** | Enlace a registrar la exploración física (3.6) |
| Comparativa | Exportar | Aviso "Comparativa exportada (PDF)" | **Funcionar** | Imprime la comparativa (vista de impresión del navegador) |
| Comparativa | Botón de "admite 2 pacientes" | Aviso informativo | **Quitar** | No hace nada; el texto puede ir como ayuda fija |
| Turno — Resumen recibido | Las filas de pendientes (8) | Nada | **Funcionar** | Cada pendiente abre la ficha de su paciente |
| Turno — Resumen recibido | Marcar como leído | Aviso; queda en el navegador | **Dejar** | Simulado hasta el pedido 11; se aclara "en este navegador" |
| Entrega de turno | Generar Reporte | Aviso "Reporte de turno generado" | **Funcionar** | Hoja imprimible de la entrega |
| Entrega de turno | Nueva Entrega | Nada | **Quitar** | La pantalla ya es la entrega nueva |
| Entrega de turno | Confirmar entrega | Aviso "se notificó a la Dra. Ana Gómez" (inventada) | **Funcionar (simulado)** | Guarda la entrega con su fecha, autor y pacientes. El aviso dice que queda registrada en el prototipo, sin un destinatario inventado |
| Historial de entregas | Tabla | 8 filas fijas de agosto de 2026 | **Funcionar (simulado)** | Muestra las entregas guardadas; cada una abre su detalle |
| Reportes | Historial, Vista previa, Descargar | Archivos y texto inventados; "Descargando…" | **Quitar** | El backend no tiene reportes clínicos (pedido 14). Quedan la hoja del paciente (arriba) y los Informes del Sistema |
| Reportes | Pendientes de entrega y Entregar | Aviso | **Quitar** | Inventados |
| Reportes | Generar Nuevo Reporte / Configurar y Generar | Modal y aviso "Reporte generado" | **Funcionar** | Elige el paciente y abre su hoja imprimible (la misma de la cabecera) |
| Documentos clínicos | Descargar | Aviso "Descargando…" | **Quitar** | El backend no guarda el archivo (pedido 15); "Subir" registra la ficha y se queda |
| Registro de diagnóstico | Adjuntar archivo | Aviso "Archivo adjuntado" | **Quitar** | No se guarda en ningún lado |
| Configurar umbrales | Guardar, Restablecer | Guarda en el navegador; no cambia las alertas | **Cambiar a solo lectura** | Mostrar los umbrales reales del sistema (los de `mqttIngest.ts`) sin editar, hasta el pedido 8 |
| Detalle de monitor | Solicitar calibración | Aviso | **Quitar** | No llega a nadie y no es tarea del médico (pedido 18) |
| Detalle de monitor | Reportar falla | Aviso | **Quitar** | No llega a nadie (pedido 18) |
| Ayuda y soporte | Contactar soporte → Enviar solicitud | Aviso con folio inventado | **Funcionar** | Abre un correo (`mailto:`) a la dirección de soporte del proyecto; si no hay una, se quita |
| Ayuda y soporte | +52 800 123 4567 | Texto de relleno | **Quitar** | Número inventado |
| Mi Perfil | Alertas críticas en tiempo real; Alertas de prioridad alta; Sonido de alerta | Interruptores sin efecto | **Funcionar** | Controlan el aviso en pantalla de las críticas, el de las altas y un sonido corto con la crítica |
| Mi Perfil | Nuevas asignaciones; Reportes de turno semanales | Interruptores sin efecto | **Quitar** | No existen |
| Mi Perfil | Cambiar contraseña, Activar MFA | Desactivados con el login real | **Quitar** con el backend | No hay cómo hacerlo (pedido 17); en modo mock siguen |
| Mis Pacientes | Indicar alta | Aviso; no queda en ningún lado | **Funcionar** | Crea un borrador de nota SOAP con "Alta médica indicada" en el plan, que el médico revisa y firma (real). El egreso lo hace Admisión |
| Centro de alertas | Atender → Confirmar atención | Queda en el navegador | **Dejar**, aclarando | Hasta el pedido 2: el aviso dice "registrada en este equipo" |
| Centro de alertas | Silenciar 15 min | Silencia en la pantalla | **Dejar** | Útil y local por naturaleza |
| Interrogatorio, Nota de ingreso, Indicaciones | Guardar | Guarda en el navegador | **Dejar**, aclarando | Simulado hasta los pedidos 11 a 13; el aviso dice "guardado en este navegador" |

Lo demás (navegación, pestañas, filtros, paginación, ventanas, acciones reales de notas, diagnósticos, exploración,
notificaciones y búsqueda) funciona y se queda.

## 7. Qué se arregla en el prototipo y qué depende del backend

**En el prototipo (fase 2):**
- Los problemas 3.1 a 3.6.
- Lo congelado de la sección 4.
- Lo de las secciones 5.1 a 5.7 que no espera al backend.
- La tabla de botones de la sección 6.
- El publicador de demo: `--historia 24h` y más ruido de medición en temperatura y SpO2.
- `BOTONES.md` actualizado con lo que se quitó o se hizo funcionar.

**Depende del backend** (pedidos de `CONEXION-BACKEND.md`):

| Pedido | Qué destraba |
|---|---|
| 2. Atender una alerta | Que la atención quede registrada para todos y las alertas dejen de estar "activas" |
| 8. Umbrales por paciente | Volver a editar umbrales |
| 9. Histórico por hora o lecturas con `desde`/`hasta` | Tendencias de 24 h, 48 h y 7 d completas |
| 10. PA como lectura | PA real en el monitor, las tendencias y la IA (y los puntajes NEWS2 y qSOFA completos) |
| 11. Entrega de turno | Entregas reales, con destinatario y notificación |
| 14. Reportes clínicos | Reportes por paciente guardados |
| 15. Archivos de documentos | Descargar documentos |
| 17. Contraseña y MFA | Mi Perfil completo |
| 18. Detalle de dispositivo | Calibraciones y fallas |
| 28. No repetir alertas | Que "58 alertas abiertas" no crezca cada 30 s |
| 33. Techo de peticiones | Usar la app rápido sin 429 |

## 8. Qué hay que correr en el servidor (después de la fase 2)

Como `siappc`, en `/opt/siappc`. Al mezclar en `dev`, el despliegue automático (`~/deploy.sh`) trae el código. Lo
demás, un paso por bloque:

1. **Prototipo y backend.** Si el despliegue no los reconstruyó (el backend cambia por la IA):

   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build prototipo backend
   ```

2. **Imagen del publicador de demo**, con la opción nueva `--una-vez` para la historia:

   ```bash
   docker build -t siappc-telemetria-demo prototipo/tools/telemetria-demo
   ```

3. **Parar el publicador que está corriendo:**

   ```bash
   docker stop siappc-telemetria-demo && docker rm siappc-telemetria-demo
   ```

4. **Historia de 24 h, una sola vez.** ⚠️ **Cambia datos de la base del servidor, que también usa la app principal:**
   agrega unas 17.000 lecturas (15 equipos `DEMO-DEV-*`, 24 h, una cada 5 min) a la tabla `lectura`. Quedan dentro de
   los umbrales, así que no crean alertas ni notificaciones. Las verá también la app principal en los pacientes DEMO.
   Correrla dos veces la duplica:

   ```bash
   docker run --rm --network siappc_default --env-file .env -v "$PWD/infra/mosquitto/certs/ca.crt:/certs/ca.crt:ro" siappc-telemetria-demo node publicador.mjs --historia 24h --una-vez
   ```

5. **El publicador como siempre**, una lectura por minuto:

   ```bash
   docker run -d --name siappc-telemetria-demo --restart unless-stopped --network siappc_default --env-file .env -e PERIODO_S=60 -v "$PWD/infra/mosquitto/certs/ca.crt:/certs/ca.crt:ro" siappc-telemetria-demo
   ```

6. **Modelo de la IA.** Sigue MedGemma 4B Q4_K_M; no hay que bajar nada. Confirmar que el backend apunta al Ollama:

   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml exec backend printenv LLM_URL LLM_MODEL
   ```

   Tiene que decir la URL del Ollama y `hf.co/Mungert/medgemma-4b-it-GGUF:Q4_K_M`.

## 9. Fase 2: qué se hizo

Todo lo aprobado, en un solo PR (rama `feature/prototipo-revision-medico`). Los botones, en `BOTONES.md` ("Revisión del
médico (fase 2)"); la IA, en `REVISION-IA-RESPUESTAS.md` (secciones 6 a 8).

| Problema | Arreglo | Dónde |
|---|---|---|
| 3.1 Tendencias con un punto | Eje de tiempo real con cada lectura; marcadores si hay pocas; "Lecturas del monitor desde las HH:MM" y qué es simulado. El publicador carga 24 h de historia una vez | `MedPacienteTendenciasVitales`, `sinBackend.ts` (`getSerie`), `tools/telemetria-demo` |
| 3.2 Curvas en diagonal | `CurvaSigno` con las lecturas de los últimos 30 min; la PA simulada | `components/monitor/CurvaSigno.tsx`, Monitoreo detallado, Nueva Nota SOAP |
| 3.3 Alertas viejas activas | Activa = último aviso de los últimos 30 min (`VIGENCIA_ALERTA_MIN`); las demás en "Anteriores sin atender" | `lib/alerts.ts`, `components/ui/AnterioresSinAtender.tsx`, 5 pantallas |
| 3.4 Pendientes de evaluación | Mis Pacientes `?filtro=evaluacion`; cada fila abre la Exploración física | Dashboard, `MedPacientesLista` |
| 3.5 ECG | Desplazamiento lleno desde el primer lote y escala automática; tarjetas con los latidos de su FC, irregulares en la FA | `EcgLive.tsx`, `BedCards.tsx` |
| 3.6 Glasgow | "Registrar exploración" (solo con permiso de editar la historia clínica) | `components/patient/RegistrarExploracion.tsx` |
| 4 Congelado | Laboratorios simulados que cambian cuando llega un resultado (cada 1 a 2 h) y dicen hace cuánto; separador de miles reconocido; más ruido de medición en el publicador | `simulacion.ts`, `publicador.mjs` |
| 5.1 Peticiones | 429: espera `Retry-After` o crece hasta 60 s (alertas y onda); React Query no reintenta un 429 y la pantalla dice "Demasiadas consultas seguidas"; pacientes y expediente vigentes 5 min | `alertStream.ts`, `EcgLive.tsx`, `main.tsx`, `queries.ts`, `PatientLayout.tsx` |
| 5.4 Última nota | La última que no es adenda, con "Con N adendas" | Resumen, Nueva Nota SOAP, Comparativa |
| 6 Botones | La tabla de la sección 6, con las decisiones aprobadas | `BOTONES.md` |

### 9.1 Dos errores más, encontrados al verificar

- **Entrega de turno vacía.** Mientras cargaba la lista de pacientes, "Confirmar Entrega de Turno" ya se podía tocar,
  y el recorrido guardó una entrega con 0 pacientes. Además se guardaban solo los de entrega directa. Ahora los botones
  y el cuadro de notas esperan a que cargue (lo escrito antes se perdía) y la entrega lleva todos los pacientes a cargo:
  el recorrido contra el backend local guarda "16 pacientes incluidos".
- **"Alertas activas" del Centro de alertas contaba todas las abiertas** (16) mientras la lista mostraba 7 activas y 9
  anteriores. Ahora cuenta con la misma regla de 30 minutos. "Desde las 15:53" de un grupo que empezó el día anterior
  ahora dice "desde ayer a las 15:53".

### 9.2 Verificación

Mismas condiciones que la fase 1: backend local con la base de demo, el publicador con 24 h de historia, el modelo
del servidor en un Ollama local y el techo general de peticiones en 1.000 por minuto solo para las pruebas
automáticas.

| Prueba | Resultado |
|---|---|
| `tsc` y `npm run build` del prototipo | Pasan |
| `tsc` del backend | Pasa (con el cliente de Prisma generado) |
| Pruebas del backend sin base (`aiTemas`, `aiParse`, `aiPuntajes`, `aiAuto`, `mqttOrden`) | 118 de 118 |
| Pruebas del backend con base | No corrieron en esta máquina: el `backend/.env.test` local no tiene la contraseña actual de Redis (ver la nota de abajo). Ninguna de esas pruebas toca la IA |
| Suite de interacción en modo mock completa (Edge sin ventana) | 60 de 60, repetida después de los últimos arreglos. En corridas anteriores apareció a veces una excepción `MessageNotSentError` que no sale del código de la app (no está en `src/` ni en `node_modules`): es del propio Edge |
| Recorrido del médico contra el backend local | 16 de 16 pasos: entrar, dashboard, pendientes de evaluación, su turno, atender y confirmar una alerta, abrir un crítico, monitoreo, tendencias de 24 y 6 h, hoja del paciente, nota SOAP escrita y firmada, consulta a la IA, entregar el turno, historial y resumen de la entrega con los 16 pacientes (`fase2/jornada.json`) |
| Capturas a 1920, 1440, 1024 y 390 | Las 40 pantallas del médico y de acceso, sin desplazamiento lateral en ninguna. Los textos recortados son los resúmenes de las notas SOAP (recorte a propósito). A 1920, Monitoreo detallado deja espacio libre a la derecha porque sus columnas tienen ancho fijo desde Figma; ya estaba así antes de este PR |
| Nada congelado, 3,5 min por pantalla | Ver la tabla de abajo (`fase2/congelado.json`) |

**Nada congelado, antes y después** (números que cambiaron / gráficas iguales):

| Pantalla | Fase 1 | Fase 2 |
|---|---|---|
| Dashboard | 13 de 26; 2 minigráficas quietas | 10 de 26; ninguna gráfica quieta |
| Central — Grid | 28 de 31; **las 5 ondas iguales** | 23 de 31; cada onda con su FC (la que quedó igual es de una cama con la misma FC al inicio y al final) |
| Comparativa | 22 de 32 | 23 de 31; ninguna gráfica quieta |
| Monitoreo detallado (DEMO-0002) | 15 de 34; **las 4 curvas fijas** | 9 de 36; las curvas de TEMP, SpO2, PA y FR se mueven (las "iguales" son íconos). Quedan quietos los laboratorios y la gasometría: cambian cuando llega un resultado, cada 1 a 2 h |
| Tendencias (DEMO-0002) | **1 de 16; todas las gráficas quietas** | 7 de 16; las 4 gráficas de signos se mueven |
| Resumen (DEMO-0002) | 16 de 20 | 12 de 19; la onda del ECG cambia (no hay otras gráficas: las que cuenta la prueba son íconos) |

**Lo que no se arregla en el prototipo** sigue en la sección 7. Las tendencias de 24 h dependen del pedido 9: el
backend devuelve como mucho 500 lecturas: con el publicador del servidor (una por minuto) son unas 8 horas. La gráfica
dice desde qué hora hay lecturas.

**Nota para correr las pruebas con base:** `backend/.env.test` tiene que tener la `REDIS_URL` con el `REDIS_PASSWORD`
actual del `.env` de la raíz y `DB_PORT=3307` (el puerto que publica MariaDB). También hace falta instalar las
dependencias de `Pruebas/` una vez:

```bash
cd Pruebas && npm ci
docker compose -f docker-compose.yml -f docker-compose.test.yml up -d
cd backend && npm test
```

Las capturas del después se quitaron del repositorio; siguen en el historial de git, en el commit c314f64
(`prototipo/docs/revision-medico/fase2/`).
