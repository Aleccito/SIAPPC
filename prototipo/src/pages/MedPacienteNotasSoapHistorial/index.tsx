// Pantalla "med/paciente/notas-soap-historial" (Figma node 29:1308) — generada desde el diseño original de Figma.
import { BackButton, PatientLayout } from '../../components';
import { SoapHistoryView } from './SoapHistoryView';

export default function MedPacienteNotasSoapHistorial() {
  return (
    <PatientLayout breadcrumb="SIAPPC > Pacientes > María González > Notas SOAP" title="Notas SOAP" tab="notas" actions={<BackButton />}>
      <SoapHistoryView linkSelected />
    </PatientLayout>
  );
}
