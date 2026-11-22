import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MedAlertasCentro from './pages/MedAlertasCentro';
import MedAlertasConfirmacionAtencion from './pages/MedAlertasConfirmacionAtencion';
import MedAyudaSoporte from './pages/MedAyudaSoporte';
import MedBusquedaGlobal from './pages/MedBusquedaGlobal';
import MedDashboardPrincipal from './pages/MedDashboardPrincipal';
import MedDispositivosMonitores from './pages/MedDispositivosMonitores';
import MedMonitoreoComparativa from './pages/MedMonitoreoComparativa';
import MedMonitoreoGridUci from './pages/MedMonitoreoGridUci';
import MedMonitoreoListaUci from './pages/MedMonitoreoListaUci';
import MedNotificacionesCentro from './pages/MedNotificacionesCentro';
import MedPacienteAntecedentes from './pages/MedPacienteAntecedentes';
import MedPacienteConfigUmbrales from './pages/MedPacienteConfigUmbrales';
import MedPacienteDatosPersonales from './pages/MedPacienteDatosPersonales';
import MedPacienteDiagnosticosActivos from './pages/MedPacienteDiagnosticosActivos';
import MedPacienteDocumentosClinicos from './pages/MedPacienteDocumentosClinicos';
import MedPacienteExploracionFisica from './pages/MedPacienteExploracionFisica';
import MedPacienteHistoriaClinicaGeneral from './pages/MedPacienteHistoriaClinicaGeneral';
import MedPacienteHistorialHospitalizaciones from './pages/MedPacienteHistorialHospitalizaciones';
import MedPacienteIndicacionesMedicas from './pages/MedPacienteIndicacionesMedicas';
import MedPacienteInterrogatorioAparatos from './pages/MedPacienteInterrogatorioAparatos';
import MedPacienteMonitoreoDetallado from './pages/MedPacienteMonitoreoDetallado';
import MedPacienteNotaIngreso from './pages/MedPacienteNotaIngreso';
import MedPacienteNotasSoapDetalle from './pages/MedPacienteNotasSoapDetalle';
import MedPacienteNotasSoapHistorial from './pages/MedPacienteNotasSoapHistorial';
import MedPacienteNotasSoapNueva from './pages/MedPacienteNotasSoapNueva';
import MedPacienteRegistroDiagnostico from './pages/MedPacienteRegistroDiagnostico';
import MedPacienteResumen from './pages/MedPacienteResumen';
import MedPacienteTendenciasVitales from './pages/MedPacienteTendenciasVitales';
import MedPacientesLista from './pages/MedPacientesLista';
import MedPerfilMiPerfil from './pages/MedPerfilMiPerfil';
import MedReportesPanel from './pages/MedReportesPanel';
import MedTurnoEntregaHandoff from './pages/MedTurnoEntregaHandoff';
import MedTurnoHistorial from './pages/MedTurnoHistorial';
import MedTurnoResumenRecibido from './pages/MedTurnoResumenRecibido';
import Notificaciones from './pages/Notificaciones';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MedAlertasCentro />} />
        <Route path="/MedAlertasCentro" element={<MedAlertasCentro />} />
        <Route path="/MedAlertasConfirmacionAtencion" element={<MedAlertasConfirmacionAtencion />} />
        <Route path="/MedAyudaSoporte" element={<MedAyudaSoporte />} />
        <Route path="/MedBusquedaGlobal" element={<MedBusquedaGlobal />} />
        <Route path="/MedDashboardPrincipal" element={<MedDashboardPrincipal />} />
        <Route path="/MedDispositivosMonitores" element={<MedDispositivosMonitores />} />
        <Route path="/MedMonitoreoComparativa" element={<MedMonitoreoComparativa />} />
        <Route path="/MedMonitoreoGridUci" element={<MedMonitoreoGridUci />} />
        <Route path="/MedMonitoreoListaUci" element={<MedMonitoreoListaUci />} />
        <Route path="/MedNotificacionesCentro" element={<MedNotificacionesCentro />} />
        <Route path="/MedPacienteAntecedentes" element={<MedPacienteAntecedentes />} />
        <Route path="/MedPacienteConfigUmbrales" element={<MedPacienteConfigUmbrales />} />
        <Route path="/MedPacienteDatosPersonales" element={<MedPacienteDatosPersonales />} />
        <Route path="/MedPacienteDiagnosticosActivos" element={<MedPacienteDiagnosticosActivos />} />
        <Route path="/MedPacienteDocumentosClinicos" element={<MedPacienteDocumentosClinicos />} />
        <Route path="/MedPacienteExploracionFisica" element={<MedPacienteExploracionFisica />} />
        <Route path="/MedPacienteHistoriaClinicaGeneral" element={<MedPacienteHistoriaClinicaGeneral />} />
        <Route path="/MedPacienteHistorialHospitalizaciones" element={<MedPacienteHistorialHospitalizaciones />} />
        <Route path="/MedPacienteIndicacionesMedicas" element={<MedPacienteIndicacionesMedicas />} />
        <Route path="/MedPacienteInterrogatorioAparatos" element={<MedPacienteInterrogatorioAparatos />} />
        <Route path="/MedPacienteMonitoreoDetallado" element={<MedPacienteMonitoreoDetallado />} />
        <Route path="/MedPacienteNotaIngreso" element={<MedPacienteNotaIngreso />} />
        <Route path="/MedPacienteNotasSoapDetalle" element={<MedPacienteNotasSoapDetalle />} />
        <Route path="/MedPacienteNotasSoapHistorial" element={<MedPacienteNotasSoapHistorial />} />
        <Route path="/MedPacienteNotasSoapNueva" element={<MedPacienteNotasSoapNueva />} />
        <Route path="/MedPacienteRegistroDiagnostico" element={<MedPacienteRegistroDiagnostico />} />
        <Route path="/MedPacienteResumen" element={<MedPacienteResumen />} />
        <Route path="/MedPacienteTendenciasVitales" element={<MedPacienteTendenciasVitales />} />
        <Route path="/MedPacientesLista" element={<MedPacientesLista />} />
        <Route path="/MedPerfilMiPerfil" element={<MedPerfilMiPerfil />} />
        <Route path="/MedReportesPanel" element={<MedReportesPanel />} />
        <Route path="/MedTurnoEntregaHandoff" element={<MedTurnoEntregaHandoff />} />
        <Route path="/MedTurnoHistorial" element={<MedTurnoHistorial />} />
        <Route path="/MedTurnoResumenRecibido" element={<MedTurnoResumenRecibido />} />
        <Route path="/Notificaciones" element={<Notificaciones />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
