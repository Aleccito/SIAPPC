// Pantalla "med/paciente/historial-hospitalizaciones" (Figma node 191:397) — generada desde el diseño original de Figma.
// La estancia actual sale del ingreso activo (tablero); las anteriores y las cirugías, del expediente
// (GET /historia/:id, `hospitalizaciones` y `procedimientos`).
import type { ReactNode } from 'react';
import imgTimelineLeftMarker from '../../assets/timeline-left-marker.svg';
import imgTimelineLeftMarker2 from '../../assets/timeline-left-marker-2.svg';
import imgTimelineLeftMarkerFrame from '../../assets/timeline-left-marker-frame.svg';
import { BackButton, Badge, Card, CardTitle, Divider, PatientLayout, usePatient, type PatientView } from '../../components';
import { fmtDate, staffName } from '../../lib/clinical';

const B = ({ children, weight = 'font-semibold' }: { children: ReactNode; weight?: string }) => <span className={`${weight} text-ink`}>{children}</span>;

type Stay = { key: string; marker: string | 'last'; title: string; status: string; current?: boolean; lines: ReactNode[] };

const UNIT_NAME: Record<string, string> = { UCI: 'Unidad de Cuidados Intensivos (UCI)', Trauma: 'Trauma', 'Piso 3': 'Hospitalización — Piso 3' };

/** Días entre dos fechas civiles, contando el de ingreso. */
const days = (from: string, to: string) => Math.max(1, Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000));

export default function MedPacienteHistorialHospitalizaciones() {
  const { view } = usePatient();
  return (
    <PatientLayout
      breadcrumb={`SIAPPC > Pacientes > ${view?.name ?? '…'} > Historia Clínica > Hospitalizaciones`}
      title="Historial de Hospitalizaciones e Intervenciones"
      tab="historia"
      actions={<BackButton />}
    >
      {view && <Historial v={view} />}
    </PatientLayout>
  );
}

function Historial({ v }: { v: PatientView }) {
  const unit = v.assigned?.unit ?? '—';
  const previous = v.expediente?.hospitalizaciones ?? [];
  const procedures = v.expediente?.procedimientos ?? [];
  const surgery = procedures[0];

  const stays: Stay[] = [
    {
      key: 'actual',
      marker: imgTimelineLeftMarker,
      current: true,
      title: `Ingreso Actual — ${UNIT_NAME[unit] ?? unit}`,
      status: v.patient.sex === 'F' ? 'HOSPITALIZADA' : 'HOSPITALIZADO',
      lines: [
        <>
          Ingreso: <B weight="font-bold">{fmtDate(v.assigned?.admittedAt ?? v.patient.arrivedAt)}</B> · Cama: <B weight="font-bold">{v.bed ?? '—'}</B> · Médico:{' '}
          <B weight="font-bold">{staffName('Carlos Méndez')}</B>
        </>,
        <>
          Motivo de Ingreso: <B weight="font-medium">{`${v.patient.reason}.`}</B>
        </>,
      ],
    },
    ...previous.map((h, i): Stay => {
      const from = String(h.admittedOn);
      const to = String(h.dischargedOn ?? from);
      return {
        key: h.id,
        marker: i === previous.length - 1 ? 'last' : imgTimelineLeftMarker2,
        title: `${String(h.service)} (${days(from, to)} días)`,
        status: 'ALTA MÉDICA',
        lines: [
          <>
            Estancia: <B>{`${fmtDate(from)} - ${fmtDate(to)}`}</B> · Motivo: <B>{String(h.reason)}</B>
          </>,
          <>
            {String(h.facility ?? '')}
            {h.dischargeSummary ? ` · ${String(h.dischargeSummary)}` : ''}
          </>,
        ],
      };
    }),
  ];

  const surgeryRows: Array<[string, string]> = surgery
    ? [
        ['Fecha', fmtDate(surgery.performedOn as string | null)],
        ['Procedimiento', `${String(surgery.name)}${surgery.code ? ` (${surgery.code})` : ''}`],
        // `surgeon` lo agrega el simulador; el procedimiento del backend no guarda al cirujano.
        ['Cirujano Principal', String(surgery.surgeon ?? '—')],
        ['Resultado / Evolución', String(surgery.outcome ?? '—')],
      ]
    : [];

  return (
    <div className="flex w-full flex-col items-start gap-5 xl:flex-row">
      <Card padding="lg" className="flex w-full min-w-0 flex-col gap-5 xl:flex-1">
        <CardTitle>Línea de Tiempo de Estancias Médicas</CardTitle>
        <ol className="flex w-full flex-col gap-4">
          {stays.map((s) => (
            <li key={s.key} className="flex w-full items-start gap-3 sm:gap-4">
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
        {previous.length === 0 && <p className="font-jakarta text-[13px] text-muted">Sin hospitalizaciones previas registradas.</p>}
      </Card>

      <Card padding="lg" className="flex w-full min-w-0 flex-col gap-5 xl:w-[450px] xl:shrink-0">
        <CardTitle>Intervenciones Quirúrgicas</CardTitle>
        {surgery ? (
          <div className="flex w-full flex-col gap-3 rounded-lg border border-line bg-surface p-4">
            <div className="flex w-full items-center justify-between gap-3">
              <p className="font-jakarta text-[14px] font-extrabold leading-[normal] text-ink">Procedimiento Quirúrgico Mayor</p>
              <Badge tone="success" size="sm">Exitoso</Badge>
            </div>
            <Divider />
            <div className="flex w-full flex-col gap-2">
              {surgeryRows.map(([label, value]) => (
                <div key={label} className="flex w-full flex-col gap-1">
                  <p className="font-jakarta text-[11px] font-semibold uppercase leading-[normal] text-muted">{label}</p>
                  <div className="w-full rounded-lg bg-surface p-3">
                    <p className="font-jakarta text-[13px] font-semibold leading-[normal] text-ink">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="font-jakarta text-[13px] font-medium text-muted">Sin intervenciones quirúrgicas registradas.</p>
        )}
      </Card>
    </div>
  );
}
