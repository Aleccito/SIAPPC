// Pantalla "med/paciente/indicaciones-medicas" (Figma node 183:782) — generada desde el diseño original de Figma.
import type { ReactNode } from 'react';
import imgBulletItemEllipse from '../../assets/bullet-item-ellipse.svg';
import imgHeart4 from '../../assets/heart-4.svg';
import { BackButton, Badge, Button, Card, IconPlus, PatientLayout, Table } from '../../components';

const SOLUTIONS = [
  ['Solución Hartmann 1000ml', '125 ml/hr', 'Vía Central'],
  ['Solución Glucosada 5% 500ml', '80 ml/hr', 'Periférica'],
];

const MEDS = [
  ['Furosemida 40mg', 'IV', 'c/8h'],
  ['Enalapril 10mg', 'VO', 'c/12h'],
  ['Enoxaparina 60mg', 'SC', 'c/24h'],
  ['Omeprazol 40mg', 'IV', 'c/24h'],
];

const CARE = [
  'Monitoreo de signos vitales cada 4 horas',
  'Posición semifowler a 45 grados permanente',
  'Control estricto de balance hídrico (ingresos y egresos)',
  'Reposo relativo en cama con apoyo asistido',
];

const STUDIES: Array<[string, string, string, 'warning' | 'info' | 'success']> = [
  ['BH completa', 'Laboratorio', 'Pendiente', 'warning'],
  ['Ecocardiograma', 'Imagen', 'Prog. 16 Oct', 'info'],
  ['Rx Tórax', 'Imagen', 'Realizado 15 Oct', 'success'],
  ['Gasometría arterial', 'Laboratorio', 'Realizado 15 Oct', 'success'],
];

const CardHeading = ({ children }: { children: ReactNode }) => <h2 className="font-jakarta text-[15px] font-bold leading-[normal] text-ink">{children}</h2>;

function OrdersTable({ head, rows, firstWidth }: { head: string[]; rows: string[][]; firstWidth: string }) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-line">
      <Table minWidth={600}>
        <div className="flex w-full items-center border-b border-line bg-surface px-3 py-[10px] font-jakarta text-[11px] font-bold uppercase leading-[normal] text-muted">
          <p className={`${firstWidth} min-w-0`}>{head[0]}</p>
          <p className="w-[180px] shrink-0">{head[1]}</p>
          <p className="w-[240px] shrink-0">{head[2]}</p>
          <p className="w-[100px] shrink-0">ESTADO</p>
        </div>
        {rows.map(([name, a, b]) => (
          <div key={name} className="flex w-full items-center border-b border-line p-3 font-jakarta text-[13px] leading-[normal] text-ink last:border-b-0">
            <p className={`${firstWidth} min-w-0 font-bold`}>{name}</p>
            <p className="w-[180px] shrink-0 font-medium">{a}</p>
            <p className="w-[240px] shrink-0 font-medium">{b}</p>
            <div className="w-[100px] shrink-0">
              <Badge tone="success">Activa</Badge>
            </div>
          </div>
        ))}
      </Table>
    </div>
  );
}

export default function MedPacienteIndicacionesMedicas() {
  return (
    <PatientLayout
      breadcrumb="SIAPPC > Pacientes > María González > Indicaciones Médicas"
      title="Indicaciones Médicas"
      tab="historia"
      actions={
        <>
          <BackButton />
          <Button icon={<IconPlus size={14} />}>Nueva Indicación</Button>
        </>
      }
    >
      <div className="flex w-full flex-col gap-4">
        <Card className="flex w-full flex-col gap-[14px]">
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <CardHeading>Soluciones Intravenosas</CardHeading>
            <Button variant="soft" size="sm">+ Agregar Solución</Button>
          </div>
          <OrdersTable head={['SOLUCIÓN / COMPOSICIÓN', 'INFUSIÓN', 'VÍA']} rows={SOLUTIONS} firstWidth="flex-1" />
        </Card>

        <Card className="flex w-full flex-col gap-[14px]">
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <CardHeading>Medicamentos Farmacológicos</CardHeading>
            <Button variant="soft" size="sm">+ Agregar Medicamento</Button>
          </div>
          <OrdersTable head={['MEDICAMENTO / DOSIS', 'VÍA', 'FRECUENCIA']} rows={MEDS} firstWidth="flex-1" />
        </Card>

        <div className="grid w-full grid-cols-1 items-start gap-4 lg:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-4">
            <Card className="flex w-full flex-col gap-3">
              <CardHeading>Dieta e Hidratación</CardHeading>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-primary-soft px-3 py-1.5 font-jakarta text-[13px] font-bold leading-[normal] text-primary">Blanda hiposódica</span>
                <span className="rounded-lg bg-danger-soft px-3 py-1.5 font-jakarta text-[13px] font-bold leading-[normal] text-danger">Restricción de líquidos: 1500 ml/día</span>
              </div>
            </Card>
            <Card className="flex w-full flex-col gap-3">
              <CardHeading>Cuidados Generales de Enfermería</CardHeading>
              <ul className="flex w-full flex-col gap-[10px]">
                {CARE.map((c) => (
                  <li key={c} className="flex w-full items-center gap-2">
                    <img className="size-1.5 shrink-0" alt="" src={imgBulletItemEllipse} />
                    <p className="min-w-0 flex-1 font-jakarta text-[13px] font-medium leading-[normal] text-ink">{c}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <Card className="flex w-full flex-col gap-3">
              <CardHeading>Estudios Solicitados</CardHeading>
              <div className="w-full overflow-hidden rounded-lg border border-line">
                <div className="flex w-full gap-[10px] border-b border-line bg-surface px-[10px] py-2 font-jakarta text-[11px] font-bold leading-[normal] text-muted">
                  <p className="min-w-0 flex-1">ESTUDIO</p>
                  <p className="w-[100px] shrink-0">TIPO</p>
                  <p className="w-[110px] shrink-0">ESTADO / FECHA</p>
                </div>
                {STUDIES.map(([name, type, status, tone]) => (
                  <div key={name} className="flex w-full items-center gap-[10px] border-b border-line px-[10px] py-2 leading-[normal] last:border-b-0">
                    <p className="min-w-0 flex-1 font-jakarta text-[12px] font-bold text-ink">{name}</p>
                    <p className="w-[100px] shrink-0 font-jakarta text-[11px] font-medium text-muted">{type}</p>
                    <div className="w-[110px] shrink-0">
                      <Badge tone={tone} size="sm">{status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="flex w-full flex-col gap-3">
              <CardHeading>Interconsultas</CardHeading>
              <div className="flex w-full items-center gap-3 rounded-lg border border-line bg-surface p-3">
                <img className="size-8 shrink-0" alt="" src={imgHeart4} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[normal]">
                  <p className="font-jakarta text-[13px] font-bold text-ink">Cardiología</p>
                  <p className="font-jakarta text-[12px] font-medium text-muted">Valoración para cateterismo programado</p>
                </div>
                <Badge tone="warning">En espera</Badge>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
