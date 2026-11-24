# SIAPPC · Prototipo del módulo médico (React + Tailwind)

Las 35 pantallas de la página **MEDICO** de Figma y las 4 de **LOGIN**, generadas a partir del diseño original.
Es una **segunda app**, aparte de `frontend/` (la app real), sin código compartido. Las pantallas piden sus datos a
`src/api/` como lo haría la app real, y un simulador en el navegador responde con los **8 pacientes de
`backend/db/seed-demo.sql`** (DEMO-0001…0008). No necesita backend; conectarlo se explica en
[CONEXION-BACKEND.md](CONEXION-BACKEND.md).

## Verlo con Docker (servidor)

Desde la raíz del repo:

```bash
docker compose up -d --build prototipo
```

Queda en `http://<servidor>:8082` (cambia el puerto con `PROTOTIPO_PORT` en el `.env`).
Solo levanta este contenedor: no necesita base de datos, backend ni broker.
`docker compose up -d --build` sin nombrar el servicio **no** lo levanta (va en el perfil `prototipo`).

## Verlo en tu PC (desarrollo)

```bash
cd prototipo
npm install
npm run dev
```

Abre http://localhost:5173 y navega con el menú lateral, o entra directo a cualquier ruta de la tabla.

## Datos y sesión

- Al entrar directo a una pantalla, el simulador abre sesión como el médico (Dr. Carlos Méndez). En el Login sirve
  cualquier contraseña y cualquier código de 6 dígitos; con `enfermero@institucion.org` se entra como enfermería
  (sin "Nueva Nota SOAP"). Después de "Cerrar sesión" hay que volver a entrar.
- El paciente va en la URL: `/MedPacienteResumen?paciente=DEMO-0005`. Sin `?paciente=` se abre DEMO-0002; una cédula
  que no existe muestra "Paciente no encontrado".
- Lo que se escribe (notas SOAP, diagnósticos, umbrales, borradores) se guarda en la pestaña del navegador y sobrevive
  a recargar; se pierde al cerrarla.
- Las respuestas tardan un poco, como un servidor. Para probar: `?retraso=0` (sin espera), `?sesion=vencida` (la
  siguiente petición responde 401 y vuelve al Login).
- `.env.example` trae el interruptor `VITE_API_MODE` (`mock` por defecto, `real` o `mixto`) y el proxy de `/api` ya
  está en `vite.config.ts`.

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
