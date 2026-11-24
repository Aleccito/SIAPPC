import { fmtDate, initials } from '../../lib/clinical';
import { useSession } from '../auth/session';
import { useAiPanel } from '../ai/AiPanel';
import { IconClipboard, IconFileText, IconSparkles } from '../icons';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Tabs, type TabItem } from '../ui/Tabs';
import { useToast } from '../ui/Toast';
import type { PatientView } from './usePatient';

/** Círculo con las iniciales: la foto de Figma era de una sola paciente (REVISION-IA.md, D2). */
export function PatientAvatar({ name, size = 56 }: { name: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full bg-primary-soft font-jakarta font-extrabold leading-[normal] text-primary"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {initials(name)}
    </span>
  );
}

/** Tarjeta superior del expediente: iniciales, nombre, estado, cama y acciones rápidas. */
export function PatientHeader({ view }: { view: PatientView | undefined }) {
  const toast = useToast();
  const { can } = useSession();
  const ai = useAiPanel();
  return (
    <Card raised className="w-full">
      {/* Debajo de 1280 px los botones van en una fila bajo los datos; en celular, a todo el ancho. */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        {view ? (
          <div className="flex min-w-0 items-center gap-4">
            <PatientAvatar name={view.name} />
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h2 className="font-jakarta text-[22px] font-extrabold leading-[normal] text-ink">{view.name}</h2>
                <span className="flex items-center gap-3">
                  <Badge tone={view.stateTone}>{view.stateLabel}</Badge>
                  {view.bed && <Badge tone="info">{`Cama ${view.bed}`}</Badge>}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-jakarta text-[13px] leading-[normal]">
                <span className="font-medium text-muted">{`ID ${view.cedula}`}</span>
                {view.age !== null && <span className="font-medium text-muted">{`${view.age} años`}</span>}
                {view.mainDx && <span className="font-semibold text-ink">{String(view.mainDx.description)}</span>}
                <span className="flex gap-1.5 text-[12px]">
                  <span className="text-muted">Ingreso:</span>
                  <span className="font-semibold text-ink">{fmtDate(view.assigned?.admittedAt ?? view.patient.arrivedAt)}</span>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex min-w-0 items-center gap-4" aria-busy="true" aria-label="Cargando paciente">
            <span className="size-14 shrink-0 animate-pulse rounded-full bg-line" />
            <div className="flex min-w-0 flex-col gap-2">
              <span className="h-6 w-64 max-w-full animate-pulse rounded bg-line" />
              <span className="h-4 w-80 max-w-full animate-pulse rounded bg-line" />
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 gap-[10px] sm:flex sm:flex-wrap sm:items-center">
          {can('notas_soap', 'crear') && (
            <Button to="/MedPacienteNotasSoapNueva" icon={<IconClipboard size={14} />}>
              Nueva Nota SOAP
            </Button>
          )}
          <Button variant="secondary" icon={<IconFileText size={14} />} onClick={() => view && toast(`Reporte de ${view.name} generado`)}>
            Generar Reporte
          </Button>
          {/* No viene de Figma (PR 3): abre la consulta a la IA en el panel lateral, con este paciente. */}
          {ai.available && view && (
            <Button variant="soft" icon={<IconSparkles size={14} />} onClick={() => ai.open({ cedula: view.cedula })}>
              Consultar IA
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export type PatientTab = 'resumen' | 'historia' | 'notas' | 'monitoreo' | 'documentos';

/** Las pestañas llevan al paciente de la URL solas (src/lib/patientLink.ts). */
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
