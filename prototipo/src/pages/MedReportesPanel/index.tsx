// Pantalla "med/reportes/panel" (Figma node 48:241) — generada desde el diseño original de Figma.
import { useState, type ReactNode, type SyntheticEvent } from 'react';
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
import {
  AppLayout,
  Button,
  Card,
  ConfirmDialog,
  DocumentPreview,
  EmptyState,
  IconPlus,
  Modal,
  ModalHeader,
  rowButton,
  rowLinkClass,
  Select,
  Table,
  Tabs,
  useToast,
} from '../../components';
import { cn } from '../../lib/cn';

const TABS = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'historial', label: 'Historial de Entregas' },
];

type Pending = { patient: string; type: string; date: string; status: string; style: string };

const PENDING: Pending[] = [
  { patient: 'María González', type: 'Evolución Clínica', date: '24 Oct 2025', status: 'Pendiente revisión', style: 'bg-[#ffedd5] text-[#f97316]' },
  { patient: 'Javier Mendoza', type: 'Alta Médica', date: '23 Oct 2025', status: 'Listo para entregar', style: 'bg-success-soft text-success' },
  { patient: 'Sofía Martínez', type: 'Interconsulta', date: '22 Oct 2025', status: 'Pendiente firma', style: 'bg-[#f3f4f6] text-muted' },
];

const TYPE_STYLE = { CLÍNICO: 'bg-primary-soft text-primary', OPERATIVO: 'bg-success-soft text-success', ADMINISTRATIVO: 'bg-[#f3f4f6] text-muted' };
const FORMAT_STYLE = { PDF: 'bg-[#fee2e2] text-danger', EXCEL: 'bg-success-soft text-success' };

type Report = { file: string; type: keyof typeof TYPE_STYLE; date: string; by: string; format: keyof typeof FORMAT_STYLE };

const r = (file: string, type: Report['type'], date: string, by: string, format: Report['format']): Report => ({ file, type, date, by, format });

const HISTORY: Report[] = [
  r('Reporte_Clinico_PT-8821_Rodríguez.pdf', 'CLÍNICO', '24 Oct 2025', 'Dr. Roberto Silva', 'PDF'),
  r('Resumen_Ocupacion_UCI_S42.xlsx', 'OPERATIVO', '23 Oct 2025', 'Sist. Administrativo', 'EXCEL'),
  r('Analisis_Alertas_Criticas_Septiembre.pdf', 'ADMINISTRATIVO', '01 Oct 2025', 'Dr. Carlos Méndez', 'PDF'),
  r('Evolucion_Mendoza_PT-8822.pdf', 'CLÍNICO', '29 Sep 2025', 'Dr. Roberto Silva', 'PDF'),
  r('Consolidado_Farmacos_UCI_Q3.xlsx', 'OPERATIVO', '15 Sep 2025', 'Enf. Lucía Fernández', 'EXCEL'),
  // Agregados para la paginación ("5 de 18"), datos de ejemplo.
  r('Alta_Martinez_PT-8823.pdf', 'CLÍNICO', '12 Sep 2025', 'Dr. Carlos Méndez', 'PDF'),
  r('Indicadores_Calidad_UCI_Agosto.xlsx', 'ADMINISTRATIVO', '05 Sep 2025', 'Sist. Administrativo', 'EXCEL'),
  r('Interconsulta_Gomez_PT-8824.pdf', 'CLÍNICO', '30 Ago 2025', 'Dr. Roberto Silva', 'PDF'),
  r('Resumen_Ocupacion_UCI_S34.xlsx', 'OPERATIVO', '25 Ago 2025', 'Sist. Administrativo', 'EXCEL'),
  r('Evolucion_Fernandez_PT-8825.pdf', 'CLÍNICO', '19 Ago 2025', 'Dr. Carlos Méndez', 'PDF'),
  r('Analisis_Alertas_Criticas_Julio.pdf', 'ADMINISTRATIVO', '01 Ago 2025', 'Dr. Carlos Méndez', 'PDF'),
  r('Consolidado_Farmacos_UCI_Q2.xlsx', 'OPERATIVO', '15 Jul 2025', 'Enf. Lucía Fernández', 'EXCEL'),
  r('Alta_Ruiz_PT-8826.pdf', 'CLÍNICO', '08 Jul 2025', 'Dr. Roberto Silva', 'PDF'),
  r('Resumen_Ocupacion_UCI_S26.xlsx', 'OPERATIVO', '30 Jun 2025', 'Sist. Administrativo', 'EXCEL'),
  r('Evolucion_Diaz_PT-8827.pdf', 'CLÍNICO', '22 Jun 2025', 'Dr. Carlos Méndez', 'PDF'),
  r('Analisis_Alertas_Criticas_Mayo.pdf', 'ADMINISTRATIVO', '02 Jun 2025', 'Dr. Carlos Méndez', 'PDF'),
  r('Interconsulta_Morales_PT-8828.pdf', 'CLÍNICO', '27 May 2025', 'Dr. Roberto Silva', 'PDF'),
  r('Consolidado_Farmacos_UCI_Q1.xlsx', 'OPERATIVO', '15 Abr 2025', 'Enf. Lucía Fernández', 'EXCEL'),
];

const TEMPLATES: Array<[string, string, string, string]> = [
  [imgUsers5, 'Evolución Clínica Individual', 'Monitoreo longitudinal de signos vitales, parámetros ventilatorios y notas SOAP.', 'Evolución Clínica'],
  [imgImageIcon, 'Reporte de Alta', 'Documento final con recomendaciones, medicación y seguimiento post-egreso.', 'Reporte de Alta'],
];

// Opciones de "Generar Nuevo Reporte" (datos de ejemplo).
const REPORT_PATIENTS = ['María González', 'Javier Mendoza', 'Sofía Martínez', 'Elena Rodríguez', 'Ricardo Gómez'];
const REPORT_TYPES: Array<[string, Report['type']]> = [
  ['Evolución Clínica', 'CLÍNICO'],
  ['Reporte de Alta', 'CLÍNICO'],
  ['Interconsulta', 'CLÍNICO'],
  ['Resumen de Ocupación UCI', 'OPERATIVO'],
  ['Análisis de Alertas Críticas', 'ADMINISTRATIVO'],
];
const FORMATS = [
  { value: 'PDF', label: 'PDF' },
  { value: 'EXCEL', label: 'Excel' },
];

const TODAY = '24 Oct 2025';
const PAGE_SIZE = 5;
const stop = (e: SyntheticEvent) => e.stopPropagation();

/** "Evolución Clínica" + "María González" → "Evolucion_Clinica_Gonzalez.pdf" */
const fileName = (type: string, patient: string, format: Report['format']) => {
  const part = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('_');
  return `${part(type)}_${part(patient.split(' ')[1] ?? patient)}.${format === 'PDF' ? 'pdf' : 'xlsx'}`;
};

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

const IconAction = ({ src, label, onClick }: { src: string; label: string; onClick: () => void }) => (
  <button type="button" aria-label={label} title={label} onClick={onClick} className="-m-1 flex rounded p-1 hover:bg-line">
    <img className="size-4" alt="" src={src} />
  </button>
);

const tableCard = 'w-full overflow-hidden rounded-xl border border-line bg-white shadow-[0px_2px_10px_0px_rgba(15,23,42,0.05)]';
const headRow = 'flex w-full items-center gap-3 border-b border-line bg-surface px-4 py-3 font-jakarta text-[12px] font-bold leading-[normal] text-muted';
const bodyRow = 'flex w-full items-center gap-3 border-b border-line px-4 py-[14px] font-jakarta text-[13px] leading-[normal] last:border-b-0';

type Preview = { title: string; meta: Array<[string, string]> };

export default function MedReportesPanel() {
  const toast = useToast();
  const [tab, setTab] = useState('resumen');
  const [pending, setPending] = useState(PENDING);
  const [delivered, setDelivered] = useState(8);
  const [history, setHistory] = useState(HISTORY);
  const [page, setPage] = useState(1);
  const [toDeliver, setToDeliver] = useState<Pending | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [draft, setDraft] = useState({ patient: REPORT_PATIENTS[0], type: REPORT_TYPES[0][0], format: 'PDF' as Report['format'] });

  const generated = history.length - HISTORY.length;
  const pages = Math.max(1, Math.ceil(history.length / PAGE_SIZE));
  const rows = history.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const kpis: Array<[string, string, string, string, string]> = [
    [imgFileText9, 'bg-primary-soft', 'Reportes Generados', `${12 + generated}`, 'Este mes'],
    [imgClock, 'bg-[#ffedd5]', 'Pendientes', `${pending.length}`, 'En revisión'],
    [imgCheckCircle2, 'bg-success-soft', 'Entregados', `${delivered}`, 'Esta semana'],
    [imgTimer, 'bg-primary-soft', 'Tiempo promedio', '2.4 días', 'De entrega'],
  ];

  const openGenerate = (type = REPORT_TYPES[0][0]) => {
    setDraft((d) => ({ ...d, type }));
    setGenerateOpen(true);
  };
  const generate = () => {
    const category = REPORT_TYPES.find(([t]) => t === draft.type)?.[1] ?? 'CLÍNICO';
    const file = fileName(draft.type, draft.patient, draft.format);
    setHistory((h) => [{ file, type: category, date: TODAY, by: 'Dr. Carlos Méndez', format: draft.format }, ...h]);
    setPage(1);
    setGenerateOpen(false);
    toast(`Reporte generado · ${file}`);
  };
  const deliver = () => {
    if (!toDeliver) return;
    setPending((p) => p.filter((x) => x !== toDeliver));
    setDelivered((n) => n + 1);
    toast(`Reporte entregado · ${toDeliver.patient}`);
    setToDeliver(null);
  };
  const previewReport = (rep: Report) =>
    setPreview({
      title: rep.file,
      meta: [
        ['Tipo', rep.type],
        ['Fecha', rep.date],
        ['Generado por', rep.by],
        ['Formato', rep.format],
      ],
    });
  const previewPending = (p: Pending) =>
    setPreview({
      title: `${p.type} — ${p.patient}`,
      meta: [
        ['Paciente', p.patient],
        ['Tipo', p.type],
        ['Fecha', p.date],
        ['Estado', p.status],
      ],
    });
  const download = (file: string) => toast(`Descargando ${file}`, 'info');

  const historySection = (
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
          {rows.map((rep) => (
            <div key={rep.file} {...rowButton(() => previewReport(rep))} aria-label={`Vista previa de ${rep.file}`} className={cn(bodyRow, rowLinkClass)}>
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <img className="size-4 shrink-0" alt="" src={imgFileText10} />
                <p className="min-w-0 flex-1 break-all font-semibold text-ink">{rep.file}</p>
              </div>
              <div className="w-[140px] shrink-0">
                <Pill className={TYPE_STYLE[rep.type]}>{rep.type}</Pill>
              </div>
              <p className="w-[140px] shrink-0 text-ink">{rep.date}</p>
              <p className="w-[160px] shrink-0 text-ink">{rep.by}</p>
              <div className="w-[80px] shrink-0">
                <Pill className={FORMAT_STYLE[rep.format]}>{rep.format}</Pill>
              </div>
              <div className="flex w-[120px] shrink-0 justify-end gap-3" onClick={stop} onKeyDown={stop}>
                <IconAction src={imgSearch} label="Ver" onClick={() => previewReport(rep)} />
                <IconAction src={imgLogOut4} label="Descargar" onClick={() => download(rep.file)} />
              </div>
            </div>
          ))}
        </Table>
      </div>
      <div className="flex w-full flex-wrap items-center justify-between gap-3 pt-3">
        <p className="font-jakarta text-[13px] font-normal leading-[normal] text-muted">{`Mostrando ${rows.length} de ${history.length} reportes generados`}</p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setPage(Math.max(1, page - 1))} aria-label="Página anterior">
            Anterior
          </Button>
          <Button variant="secondary" onClick={() => setPage(Math.min(pages, page + 1))} aria-label="Página siguiente">
            Siguiente
          </Button>
        </div>
      </div>
    </section>
  );

  return (
    <AppLayout
      breadcrumb="SIAPPC > Reportes"
      title="Módulo de Reportes Clínicos"
      actions={
        <Button icon={<IconPlus size={14} />} onClick={() => openGenerate()}>
          Generar Nuevo Reporte
        </Button>
      }
    >
      <div className="w-full px-4 pt-4 md:px-8">
        <Tabs items={TABS} active={tab} onChange={setTab} />
      </div>
      <div className="flex w-full min-w-0 flex-1 flex-col gap-6 bg-surface p-4 md:p-8">
        {tab === 'historial' ? (
          historySection
        ) : (
          <>
            <section className="flex w-full flex-col gap-3">
              <SectionHeader title="Resumen Personal del Médico" text="Indicadores clave de entrega de resultados para este mes." />
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {kpis.map(([icon, iconBg, label, value, note]) => (
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
                  {pending.map((p) => (
                    <div key={p.patient} {...rowButton(() => previewPending(p))} aria-label={`Vista previa: ${p.type} de ${p.patient}`} className={cn(bodyRow, rowLinkClass)}>
                      <p className="min-w-0 flex-1 font-semibold text-ink">{p.patient}</p>
                      <p className="w-[180px] shrink-0 text-ink">{p.type}</p>
                      <p className="w-[140px] shrink-0 text-ink">{p.date}</p>
                      <div className="w-[140px] shrink-0">
                        <Pill className={p.style}>{p.status}</Pill>
                      </div>
                      <div className="flex w-[120px] shrink-0 justify-end" onClick={stop} onKeyDown={stop}>
                        <Button variant="soft" size="sm" onClick={() => setToDeliver(p)}>
                          Entregar
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pending.length === 0 && <EmptyState message="No hay reportes pendientes de entrega." />}
                </Table>
              </div>
            </section>

            {historySection}

            <section className="flex w-full flex-col gap-3">
              <SectionHeader title="Plantillas de Reporte Rápido" text="Accede a las plantillas más usadas para generar resultados." />
              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                {TEMPLATES.map(([icon, title, text, type]) => (
                  <Card key={title} className="flex min-h-[180px] flex-col gap-3 shadow-[0px_2px_10px_0px_rgba(15,23,42,0.05)]">
                    <div className="flex w-full items-center gap-3">
                      <img className="size-10 shrink-0" alt="" src={icon} />
                      <p className="min-w-0 flex-1 font-jakarta text-[14px] font-bold leading-[normal] text-ink">{title}</p>
                    </div>
                    <p className="w-full font-jakarta text-[13px] font-normal leading-[normal] text-muted">{text}</p>
                    <Button variant="soft" fullWidth className="mt-auto" onClick={() => openGenerate(type)}>
                      Configurar y Generar
                    </Button>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      <Modal labelledBy="generar-titulo" open={generateOpen} onClose={() => setGenerateOpen(false)} width={480} className="gap-4 p-5 shadow-xl sm:p-6">
        <ModalHeader id="generar-titulo" title="Generar nuevo reporte" onClose={() => setGenerateOpen(false)} />
        <Select variant="input" fieldLabel="Paciente" options={REPORT_PATIENTS} value={draft.patient} onChange={(patient) => setDraft((d) => ({ ...d, patient }))} />
        <Select variant="input" fieldLabel="Tipo de reporte" options={REPORT_TYPES.map(([t]) => t)} value={draft.type} onChange={(type) => setDraft((d) => ({ ...d, type }))} />
        <Select variant="input" fieldLabel="Formato" options={FORMATS} value={draft.format} onChange={(format) => setDraft((d) => ({ ...d, format: format as Report['format'] }))} />
        <p className="break-all font-jakarta text-[12px] font-medium leading-[normal] text-muted">{`Archivo: ${fileName(draft.type, draft.patient, draft.format)}`}</p>
        <div className="flex w-full flex-wrap justify-end gap-3 pt-1">
          <Button variant="secondary" onClick={() => setGenerateOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={generate}>Generar</Button>
        </div>
      </Modal>

      <ConfirmDialog open={toDeliver !== null} title="¿Entregar reporte?" confirmLabel="Entregar" onCancel={() => setToDeliver(null)} onConfirm={deliver}>
        {toDeliver && `Se entregará el reporte de ${toDeliver.type} de ${toDeliver.patient}. Quedará disponible en el expediente.`}
      </ConfirmDialog>

      <DocumentPreview open={preview !== null} title={preview?.title ?? ''} meta={preview?.meta ?? []} onClose={() => setPreview(null)} onDownload={() => preview && download(preview.title)} />
    </AppLayout>
  );
}
