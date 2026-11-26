// Pantalla "med/reportes/panel" (Figma: Módulo de Reportes Clínicos).
// Lo que hay de verdad:
// - La hoja imprimible de un paciente, con sus datos reales (la misma de "Generar Reporte" en la ficha).
// - Los Informes del Sistema: la bitácora del ETL y el CSV de actividad clínica (InformesSistema.tsx).
// Los reportes clínicos por paciente que traía Figma (historial de entregas, pendientes de entregar, descargas y
// vistas previas) eran inventados y se quitaron: el backend no tiene reportes clínicos (docs/CONEXION-BACKEND.md,
// pedido 14; docs/historial/REVISION-MEDICO.md, 6).
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '../../api/queries';
import { AppLayout, Button, Card, IconFileText, Select, useSession } from '../../components';
import { InformesSistema } from './InformesSistema';

function SectionHeader({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex w-full flex-col gap-1 leading-[normal]">
      <h2 className="font-jakarta text-[18px] font-bold text-ink">{title}</h2>
      <p className="font-jakarta text-[13px] font-normal text-muted">{text}</p>
    </div>
  );
}

export default function MedReportesPanel() {
  const navigate = useNavigate();
  const { can } = useSession();
  // La hoja abre la ficha del paciente: sin la historia clínica (el administrativo) no se ofrece.
  const conExpediente = can('historia_clinica', 'ver');
  const pacientes = usePatients();
  const opciones = (pacientes.data?.items ?? [])
    .filter((p) => p.status !== 'discharged')
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
    .map((p) => ({ value: p.document, label: `${p.name} · ${p.document}` }));
  const [cedula, setCedula] = useState('');
  const elegido = cedula || opciones[0]?.value || '';

  return (
    <AppLayout breadcrumb="SIAPPC > Reportes" title="Reportes">
      <div className="flex w-full min-w-0 flex-1 flex-col gap-6 bg-surface p-4 md:p-8">
        {conExpediente && (
          <section className="flex w-full flex-col gap-3">
            <SectionHeader title="Hoja del Paciente" text="Diagnósticos, alergias, medicamentos, signos de ahora, alertas activas y última nota, lista para imprimir o guardar en PDF." />
            <Card className="flex w-full flex-col gap-4 sm:flex-row sm:items-end">
              <div className="w-full sm:max-w-[420px]">
                <Select variant="stacked" label="Paciente" options={opciones.length ? opciones : [{ value: '', label: pacientes.isPending ? 'Cargando…' : 'Sin pacientes' }]} value={elegido} onChange={setCedula} />
              </div>
              <Button icon={<IconFileText size={14} />} disabled={!elegido} onClick={() => navigate(`/MedPacienteResumen?paciente=${encodeURIComponent(elegido)}&imprimir=1`)}>
                Abrir hoja imprimible
              </Button>
            </Card>
          </section>
        )}
        <InformesSistema />
      </div>
    </AppLayout>
  );
}
