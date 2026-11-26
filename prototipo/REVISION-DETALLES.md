# Ronda de detalles, admisión con monitor y alergias — informe

> **Estado: fase 2 hecha.** Las secciones 1 a 7 son el informe de la fase 1 (aprobado, con las decisiones de la
> sección 7), con los cambios que salieron al implementarlo marcados como "En la fase 2". Lo que se hizo y cómo se
> verificó está en la sección 8; la IA de pronóstico quedó detenida a pedido (A5, "Estado en la fase 2").

Capturas en `docs/revision-detalles/`.

## 1. Cómo se probó

- Backend local con los datos de demo y el publicador corriendo (una lectura por minuto), prototipo en modo `real`
  (`npm run dev`), entrando como el médico del seed.
- Windows 11 de este equipo: **Edge** (sin ventana, por CDP) y el **navegador del panel de Claude** (Chromium, con
  ventana). **Chrome no está instalado en este equipo**: ver la sección 7.
- Pantallas del médico a **1920 y 1440 px**; las de 1024 y 390 quedan para la verificación de la fase 2.
- IA: Ollama local con el modelo del servidor (MedGemma 4B Q4_K_M), con un override temporal del backend.

## 2. Parte A — detalles del prototipo

### A1. Zonas vacías y columnas que no llenan el ancho

| Pantalla | A 1920 px | Causa | Arreglo propuesto |
|---|---|---|---|
| Lista UCI (`problema-lista-uci-1920.jpg`) | Unos 600 px vacíos a la derecha. Cada celda repite "FC", "SpO2", "TEMP"…; los títulos de columna no quedan encima de sus valores. La caja de la tabla se estira hasta el final de la pantalla con 6 camas | Anchos fijos de Figma (70 a 140 px por columna) y `flex-1` en la caja | Rejilla con columnas proporcionales a todo el ancho. Desde 768 px una sola fila de títulos y las celdas solo con valor y unidad; en celular, tarjetas con la etiqueta de cada signo. La caja mide lo que su contenido |
| Mis Pacientes (`problema-mis-pacientes-1920.jpg`) | Hueco de unos 500 px entre "TEMP" y "•••" | Columnas fijas (210, 100, 110, 75, 70…) y la última se come el resto | Columnas proporcionales (`minmax(…, fr)`) |
| Monitoreo detallado (`problema-monitoreo-detallado-1920.jpg`) | 480 px libres a la derecha y un hueco largo bajo "Ideas de la IA" | Dos columnas de ancho fijo de Figma (706 + 442 px) | El monitor crece; los paneles de la derecha pasan a dos columnas desde unos 1600 px |
| Resumen del paciente (`problema-resumen-1920.jpg`) | 526 px libres a la derecha | `max-w-[630px]` + `w-[474px]` | Las dos columnas se reparten el ancho (por ejemplo 3:2) |
| Mi Perfil (`problema-perfil-1920.jpg`) | 526 px libres | 680 + 420 px fijos | Rejilla 2:1 a todo el ancho |
| Entrega de turno (`problema-entrega-turno-1920.jpg`) | 530 px libres | 740 + 360 px fijos | La tabla crece; "Quién entrega" se queda en 360 px |
| Dispositivos (`problema-dispositivos-1920.jpg`) | Columna vacía de unos 250 px entre "Señales" y "Acción" | La columna de acción se lleva el sobrante | Repartir el sobrante entre paciente y señales |

Sin zonas vacías a 1920: Dashboard, Alertas, Central (Grid), Comparativa, Notificaciones, Reportes, Búsqueda, Ayuda,
Asistente IA, Historial de entregas, Turno recibido y las demás fichas del paciente (Historia clínica, datos
personales, antecedentes, interrogatorio, exploración, diagnósticos, registro de diagnóstico, hospitalizaciones, nota
de ingreso, indicaciones, documentos, notas SOAP, nueva nota, umbrales, tendencias). El barrido a 1440: sección 2.6.

### A2. Íconos que no se ven en Windows

- **Dónde:** la tabla con "hace X días" y columna "Acciones" es la del **Dashboard** ("Alerta activa: ⚠️ Hace 2 días" y
  4 botones: ver perfil, monitoreo, nota SOAP, historia clínica). El Centro de alertas no tiene esa columna.
- **Qué son:** esos 4 íconos no son emojis: son archivos SVG de Figma puestos como imagen (`<img>`). En este equipo,
  con Edge y con Chromium, a 1920 px, en el modo de desarrollo y en la imagen del contenedor, **se ven**
  (`problema-iconos-acciones.jpg`). No pude reproducir los cuadritos vacíos.
- **Por qué igual hay que cambiarlos:** si el navegador no carga una imagen (bloqueo de imágenes, una extensión, una
  política del equipo), queda exactamente un cuadrito vacío: el borde del botón sin nada. Los íconos del menú lateral,
  que salen de `icons.tsx` en línea, no dependen de cargar nada. Y sí hay símbolos que dependen de la fuente del
  sistema:

  | Símbolo | Dónde |
  |---|---|
  | ⚠️ y 📈 (emojis) | Dashboard: columna "Alerta activa" y título "Tendencias de Pacientes Críticos" |
  | ⚙ | Resumen: botón "Ver umbrales" |
  | ✓ | Turno recibido: "Marcar como Leído ✓" |
  | ↑ ↓ | Junto a FC y SpO2 (Dashboard, Comparativa, listas) |
  | → | "Ver todos →" y los "Ver … →" de Historia clínica y Antecedentes |
  | › | "Anteriores sin atender" |
  | ••• (texto) | Encabezado de Mis Pacientes |

- **Arreglo propuesto:** agregar a `icons.tsx` los que faltan (ojo, corazón, carpeta, archivo, engrane, flecha,
  flechas arriba/abajo, chevrón, más horizontal, alerta, tendencia, visto) y usarlos en **todos los símbolos de la tabla
  y en todo ícono que esté dentro de un botón o enlace**. Los SVG de Figma que son solo decoración (puntos de leyenda,
  íconos de tarjetas) se quedan. Los separadores de texto (•, …) no son íconos y se quedan.
- **Verificación:** en Edge y Chromium a 1920, 1440, 1024 y 390, cada botón de la tabla del Dashboard y de cada menú se
  ve y lleva a su pantalla (recorrido automático que hace clic en cada uno).

### A3. Menús "•••"

- Solo hay "•••" en **Mis Pacientes** (`problema-tres-puntos.jpg`):
  - **El del encabezado** es texto: no hace nada.
  - **El de cada fila** sí abre un menú en este equipo (Ver expediente, Monitoreo, Nueva nota SOAP, Indicar alta
    médica), pero su ícono es una imagen SVG: si no carga, el botón queda vacío (A2).
- **Arreglo propuesto:**
  - Fila: ícono en línea y el menú con "Abrir expediente", "Ver monitoreo", "Tendencias", "Nueva nota SOAP",
    "Registrar exploración física" (si falta), "Consultar IA" (con permiso de IA) e "Indicar alta médica".
  - Encabezado: un menú de la lista con "Más críticos primero", "Solo evaluación pendiente", "Ir a la central de
    monitoreo" e "Imprimir la lista". Si prefieres, se quita.

### A4. GCS "—" en la Lista UCI

- Todas las camas muestran GCS "-" sin forma de registrarlo (`problema-gcs-lista-uci.jpg`). En el Dashboard, la Central
  y el Monitoreo detallado ya hay un "Registrar" que lleva a la Exploración física.
- **Arreglo:** el mismo "Registrar" (`RegistrarExploracion`) bajo el "—" de cada cama ocupada, sin abrir la fila.

### A5. La IA responde demasiado corto

- **Reproducido** con DEMO-0002: a "¿Cuál es la probabilidad de muerte de este paciente?" respondió una sola frase,
  esta vez "El índice de shock no es calculable debido a la falta de presión arterial sistólica."
  (`problema-ia-probabilidad.jpg`).
- **Causa:** el backend clasifica la pregunta y le da un formato y un tope. "Probabilidad de muerte" no entra en el tipo
  "gravedad" (que solo reconoce "grave", "NEWS2", "riesgo de muerte"…), así que cae en **"Un dato: una frase"** (el
  panel "Lo que verá la IA" lo dice).
- **Arreglo propuesto (lo revisa Adrian):**
  1. Tipo nuevo **"pronóstico"** para gravedad, riesgo, pronóstico, mortalidad, probabilidad de morir o de sobrevivir.
  2. Respuesta de 4 a 6 líneas, con lo que se pueda **calculado en el backend** con los datos reales:
     - NEWS2 y qué significa (≥ 7 riesgo alto: valoración urgente y considerar UCI; 5–6 medio; …);
     - por qué es "parcial" y qué dato falta (hoy: PA, Glasgow, oxígeno suplementario);
     - el puntaje propio de su enfermedad, según los diagnósticos activos: **sPESI/PESI** en TEP (I26), **qSOFA** en
       sepsis, **CURB-65** en neumonía (J12–J18); con lo que falte (PA, urea, antecedentes) dice que es parcial;
     - que no se puede dar una probabilidad exacta de muerte.
  3. Esas líneas se arman en el backend y el modelo solo agrega el hallazgo que más pesa: un modelo de 4B no inventa
     así un porcentaje ni mezcla puntajes.
  4. Set de prueba: esta pregunta y 3 parecidas ("¿Cuál es su pronóstico?", "¿Qué riesgo de mortalidad tiene?",
     "¿Qué probabilidad tiene de sobrevivir?") con DEMO-0002 (TEP), DEMO-0001 (sepsis) y DEMO-0007 (neumonía), antes y
     después, en `REVISION-IA-RESPUESTAS.md`.

**Estado en la fase 2: detenido a pedido, queda como está (25 nov 2026).** Para retomarlo:

- **Hecho (backend, lo revisa Adrian):**
  - tipo de pregunta `pronostico` (probabilidad de muerte, pronóstico, mortalidad, sobrevivir);
  - para `gravedad` y `pronostico` el backend escribe primero las líneas de riesgo (`lineasRiesgo` en
    `services/aiParse.ts`; `riesgoCalculado` en `lib/clinicalAi.ts`; `routes/ai.ts`): NEWS2 con qué significa, por qué
    es parcial, sPESI/PESI en TEP, CURB-65 en neumonía, qSOFA en sepsis, "sin puntaje propio" si su diagnóstico no
    tiene, y "no se puede dar una probabilidad exacta". El modelo solo agrega "Lo que más pesa";
  - el contexto del modelo dice "lo que más suma" del NEWS2;
  - pruebas sin base: 136 de 136 (`aiTemas`, `aiPuntajes`, `aiParse`, `mqttOrden`, `aiAuto`).
- **Medido** (`docs/ia-respuestas/pronostico-*.json`): antes, las 3 preguntas de "probabilidad" respondían una frase
  (tipo "dato") y las de pronóstico o mortalidad, la plantilla completa, sin sPESI ni CURB-65. Después, las 8 de
  pronóstico responden en 5 líneas y el primer texto llega en 0,1 a 0,4 s (antes, 10 a 26 s).
- **Sin terminar:**
  1. La segunda vuelta (con "lo que más suma") se cortó en 4 de 10 preguntas: "Lo que más pesa" ya nombra la SpO2 con
     su valor en vez del NEWS2, pero a veces sin negrita, con "(%)" de más o mencionando los puntos del NEWS2.
  2. El prototipo no conoce el tipo `pronostico`: `src/lib/aiTemas.ts` (copia del backend), la etiqueta "Tipo de
     respuesta" de "Lo que verá la IA" (hoy dice "Un dato: una frase" aunque el backend responda en 5 líneas) y las
     respuestas del simulador en modo mock.
  3. Escribir el antes y después en `REVISION-IA-RESPUESTAS.md`.

### 2.6 Barrido a 1440 px

- Las 33 pantallas llenan el ancho: los anchos fijos de Figma están pensados para 1440, así que a esa medida justo
  caben. Lo que sigue mal a 1440 es lo de dentro de las tablas: la Lista UCI repite las etiquetas y desalinea los
  títulos, y en Mis Pacientes queda un hueco de unos 100 px antes de "•••".
- Con el arreglo de A1, 1440 se ve igual que hoy o mejor, y 1920 deja de tener huecos. 1024 y 390 se revisan en la
  verificación de la fase 2.

## 3. Parte B — admisión en SIAPPC → paciente en vivo en el prototipo

### 3.1 Lo que ya existe y lo que falta

- `dispositivo.paciente_id` ya dice qué monitor tiene cada paciente, y el tablero, la central y el expediente ya lo
  leen. Lo que falta es poder escribirlo: hoy solo se llena por SQL.
- En la app principal, el administrativo ya registra al paciente (con motivo), le asigna cama (eso crea el ingreso) y
  personal a cargo. No hay campo de diagnóstico al registrar: el diagnóstico es clínico (permiso `historia_clinica`) y
  lo registra el médico (sección 7).
- El publicador de demo hoy publica siempre los 15 equipos de `casos.json` y recibe **todo el `.env`** (contraseñas de
  la base, de Redis y el secreto de los tokens), aunque solo usa las dos de MQTT.

### 3.2 Backend (lo revisa Adrian)

| Ruta | Permiso | Qué hace |
|---|---|---|
| `GET /devices/free` | `dispositivos: ver` | Monitores del hospital sin paciente, que no están en mantenimiento ni de baja |
| `GET /patients/:id/device` | `dispositivos: ver` | `{ monitor }` del paciente, o `{ monitor: null }` (aunque no esté transmitiendo) |
| `GET /patients/care-staff` | `pacientes: editar` | **En la fase 2:** médicos y enfermería activos para "Personal a cargo" (sin correo ni teléfono). El diálogo usaba `GET /users`, que el administrativo no puede leer: no podía elegir al médico |
| `PUT /patients/:id/device` `{ deviceId }` | `dispositivos: editar` | Asigna. Si tenía otro, lo libera en la misma transacción. 409 si el monitor ya es de otro, si está en mantenimiento o si el paciente no tiene ingreso activo; 404 si es de otro hospital. Queda en la bitácora |
| `DELETE /patients/:id/device` | `dispositivos: editar` | Libera (204) |

- **Al egresar** (`POST /admissions/:id/discharge`) y **al cancelar el ingreso**, el monitor queda libre en la misma
  transacción.
- **Matriz de permisos:** el administrativo pasa a `dispositivos: editar` (en `seed.sql` y con un parche para las bases
  ya cargadas); el admin ya lo tiene. El médico y la enfermera siguen solo viendo.
- **Aviso al monitor (cómo se entera el publicador):** el backend publica en MQTT
  `siappc/<equipo>/asignacion`, retenido, `{ device, asignado, motivo, diagnosticos }` —sin nombre, cédula ni id del
  paciente— al asignar, al liberar, al conectarse y **cada 2 minutos** para todos los equipos (así también se entera
  de un diagnóstico que el médico registra después). Al liberar manda `asignado: false`.
  - Es lo que hace un monitor de verdad (recibe la admisión de su cama) y le sirve también al equipo real.
  - El publicador no necesita **ninguna contraseña nueva**: ya tiene la de MQTT. Las otras dos formas (una cuenta de
    servicio que entre por la API, o un usuario de solo lectura en la base) obligan a crear y guardar otra contraseña:
    sección 7.
- **Pruebas** en `Pruebas/backend/monitores.test.ts`: lista de libres, asignar, cambiar, liberar, 409 y 404 de cada
  regla, 403 para el médico, egreso y cancelación que liberan, y el mensaje de aviso (función pura, sin broker).

### 3.3 App principal (`frontend/`, lo revisa Adrian)

- En el menú de cada paciente de Pacientes, junto a "Asignar cama" y "Personal a cargo": **"Asignar monitor"** (o
  "Cambiar monitor").
- Diálogo con el mismo estilo que el de cama: el monitor actual (con "Liberar" en dos pasos, como quitar a alguien del
  personal), la lista de monitores libres ("DEMO-DEV-16 · Monitor de prueba · sin transmitir") y "Asignar". Sin ingreso
  activo, el diálogo lo dice y pide asignar cama primero.
- **En la fase 2:** aparece para admin y administrativo, los roles con `dispositivos: editar` en la matriz base: la app
  principal no recibe la matriz de permisos, así que decide por el rol. Con otro rol, el diálogo muestra el 403.

### 3.4 Monitores libres de demo

- `prototipo/tools/base/monitores-libres.sql`, llamado por `base.sh cargar`: **DEMO-DEV-16 a DEMO-DEV-20**, "Monitor de
  prueba", sin paciente, en `inactivo` (no transmiten hasta que se asignan). Se inserta solo lo que falta: correrlo
  varias veces no los duplica. `base.sh revisar` cuenta los libres.

### 3.5 Publicador de demo

- Escucha `siappc/+/asignacion` y publica **solo los equipos `DEMO-*` asignados** (un equipo real asignado, como el
  `RPI-01` de la base local, nunca se simula).
- Equipo nuevo asignado: manda `online`, sus lecturas (FC, SpO2, FR y temperatura) y la onda del ECG. Liberado: manda
  `offline` y deja de publicar. Sin reiniciarse.
- Valores: los de `casos.json` para DEMO-DEV-01 a 15; para los demás, un **perfil según el diagnóstico y el motivo**
  (`perfiles.json`: sepsis, TEP, neumonía/respiratorio, insuficiencia cardíaca, arritmia, trauma, abdominal, metabólico,
  neurológico, obstétrico y general), con la misma idea que `categoriaDe` del prototipo.
- **Solo recibe `MQTT_USER` y `MQTT_PASSWORD`**: el `docker run` deja de pasar `--env-file .env` entero.
- Cada 2 minutos escribe en el registro qué equipos está publicando.

### 3.6 Enfermería

- **Sí se puede**: el diálogo "Personal a cargo" de la app principal ya ofrece médicos y enfermeras. Pero se asigna de a
  uno y no sugiere quién es la enfermera de la unidad.
- **Propuesta:** en ese diálogo, si el paciente tiene cama, una línea "Enfermería de UCI: Lucía Ramos — Asignar" con las
  enfermeras activas de la unidad de la cama que todavía no están a cargo. Es solo de `frontend/` (sección 7).

### 3.7 Prototipo

- **Listas:** el tablero y la central ya se vuelven a pedir cada 15 s y al volver a la pestaña. Falta:
  - al entrar a una pantalla, pedir otra vez la lista si tiene más de 10 s (hoy espera hasta 30 s);
  - **la ficha de un paciente nuevo daba "no encontrado" hasta 5 minutos**: el paciente se busca en una lista guardada
    5 minutos (`usePatient`). Si la cédula no está, se pide la lista otra vez antes de decir que no existe.
- **Pantallas de un paciente nuevo:** se recorren todas en la fase 2 con el paciente registrado en la app principal
  (sin notas, sin exploración, sin diagnósticos al principio). Lo simulado (PA, paneles) ya se genera según el motivo
  (`simulacion.ts`).

### 3.8 Recorrido de punta a punta (fase 2)

1. Administrativo, en la app principal: registra un paciente con motivo, le asigna cama, a Carlos Méndez y a la
   enfermera de la unidad, y un monitor libre.
2. Médico, en el prototipo, sin recargar: aparece en Mis Pacientes, Dashboard y la central.
3. En 1 a 2 minutos: FC, SpO2, FR, temperatura y ECG en vivo. El médico registra el diagnóstico y, a los 2 minutos
   como mucho, el publicador cambia al perfil de ese diagnóstico.
4. Administrativo: egreso. El monitor queda libre y deja de publicar.

Con capturas de cada paso.

## 4. Parte C — nginx de la app principal

- `frontend/nginx.conf` pasa `/api` a `http://backend:3001/` fijo: nginx resuelve el nombre una sola vez al arrancar y,
  si el backend se reconstruye con otra IP, da 502 hasta reiniciar el frontend. Y detrás de Cloudflare todas las visitas
  llegan con la misma IP, así que el límite de login (5 intentos cada 15 min por IP y correo) se comparte.
- **Cambio** (lo mismo que `prototipo/nginx.conf`, conservando lo demás y sus comentarios):
  - `resolver 127.0.0.11 valid=10s ipv6=off;` y el backend en una variable, con `rewrite` para quitar `/api` (con
    variable, `proxy_pass` ya no lo quita solo);
  - `set_real_ip_from` 127.0.0.1, 172.16.0.0/12 y 192.168.0.0/16, y `real_ip_header CF-Connecting-IP;`;
  - el comentario "There is no proxy in front of this nginx" se corrige: ahora está Cloudflare, y `$remote_addr` ya es
    la IP del visitante.
- **Prueba (igual que en el prototipo):** con el contenedor `frontend` en 8080:
  1. Pantallas y `/api` responden.
  2. Con el backend parado, las pantallas siguen y solo `/api` da 502; al recrearlo, vuelve solo, sin reiniciar el
     frontend.
  3. Con `CF-Connecting-IP` desde la red de Docker, el backend ve la IP del visitante.
- **Ojo para el servidor:** esa confianza en la cabecera supone que solo cloudflared (o la red local) llega al puerto
  del frontend. Si el 8080 está abierto a internet, conviene publicarlo solo en `127.0.0.1` (lo decide quien administra
  el servidor; no se toca el Compose).
- **Nota para Adrian:** el frontend también usa flujos SSE (alertas); el prototipo les quita el búfer y les da 300 s.
  No se cambia aquí porque no se pidió.

## 5. Parte D — registrar alergias

### 5.1 Lo que hay

- Backend: `GET/POST/PATCH /historia/:pacienteId/alergias`, sin DELETE. Severidad `leve | moderada | grave |
  anafilaxia`; estado `activa | resuelta | descartada`. Crear pide `historia_clinica: crear` y corregir
  `historia_clinica: editar`: el médico sí; la enfermera y el admin solo ven.
- Prototipo: las alergias activas se **leen** en el Resumen (una fila de "Información del Paciente"), Historia clínica
  general ("Alergias y Reacciones Adversas"), la hoja imprimible y el panel "Lo que verá la IA". Ninguna pantalla las
  escribe. Nueva nota SOAP e Indicaciones solo piden "revisar alergias", sin mostrarlas.
- La IA del backend ya lee las alergias activas de la base en cada consulta: una alergia nueva entra en la siguiente
  pregunta sin tocar el backend.
- La cabecera del paciente **no** muestra alergias.

### 5.2 Propuesta

- **Resumen:** la fila "Alergias" pasa a una tarjeta "Alergias" propia, con cada alergia (sustancia, severidad,
  reacción) y, solo para el médico:
  - **"Registrar alergia"**: formulario con sustancia (obligatoria), reacción, severidad (leve, moderada, grave y
    anafilaxia, que ya existe en el backend: sección 7), fecha de detección y estado;
  - en cada alergia, **"Corregir"** (el mismo formulario, PATCH) y **"Marcar inactiva"** (estado `resuelta` o
    `descartada`, con confirmación). Nada se borra; las inactivas quedan plegadas en "Inactivas (N)".
- **Antecedentes:** sí conviene una sub-pestaña **"Alergias"** con la misma tarjeta: es donde se buscan los antecedentes
  y ahí no estaban. El texto de "Personales Patológicos" deja de decir "alergias severas" y pasa a "cirugías previas,
  hospitalizaciones, transfusiones y comorbilidades; las alergias están en su pestaña".
- **Cabecera del paciente:** un aviso rojo "Alergias: penicilina, látex" cuando hay activas, en todas las fichas (así
  también se ve al escribir la nota SOAP y al indicar fármacos).
- **Al guardar:** se refresca el expediente, así la alergia aparece enseguida en el Resumen, la cabecera, Historia
  clínica, la hoja imprimible y "Lo que verá la IA". En modo mock, lo mismo contra el simulador.
- **Permisos:** el botón y las acciones solo con `historia_clinica: crear` / `editar` (el médico). Con un 403 del
  backend, el aviso "Su rol no puede registrar alergias".
- **Verificación:** médico registra, corrige y marca inactiva; enfermera y admin no ven los botones; la alergia aparece
  en cada lugar de la lista; la IA la nombra en "Revisa alergias e interacciones" y en una pregunta de fármaco.

## 6. Qué hay que correr en el servidor (después de la fase 2)

Como `siappc`, en `/opt/siappc`, uno por bloque. El despliegue automático trae el código al mezclar en `dev`.

1. Si el despliegue no los reconstruyó: backend (rutas nuevas y la IA), frontend (diálogo y nginx) y prototipo.

   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build backend frontend prototipo
   ```

2. ⚠️ **Cambia datos de la base del servidor, que usa también la app principal:** agrega los 5 monitores libres
   DEMO-DEV-16 a 20 y le da al administrativo `dispositivos: editar`. Se puede repetir. El primer comando borra la
   copia anterior **dentro del contenedor de MariaDB** (no toca la base): con `cp backend/db` sobre una carpeta que ya
   existe, Docker la copiaba dentro (`/tmp/db/db`) y `base.sh` corría los scripts viejos sin avisar (pasó en local).

   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml exec mariadb rm -rf /tmp/db /tmp/base
   docker compose -f docker-compose.yml -f docker-compose.prod.yml cp backend/db/. mariadb:/tmp/db
   docker compose -f docker-compose.yml -f docker-compose.prod.yml cp prototipo/tools/base/. mariadb:/tmp/base
   docker compose -f docker-compose.yml -f docker-compose.prod.yml exec mariadb sh /tmp/base/base.sh cargar
   ```

3. Imagen nueva del publicador y reemplazarlo, ahora **solo con las variables de MQTT**. **Debe correr uno solo, este
   del prototipo**: `tools/telemetria-demo/` de la raíz (PR #64) es una copia anterior que publica siempre los 15
   equipos; si corren los dos, las lecturas y las alertas salen duplicadas. Si se levantó, se para igual que este:

   ```bash
   docker build -t siappc-telemetria-demo prototipo/tools/telemetria-demo
   docker stop siappc-telemetria-demo && docker rm siappc-telemetria-demo
   docker run -d --name siappc-telemetria-demo --restart unless-stopped --network siappc_default --env-file <(grep -E '^MQTT_(USER|PASSWORD)=' .env) -e PERIODO_S=60 -v "$PWD/infra/mosquitto/certs/ca.crt:/certs/ca.crt:ro" siappc-telemetria-demo
   ```

4. Comprobar que corre un solo publicador y que ve las asignaciones (debe listar DEMO-DEV-01 a 15):

   ```bash
   docker ps --format '{{.Names}} {{.Image}}' | grep -i telemetria
   ```

   ```bash
   docker logs --tail 20 siappc-telemetria-demo
   ```

No hace falta repetir la historia de 24 h ni bajar otro modelo.

## 7. Decisiones (aprobadas)

1. El publicador se entera por el aviso MQTT retenido del backend, sin contraseñas nuevas.
2. Íconos: todos los de botones y enlaces y los símbolos de la fuente del sistema, como SVG en línea; los decorativos
   se quedan. El usuario lo prueba en su Windows.
3. Navegadores: Edge y Chromium.
4. Se sugiere la enfermera de la unidad en "Personal a cargo".
5. El administrativo registra el motivo y el médico el diagnóstico; mientras no haya diagnóstico, el perfil sale del
   motivo.
6. El monitor se asigna solo si el paciente ya tiene cama.
7. La severidad de las alergias incluye anafilaxia.
8. El "•••" del encabezado de Mis Pacientes se quita; el de cada fila se queda, con su ícono en SVG.
9. Columnas proporcionales para que a 1920 no queden zonas vacías.

## 8. Fase 2: qué se hizo y cómo se verificó

Capturas y resultados de esta fase en `docs/revision-detalles/fase2/`.

### 8.1 Qué se hizo

- **A1, columnas:** Lista UCI (tabla con una sola fila de títulos, celdas solo con el valor y tarjetas en celular), Mis
  Pacientes, Monitoreo detallado y Resumen (los paneles de la derecha en dos columnas desde 1600 px), Mi Perfil,
  Entrega de turno y Dispositivos, con columnas proporcionales.
- **A2, íconos:** 15 íconos nuevos en `icons.tsx` y el componente `Flecha` (↑ ↓). Cambiados los íconos de botones,
  enlaces, menús, interruptores y opciones de 20 pantallas, y los símbolos ⚠️, 📈, ⚙, ✓, ↑ ↓, → y › (`BOTONES.md`,
  "Ronda de detalles").
- **A3:** sin el "•••" del encabezado de Mis Pacientes; el de cada fila con el menú completo según el rol.
- **A4:** "Registrar" bajo el GCS de la Lista UCI.
- **A5, IA:** detenida a pedido (ver "Estado en la fase 2" en A5).
- **B:** las rutas de monitores, el aviso MQTT, el permiso y las pruebas del backend; "Asignar monitor" y la
  sugerencia de enfermería en la app principal; los 5 monitores libres; el publicador por asignación; las listas del
  prototipo que se piden al entrar y la ficha de un paciente nuevo.
- **C:** `frontend/nginx.conf`.
- **D:** la tarjeta "Alergias" (Resumen y Antecedentes), el aviso en la cabecera y la severidad en la hoja.
- **Encontrado y arreglado en esta fase:**
  - En la app principal, "Personal a cargo" listaba el personal con `GET /users`, que el administrativo no puede leer:
    no podía elegir al médico. Ruta nueva `GET /patients/care-staff`.
  - En el prototipo, la ficha de un paciente recién admitido decía "no encontrado" y su cama de la central salía
    "Disponible" hasta 5 minutos (la lista de pacientes guardada). Ahora, si falta alguien, se pide en el acto.
  - Dashboard: "Requiere tu atención ahora" ponía primero la evaluación pendiente más antigua; ahora la del ingreso
    más reciente, así un paciente recién admitido aparece aunque esté estable y no entre en las 6 filas de la tabla.
  - Resumen: "Médico Responsable" mostraba al primero del equipo, que podía ser la enfermera.
  - Con dos nombres ("Rosa Elena Pinzón Mora") el Dashboard y la Lista UCI tomaban "Elena" como apellido.
  - Mis Pacientes ofrecía a la enfermera "Nueva nota SOAP", "Registrar exploración física" e "Indicar alta".
  - Repetir `docker compose cp backend/db mariadb:/tmp/db` anida la carpeta y `base.sh` corría los scripts viejos sin
    avisar: los pasos del servidor (sección 6) copian con `/.`.

### 8.2 Admisión en la app principal → paciente en vivo en el prototipo

En local, con el backend, la app principal (8080), el prototipo en modo real (5173) y el publicador nuevo. Edge sin
ventana, con dos pestañas: el administrativo y el médico (`fase2/flujo.json`).

| # | Paso | Resultado | Captura |
|---|---|---|---|
| 0 | El administrativo registra a la paciente con su motivo de consulta | Registrada | `b00-registro-en-siappc.jpg` |
| 1 | El médico está en Mis Pacientes del prototipo | Todavía no la tiene | `b01-medico-antes.jpg` |
| 2 | El administrativo la busca en Pacientes | "Sin cama" | `b02-registrada-sin-cama.jpg` |
| 3 | Le asigna la cama UCI-06 | Crea el ingreso | `b03-cama.jpg` |
| 4 | "Personal a cargo": un clic en la sugerencia "Asignar a Lucía Ramos" (enfermería de UCI) y elige a Carlos Méndez | Los dos a cargo | `b04-personal.jpg` |
| 5 | "Asignar monitor": elige DEMO-DEV-16 de los 5 libres | Asignado; el publicador lo empieza a simular a los 10 s, con el perfil "respiratorio" (por el motivo) | `b05-monitor.jpg` |
| 6 | El médico, sin recargar, vuelve al Dashboard | Cuenta 17 pacientes; aparece primera en "Requiere tu atención ahora" (evaluación pendiente) | `b06-dashboard.jpg` |
| 7 | Mis Pacientes | Aparece | `b07-mis-pacientes.jpg` |
| 8 | Central (Lista UCI) | UCI-06 ocupada, con signos | `b08-central.jpg` |
| 9 | Monitoreo detallado | FC, SpO2, FR, temperatura y ECG en vivo **47 s después de asignar el monitor** | `b09-signos-en-vivo.jpg` |
| 10 | Resumen | Abre bien, con el monitor DEMO-DEV-16 | `b10-resumen.jpg` |
| 11 | El médico registra el diagnóstico "Sepsis de origen pulmonar [A41.9]" | El publicador cambia al perfil "sepsis" **18 s después** (T 39 °C, FC 118) | `b11-resumen-con-diagnostico.jpg` |
| 12 | Egreso (con la primera paciente de prueba) | El monitor queda libre y el publicador deja de publicarlo en el acto | `docker logs`: "DEMO-DEV-16 liberado: deja de publicar" |

La primera corrida falló en los pasos 4 y 5 porque el contenedor del backend se había recreado con la imagen anterior
(sin `/patients/care-staff`); con la imagen nueva pasaron todos. El paso 6 falló una vez porque el Dashboard solo
enseña los 6 pacientes más graves: de ahí el cambio de "Requiere tu atención ahora".

### 8.3 Alergias

Con la paciente de prueba, en el prototipo en modo real (`fase2/alergias.json`): 9 de 9.

| Paso | Resultado | Captura |
|---|---|---|
| Médico: tarjeta "Alergias" con "Registrar alergia" | Sí | `d00-resumen.jpg` |
| Registra "Penicilina", grave, "urticaria generalizada y disnea" | Aparece en la tarjeta y en la cabecera ("Alergias: Penicilina (grave)") | `d01-registrada.jpg` |
| La corrige a anafilaxia | La cabecera se actualiza | `d02-corregida.jpg` |
| Hoja imprimible | "Penicilina (anafilaxia) — Urticaria…" | `d03-hoja.jpg` |
| "Lo que verá la IA" | "Alergias activas: Penicilina (anafilaxia…)" | `d04-ia.jpg` |
| Antecedentes → "Alergias" | La misma tarjeta; "Personales Patológicos" ya no menciona alergias | `d05-antecedentes.jpg` |
| La marca inactiva (resuelta) | Sale de la cabecera y queda en "Inactivas (1)" | `d06-inactiva.jpg` |
| Enfermera | Ve las alergias, sin botones | `d07-enfermero.jpg` |
| Admin | Sin botones (las fichas clínicas le dicen "cuenta técnica") | `d07-admin.jpg` |

### 8.4 Verificación completa

| Prueba | Resultado |
|---|---|
| `tsc` y `vite build` del prototipo | Pasan |
| `tsc`, `vite build` y `oxlint` de la app principal | Pasan, sin avisos |
| `tsc` del backend | Pasa |
| Pruebas del backend con base | **267 de 267**, con `monitores.test.ts` (13) y los casos nuevos de `aiTemas` y `aiPuntajes`. Para correrlas: Redis publicado con `docker-compose.test.yml` y `DB_PORT`, `DB_PASSWORD` y `REDIS_URL` por variable de entorno, sin tocar `backend/.env.test` |
| Suite de interacción en modo mock (Edge sin ventana) | **60 de 60**, repetida después de los últimos cambios |
| Recorrido del médico contra el backend local | **15 de 15** pasos (dashboard, pendientes, turno, atender y confirmar una alerta, paciente crítico, monitoreo, tendencias, hoja, nota SOAP escrita y firmada, entrega e historial). Sin la consulta a la IA, que está detenida |
| Capturas a 1920, 1440, 1024 y 390 | **Sin verificar**: se cortó a pedido para acortar la verificación. Las pantallas cambiadas se miraron a 1920 durante el trabajo (sin zonas vacías) y a 1440 en la fase 1 (sin desbordes); 1024 y 390 no se revisaron después de los cambios |
| nginx de la app principal (Parte C) | Pantallas y `/api` responden; con el backend parado, las pantallas siguen y solo `/api` da 502; con el backend recreado **en otra IP** (172.21.0.6 → .11), `/api` vuelve solo, sin reiniciar el frontend; `CF-Connecting-IP: 203.0.113.7` llega al backend como la IP del visitante y un `X-Forwarded-For` inventado no |
| Íconos en Windows | Edge (sin ventana) y Chromium del panel (con ventana), a 1920: los íconos de acciones del Dashboard, la alerta y la flecha de "Ver todos" se ven; el ojo, el corazón y el "•••" de Mis Pacientes llevan a su pantalla o abren su menú |

### 8.5 Lo que queda

- La IA de pronóstico (A5, "Estado en la fase 2").
- **Sin verificar:** capturas de todas las pantallas a 1024 y 390 después de los cambios (la Lista UCI tiene una vista
  nueva en celular) y las de 1440 y 1920 de las pantallas que no se tocaron.
- Chrome no está instalado en este equipo: se probó en Edge y Chromium. Los cuadritos vacíos los confirma el usuario en
  su Windows.
- Pedidos 35 a 38 de `CONEXION-BACKEND.md` (sección 13.3).
