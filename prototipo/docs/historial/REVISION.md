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

---

# Paso 3 — Formularios

> **Estado: hecho.** Aprobado completo ("Approve all") e implementado en la rama `feature/prototipo-formularios`.
> Ajustes al implementar, respecto de lo escrito abajo:
> - Los textos largos (`TextArea`) se vuelven a medir al cargar la fuente y al cambiar de ancho, para que su alto
>   sea siempre el del texto, como el recuadro de Figma.
> - El IMC se muestra con un decimal **truncado** (68 kg y 165 cm dan 24.9, como en Figma; redondeado daría 25.0).
> - "Editar Nota" de un borrador abre la ventana con el título "Editar borrador SOAP" y, al guardar, reemplaza ese borrador.
> - `Input` también muestra errores (lo usan Cambiar contraseña y Configurar MFA). `TextBlock` se borró: ya no lo usaba ninguna pantalla.
> - A 1440 px solo cambian los tres puntos aprobados; las demás pantallas quedan idénticas (comparadas píxel a píxel).

Objetivo: que todos los campos que hoy son dibujos sean reales, con validación y sin backend.

## Reglas para todos los formularios

- **Componentes compartidos nuevos** (en `src/components/form/`):
  - `TextArea` (reemplaza al actual): crece con el texto, tiene límite de caracteres y estilos que reproducen cada
    dibujo de Figma (fondo blanco, gris claro o gris; letra de 13 o 14 px). Así, a 1440 px, cada campo se ve igual que hoy.
  - `DateField`: muestra la fecha como en Figma ("02 Ago 2026") y abre el calendario del navegador al tocarlo.
  - `NumberField`: solo números (con un decimal donde haga falta, ej. temperatura), con unidad y rango. Dos aspectos:
    "caja" (Mín/Máx de umbrales) y "en línea" (los valores grandes de Exploración física, que siguen viéndose como texto).
  - `Combobox`: lista desplegable en la que se escribe para buscar (CIE-10; soluciones y medicamentos).
  - `FormField` y `FieldError`: etiqueta, mensaje de error en rojo bajo el campo y borde rojo; el campo queda
    marcado para lectores de pantalla (`aria-invalid`, `aria-describedby`).
  - Funciones de validación en `src/lib/validate.ts` (obligatorio, largo mínimo y máximo, rango, formato de presión).
- **Cuándo aparecen los errores:** al salir de un campo que se tocó, o al intentar guardar. Si hay errores al
  guardar, no se guarda nada, el cursor va al primer campo con error y aparece el aviso "Revise los campos marcados".
  Mientras se corrige, el error desaparece en cuanto el valor es válido.
- **Obligatorios:** no se agregan asteriscos (solo "Acción tomada *", que ya viene de Figma); lo dice el mensaje de
  error. Los campos obligatorios llevan `aria-required`.
- **Textos libres:** se ignoran los espacios al inicio y al final. El contador "420 / 500" aparece solo al pasar
  el 80 % del límite.
- **Sin backend:** guardar actualiza la pantalla y muestra un aviso. Lo guardado se conserva mientras no se recargue
  la página (memoria del prototipo), así que al volver a la pantalla se ve lo último guardado.
- **Roles:** Datos Personales sigue de solo lectura. En Nota de ingreso, los "Datos de Admisión" (fecha, servicio,
  cama, médico) también quedan de solo lectura: los registra Admisión.

### Rangos de signos vitales (valores posibles, no umbrales de alarma)

Sirven para rechazar errores de tecleo en Exploración física y en Umbrales.

| Signo | Rango aceptado | Formato |
|---|---|---|
| FC (frecuencia cardíaca) | 20 – 250 lpm | entero |
| FR (frecuencia respiratoria) | 4 – 60 rpm | entero |
| PA sistólica | 50 – 260 mmHg | entero |
| PA diastólica | 30 – 160 mmHg | entero, menor que la sistólica |
| Temperatura | 30.0 – 43.0 °C | un decimal |
| SpO2 / saturación | 50 – 100 % | entero |
| Glasgow | 3 – 15 | entero |
| Peso | 1 – 300 kg | un decimal |
| Talla | 40 – 230 cm | entero |
| Perímetro abdominal | 40 – 200 cm | entero |

---

## 1. Nueva Nota SOAP (`MedPacienteNotasSoapNueva`)

| Campo | Obligatorio | Valida |
|---|---|---|
| Subjetivo (S) | para firmar | 10 – 2000 caracteres |
| Objetivo (O) | para firmar | 10 – 2000 caracteres |
| Evaluación / Análisis (A) | para firmar | 10 – 2000 caracteres |
| Plan (P) | para firmar | 10 – 2000 caracteres |

- **Botones** (cambia a 1440: hoy hay dos): "Cancelar", **"Guardar borrador"** (secundario) y **"Guardar y firmar"** (principal).
- **Guardar borrador:** basta con una sección escrita (si las cuatro están vacías: "Escriba al menos una sección").
  La nota aparece primera en el Historial como **"En progreso"**, con la fecha y hora de ahora. Aviso "Borrador guardado".
- **Guardar y firmar:** las cuatro secciones son obligatorias. Pide confirmación: "¿Firmar la nota? Una vez firmada
  no se puede editar." Al confirmar, la nota aparece primera en el Historial como **"Completada"**, firmada por
  Dr. Carlos Méndez. Aviso "Nota firmada".
- **Cancelar, X o Escape con texto escrito:** pregunta "¿Descartar la nota?" antes de salir.
- **Editar Nota** (en el Detalle): en una nota "En progreso" abre Nueva Nota con su texto para seguir escribiéndola;
  en una nota firmada el botón dice **"Nota firmada"** y queda deshabilitado (cambia a 1440 en el Detalle, porque la
  nota de Figma está completada).

## 2. Confirmación de Atención (`MedAlertasConfirmacionAtencion`)

| Campo | Obligatorio | Valida |
|---|---|---|
| Acción tomada * | sí | 10 – 500 caracteres |
| Clasificación de alerta | sí (ya viene elegida) | una de las 4 opciones |
| Notas adicionales | no | hasta 500 caracteres |

- **Confirmar Atención:** con errores no confirma. Si todo está bien, hace lo de hoy: la alerta pasa a atendida en la
  pantalla de origen y aparece el aviso.

## 3. Entrega de Turno (`MedTurnoEntregaHandoff`)

| Campo | Obligatorio | Valida |
|---|---|---|
| Notas generales de entrega | para confirmar | 20 – 2000 caracteres (empieza con el texto de Figma, editable) |

- **Guardar borrador:** guarda lo escrito aunque esté corto o vacío. Aviso "Borrador guardado".
- **Confirmar entrega de turno:** valida las notas; si están bien, la confirmación de hoy (receptora Dra. Ana Gómez)
  y el Historial de entregas.

## 4. Configuración de Umbrales (`MedPacienteConfigUmbrales`)

| Campo | Obligatorio | Valida |
|---|---|---|
| Mín y Máx de cada signo | al menos uno de los dos si el signo está activo | número dentro del rango del signo (tabla de arriba); temperatura con un decimal |
| Mín y Máx juntos | — | **Mín menor que Máx** |
| Signo apagado | — | no se valida (puede quedar sin límites) |

- Los "-" de hoy pasan a campos vacíos con "-" como texto de ayuda.
- **Guardar configuración:** con errores marca el campo y explica debajo de la fila; si todo está bien, aviso
  "Umbrales guardados".
- **Restablecer valores sugeridos:** también vuelve los Mín/Máx a los valores de Figma.

## 5. Registro de Diagnóstico (`MedPacienteRegistroDiagnostico`)

| Campo | Obligatorio | Valida |
|---|---|---|
| Tipo de diagnóstico | sí (ya viene elegido) | Principal / Secundario / Complicación |
| Código CIE-10 | sí | **se escribe para buscar** por código o por texto, sin importar tildes ni mayúsculas ("insuf", "I50", "neumonia"); hay que elegir un código de la lista (unos 30 códigos frecuentes de ejemplo). Si se escribe algo y no se elige: "Elija un código de la lista". |
| Descripción / hallazgos clínicos | sí | 20 – 1000 caracteres (empieza con el texto de Figma) |
| Severidad | sí (ya viene elegida) | Leve / Moderada / Severa / Crítica |
| Fecha de registro | sí | fecha válida, **no futura** y no anterior al ingreso del paciente (15 Oct 2025) |
| Notas adicionales / plan inicial | no | hasta 1000 caracteres |

- **CIE-10 a 390 px:** cerrado, el campo muestra el código y la descripción en dos líneas si no caben (a 1440 sigue en
  una línea, como hoy). Al tocarlo se puede escribir y aparece la lista filtrada; flechas y Enter para elegir.
- **Registrar diagnóstico:** con errores no registra; si todo está bien, hace lo de hoy (Diagnósticos activos con el
  código primero y aviso).

## 6. Nota de Ingreso (`MedPacienteNotaIngreso`)

| Campo | Obligatorio | Valida |
|---|---|---|
| Datos de admisión (fecha, servicio, cama, médico) | — | **solo lectura** (los registra Admisión) |
| Motivo de ingreso | sí | 10 – 300 caracteres (empieza con el texto de Figma) |
| Padecimiento actual | sí | 30 – 2000 caracteres (empieza con el texto de Figma) |
| Plan terapéutico inicial | al menos una indicación | cada indicación de 3 a 120 caracteres; una indicación vacía se quita al salir de ella |
| Pronóstico | sí (ya viene elegido) | Bueno / Reservado / Grave |
| Diagnósticos de ingreso | al menos uno | se agregan con "+ Agregar Diagnóstico" (sin cambio) |

- Las indicaciones del plan se editan en su lugar (se ven como hoy) y se agrega **"+ Agregar indicación"** bajo la
  lista (cambia a 1440).
- **Guardar nota de ingreso:** con errores no guarda; si todo está bien, aviso "Nota de ingreso guardada".

## 7. Exploración Física (`MedPacienteExploracionFisica`)

| Campo | Obligatorio | Valida |
|---|---|---|
| Peso, talla, perímetro abdominal | peso y talla | rangos de la tabla de arriba |
| IMC | — | **se calcula solo** con peso y talla, con su categoría (Bajo peso / Normal / Sobrepeso / Obesidad) y su color |
| FC, FR, temperatura, saturación, Glasgow | sí | rangos de la tabla de arriba |
| Tensión arterial | sí | formato "120/80"; sistólica y diastólica en su rango y la sistólica mayor |
| Hallazgos por región (4 por región, 6 regiones) | si se marca **Anormal** | 10 – 500 caracteres |
| Normal / Anormal de cada hallazgo | — | la etiqueta se toca para cambiarla (se ve igual que hoy) |

- Los valores grandes (68 kg, 165 cm, 78 lpm…) se editan en su lugar: se ven como texto y al tocarlos muestran borde.
- **Guardar:** con errores no guarda y, si el error está en otra región, la marca en la lista de regiones; si todo
  está bien, aviso "Exploración guardada".

## 8. Otros campos que hoy no se pueden escribir o no validan

| Pantalla | Campo | Obligatorio | Valida | Al guardar |
|---|---|---|---|---|
| Diagnósticos activos | Nota clínica correlativa (hoy texto fijo) | sí | 20 – 2000 caracteres | "Actualizar Nota" → aviso "Nota actualizada" |
| Interrogatorio por aparatos | Observaciones de cada aparato (hoy texto fijo) | si el aparato tiene síntomas marcados | 10 – 1000 caracteres | "Guardar Interrogatorio" → aviso; con errores abre el aparato que tiene el error |
| Indicaciones médicas → Nueva indicación | Solución o medicamento (hoy solo lista) | sí | `Combobox`: se elige de la lista o se escribe uno nuevo (3 – 80 caracteres) | agrega la fila como hoy |
| Mi Perfil → Cambiar contraseña | Contraseña actual | sí | no vacía | aviso "Contraseña actualizada" |
| | Nueva contraseña | sí | 12 o más caracteres, con mayúscula, número y símbolo; distinta de la actual | |
| | Confirmar | sí | igual a la nueva | |
| Mi Perfil → Configurar MFA | Código de verificación | sí | 6 dígitos | aviso "MFA activado" |
| Ayuda → Contactar soporte | Mensaje | sí | 10 – 1000 caracteres | aviso con folio |

**Sin cambio:** Datos Personales (solo lectura, por rol). Las pantallas de acceso siguen aceptando cualquier dato
(decisión del paso 2b); solo el código de 6 dígitos se valida, como ya hace.

## Qué cambia a 1440 px (necesita tu visto bueno)

1. Nueva Nota SOAP: tres botones en lugar de dos ("Guardar borrador" es nuevo).
2. Detalle de nota SOAP: "Editar Nota" pasa a "Nota firmada" deshabilitado en notas firmadas (la de Figma lo está).
3. Nota de ingreso: enlace "+ Agregar indicación" bajo el plan terapéutico.
4. Todo lo demás se ve igual que hoy hasta que se escribe algo o aparece un error.
