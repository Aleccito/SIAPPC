# Tablas, "Volver", cursor y central por unidades — informe

> **Estado: hecho** (rama `fix/prototipo-tablas-y-volver`). Solo `prototipo/`; no toca el backend.

## 1. Tablas que se enciman

- **Dashboard:**
  - Antes, los 4 botones de "Acciones" tapaban 58 px de "Alerta activa" en todo ancho menor a ~1900 px.
  - La causa: la columna de acciones era `flex-1` sin mínimo, y la tabla tenía `minWidth` 1000, menos que la suma de
    sus columnas (1060).
  - Ahora la columna no baja de 148 px (4 botones de 34 px más 3 separaciones) y la tabla mide al menos 1060 px. Con
    menos ancho, se desplaza de lado, con la sombra que avisa que hay más columnas.
- **Dispositivos:**
  - Antes, a 1280 px la fila se salía 68 px, porque su `minWidth` era 1060 y las columnas suman 1152.
  - Ahora el mínimo es esa suma.
- **Comparativa** (no es una tabla, pero tenía el mismo problema):
  - Antes, a 1280 px los valores con flecha ("91% ↓") se salían de su recuadro de 55 px.
  - Ahora los 5 recuadros van en una fila desde 1366 px; con menos ancho, en 3 columnas.
- **Revisión:**
  - Se buscó contenido que se sale de su fila en 27 pantallas a 1280, 1366, 1440 y 1920 px.
  - Después de los arreglos no queda nada, salvo 4 px del ícono de una tarjeta de Notas SOAP a 1920, que no se nota.

## 2. Volver y miga de pan

- **"← Volver" a la izquierda del título** (`back` en `TopBar`/`AppLayout`). Está en:
  - todas las fichas del paciente (`PatientLayout`);
  - el detalle del monitor.
- **Cómo decide adónde ir** (`components/layout/historial.tsx`):
  - `RegistroHistorial`, en `App.tsx`, anota cada pantalla de la pestaña con su `key` de React Router.
  - Si hay una pantalla anterior de la app, "Volver" regresa a ella con `navigate(-1)` y conserva sus filtros.
  - Si no la hay, o la anterior es el Login o el código, va a la pantalla padre: Mis Pacientes para las fichas y
    Dispositivos para el monitor. Pasa al entrar por un enlace directo, al recargar o justo después de iniciar
    sesión.
- **Se quitaron los "Volver" de la derecha** de 18 pantallas.
  - El componente `BackButton` se queda: lo puede estar usando la sección `Admin*` en su rama.
- **Miga de pan con enlaces:**
  - Cada tramo, menos el último, lleva a su sección (`CRUMB_LINKS` en `nav.ts`). `PatientLayout` agrega los del
    paciente: nombre, "Historia Clínica" y "Notas SOAP".
  - Un tramo que el rol no puede abrir queda como texto (`canOpenPath`, la misma regla que `RoleGuard`).
  - El Resumen dice "SIAPPC > Pacientes > nombre", y no "Monitoreo > Mapa de Camas > cama".
- **La confirmación de atención no lleva "Volver":** es una ventana sobre la pantalla de origen y ya vuelve con
  "Cancelar", la X y Escape.

## 3. Cursor de escribir

- `index.css`, en `@layer base`:
  - flecha normal (`cursor: default`) y `caret-color: transparent` en el cuerpo;
  - cursor de texto y rayita visible en `input`, `textarea` y `contenteditable`.
- Las clases de Tailwind siguen mandando: `cursor-pointer` en filas y botones, y `disabled:cursor-not-allowed`.
- No se tocó `user-select`: el texto se sigue pudiendo seleccionar y copiar.
- La rayita que parpadea al hacer clic en cualquier texto la pone la navegación con cursor de Edge (F7). Con esto ya
  no se ve dentro de la app.

## 4. Central de monitoreo

- **La central es por camas:**
  - Muestra una unidad a la vez, y por eso con 15 pacientes a cargo se veían 6 en UCI.
  - Los demás están en Trauma, en Piso 3 o sin cama.
- **Selector de unidad:** dice cuántos pacientes (camas ocupadas) tiene cada una, por ejemplo "UCI (6)".
- **Opción "Todas" (n)** (`?unidad=Todas`):
  - muestra todas las camas en un grupo por unidad ("Trauma · 4 pacientes"), en la vista Grid y en la Lista;
  - en la Lista, con un rótulo dentro de la tabla.
  - La unidad por defecto sigue siendo UCI.
- **Pacientes sin cama:** si hay alguno a cargo, el resumen dice "1 de tus pacientes no tiene cama y no aparece en la
  central", con un enlace a Mis Pacientes.
  - La línea solo la ve quien puede abrir Mis Pacientes: el administrativo ve la central, pero no tiene pacientes a
    cargo.

## 5. Cómo se verificó (rápida)

- `tsc --noEmit` y `npm run build` del prototipo.
- **Pruebas en modo mock**, con el navegador de pruebas (Chromium):
  - La revisión de encimados de la sección 1, a 4 anchos.
  - Dashboard → paciente → "Volver" regresa al Dashboard.
  - Antecedentes por enlace directo → la miga "Historia Clínica" → "Volver" (vuelve a Antecedentes) → "Volver" (Mis
    Pacientes).
  - Detalle del monitor por enlace directo → "Volver" (Dispositivos).
  - El cursor medido en un título (flecha, sin rayita), en un campo (texto, rayita visible) y en filas y botones
    (mano).
  - Selector "Todas (8) · UCI (5) · Trauma (1) · Piso 3 (2)" y los grupos de "Todas".
  - La línea de pacientes sin cama. En el simulador todos tienen cama, así que para la prueba se le quitó la cama a
    uno solo en memoria.
- **Capturas** en Edge sin ventana, a 1440 y 390, de estas pantallas:
  - Dashboard;
  - Dispositivos y Detalle del monitor;
  - Resumen y Antecedentes;
  - la central "Todas" en Grid y en Lista;
  - Comparativa.

  Además, Dashboard y Dispositivos a 1366 y 1280. No hay desplazamiento lateral de la página. Las capturas no se suben:
  quedan en la carpeta de trabajo local.
- **Sin verificar:**
  - contra el backend real (Docker estaba apagado);
  - en Chrome;
  - la rayita de F7 a la vista: se midió el estilo, no se miró el parpadeo.
