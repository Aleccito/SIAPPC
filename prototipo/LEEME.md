# SIAPPC · Prototipo del módulo médico (React + Tailwind)

Las 35 pantallas de la página **MEDICO** de Figma y las 4 de **LOGIN**, generadas a partir del diseño original.
Es una **segunda app**, aparte de `frontend/` (la app real), sin código compartido. Las pantallas piden sus datos a
`src/api/`, que los trae del backend (`/api`) o de un simulador en el navegador con los **8 pacientes de
`backend/db/seed-demo.sql`** (DEMO-0001…0008), según `VITE_API_MODE`. Lo publicado usa el backend (`real`); lo que
el backend todavía no tiene sigue simulado en `src/api/sinBackend.ts`. Cómo quedó la conexión:
[CONEXION-BACKEND.md](CONEXION-BACKEND.md), secciones 10 y 11.

## Verlo con Docker (servidor)

Desde la raíz del repo:

```bash
docker compose up -d --build prototipo
```

Queda en `http://<servidor>:8082` (cambia el puerto con `PROTOTIPO_PORT` en el `.env`).
Por defecto se construye en modo `real`: usa el backend del mismo Compose a través de su nginx (`/api`). Si el
backend no está, las pantallas cargan igual y solo `/api` responde 502. Para verlo sin backend, con el simulador:
`PROTOTIPO_API_MODE=mock` en el `.env`.
`docker compose up -d --build` sin nombrar el servicio **no** lo levanta (va en el perfil `prototipo`).

Para que los signos vitales, las alertas y la onda del ECG se muevan sin equipos de verdad, está el publicador de
demo: [tools/telemetria-demo/LEEME.md](tools/telemetria-demo/LEEME.md).

## Verlo en tu PC (desarrollo)

```bash
cd prototipo
npm install
npm run dev
```

Abre http://localhost:5173 y navega con el menú lateral, o entra directo a cualquier ruta de la tabla.

## Datos y sesión

- **Con el backend** (lo publicado, `real`): se entra con las cuentas del seed (README de la raíz, "5.
  Entrar"). Después del login viene el código de verificación: mientras el backend no tenga MFA, el código es
  **000000** (lo dice la pantalla) y sin él no se entra. Cada rol ve lo suyo:
  - Médico: todo lo clínico.
  - Enfermería: solo lectura, sin IA.
  - Administrativo: monitoreo, alertas, dispositivos y reportes, sin abrir el expediente.
  - Admin: nada clínico; entra a Mi Perfil.
- **Con el simulador** (`npm run dev` sin `.env.local`): al entrar directo a una pantalla se abre sesión como el
  médico. En el Login sirve cualquier contraseña (las cuentas del seed entran con su rol) y el código también es
  000000. Después de "Cerrar sesión" hay que volver a entrar.
- El paciente va en la URL: `/MedPacienteResumen?paciente=DEMO-0005`. Sin `?paciente=` se abre DEMO-0002; una cédula
  que no existe muestra "Paciente no encontrado". Con el backend se abren todos los pacientes de la base, no solo
  los 8.
- **Lo simulado** (PA, temperatura sin monitor, datos personales, los paneles del monitoreo detallado, nota de
  ingreso, indicaciones, entrega de turno…) no es fijo: cambia poco a poco con el tiempo. Los pacientes que no son de
  los 8 reciben valores simulados según su diagnóstico (`src/api/simulacion.ts`; CONEXION-BACKEND.md, 11.2).
- Con el backend, las notas SOAP, los diagnósticos y las demás altas se guardan en la base. Sin él, lo que se escribe
  se guarda en la pestaña del navegador y sobrevive a recargar; se pierde al cerrarla. Lo simulado que se edita
  (umbrales, nota de ingreso, indicaciones) se guarda siempre en la pestaña.
- Las respuestas tardan un poco, como un servidor. Para probar: `?retraso=0` (sin espera), `?sesion=vencida` (la
  siguiente petición responde 401 y vuelve al Login).
- `.env.example` trae el interruptor `VITE_API_MODE` (`mock` por defecto en `npm run dev`, `real` o `mixto`, con
  `VITE_API_REAL` para elegir grupos o rutas) y el proxy de `/api` está en `vite.config.ts`. En el contenedor, el
  modo se fija al construir (`PROTOTIPO_API_MODE` y `PROTOTIPO_API_REAL` en el `.env` del servidor; por defecto,
  `real`) y el nginx del prototipo hace de proxy de `/api` hacia el backend.

## IA

- "Asistente IA" en el menú (`/MedAsistenteIa`) y "Consultar IA" en la cabecera de cada paciente: consulta libre
  sobre un paciente. Las ideas de la IA aparecen en el Resumen y, en los críticos, en el Monitoreo detallado.
- **Con el backend** responde el modelo del servidor (`LLM_URL` y `LLM_MODEL` del backend; en CPU, unos 20 s por
  respuesta). Si el modelo no está, la pantalla dice que la IA no está disponible y ofrece reintentar.
- **Con el simulador** responde en segundos con textos escritos para cada paciente y se presenta como
  `medgemma-4b-it (simulado)`. Para probar estados: `?ia=lenta` (tiempos del modelo real), `?ia=caida` (no
  disponible), `?ia=corte` (se corta a mitad), `?ia=sin-analisis` y `?ia=normal` para volver.
- Nada de lo que dice se guarda; si se lleva a una nota SOAP, el médico la revisa y la firma. Solo la ven los
  médicos.

## Notas

- Íconos e imágenes viven en `src/assets/`, exportados de Figma.
- Todas las pantallas comparten el mismo menú lateral, barra superior y componentes (`src/components/`).
  A 1440 px se ven como en Figma; en pantallas más angostas se reacomodan y el menú se abre con el botón ☰.
- El menú lateral, la campana, la ayuda, el perfil, las pestañas del paciente y los enlaces de prototipo de Figma
  navegan entre pantallas.
- Fuentes: Plus Jakarta Sans, Inter y Geist (Google Fonts, en `index.html`; requieren internet).
- La ruta `/` abre el `Login`; después del código se llega al Dashboard.
- Estado del trabajo y siguientes pasos: [PLAN.md](PLAN.md).

## Rutas

| Ruta | Pantalla en Figma |
|---|---|
| `/` y `/Login` | siappc-login |
| `/LoginMfa` | SIAPPC - MFA |
| `/RecuperarContrasena` | SIAPPC - Recovery |
| `/RecuperacionEnviada` | siappc-recovery-confirmation |
| `/MedAlertasCentro` | med/alertas/centro |
| `/MedAlertasConfirmacionAtencion` | med/alertas/confirmacion-atencion |
| `/MedAsistenteIa` | asistente de IA **(nueva, no viene de Figma)** |
| `/MedAyudaSoporte` | med/ayuda/soporte **(nueva)** |
| `/MedBusquedaGlobal` | med/busqueda/global |
| `/MedDashboardPrincipal` | med/dashboard/principal |
| `/MedDispositivosMonitores` | med-dispositivos-monitores |
| `/MedDispositivoDetalle` | detalle de monitor **(nueva, no viene de Figma)** |
| `/MedMonitoreoComparativa` | med/monitoreo/comparativa |
| `/MedMonitoreoGridUci` | med/monitoreo/grid-uci |
| `/MedMonitoreoListaUci` | med/monitoreo/lista-uci |
| `/MedNotificacionesCentro` | med-notificaciones-centro **(nueva)** |
| `/MedPacienteAntecedentes` | med/paciente/antecedentes |
| `/MedPacienteConfigUmbrales` | med/paciente/config-umbrales |
| `/MedPacienteDatosPersonales` | med/paciente/datos-personales |
| `/MedPacienteDiagnosticosActivos` | med/paciente/diagnosticos-activos |
| `/MedPacienteDocumentosClinicos` | med/paciente/documentos-clinicos |
| `/MedPacienteExploracionFisica` | med/paciente/exploracion-fisica |
| `/MedPacienteHistoriaClinicaGeneral` | med/paciente/historia-clinica-general |
| `/MedPacienteHistorialHospitalizaciones` | med/paciente/historial-hospitalizaciones |
| `/MedPacienteIndicacionesMedicas` | med/paciente/indicaciones-medicas |
| `/MedPacienteInterrogatorioAparatos` | med/paciente/interrogatorio-aparatos |
| `/MedPacienteMonitoreoDetallado` | med/paciente/monitoreo-detallado |
| `/MedPacienteNotaIngreso` | med/paciente/nota-ingreso |
| `/MedPacienteNotasSoapDetalle` | med/paciente/notas-soap-detalle |
| `/MedPacienteNotasSoapHistorial` | med/paciente/notas-soap-historial |
| `/MedPacienteNotasSoapNueva` | med/paciente/notas-soap-nueva |
| `/MedPacienteRegistroDiagnostico` | med/paciente/registro-diagnostico |
| `/MedPacienteResumen` | med/paciente/resumen |
| `/MedPacienteTendenciasVitales` | med/paciente/tendencias-vitales |
| `/MedPacientesLista` | med/pacientes/lista |
| `/MedPerfilMiPerfil` | med/perfil/mi-perfil |
| `/MedReportesPanel` | med/reportes/panel **(nueva)** |
| `/MedTurnoEntregaHandoff` | med/turno/entrega-handoff **(nueva)** |
| `/MedTurnoHistorial` | med-turno-historial **(nueva)** |
| `/MedTurnoResumenRecibido` | med/turno/resumen-recibido |
| `/Notificaciones` | notificaciones |
