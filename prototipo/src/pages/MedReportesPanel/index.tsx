// Pantalla "med/reportes/panel" (Figma node 48:241) — generada desde el diseño original de Figma.
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import imgCheckCircle2 from '../../assets/check-circle-2.svg';
import imgClipboard4 from '../../assets/clipboard-4.svg';
import imgClock from '../../assets/clock.svg';
import imgFileText10 from '../../assets/file-text-10.svg';
import imgFileText9 from '../../assets/file-text-9.svg';
import imgImageIcon from '../../assets/image-icon.svg';
import imgLogOut4 from '../../assets/log-out-4.svg';
import imgSearch from '../../assets/search.svg';
import imgTimer from '../../assets/timer.svg';
import imgUsers5 from '../../assets/users-5.svg';
import { AppLayout, Button, Card, IconPlus, Table, Tabs } from '../../components';
import { cn } from '../../lib/cn';

const TABS = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'historial', label: 'Historial de Entregas' },
];

const KPIS: Array<[string, string, string, string, string]> = [
  [imgFileText9, 'bg-primary-soft', 'Reportes Generados', '12', 'Este mes'],
  [imgClock, 'bg-[#ffedd5]', 'Pendientes', '3', 'En revisión'],
  [imgCheckCircle2, 'bg-success-soft', 'Entregados', '8', 'Esta semana'],
  [imgTimer, 'bg-primary-soft', 'Tiempo promedio', '2.4 días', 'De entrega'],
];

const PENDING: Array<[string, string, string, string, string]> = [
  ['María González', 'Evolución Clínica', '24 Oct 2025', 'Pendiente revisión', 'bg-[#ffedd5] text-[#f97316]'],
  ['Javier Mendoza', 'Alta Médica', '23 Oct 2025', 'Listo para entregar', 'bg-success-soft text-success'],
  ['Sofía Martínez', 'Interconsulta', '22 Oct 2025', 'Pendiente firma', 'bg-[#f3f4f6] text-muted'],
];

const TYPE_STYLE = { CLÍNICO: 'bg-primary-soft text-primary', OPERATIVO: 'bg-success-soft text-success', ADMINISTRATIVO: 'bg-[#f3f4f6] text-muted' };
const FORMAT_STYLE = { PDF: 'bg-[#fee2e2] text-danger', EXCEL: 'bg-success-soft text-success' };

const HISTORY: Array<[string, keyof typeof TYPE_STYLE, string, string, keyof typeof FORMAT_STYLE]> = [
  ['Reporte_Clinico_PT-8821_Rodríguez.pdf', 'CLÍNICO', '24 Oct 2025', 'Dr. Roberto Silva', 'PDF'],
  ['Resumen_Ocupacion_UCI_S42.xlsx', 'OPERATIVO', '23 Oct 2025', 'Sist. Administrativo', 'EXCEL'],
  ['Analisis_Alertas_Criticas_Septiembre.pdf', 'ADMINISTRATIVO', '01 Oct 2025', 'Dr. Carlos Méndez', 'PDF'],
  ['Evolucion_Mendoza_PT-8822.pdf', 'CLÍNICO', '29 Sep 2025', 'Dr. Roberto Silva', 'PDF'],
  ['Consolidado_Farmacos_UCI_Q3.xlsx', 'OPERATIVO', '15 Sep 2025', 'Enf. Lucía Fernández', 'EXCEL'],
];

const TEMPLATES: Array<[string, string, string]> = [
  [imgUsers5, 'Evolución Clínica Individual', 'Monitoreo longitudinal de signos vitales, parámetros ventilatorios y notas SOAP.'],
  [imgImageIcon, 'Reporte de Alta', 'Documento final con recomendaciones, medicación y seguimiento post-egreso.'],
];

const Pill = ({ className, children }: { className: string; children: ReactNode }) => (
  <span className={cn('inline-flex rounded-full px-[10px] py-1 font-jakarta text-[11px] font-bold leading-[normal]', className)}>{children}</span>
);

function SectionHeader({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex w-full flex-col gap-1 leading-[normal]">
      <h2 className="font-jakarta text-[18px] font-bold text-ink">{title}</h2>
      <p className="font-jakarta text-[13px] font-normal text-muted">{text}</p>
    </div>
  );
}

const tableCard = 'w-full overflow-hidden rounded-xl border border-line bg-white shadow-[0px_2px_10px_0px_rgba(15,23,42,0.05)]';
const headRow = 'flex w-full items-center gap-3 border-b border-line bg-surface px-4 py-3 font-jakarta text-[12px] font-bold leading-[normal] text-muted';
const bodyRow = 'flex w-full items-center gap-3 border-b border-line px-4 py-[14px] font-jakarta text-[13px] leading-[normal] last:border-b-0';

export default function MedReportesPanel() {
  const [tab, setTab] = useState('resumen');

  return (
    <AppLayout breadcrumb="SIAPPC > Reportes" title="Módulo de Reportes Clínicos" actions={<Button icon={<IconPlus size={14} />}>Generar Nuevo Reporte</Button>}>
      <div className="w-full px-4 pt-4 md:px-8">
        <Tabs items={TABS} active={tab} onChange={setTab} />
      </div>
      <div className="flex w-full min-w-0 flex-1 flex-col gap-6 bg-surface p-4 md:p-8">
        <section className="flex w-full flex-col gap-3">
          <SectionHeader title="Resumen Personal del Médico" text="Indicadores clave de entrega de resultados para este mes." />
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {KPIS.map(([icon, iconBg, label, value, note]) => (
              <Card key={label} padding="sm" className="flex flex-col gap-[10px] drop-shadow-[0px_2px_5px_rgba(15,23,42,0.05)]">
                <div className="flex w-full items-center gap-[10px]">
                  <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', iconBg)}>
                    <img className="size-4" alt="" src={icon} />
                  </span>
                  <p className="font-jakarta text-[13px] font-semibold leading-[normal] text-muted">{label}</p>
                </div>
                <p className="font-jakarta text-[28px] font-extrabold leading-[normal] text-ink">{value}</p>
                <p className="font-jakarta text-[12px] font-normal leading-[normal] text-muted">{note}</p>
              </Card>
            ))}
          </div>
        </section>

        <Link
          to="/MedTurnoEntregaHandoff"
          className="flex w-full flex-col gap-4 rounded-xl border border-line bg-gradient-to-r from-primary-soft to-white p-5 drop-shadow-[0px_2px_5px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary">
              <img className="size-5" alt="" src={imgClipboard4} />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1 leading-[normal]">
              <p className="font-jakarta text-[14px] font-extrabold text-ink">Reporte de Entrega de Turno</p>
              <p className="font-jakarta text-[12px] font-normal leading-[1.4] text-muted">Genera el reporte general de handoff con el resumen de todos los pacientes a tu cargo</p>
              <p className="font-jakarta text-[11px] font-semibold text-muted">Último generado: 24 Oct 2025, 07:00 — Turno Matutino</p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center justify-center self-start rounded-lg bg-primary px-4 py-2 font-jakarta text-[13px] font-bold leading-[normal] text-white sm:self-auto">
            Generar Reporte de Turno
          </span>
        </Link>

        <section className="flex w-full flex-col gap-3">
          <SectionHeader title="Reportes Pendientes de Entrega" text="Revisa y finaliza los reportes que requieren tu atención." />
          <div className={tableCard}>
            <Table minWidth={680}>
              <div className={headRow}>
                <p className="min-w-0 flex-1">Paciente</p>
                <p className="w-[180px] shrink-0">Tipo de Reporte</p>
                <p className="w-[140px] shrink-0">Fecha Generación</p>
                <p className="w-[140px] shrink-0">Estado</p>
                <p className="w-[120px] shrink-0 text-right">Acción</p>
              </div>
              {PENDING.map(([patient, type, date, status, style]) => (
                <div key={patient} className={bodyRow}>
                  <p className="min-w-0 flex-1 font-semibold text-ink">{patient}</p>
                  <p className="w-[180px] shrink-0 text-ink">{type}</p>
                  <p className="w-[140px] shrink-0 text-ink">{date}</p>
                  <div className="w-[140px] shrink-0">
                    <Pill className={style}>{status}</Pill>
                  </div>
                  <div className="flex w-[120px] shrink-0 justify-end">
                    <Button variant="soft" size="sm">Entregar</Button>
                  </div>
                </div>
              ))}
            </Table>
          </div>
        </section>

        <section className="flex w-full flex-col gap-3">
          <SectionHeader title="Reportes por Paciente" text="Historial de entregas recientes." />
          <div className={tableCard}>
            <Table minWidth={860}>
              <div className={headRow}>
                <p className="min-w-0 flex-1">NOMBRE DEL ARCHIVO</p>
                <p className="w-[140px] shrink-0">TIPO</p>
                <p className="w-[140px] shrink-0">FECHA</p>
                <p className="w-[160px] shrink-0">GENERADO POR</p>
                <p className="w-[80px] shrink-0">FORMATO</p>
                <p className="w-[120px] shrink-0 text-right">ACCIONES</p>
              </div>
              {HISTORY.map(([file, type, date, by, format]) => (
                <div key={file} className={bodyRow}>
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <img className="size-4 shrink-0" alt="" src={imgFileText10} />
                    <p className="min-w-0 flex-1 break-all font-semibold text-ink">{file}</p>
                  </div>
                  <div className="w-[140px] shrink-0">
                    <Pill className={TYPE_STYLE[type]}>{type}</Pill>
                  </div>
                  <p className="w-[140px] shrink-0 text-ink">{date}</p>
                  <p className="w-[160px] shrink-0 text-ink">{by}</p>
                  <div className="w-[80px] shrink-0">
                    <Pill className={FORMAT_STYLE[format]}>{format}</Pill>
                  </div>
                  <div className="flex w-[120px] shrink-0 justify-end gap-3">
                    <img className="size-4" alt="Ver" src={imgSearch} />
                    <img className="size-4" alt="Descargar" src={imgLogOut4} />
                  </div>
                </div>
              ))}
            </Table>
          </div>
          <div className="flex w-full flex-wrap items-center justify-between gap-3 pt-3">
            <p className="font-jakarta text-[13px] font-normal leading-[normal] text-muted">Mostrando 5 de 18 reportes generados</p>
            <div className="flex gap-2">
              <Button variant="secondary">Anterior</Button>
              <Button variant="secondary">Siguiente</Button>
            </div>
          </div>
        </section>

        <section className="flex w-full flex-col gap-3">
          <SectionHeader title="Plantillas de Reporte Rápido" text="Accede a las plantillas más usadas para generar resultados." />
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            {TEMPLATES.map(([icon, title, text]) => (
              <Card key={title} className="flex min-h-[180px] flex-col gap-3 shadow-[0px_2px_10px_0px_rgba(15,23,42,0.05)]">
                <div className="flex w-full items-center gap-3">
                  <img className="size-10 shrink-0" alt="" src={icon} />
                  <p className="min-w-0 flex-1 font-jakarta text-[14px] font-bold leading-[normal] text-ink">{title}</p>
                </div>
                <p className="w-full font-jakarta text-[13px] font-normal leading-[normal] text-muted">{text}</p>
                <Button variant="soft" fullWidth className="mt-auto">
                  Configurar y Generar
                </Button>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
