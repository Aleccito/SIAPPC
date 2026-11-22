# SIAPPC · Prototipo del módulo médico (React + Tailwind)

Las 35 pantallas de la página **MEDICO** de Figma, generadas a partir del diseño original.
Es un **prototipo visual**: los datos están escritos en las pantallas y no se conecta al
backend. Es independiente de `frontend/` (la app real) y no comparte nada con ella.

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

## Notas

- Íconos e imágenes viven en `src/assets/`, exportados de Figma.
- El menú lateral, la campana, la ayuda, el perfil y los enlaces de prototipo de Figma navegan entre pantallas.
- Fuentes: Plus Jakarta Sans, Inter y Geist (Google Fonts, en `index.html`; requieren internet).
- Cada pantalla tiene el tamaño fijo del diseño (1440 px de ancho), igual que en Figma.
- La ruta `/` abre `MedAlertasCentro`.

## Rutas

| Ruta | Pantalla en Figma |
|---|---|
| `/MedAlertasCentro` | med/alertas/centro |
| `/MedAlertasConfirmacionAtencion` | med/alertas/confirmacion-atencion |
| `/MedAyudaSoporte` | med/ayuda/soporte **(nueva)** |
| `/MedBusquedaGlobal` | med/busqueda/global |
| `/MedDashboardPrincipal` | med/dashboard/principal |
| `/MedDispositivosMonitores` | med-dispositivos-monitores |
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
