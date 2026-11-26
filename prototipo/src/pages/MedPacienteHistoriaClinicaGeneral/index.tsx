// Pantalla "med/paciente/historia-clinica-general" (Figma node 45:505) — generada desde el diseño original de Figma.
// Cada sección resume el expediente del paciente de la URL (GET /historia/:id) o, si el backend no lo
// tiene, lo de src/api/sinBackend.ts.
import { useState, type ReactNode } from 'react';
import imgActivity2 from '../../assets/activity-2.svg';
import imgClipboardList from '../../assets/clipboard-list.svg';
import imgFileText3 from '../../assets/file-text-3.svg';
import imgHeart from '../../assets/heart.svg';
import imgHome from '../../assets/home.svg';
import imgPill from '../../assets/pill.svg';
import imgShieldAlert from '../../assets/shield-alert.svg';
import imgStethoscope from '../../assets/stethoscope.svg';
import imgUser from '../../assets/user.svg';
import { useMonitoredBeds } from '../../api/queries';
import { getDatosExtra, getIndicacionesExtra, getInterrogatorio, getNotaIngreso, getSignosIngreso, useExtra } from '../../api/sinBackend';
import { AppLink, Button, Divider, IconArrowRight, IconChevronDown, PatientLayout, type PatientView, Table, usePatient, useSession } from '../../components';
import { fmtDate } from '../../lib/clinical';
import { cn } from '../../lib/cn';

/** Botón redondeado que lleva a la sección completa. */
const NavPill = ({ to, children }: { to: string; children: string }) => (
  <AppLink to={to} className="flex items-center gap-1.5 rounded-full bg-[#eff2ff] px-4 py-2 font-jakarta text-[13px] font-medium leading-[normal] text-[#2663eb] hover:bg-primary-soft">
    {children}
    <IconArrowRight size={14} />
  </AppLink>
);

const CollapseIcon = () => (
  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#dbeafe] bg-[#f1f5f9]">
    <IconChevronDown size={16} className="text-muted" />
  </span>
);

/** Sección plegable: la flecha de la derecha oculta o muestra su contenido (gira al plegar). */
function Section({ icon, title, expanded, children }: { icon: string; title: string; expanded?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="flex w-full flex-col items-start gap-3 rounded-xl border border-line bg-white p-4">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <img className="size-7 shrink-0" alt="" src={icon} />
          <h2 className="font-jakarta text-[14px] font-semibold leading-[normal] text-ink">{title}</h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={`${open ? 'Plegar' : 'Desplegar'} ${title}`}
          className={cn('flex shrink-0 rounded-full transition-transform hover:opacity-80', !open && 'rotate-180')}
        >
          {expanded ? <span className="flex size-7 shrink-0 items-center justify-center"><IconChevronDown size={16} className="rotate-180 text-muted" /></span> : <CollapseIcon />}
        </button>
      </div>
      {open && (
        <>
          <Divider />
          {children}
        </>
      )}
    </section>
  );
}

const Summary = ({ children }: { children: string }) => <p className="w-full font-jakarta text-[13px] font-normal leading-[1.5] text-muted">{children}</p>;

const SEX: Record<string, string> = { M: 'Masculino', F: 'Femenino', O: 'Otro' };
const SEVERITY: Record<string, { label: string; box: string }> = {
  anafilaxia: { label: 'ANAFILAXIA', box: 'border-danger bg-danger-soft text-danger' },
  grave: { label: 'GRAVE', box: 'border-danger bg-danger-soft text-danger' },
  moderada: { label: 'MODERADA', box: 'border-warning bg-warning-soft text-warning' },
  leve: { label: 'LEVE', box: 'border-line bg-surface text-muted' },
};
const ROUTE: Record<string, string> = { oral: 'Oral', intravenosa: 'Intravenosa', subcutanea: 'Subcutánea', subcutánea: 'Subcutánea', inhalada: 'Inhalada' };
const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export default function MedPacienteHistoriaClinicaGeneral() {
  const { view } = usePatient();
  return (
    <PatientLayout breadcrumb={`SIAPPC > Pacientes > ${view?.name ?? '…'} > Historia Clínica`} title="Historia Clínica General" tab="historia">
      {view && <Historia v={view} />}
    </PatientLayout>
  );
}

function Historia({ v }: { v: PatientView }) {
  const { can } = useSession();
  const exp = v.expediente;
  const datos = useExtra('datos', v.cedula, getDatosExtra);
  const interrogatorio = useExtra('interrogatorio', v.cedula, getInterrogatorio);
  const signosIngreso = useExtra('signosIngreso', v.cedula, getSignosIngreso);
  const ingreso = useExtra('ingreso', v.cedula, getNotaIngreso);
  const indicaciones = useExtra('indicaciones', v.cedula, getIndicacionesExtra);
  const beds = useMonitoredBeds();
  const unit = beds.data?.find((b) => b.patientId === v.id)?.unit ?? v.assigned?.unit ?? '—';

  const history = (exp?.antecedentes ?? []).filter((a) => a.active && (a.type === 'personal' || a.type === 'quirurgico'));
  const allergies = (exp?.alergias ?? []).filter((a) => a.status === 'activa');
  const meds = (exp?.medicamentos ?? []).filter((m) => m.status === 'activo');
  const dx = (exp?.diagnosticos ?? []).filter((d) => d.status === 'activo');
  const docs = exp?.documentos ?? [];
  const solutions = meds.filter((m) => /^soluci/i.test(String(m.name))).length + (indicaciones.data?.soluciones.length ?? 0);
  const drugs = meds.filter((m) => !/^soluci/i.test(String(m.name))).length;

  const marked = Object.entries(interrogatorio.data ?? {}).filter(([, x]) => x.marcados.length);
  const si = signosIngreso.data;

  const summaries: Array<{ icon: string; title: string; text: string; to: string; link: string }> = [
    {
      icon: imgClipboardList,
      title: 'Interrogatorio por Aparatos y Sistemas',
      text: marked.length ? `Hallazgos: ${marked.map(([name, x]) => `${name.replace(/^(Aparato|Sistema) /, '')} (${x.marcados.join(', ')})`).join(', ')}` : 'Sin hallazgos registrados',
      to: '/MedPacienteInterrogatorioAparatos',
      link: 'Ver interrogatorio completo',
    },
    {
      icon: imgActivity2,
      title: 'Exploración Física',
      text: si ? `FC ${si.fc}bpm · PA ${si.ta} · FR ${si.fr}rpm · SpO₂ ${si.spo2}% · Temp ${si.temp.toFixed(1)}°C` : 'Evaluación primaria pendiente',
      to: '/MedPacienteExploracionFisica',
      link: 'Ver exploración completa',
    },
  ];
  const summaries2: typeof summaries = [
    {
      icon: imgStethoscope,
      title: 'Diagnósticos y Problemas Activos',
      text: `${dx.length} ${dx.length === 1 ? 'diagnóstico activo' : 'diagnósticos activos'}${dx.length ? ` - ${dx.map((d) => `${d.code} ${d.description}`).join(', ')}` : ''}`,
      to: '/MedPacienteDiagnosticosActivos',
      link: 'Ver diagnósticos',
    },
    {
      icon: imgHome,
      title: 'Historial de Hospitalizaciones e Intervenciones',
      text: `Actual: ${fmtDate(v.assigned?.admittedAt ?? v.patient.arrivedAt)} · ${unit} · Cama ${v.bed ?? '—'} · Dr. Méndez`,
      to: '/MedPacienteHistorialHospitalizaciones',
      link: 'Ver historial completo',
    },
    {
      icon: imgFileText3,
      title: 'Nota de Ingreso / Admisión',
      text: `Ingreso ${fmtDate(v.assigned?.admittedAt ?? v.patient.arrivedAt)} · Dx principal: ${v.mainDx ? String(v.mainDx.description) : '—'} · Pronóstico ${ingreso.data?.pronostico ?? '—'}`,
      to: '/MedPacienteNotaIngreso',
      link: 'Ver nota de ingreso',
    },
    {
      icon: imgPill,
      title: 'Indicaciones Médicas',
      text: `${drugs} ${drugs === 1 ? 'medicamento' : 'medicamentos'} · ${solutions} ${solutions === 1 ? 'solución IV' : 'soluciones IV'} · Dieta ${(indicaciones.data?.dieta ?? ['—']).join(', ').toLowerCase()}`,
      to: '/MedPacienteIndicacionesMedicas',
      link: 'Ver indicaciones médicas',
    },
    {
      icon: imgFileText3,
      title: 'Documentos Clínicos Adjuntos',
      text: `${docs.length} ${docs.length === 1 ? 'documento adjunto' : 'documentos adjuntos'} · Subir archivo (PDF, JPG)`,
      to: '/MedPacienteDocumentosClinicos',
      link: 'Ver documentos',
    },
  ];

  return (
    <div className="flex w-full flex-col items-start gap-3">
      {can('historia_clinica', 'crear') && (
        <Button variant="soft" size="sm" to="/MedPacienteRegistroDiagnostico">
          + Agregar Diagnóstico
        </Button>
      )}

      <Section icon={imgUser} title="Datos Personales y Demográficos">
        <Summary>
          {[v.name, v.age !== null ? `${v.age} años` : null, SEX[v.patient.sex], v.patient.bloodType, datos.data?.estadoCivil, `ID ${v.cedula}`].filter(Boolean).join(' · ')}
        </Summary>
        <NavPill to="/MedPacienteDatosPersonales">Ver datos completos</NavPill>
      </Section>

      <Section icon={imgHeart} title="Antecedentes Patológicos Diagnosticados" expanded>
        <div className="flex w-full flex-col gap-3">
          {history.length === 0 && <p className="font-jakarta text-[13px] text-muted">Sin antecedentes patológicos registrados.</p>}
          {history.map((a) => (
            <div key={a.id} className="w-full rounded-lg bg-surface p-3">
              <p className="font-jakarta text-[13px] font-bold leading-[normal] text-ink">
                {String(a.description)} <span className="font-medium text-muted">{a.type === 'quirurgico' ? `(Cirugía${a.year ? `, ${a.year}` : ''})` : a.year ? `(${a.year})` : ''}</span>
              </p>
            </div>
          ))}
        </div>
        <AppLink
          to="/MedPacienteAntecedentes"
          className="flex items-center gap-1.5 rounded-full border border-[#dbeafe] bg-primary-soft px-4 py-2 font-jakarta text-[13px] font-semibold leading-[normal] text-primary hover:bg-[#dbeafe]"
        >
          Ver historial completo de antecedentes
          <IconArrowRight size={14} />
        </AppLink>
      </Section>

      {summaries.map((s) => (
        <Section key={s.title} icon={s.icon} title={s.title}>
          <Summary>{s.text}</Summary>
          <NavPill to={s.to}>{s.link}</NavPill>
        </Section>
      ))}

      <Section icon={imgShieldAlert} title="Alergias y Reacciones Adversas" expanded>
        {allergies.length === 0 ? (
          <p className="font-jakarta text-[13px] font-medium text-muted">Sin alergias conocidas.</p>
        ) : (
          <div className="grid w-full grid-cols-1 gap-3 leading-[normal] sm:grid-cols-2">
            {allergies.map((a) => {
              const sev = SEVERITY[String(a.severity)] ?? SEVERITY.leve;
              return (
                <div key={a.id} className={cn('flex flex-col gap-1 rounded-lg border p-3', sev.box)}>
                  <p className="font-jakarta text-[13px] font-bold">{String(a.substance)}</p>
                  <p className="font-jakarta text-[11px] font-semibold">{`Severidad: ${sev.label}${a.reaction ? ` (${a.reaction})` : ''}`}</p>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      <Section icon={imgPill} title="Medicamentos y Tratamientos Actuales" expanded>
        <div className="w-full overflow-hidden rounded-lg border border-line bg-white">
          <Table minWidth={680}>
            <div className="flex w-full items-center gap-3 border-b border-line bg-surface px-3 py-[10px] font-jakarta text-[11px] font-bold leading-[normal] text-muted">
              <p className="min-w-0 flex-1">MEDICAMENTO</p>
              <p className="w-[130px] shrink-0">DOSIS</p>
              <p className="w-[150px] shrink-0">FRECUENCIA</p>
              <p className="w-[110px] shrink-0">VÍA</p>
              <p className="w-[110px] shrink-0">INICIO</p>
            </div>
            {meds.map((m) => (
              <div key={m.id} className="flex w-full items-center gap-3 border-b border-line px-3 py-[10px] font-jakarta text-[13px] font-normal leading-[normal] last:border-b-0">
                <p className="min-w-0 flex-1 font-bold text-ink">{String(m.name)}</p>
                <p className="w-[130px] shrink-0 text-ink">{String(m.dose ?? '—')}</p>
                <p className="w-[150px] shrink-0 text-muted">{cap(String(m.frequency ?? '—'))}</p>
                <p className="w-[110px] shrink-0 text-ink">{ROUTE[String(m.route)] ?? cap(String(m.route ?? '—'))}</p>
                <p className="w-[110px] shrink-0 text-muted">{fmtDate(m.startedOn as string | null)}</p>
              </div>
            ))}
            {meds.length === 0 && <p className="px-3 py-[10px] font-jakarta text-[13px] text-muted">Sin medicamentos activos.</p>}
          </Table>
        </div>
      </Section>

      {summaries2.map((s) => (
        <Section key={s.title} icon={s.icon} title={s.title}>
          <Summary>{s.text}</Summary>
          <NavPill to={s.to}>{s.link}</NavPill>
        </Section>
      ))}
    </div>
  );
}
