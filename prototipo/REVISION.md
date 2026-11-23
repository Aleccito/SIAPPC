# Revisión — pantallas de acceso y pantallas del médico

> **Estado: hecho.** Aprobado completo ("Approve all") e implementado en la rama `feature/prototipo-login-revision`.
> Ajustes al implementar, respecto de lo escrito abajo:
> - **V12 Umbrales:** a 768 px la tabla ya entra con las columnas angostas, así que las tarjetas son solo en celular (< 768 px).
> - **V14 CIE-10:** el campo va a todo el ancho por debajo de 1280 px; a 390 px el código elegido todavía se corta con "…".
> - **V3 a 1440:** el Dashboard y el Resumen de turno recibido muestran la sombra del borde, porque sus tablas ya se
>   desplazaban de lado en el diseño de Figma (Glasgow/acciones y columnas finales).
> - **C8:** la confirmación se abre sobre la pantalla desde la que se llegó (Centro de Alertas, Dashboard o Resumen del
>   paciente), no siempre sobre el Centro de Alertas.
> - **"Guardar y firmar"** no se agregó (no había propuesta de cambio).
> - Se borraron dos íconos que quedaron sin uso (`x-circle.svg`, `mock-alert-row-ellipse.svg`) y `prototipo/referencias/`.

Tres partes: cómo construir las 4 pantallas de acceso de Figma (y cómo resolver sus inconsistencias), qué cosas
del prototipo no le tocan al médico según los roles del README, y los problemas visuales encontrados al revisar
las 37 pantallas a 1440, 1024, 768 y 390 px.

---

## Parte 1 — Pantallas de acceso

### Pantallas y rutas

| Pantalla (Figma) | Página nueva | Ruta |
|---|---|---|
| Iniciar sesión (`345:1264`) | `src/pages/Login` | `/` y `/Login` |
| Verificación de seguridad (`345:426`) | `src/pages/LoginMfa` | `/LoginMfa` |
| Recuperar contraseña (`345:849`) | `src/pages/RecuperarContrasena` | `/RecuperarContrasena` |
| Revisa tu correo (`345:19`) | `src/pages/RecuperacionEnviada` | `/RecuperacionEnviada` |

El Dashboard sigue en `/MedDashboardPrincipal`. Como no hay backend, las pantallas del médico siguen abriéndose
directo por su ruta (no hay "sesión" que las proteja).

### Cómo se construyen

- **`AuthLayout`** (componente compartido nuevo en `src/components/layout/`): barra superior (logo, nombre del
  sistema y selector ES/EN/DE), fondo de puntos (el patrón CSS de la referencia, sin los 360 círculos de Figma),
  barra de estado ("Sistema estable · Conexión segura (SSL) · Servidor en línea · Latencia: 12ms") y pie
  (© 2026 SIAPPC… · HIPAA Compliant · HL7 FHIR Interoperable). Cada pantalla solo pone su tarjeta.
- **`AuthCard`**: la tarjeta blanca con la cabecera "SIAPPC Central" y, si la pantalla lo lleva, el ícono del paso
  (escudo, llave, sobre). La sombra doble va con `[filter:drop-shadow(…)_drop-shadow(…)]`, como dice el LEEME.
- Campos con `Input` (ampliado con el tamaño del login: 48 px de alto, borde de 1.5 px) y botones con `Button`.
  Íconos de la referencia (`shield`, `key`, `mail-check`, `clock`, `alert-triangle`, ojo) pasan a `src/assets/`;
  la flecha de volver usa `IconArrowLeft`, que ya existe.
- Fuente **Geist**, como en Figma y en las capturas (ver punto 10 abajo).

### Flujo e interacción

- `/` abre el Login. **Entrar** → Verificación → **Verificar** → Dashboard, con el aviso "Bienvenido, Dr. Carlos Méndez".
- **¿Olvidó su contraseña?** → Recuperar contraseña (con el correo que se haya escrito en el Login) → **Enviar
  enlace** → Revisa tu correo (muestra ese correo) → **Volver al inicio de sesión** → Login.
- **Cerrar sesión** del menú lateral: la confirmación que ya existe, y al aceptar → Login con el aviso "Sesión cerrada".
- Campos reales: correo y contraseña (el ojo muestra u oculta la contraseña; Enter envía). Cualquier dato sirve,
  incluso vacío, para no frenar una demostración.
- **Código de 6 dígitos**: seis casillas reales; al escribir un dígito pasa a la siguiente, Retroceso vuelve a la
  anterior, flechas para moverse y pegar "482913" llena las seis. Solo acepta números. Cualquier código de 6 dígitos
  pasa; si faltan dígitos, las casillas vacías se marcan en rojo con "Ingrese los 6 dígitos".
- **Reenviar**: el contador baja de verdad (0:45 → 0:00); en 0 el enlace se activa, muestra "Código reenviado" (o
  "Enlace reenviado" en Revisa tu correo) y vuelve a contar.
- La Verificación empieza con las casillas vacías. La captura muestra "4 8 2" ya escritos; esa es la única
  diferencia buscada con la captura de esa pantalla, aparte de lo que se unifique abajo.

### Inconsistencias del diseño — propuesta

Las 5 del LEEME y 5 más que encontré al comparar el código de referencia.

| # | Inconsistencia | Propuesta |
|---|---|---|
| 1 | El enlace expira en **15 min** (Recuperar) y en **30 min** (Revisa tu correo). | **15 minutos** en las dos: es la advertencia explícita de seguridad y el plazo más corto. |
| 2 | Correo de ejemplo `ejemplo@institucion.org` (Login, Recuperar) y `usuario@institucion.gob.mx` (confirmación). | **`@institucion.org`** en todas, que es el dominio de las cuentas del README (`medico@institucion.org`). En el Login y Recuperar va como texto de ayuda gris (`ejemplo@institucion.org`); en la confirmación aparece el correo que se escribió, o `medico@institucion.org` si se dejó vacío. |
| 3 | "Volver al inicio de sesión" (flecha, 14 px, MFA y Recuperar) y "← Volver a Iniciar Sesión" (13 px, confirmación). | **"Volver al inicio de sesión"** con el ícono de flecha y 14 px en las tres pantallas (un solo componente). |
| 4 | Pie y barra de estado en Login y confirmación, no en MFA ni Recuperar; además la barra de estado está pegada al pie en Login y bajo la tarjeta en la confirmación. | **En las cuatro**, como en Login: barra de estado centrada sobre el pie y pie abajo. Lo pone `AuthLayout`. |
| 5 | Tarjetas distintas: Login y confirmación con sombra fuerte, 460 px, radio 20 y "SIAPPC Central"; MFA y Recuperar con borde suave, 420 px, radio 16 y solo un ícono. | **Una sola tarjeta, la del Login** (460 px, sombra fuerte, cabecera "SIAPPC Central"). MFA y Recuperar llevan su ícono (escudo, llave) bajo la cabecera y el título centrado, igual que la confirmación con el sobre. |
| 6 | Barra superior: 72 px (Login, MFA, Recuperar) y 80 px con fondo blanco (confirmación); logo de 36 o 32 px; nombre de 18 o 16 px; botones de idioma de 12 o 13 px, EN/DE en blanco o gris. | **La del Login** en las cuatro: 72 px, fondo transparente (se ven los puntos), logo de 36 px, nombre de 18 px, idiomas de 12 px. |
| 7 | Campo de correo: 48 px y borde de 1.5 px (Login) contra 44 px y borde de 1 px (Recuperar); etiqueta en negrita o seminegrita. | **El del Login** en todos los campos. |
| 8 | Contador "Reenviar (en 0:45)" (MFA) y "Reenviar en 00:45" (confirmación). | **"Reenviar (en 0:45)"** en las dos, y el contador funciona (ver arriba). |
| 9 | Títulos de 24 px (Login, confirmación) y 22 px (MFA, Recuperar); texto descriptivo `#475569` o `#64748b`. | **24 px y `#475569`** en las cuatro, como el Login. |
| 10 | Las pantallas de acceso usan Geist; el resto del prototipo usa Plus Jakarta Sans (decisión del paso 1). | **Geist en las de acceso**, para que se vean como sus capturas. Si prefieres todo en Plus Jakarta, es cambiar una clase en `AuthLayout`. |

**Resultado a 1440 px:** el Login queda igual a su captura. MFA, Recuperar y Revisa tu correo cambian solo en lo
que se unifica (tarjeta, barra superior, pie, campo, contador). Si prefieres no tocarlas, la alternativa mínima es
resolver solo 1, 2, 3 y 8 (textos) y dejar cada pantalla como su captura.

### Botones ES / EN / DE

**Propuesta:** cambian el idioma de las cuatro pantallas de acceso (español por defecto, inglés y alemán). El
idioma elegido queda marcado (como "ES" en Figma: blanco y negrita) y se mantiene al pasar de una pantalla de acceso
a otra (se guarda en el navegador). Al entrar, el resto del prototipo sigue en español; traducir las 37 pantallas
del médico no entra en este paso.

Alternativa más simple: solo marcan el idioma y muestran el aviso "Por ahora el prototipo solo está en español".

### En celular

- Barra superior: logo y "SIAPPC"; la línea larga "Sistema Inteligente de Atención…" se oculta abajo de 640 px.
  Los botones de idioma se quedan.
- Tarjeta a todo el ancho con 16 px de margen y 24 px de relleno (40 px desde 640 px).
- Casillas del código: se encogen para que las 6 quepan en 320 px.
- Barra de estado en dos líneas centradas; pie apilado (copyright arriba, HIPAA / HL7 abajo).

### Al terminar

Se borra `prototipo/referencias/` (código, íconos y capturas de referencia).

---

## Parte 2.1 — Lo que no le toca al médico

Según el README: el **médico** escribe y firma notas SOAP y edita el expediente; **Admisión (administrativo)**
registra pacientes, asigna camas, hace ingresos, altas y citas; **enfermería** reconoce alertas y mueve camas a
limpieza o mantenimiento.

| # | Pantalla | Elemento | Por qué no es del médico | Propuesta |
|---|---|---|---|---|
| R1 | Gestión de Pacientes | Botón **"Nuevo Paciente"** (Figma) y la pantalla nueva **Registro de Paciente** (`MedPacienteNuevo`, paso 2) | Registrar pacientes e ingresarlos es de Admisión. | **Quitar** el botón y borrar la pantalla y su ruta. |
| R2 | Gestión de Pacientes | Menú "•••" → **"Dar de alta"** | El egreso lo hace Admisión; el médico decide e indica el alta médica. | **Cambiar** a "Indicar alta médica" → confirmación → aviso "Alta médica indicada · Admisión completará el egreso". |
| R3 | Monitoreo Grid y Lista | Cama libre C-07 → **"Asignar paciente"** (`AssignBedModal`, paso 2) | Asignar camas es de Admisión. | **Quitar**: la cama libre queda informativa (sin cursor ni efecto al pasar el mouse), y se borra `AssignBedModal`. |
| R4 | Expediente → Datos Personales | Botón **"Guardar cambios"** (Figma) | Identificación, contacto, datos socioeconómicos y seguro los registra Admisión; además la pantalla no tiene campos editables. | **Quitar** el botón; la pantalla queda de consulta con la leyenda "Datos registrados por Admisión". |
| R5 | Detalle de Monitor (paso 2) | **"Programar calibración"** | Calibrar equipos es de Ingeniería Biomédica (en el README, el mantenimiento lo mueve enfermería). | **Cambiar** a "Solicitar calibración": la misma ventana, pero el aviso dice "Solicitud enviada a Ingeniería Biomédica" y la tabla la muestra como "Solicitada". "Reportar falla" se queda: cualquier personal clínico puede reportar una falla. |
| R6 | Reportes → Generar Nuevo Reporte (paso 2) | Tipos **"Resumen de Ocupación UCI"** y **"Análisis de Alertas Críticas"** | Son reportes operativos y administrativos (ocupación de camas es del tablero de Admisión). | **Quitar** esos dos tipos del modal; quedan Evolución Clínica, Reporte de Alta e Interconsulta. El historial puede seguir mostrando reportes del sistema (solo lectura). |
| R7 | Gestión de Pacientes | Título **"Gestión de Pacientes"** (Figma) | "Gestión" suena a administración; la tabla dice "Lista de Pacientes Asignados". | **Opcional:** renombrar a "Mis Pacientes". |

**Se quedan (sí son del médico):** notas SOAP, diagnósticos, indicaciones médicas, nota de ingreso (es la nota
clínica, no el ingreso administrativo), exploración física, interrogatorio, antecedentes, documentos clínicos
(subir y ver), umbrales de alarma, atender y silenciar alertas, entrega de turno, reportes clínicos y "Reportar falla".

**Observación sin cambio propuesto:** el README dice que el médico *firma* las notas SOAP, pero ninguna pantalla de
Figma tiene "Firmar". Si lo quieres, "Guardar Nota" podría pasar a "Guardar y firmar".

---

## Parte 2.2 — Problemas visuales

Cómo se revisó: las 37 pantallas (35 de Figma + 2 nuevas) a 1440, 1024, 768 y 390 px, con capturas y una revisión
automática de cada elemento: texto cortado con "…", texto que se sale de su caja, botones partidos en dos líneas,
elementos encimados y desbordes. Ninguna pantalla se sale de lado (no hay desplazamiento horizontal de la página).

Columna **1440**: "sí" si el arreglo cambia cómo se ve esa pantalla de Figma a 1440 px (necesita tu visto bueno
explícito); "no" si solo cambia en pantallas más angostas.

### A. Partes compartidas (un arreglo corrige muchas pantallas)

| # | Dónde | Tamaño | Problema | Propuesta | 1440 |
|---|---|---|---|---|---|
| V1 | Barra superior: título | 390 (y 1024 en Centro de Alertas) | El título se corta con "…" en 17 pantallas: "Centro de Control de Ale…", "Dispositivos — Monitores…", "Central de Monitoreo - U…", "Datos Personales y Demog…", "Cama C-03 — María Gon…", "Configuración de Umbrales…", "Monitor Philips IntelliVue…", etc. A 1024, "Centro de Alert…" porque los tres filtros ocupan la barra. | En celular el título puede ocupar 2 líneas. Entre 1024 y 1279 px, si las acciones no caben, pasan a una segunda fila (como ya pasa abajo de 1024). | no |
| V2 | Barra superior: ruta ("SIAPPC > Pacientes > …") | 390 | Se corta en 19 pantallas: las del paciente, el Resumen y Comparativa ("SIAPPC > Pacientes > María González > Historia Clínica > Datos Persona…"). | En celular mostrar solo los dos últimos niveles ("… › Historia Clínica › Antecedentes"). | no |
| V3 | Tablas (componente `Table`) | 1024, 768, 390 | Las tablas anchas se desplazan de lado, pero nada lo indica: en celular no hay barra de desplazamiento visible y parece que la tabla termina ahí. Casos donde se pierde algo importante: **Umbrales** (los interruptores "Estado" y la severidad quedan fuera de vista a 1024 y 768), **Historial de entregas** ("Ver Resumen", Estado y Pacientes fuera a 768), **Dashboard** (Glasgow y acciones fuera a 1024), **Comparativa** (resumen métrico cortado a 1024). | Que `Table` muestre una sombra en el borde derecho (y en el izquierdo al desplazar) cuando hay más contenido. | no |
| V4 | Tablas con una columna flexible | 1024, 768, 390 | La columna que se estira se aplasta hasta 20–60 px y su texto se monta sobre la columna de al lado: **Reportes** → pendientes de entrega (columna Paciente de 20 px a 390 y 42 px a 768: "María González" encima de "Evolución Clínica"); **Indicaciones** → soluciones y medicamentos (56 px a 390) y Estudios solicitados (58 px a 1024); **Diagnósticos activos** (Descripción de 76 px y 20 px en "Resueltos" a 390); **Antecedentes** ("Enfermedades Psiquiátricas / Mentales" se sale a 1024, 768 y 390); **Historial de entregas** (encabezado "Acción" de 18 px). | Ancho mínimo para la columna flexible (160–200 px) para que la tabla se desplace en vez de aplastarse. | no |
| V5 | Pestañas del expediente | 390 | Solo se ven Resumen, Historia Clínica y Notas SOAP; Monitoreo y Documentos quedan ocultas a la derecha sin ninguna señal. | Misma sombra de borde que V3 y que la pestaña activa se desplace a la vista al abrir la pantalla. | no |
| V6 | Cabecera del paciente | 1024, 768, 390 | "Nueva Nota SOAP" y "Generar Reporte" quedan uno sobre otro con distinto ancho; a 390 "Cama C-03" baja sola a otra línea, separada de "Crítico". | Los dos botones del mismo ancho (o en fila); en celular a todo el ancho, y las dos etiquetas juntas bajo el nombre. | no |

### B. Por pantalla

| # | Pantalla | Tamaño | Problema | Propuesta | 1440 |
|---|---|---|---|---|---|
| V7 | Centro de Alertas → Historial resuelto | todas (también 1440, viene de Figma) | Nombres cortados: "Elena Rodríg…", "Lucía Fernán…", "Javier Mendo…" (la columna mide 93 px y necesitan 97–102). | Ensanchar la columna de paciente unos 20 px. | sí (mínimo) |
| V8 | Dashboard → Tendencias de pacientes críticos | todas (también 1440) | "García López J…" y "Rojas Méndez …" se cortan con un ancho fijo de 100 px aunque sobra espacio; a 1024 y 768 las mini-gráficas no se estiran y la mitad derecha de la tarjeta queda vacía. | Nombre con ancho flexible y gráficas que ocupen el espacio disponible. | sí (mínimo) |
| V9 | Entrega de Turno → Pacientes de entrega directa | todas (3 cortes a 1440, 6 a 1024 o menos) | Pendientes y novedades cortados: "Chequear gasometr…", "Control de diuresis…", "Inestabilidad hemodinámica, noradre…". Es información clínica que no se puede leer completa. | Permitir 2 líneas en Novedades y Pendientes. | sí |
| V10 | Datos Personales → Datos sociales y demográficos | 1024 | Cuatro columnas demasiado angostas: "ESCOLARIDAD" se monta sobre "RELIGIÓN" y los valores se parten a la mitad ("Casa/da", "Licen/ciatur/a", "Católi/ca"). | 2 columnas por debajo de 1280 px. | no |
| V11 | Exploración física → Somatometría | 1024 | "PERÍMETRO ABD." se sale de su recuadro y los valores se parten ("68 / kg", "165 / cm"). | 2 columnas de recuadros entre 1024 y 1279 px (o la tarjeta a todo el ancho). | no |
| V12 | Configuración de umbrales | 1024, 768, 390 | La tabla no entra: severidad cortada e interruptores fuera de vista (ver V3). | Reducir los anchos fijos para que entre completa a 1024; en 768 y celular, cada signo vital como tarjeta (nombre arriba; límites, severidad e interruptor abajo). | no |
| V13 | Comparativa de pacientes | 1024 | Las dos columnas se apilan, así que deja de ser una comparación lado a lado; la tabla "Resumen métrico" se corta en "PACIENTE B (JUAN G…". | Columnas lado a lado desde 1024 (indicadores en 3 + 2) y tabla con columnas flexibles. | no |
| V14 | Registro de diagnóstico | 1024, 768, 390 | El código CIE-10 elegido se corta: "I50.9 Insuficiencia cardíaca, no espe…". | Campo CIE-10 a todo el ancho por debajo de 1280 px. | no |
| V15 | Documentos clínicos | 390 | "Resultados de Laboratorio - 23 Oct 2025" se corta por 4 px. | Permitir 2 líneas en el título del documento. | no |
| V16 | Dashboard | 390 | Los tres indicadores ocupan una tarjeta alta cada uno (casi una pantalla entera antes de la tabla). | En celular, los tres en una fila compacta. | no |

### C. Distinto entre pantallas

| # | Qué | Dónde | Problema | Propuesta | 1440 |
|---|---|---|---|---|---|
| C1 | Botón "Atender" | Centro de Alertas / Resumen del paciente | Azul en uno, blanco y más chico en el otro, para la misma acción. | Azul (`primary`) en los dos; en el Resumen, tamaño chico. | sí (Resumen) |
| C2 | Selector de periodo | Comparativa (4h/12h/24h) / Tendencias (6h…7d) | Comparativa usa fondo gris con la opción marcada en blanco y letra de 12 px; Tendencias y Grid/Lista marcan la opción en azul con letra de 13 px. | `SegmentedControl` (el de Grid/Lista) también en Comparativa. | sí (Comparativa) |
| C3 | Cerrar (✕) de las ventanas | Detalle SOAP, Nueva Nota SOAP, Confirmación de atención y las ventanas nuevas del paso 2 | Cuatro estilos: "✕" de texto en círculo gris, ícono en círculo gris de 42 px, ícono suelto y la X de `ModalHeader`. | La X de `ModalHeader` en todas. | sí (3 pantallas) |
| C4 | Botones de las ventanas | Confirmación de atención (34 px) / Nueva Nota SOAP y Detalle SOAP (44 px) | Mismo tipo de ventana, botones de distinto tamaño. | Tamaño mediano (34 px) en todas las ventanas; el grande queda para pantallas completas. | sí (2 pantallas) |
| C5 | Paginación | Dispositivos, Pacientes, Reportes / Historial de entregas | Tres usan "Anterior / Siguiente" sin números; Historial usa números de página. | El componente `Pagination` (con números) en los cuatro. | sí (3 pantallas) |
| C6 | Buscadores dentro de la página | Dispositivos, Pacientes, Notas SOAP | Tres tamaños y fondos distintos (blanco grande, gris mediano, gris chico). | **Sin cambio**: vienen así de Figma y no estorban. Lo dejo anotado por si quieres unificarlos con `SearchBox`. | — |
| C7 | Títulos de tarjeta | Exploración (14 px), Indicaciones y Turno (15 px), Diagnósticos y Comparativa (16 px) | El mismo tipo de encabezado con tres tamaños. | **Sin cambio**: diferencia chica que tocaría muchas pantallas de Figma. | — |
| C8 | Fondo de la Confirmación de atención | Confirmación de atención | Detrás de la ventana se ve "Centro de Control de Alertas / Monitoreo Crítico Activo" (así viene de Figma), que no es el Centro de Alertas desde donde se llega. | Mostrar la ventana encima del Centro de Alertas real. | sí |

### Recortes intencionales (no se tocan)

Vistas previas que se cortan a propósito con "…": el subjetivo de cada nota en el historial SOAP, la cita en
Búsqueda Global y la última nota SOAP en Nueva Nota SOAP. Las líneas de ECG del Grid UCI se salen de su tarjeta
pero la tarjeta las recorta, así que no se ven.

---

## Decisiones

Aprobado todo: propuesta completa del login (1–10), traducción ES/EN/DE de las pantallas de acceso, roles R1–R7,
problemas visuales A y B completos, y C1–C5 y C8 (C6 y C7 sin cambio).
