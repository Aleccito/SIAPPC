// Pantalla "med/paciente/historial-hospitalizaciones" (Figma node 191:397) — generada desde el diseño original de Figma.
import type { ReactNode } from 'react';
import imgTimelineLeftMarker from '../../assets/timeline-left-marker.svg';
import imgTimelineLeftMarker2 from '../../assets/timeline-left-marker-2.svg';
import imgTimelineLeftMarkerFrame from '../../assets/timeline-left-marker-frame.svg';
import { BackButton, Badge, Card, CardTitle, Divider, PatientLayout } from '../../components';

const B = ({ children, weight = 'font-semibold' }: { children: ReactNode; weight?: string }) => <span className={`${weight} text-ink`}>{children}</span>;

type Stay = { marker: string | 'last'; title: string; status: string; current?: boolean; lines: ReactNode[] };

const STAYS: Stay[] = [
  {
    marker: imgTimelineLeftMarker,
    current: true,
    title: 'Ingreso Actual — Unidad de Cuidados Intensivos (UCI)',
    status: 'HOSPITALIZADA',
    lines: [
      <>Ingreso: <B weight="font-bold">15 Oct 2025</B> · Cama: <B weight="font-bold">C-03</B> · Médico: <B weight="font-bold">Dr. Carlos Méndez</B></>,
      <>Motivo de Ingreso: <B weight="font-medium">Descompensación severa de Insuficiencia Cardíaca Congestiva + Edema Agudo de Pulmón.</B></>,
    ],
  },
  {
    marker: imgTimelineLeftMarker2,
    title: 'Hospitalización General — Medicina Interna (5 días)',
    status: 'ALTA MÉDICA',
    lines: [<>Estancia: <B>22 Jul 2024 - 27 Jul 2024</B> · Diagnóstico de egreso: <B>Infección Urinaria Complicada</B></>],
  },
  {
    marker: imgTimelineLeftMarker2,
    title: 'Hospitalización Especializada — Cardiología (8 días)',
    status: 'ALTA MÉDICA',
    lines: [<>Estancia: <B>03 Mar 2020 - 11 Mar 2020</B> · Motivo: <B>Revascularización miocárdica quirúrgica electiva (Bypass Coronario)</B></>],
  },
  {
    marker: 'last',
    title: 'Estancia Corta — Urgencias (2 días)',
    status: 'ALTA MÉDICA',
    lines: [<>Fecha: <B>15 Nov 2018</B> · Diagnóstico clínico: <B>Crisis Hipertensiva controlada</B></>],
  },
];

const SURGERY = [
  ['Fecha', '05 Mar 2020'],
  ['Procedimiento', 'Bypass coronario triple (Revascularización)'],
  ['Cirujano Principal', 'Dr. Ramírez'],
  ['Resultado / Evolución', 'Excelente cicatrización, injertos arteriales permeables'],
];

export default function MedPacienteHistorialHospitalizaciones() {
  return (
    <PatientLayout
      breadcrumb="SIAPPC > Pacientes > María González > Historia Clínica > Hospitalizaciones"
      title="Historial de Hospitalizaciones e Intervenciones"
      tab="historia"
      actions={<BackButton />}
    >
      <div className="flex w-full flex-col items-start gap-5 xl:flex-row">
        <Card padding="lg" className="flex w-full min-w-0 flex-col gap-5 xl:flex-1">
          <CardTitle>Línea de Tiempo de Estancias Médicas</CardTitle>
          <ol className="flex w-full flex-col gap-4">
            {STAYS.map((s) => (
              <li key={s.title} className="flex w-full items-start gap-3 sm:gap-4">
                {s.marker === 'last' ? (
                  <div className="flex w-10 shrink-0 flex-col items-center">
                    <img className="size-6" alt="" src={imgTimelineLeftMarkerFrame} />
                  </div>
                ) : (
                  <div className="relative h-7 w-10 shrink-0">
                    <img className="absolute inset-y-0 -left-1/4 h-full w-[150%] max-w-none" alt="" src={s.marker} />
                  </div>
                )}
                <div className={`flex min-w-0 flex-1 flex-col gap-2 rounded-[10px] border p-[14px] ${s.current ? 'border-danger bg-danger-soft' : 'border-line bg-surface'}`}>
                  <div className="flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-1 leading-[normal]">
                    <p className="font-jakarta text-[14px] font-extrabold text-ink">{s.title}</p>
                    <p className={`font-jakarta text-[12px] font-bold ${s.current ? 'text-danger' : 'text-success'}`}>{s.status}</p>
                  </div>
                  {s.lines.map((line, i) => (
                    <p key={i} className="w-full font-jakarta text-[13px] font-normal leading-[normal] text-[#475569]">
                      {line}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <Card padding="lg" className="flex w-full min-w-0 flex-col gap-5 xl:w-[450px] xl:shrink-0">
          <CardTitle>Intervenciones Quirúrgicas</CardTitle>
          <div className="flex w-full flex-col gap-3 rounded-lg border border-line bg-surface p-4">
            <div className="flex w-full items-center justify-between gap-3">
              <p className="font-jakarta text-[14px] font-extrabold leading-[normal] text-ink">Procedimiento Quirúrgico Mayor</p>
              <Badge tone="success" size="sm">Exitoso</Badge>
            </div>
            <Divider />
            <div className="flex w-full flex-col gap-2">
              {SURGERY.map(([label, value]) => (
                <div key={label} className="flex w-full flex-col gap-1">
                  <p className="font-jakarta text-[11px] font-semibold uppercase leading-[normal] text-muted">{label}</p>
                  <div className="w-full rounded-lg bg-surface p-3">
                    <p className="font-jakarta text-[13px] font-semibold leading-[normal] text-ink">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </PatientLayout>
  );
}
