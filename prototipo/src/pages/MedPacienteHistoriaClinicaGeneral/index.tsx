// Pantalla "med/paciente/historia-clinica-general" (Figma node 45:505) — generada desde el diseño original de Figma.
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import imgActivity2 from '../../assets/activity-2.svg';
import imgChevronDown2 from '../../assets/chevron-down-2.svg';
import imgClipboardList from '../../assets/clipboard-list.svg';
import imgFileText3 from '../../assets/file-text-3.svg';
import imgHeart from '../../assets/heart.svg';
import imgHome from '../../assets/home.svg';
import imgPill from '../../assets/pill.svg';
import imgShieldAlert from '../../assets/shield-alert.svg';
import imgStethoscope from '../../assets/stethoscope.svg';
import imgUser from '../../assets/user.svg';
import { BackButton, Button, Divider, PatientLayout, Table } from '../../components';

/** Botón redondeado que lleva a la sección completa. */
const NavPill = ({ to, children }: { to: string; children: string }) => (
  <Link to={to} className="rounded-full bg-[#eff2ff] px-4 py-2 font-jakarta text-[13px] font-medium leading-[normal] text-[#2663eb] hover:bg-primary-soft">
    {children}
  </Link>
);

const CollapseIcon = () => (
  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#dbeafe] bg-[#f1f5f9]">
    <img className="size-4 rotate-180" alt="" src={imgChevronDown2} />
  </span>
);

function Section({ icon, title, expanded, children }: { icon: string; title: string; expanded?: boolean; children: ReactNode }) {
  return (
    <section className="flex w-full flex-col items-start gap-3 rounded-xl border border-line bg-white p-4">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <img className="size-7 shrink-0" alt="" src={icon} />
          <h2 className="font-jakarta text-[14px] font-semibold leading-[normal] text-ink">{title}</h2>
        </div>
        {expanded ? <img className="size-7 shrink-0" alt="" src={imgChevronDown2} /> : <CollapseIcon />}
      </div>
      <Divider />
      {children}
    </section>
  );
}

const Summary = ({ children }: { children: string }) => <p className="w-full font-jakarta text-[13px] font-normal leading-[1.5] text-muted">{children}</p>;

const SUMMARIES: Array<{ icon: string; title: string; text: string; to: string; link: string }> = [
  { icon: imgClipboardList, title: 'Interrogatorio por Aparatos y Sistemas', text: 'Hallazgos: Cardiovascular (Disnea), Respiratorio (Tos productiva), Renal (Edema MsIs)', to: '/MedPacienteInterrogatorioAparatos', link: 'Ver interrogatorio completo →' },
  { icon: imgActivity2, title: 'Exploración Física', text: 'FC 92bpm · PA 145/90 · FR 24rpm · SpO₂ 91% · Temp 36.8°C', to: '/MedPacienteExploracionFisica', link: 'Ver exploración completa →' },
];

const SUMMARIES_2: typeof SUMMARIES = [
  { icon: imgStethoscope, title: 'Diagnósticos y Problemas Activos', text: '3 diagnósticos activos - I50.9 ICC, J81 Edema Pulmonar, I10 HTA', to: '/MedPacienteDiagnosticosActivos', link: 'Ver diagnósticos →' },
  { icon: imgHome, title: 'Historial de Hospitalizaciones e Intervenciones', text: 'Última: 15 Oct 2025 · UCI · Cama C-03 · Dr. Méndez', to: '/MedPacienteHistorialHospitalizaciones', link: 'Ver historial completo →' },
  { icon: imgFileText3, title: 'Nota de Ingreso / Admisión', text: 'Ingreso 15 Oct 2025 · Dx principal: ICC · Pronóstico Reservado', to: '/MedPacienteNotaIngreso', link: 'Ver nota de ingreso →' },
  { icon: imgPill, title: 'Indicaciones Médicas', text: '4 medicamentos · 2 soluciones IV · Dieta blanda hiposódica', to: '/MedPacienteIndicacionesMedicas', link: 'Ver indicaciones médicas →' },
  { icon: imgFileText3, title: 'Documentos Clínicos Adjuntos', text: '3 documentos adjuntos · Subir archivo (PDF, JPG)', to: '/MedPacienteDocumentosClinicos', link: 'Ver documentos →' },
];

const HISTORY = [
  ['Hipertensión Arterial Sistémica', '(2018)'],
  ['Diabetes Mellitus Tipo 2', '(2020)'],
  ['Revascularización Miocárdica Quirúrgica', '(Cirugía)'],
];

const MEDS = [
  ['Noradrenalina', '0.15 mcg/kg/min', 'Infusión Continua', 'Vía Central', '02 Ago, 08:30'],
  ['Fentanilo', '2 mcg/kg/h', 'Infusión Continua', 'Vía Central', '02 Ago, 09:00'],
  ['Omeprazol', '40 mg', 'Cada 24 horas', 'Intravenosa', '03 Ago, 06:00'],
  ['Enoxaparina', '40 mg', 'Cada 24 horas', 'Subcutánea', '03 Ago, 20:00'],
];

export default function MedPacienteHistoriaClinicaGeneral() {
  return (
    <PatientLayout breadcrumb="SIAPPC > Pacientes > María González > Historia Clínica" title="Historia Clínica General" tab="historia" actions={<BackButton />}>
      <div className="flex w-full flex-col items-start gap-3">
        <Button variant="soft" size="sm" to="/MedPacienteRegistroDiagnostico">
          + Agregar Diagnóstico
        </Button>

        <Section icon={imgUser} title="Datos Personales y Demográficos">
          <Summary>María González · 67 años · Femenino · O+ · Casada · ID PT-8821</Summary>
          <NavPill to="/MedPacienteDatosPersonales">Ver datos completos →</NavPill>
        </Section>

        <Section icon={imgHeart} title="Antecedentes Patológicos Diagnosticados" expanded>
          <div className="flex w-full flex-col gap-3">
            {HISTORY.map(([name, note]) => (
              <div key={name} className="w-full rounded-lg bg-surface p-3">
                <p className="font-jakarta text-[13px] font-bold leading-[normal] text-ink">
                  {name} <span className="font-medium text-muted">{note}</span>
                </p>
              </div>
            ))}
          </div>
          <Link
            to="/MedPacienteAntecedentes"
            className="rounded-full border border-[#dbeafe] bg-primary-soft px-4 py-2 font-jakarta text-[13px] font-semibold leading-[normal] text-primary hover:bg-[#dbeafe]"
          >
            Ver historial completo de antecedentes →
          </Link>
        </Section>

        {SUMMARIES.map((s) => (
          <Section key={s.title} icon={s.icon} title={s.title}>
            <Summary>{s.text}</Summary>
            <NavPill to={s.to}>{s.link}</NavPill>
          </Section>
        ))}

        <Section icon={imgShieldAlert} title="Alergias y Reacciones Adversas" expanded>
          <div className="grid w-full grid-cols-1 gap-3 leading-[normal] sm:grid-cols-2">
            <div className="flex flex-col gap-1 rounded-lg border border-danger bg-danger-soft p-3 text-danger">
              <p className="font-jakarta text-[13px] font-bold">Penicilina</p>
              <p className="font-jakarta text-[11px] font-semibold">Severidad: SEVERA (Shock Anafiláctico)</p>
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-warning bg-warning-soft p-3 text-warning">
              <p className="font-jakarta text-[13px] font-bold">AINEs (Antiinflamatorios no esteroideos)</p>
              <p className="font-jakarta text-[11px] font-semibold">Severidad: MODERADA (Broncoespasmo)</p>
            </div>
          </div>
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
              {MEDS.map(([name, dose, freq, route, start]) => (
                <div key={name} className="flex w-full items-center gap-3 border-b border-line px-3 py-[10px] font-jakarta text-[13px] font-normal leading-[normal] last:border-b-0">
                  <p className="min-w-0 flex-1 font-bold text-ink">{name}</p>
                  <p className="w-[130px] shrink-0 text-ink">{dose}</p>
                  <p className="w-[150px] shrink-0 text-muted">{freq}</p>
                  <p className="w-[110px] shrink-0 text-ink">{route}</p>
                  <p className="w-[110px] shrink-0 text-muted">{start}</p>
                </div>
              ))}
            </Table>
          </div>
        </Section>

        {SUMMARIES_2.map((s) => (
          <Section key={s.title} icon={s.icon} title={s.title}>
            <Summary>{s.text}</Summary>
            <NavPill to={s.to}>{s.link}</NavPill>
          </Section>
        ))}
      </div>
    </PatientLayout>
  );
}
