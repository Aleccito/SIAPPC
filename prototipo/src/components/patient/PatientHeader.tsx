import patientAvatar from '../../assets/patient-avatar.png';
import { IconClipboard, IconFileText } from '../icons';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Tabs, type TabItem } from '../ui/Tabs';
import { useToast } from '../ui/Toast';

/** Paciente de ejemplo que se muestra en todas las pantallas del expediente. */
export const DEMO_PATIENT = {
  name: 'María González',
  status: 'Crítico',
  bed: 'Cama C-03',
  id: 'ID PT-8821',
  age: '67 años',
  diagnosis: 'Insuficiencia Cardíaca Congestiva',
  admission: '15 Oct 2025',
  avatar: patientAvatar,
};

/** Tarjeta superior del expediente: foto, nombre, estado y acciones rápidas. */
export function PatientHeader({ patient = DEMO_PATIENT }: { patient?: typeof DEMO_PATIENT }) {
  const toast = useToast();
  return (
    <Card raised className="w-full">
      {/* Debajo de 1280 px los botones van en una fila bajo los datos; en celular, a todo el ancho. */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <img src={patient.avatar} alt="" className="size-14 shrink-0 rounded-full object-cover" />
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h2 className="font-jakarta text-[22px] font-extrabold leading-[normal] text-ink">{patient.name}</h2>
              <span className="flex items-center gap-3">
                <Badge tone="danger">{patient.status}</Badge>
                <Badge tone="info">{patient.bed}</Badge>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-jakarta text-[13px] leading-[normal]">
              <span className="font-medium text-muted">{patient.id}</span>
              <span className="font-medium text-muted">{patient.age}</span>
              <span className="font-semibold text-ink">{patient.diagnosis}</span>
              <span className="flex gap-1.5 text-[12px]">
                <span className="text-muted">Ingreso:</span>
                <span className="font-semibold text-ink">{patient.admission}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-[10px] sm:flex sm:flex-wrap sm:items-center">
          <Button to="/MedPacienteNotasSoapNueva" icon={<IconClipboard size={14} />}>
            Nueva Nota SOAP
          </Button>
          <Button variant="secondary" icon={<IconFileText size={14} />} onClick={() => toast(`Reporte de ${patient.name} generado`)}>
            Generar Reporte
          </Button>
        </div>
      </div>
    </Card>
  );
}

export type PatientTab = 'resumen' | 'historia' | 'notas' | 'monitoreo' | 'documentos';

export const PATIENT_TABS: TabItem[] = [
  { id: 'resumen', label: 'Resumen', to: '/MedPacienteResumen' },
  { id: 'historia', label: 'Historia Clínica', to: '/MedPacienteHistoriaClinicaGeneral' },
  { id: 'notas', label: 'Notas SOAP', to: '/MedPacienteNotasSoapHistorial' },
  { id: 'monitoreo', label: 'Monitoreo', to: '/MedPacienteMonitoreoDetallado' },
  { id: 'documentos', label: 'Documentos', to: '/MedPacienteDocumentosClinicos' },
];

/** Pestañas del expediente del paciente. */
export function PatientTabs({ active }: { active: PatientTab }) {
  return <Tabs items={PATIENT_TABS} active={active} />;
}
