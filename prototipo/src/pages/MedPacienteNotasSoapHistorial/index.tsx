// Pantalla "med/paciente/notas-soap-historial" (Figma node 29:1308) — generada desde el diseño original de Figma.
import { PatientLayout, usePatient } from '../../components';
import { SoapHistoryView } from './SoapHistoryView';

export default function MedPacienteNotasSoapHistorial() {
  const { view } = usePatient();
  return (
    <PatientLayout breadcrumb={`SIAPPC > Pacientes > ${view?.name ?? '…'} > Notas SOAP`} title="Notas SOAP" tab="notas">
      {view && <SoapHistoryView v={view} />}
    </PatientLayout>
  );
}
