// Pantalla "med/dashboard/principal" (Figma node 245:22) — generada desde el diseño original de Figma.
import imgAlertTriangle2 from '../../assets/alert-triangle-2.svg';
import imgCheckSquare from '../../assets/check-square.svg';
import imgEye from '../../assets/eye.svg';
import imgFileText4 from '../../assets/file-text-4.svg';
import imgFolder from '../../assets/folder.svg';
import imgHeart2 from '../../assets/heart-2.svg';
import imgHeart3 from '../../assets/heart-3.svg';
import imgSparklineContainer from '../../assets/sparkline-container.svg';
import imgSparklineContainer2 from '../../assets/sparkline-container-2.svg';
import imgSparklineContainer3 from '../../assets/sparkline-container-3.svg';
import imgSparklineContainer4 from '../../assets/sparkline-container-4.svg';
import imgUsers3 from '../../assets/users-3.svg';
import { AppLayout, Badge, Button, Card, SearchBox, Table } from '../../components';
import { cn } from '../../lib/cn';

const KPIS: Array<[string, string, string, string, string]> = [
  ['Pacientes Asignados', '12', 'bg-primary', 'text-ink', imgUsers3],
  ['Alertas Críticas', '3', 'bg-danger', 'text-danger', imgAlertTriangle2],
  ['Pendientes Evaluación', '2', 'bg-success', 'text-ink', imgCheckSquare],
];

type Row = {
  name: string;
  hc: string;
  status: 'CRÍTICO' | 'ATENCIÓN' | 'ESTABLE';
  bed: string;
  vitals?: [string, string];
  gcs: string;
  triage: string;
  alert?: string;
};

const STATUS = {
  CRÍTICO: { tone: 'danger', triage: 'text-danger', row: 'bg-danger-soft' },
  ATENCIÓN: { tone: 'warning', triage: 'text-warning', row: 'bg-white' },
  ESTABLE: { tone: 'success', triage: 'text-success', row: 'bg-white' },
} as const;

const ROWS: Row[] = [
  { name: 'García López, Juan', hc: 'HC-49521', status: 'CRÍTICO', bed: 'UCI Cama 3', vitals: ['FC: 112↑ SpO2: 89%↓', 'PA: 85/50 (Hipotensión)'], gcs: 'GCS: 9/15', triage: 'TRIAGE: T1', alert: '⚠️ Hace 4 min' },
  { name: 'Rojas Méndez, Ana', hc: 'HC-98232', status: 'CRÍTICO', bed: 'UCI Cama 7', vitals: ['FC: 98 SpO2: 91%↓', 'PA: 90/60 (Baja)'], gcs: 'GCS: 11/15', triage: 'TRIAGE: T1', alert: '⚠️ Hace 3 min' },
  { name: 'Pérez Díaz, Carlos', hc: 'HC-44923', status: 'ATENCIÓN', bed: 'UCI Cama 2', vitals: ['FC: 88↑ SpO2: 94%', 'PA: 110/70'], gcs: 'GCS: 13/15', triage: 'TRIAGE: T2' },
  { name: 'Morales Vega, Luis', hc: 'HC-49822', status: 'ATENCIÓN', bed: 'UCI Cama 5', vitals: ['FC: 92↑ SpO2: 93%', 'PA: 105/65'], gcs: 'GCS: 12/15', triage: 'TRIAGE: T2' },
  { name: 'Fernández R., María', hc: 'HC-86521', status: 'ESTABLE', bed: 'UCI Cama 12', gcs: 'GCS: 15/15', triage: 'TRIAGE: T3' },
  { name: 'Torres G., Diego', hc: 'HC-19235', status: 'ESTABLE', bed: 'UCI Cama 8', gcs: 'GCS: 15/15', triage: 'TRIAGE: T3' },
];

const TRENDS = [
  { name: 'García López Juan', bed: 'UCI Cama 3', series: [['FC (112 bpm)', 'text-danger', imgSparklineContainer], ['SpO2 (89%)', 'text-primary', imgSparklineContainer2]] },
  { name: 'Rojas Méndez Ana', bed: 'UCI Cama 7', series: [['FC (98 bpm)', 'text-warning', imgSparklineContainer3], ['SpO2 (91%)', 'text-primary', imgSparklineContainer4]] },
];

const ATTENTION: Array<{ tag: string; tone: 'danger' | 'warning' | 'neutral'; when: string; text: string; bed: string }> = [
  { tag: 'GCS Crítico', tone: 'danger', when: 'Hace 2 min', text: 'García: Glasgow bajó abruptamente de 13→9 en los últimos 20 minutos', bed: 'UCI Cama 3' },
  { tag: 'SpO2 Bajo', tone: 'danger', when: 'Hace 3 min', text: 'Rojas: SpO2 por debajo de umbral hace 3 minutos sin confirmación médica', bed: 'UCI Cama 7' },
  { tag: 'Evaluación', tone: 'warning', when: 'Hace 12 min', text: 'Méndez: Evaluación primaria ABCDE lleva 45 minutos sin completarse', bed: 'Cama 6' },
  { tag: 'Pendiente', tone: 'neutral', when: 'Hace 20 min', text: 'Pérez: Pendiente registrar nota SOAP tras pase de guardia de trauma', bed: 'UCI Cama 2' },
];

const BED_COLOR = { danger: 'text-danger', warning: 'text-warning', neutral: 'text-muted' };

const COLS = 'flex w-full items-center px-4';

export default function MedDashboardPrincipal() {
  return (
    <AppLayout breadcrumb="SIAPPC > Dashboard" title="Dashboard Principal" actions={<SearchBox to="/MedBusquedaGlobal" placeholder="Buscar paciente por nombre o HC..." width={320} />}>
      <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-5 p-4 md:p-6 xl:flex-row">
        <div className="flex w-full min-w-0 flex-col gap-5 xl:flex-1">
          <div className="grid w-full grid-cols-1 gap-[14px] sm:grid-cols-3">
            {KPIS.map(([label, value, stripe, color, icon]) => (
              <Card key={label} raised padding="none" className="relative flex flex-col gap-2 overflow-hidden p-[18px]">
                <span className={cn('absolute inset-y-0 left-0 w-1', stripe)} />
                <div className="flex w-full items-center justify-between pl-1.5">
                  <p className="font-jakarta text-[13px] font-medium leading-[normal] text-muted">{label}</p>
                  <img className="size-5" alt="" src={icon} />
                </div>
                <p className={cn('pl-1.5 font-jakarta text-[28px] font-extrabold leading-[normal]', color)}>{value}</p>
              </Card>
            ))}
          </div>

          <Card className="flex w-full flex-col gap-4">
            <div className="flex w-full flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">Monitoreo de Pacientes Politraumatizados (ATLS)</h2>
                <Badge tone="danger">Alta Prioridad de Atención</Badge>
              </div>
              <div className="flex items-center gap-[10px] font-jakarta text-[12px] leading-[normal]">
                <p className="font-semibold text-muted">Unidad:</p>
                <span className="rounded-md bg-[#f1f5f9] px-[10px] py-1.5 font-bold text-ink">UCI</span>
                <p className="font-semibold text-muted">Estado:</p>
                <span className="rounded-md bg-[#f1f5f9] px-[10px] py-1.5 font-bold text-ink">Todos</span>
              </div>
            </div>

            <div className="w-full overflow-hidden rounded-lg border border-line">
              <Table minWidth={1000}>
                <div className={cn(COLS, 'border-b border-line bg-surface py-3 font-jakarta text-[11px] font-bold uppercase leading-[normal] text-muted')}>
                  <p className="w-[180px] shrink-0">Nombre / HC</p>
                  <p className="w-[100px] shrink-0">Estado</p>
                  <p className="w-[100px] shrink-0">Ubicación</p>
                  <p className="w-[250px] shrink-0">Signos Vitales</p>
                  <p className="w-[130px] shrink-0">Glasgow / TR</p>
                  <p className="w-[120px] shrink-0">Alerta Activa</p>
                  <p className="min-w-0 flex-1 text-right">Acciones</p>
                </div>
                {ROWS.map((r) => {
                  const s = STATUS[r.status];
                  const crit = r.status === 'CRÍTICO';
                  return (
                    <div key={r.hc} className={cn(COLS, 'border-b border-line py-3 last:border-b-0', s.row)}>
                      <div className="flex w-[180px] shrink-0 flex-col gap-0.5 leading-[normal]">
                        <p className="font-jakarta text-[13px] font-bold text-ink">{r.name}</p>
                        <p className="font-jakarta text-[11px] font-normal text-muted">{r.hc}</p>
                      </div>
                      <div className="w-[100px] shrink-0">
                        <Badge tone={s.tone} size="sm">{r.status}</Badge>
                      </div>
                      <p className="w-[100px] shrink-0 font-jakarta text-[13px] font-semibold leading-[normal] text-ink">{r.bed}</p>
                      <div className="flex w-[250px] shrink-0 flex-col gap-0.5 leading-[normal]">
                        {r.vitals ? (
                          <>
                            <p className={cn('font-jakarta text-[13px] font-bold', crit ? 'text-danger' : 'text-ink')}>{r.vitals[0]}</p>
                            <p className="font-jakarta text-[11px] font-normal text-muted">{r.vitals[1]}</p>
                          </>
                        ) : (
                          <p className="font-jakarta text-[13px] font-normal text-muted">-</p>
                        )}
                      </div>
                      <div className="flex w-[130px] shrink-0 flex-col gap-0.5 leading-[normal]">
                        <p className="font-jakarta text-[13px] font-bold text-ink">{r.gcs}</p>
                        <p className={cn('font-jakarta text-[11px] font-semibold', s.triage)}>{r.triage}</p>
                      </div>
                      <p className={cn('w-[120px] shrink-0 font-jakarta text-[12px] leading-[normal]', r.alert ? 'font-bold text-danger' : 'font-normal text-muted')}>{r.alert ?? 'Ninguna'}</p>
                      <div className="flex min-w-0 flex-1 justify-end gap-1">
                        {[
                          [imgEye, 'Ver perfil'],
                          [crit ? imgHeart2 : imgHeart3, 'Monitoreo'],
                          [imgFileText4, 'Nota SOAP'],
                          [imgFolder, 'Historia clínica'],
                        ].map(([icon, label]) => (
                          <button key={label} type="button" title={label} aria-label={label} className="flex items-center justify-center rounded-lg border border-line bg-white p-2 hover:bg-surface">
                            <img className="size-4" alt="" src={icon} />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </Table>
            </div>
            <div className="flex w-full flex-wrap items-center justify-between gap-3 font-jakarta text-[13px] leading-[normal]">
              <p className="font-normal text-muted">Mostrando 6 de 12 pacientes</p>
              <Button variant="link">Ver todos →</Button>
            </div>
          </Card>

          <Card className="flex w-full flex-col gap-[14px]">
            <div className="flex flex-col gap-0.5 leading-[normal]">
              <h2 className="font-jakarta text-[15px] font-extrabold text-ink">📈 Tendencias de Pacientes Críticos (Últimas 4 Horas)</h2>
              <p className="font-jakarta text-[12px] font-normal text-muted">Lecturas en tiempo real</p>
            </div>
            <div className="grid w-full grid-cols-1 gap-4 min-[1400px]:grid-cols-2">
              {TRENDS.map((t) => (
                <div key={t.name} className="flex min-w-0 flex-col gap-3 rounded-lg border border-line bg-surface p-3 sm:flex-row sm:items-center">
                  <div className="flex w-[100px] shrink-0 flex-col gap-0.5 leading-[normal]">
                    <p className="truncate font-jakarta text-[13px] font-bold text-ink">{t.name}</p>
                    <p className="font-jakarta text-[11px] font-normal text-muted">{t.bed}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {t.series.map(([label, color, img]) => (
                      <div key={label} className="flex flex-col gap-0.5">
                        <p className={cn('font-jakarta text-[11px] font-semibold leading-[normal]', color)}>{label}</p>
                        <img className="h-8 w-[110px]" alt="" src={img} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <aside className="flex w-full min-w-0 flex-col gap-4 rounded-xl border border-line bg-surface p-4 xl:w-[340px] xl:shrink-0 xl:self-stretch">
          <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">Requiere tu atención ahora</h2>
          <ul className="flex w-full flex-col gap-3">
            {ATTENTION.map((a) => (
              <li key={a.text} className="flex w-full flex-col gap-2 rounded-lg border border-line bg-white p-[14px]">
                <div className="flex w-full items-center justify-between gap-2">
                  <Badge tone={a.tone} size="sm">{a.tag}</Badge>
                  <p className="font-jakarta text-[11px] font-normal leading-[normal] text-muted">{a.when}</p>
                </div>
                <p className="font-jakarta text-[12px] font-semibold leading-[17px] text-ink">{a.text}</p>
                <p className={cn('font-jakarta text-[11px] font-bold leading-[normal]', BED_COLOR[a.tone])}>{a.bed}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </AppLayout>
  );
}
