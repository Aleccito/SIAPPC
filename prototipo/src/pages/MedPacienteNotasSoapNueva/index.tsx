// Pantalla "med/paciente/notas-soap-nueva" (Figma node 29:1881) — generada desde el diseño original de Figma.
// Los campos de la ventana son dibujos (paso 3 del plan los vuelve editables).
import imgAvatar2Png from '../../assets/avatar-2.png';
import imgHeaderRowFrame from '../../assets/header-row-frame.svg';
import imgHeaderRowFrame2 from '../../assets/header-row-frame-2.svg';
import imgModalHeaderFrame from '../../assets/modal-header-frame.svg';
import imgWave from '../../assets/wave.svg';
import imgWave2 from '../../assets/wave-2.svg';
import imgWave3 from '../../assets/wave-3.svg';
import { useNavigate } from 'react-router-dom';
import { BackButton, Badge, Button, Card, CloseButton, Divider, Modal, PatientLayout, useToast } from '../../components';
import { SOAP_HISTORY_PATH } from '../../data/soap';
import { cn } from '../../lib/cn';

const SIGNALS = [
  { label: 'ECG II', value: '134', unit: 'bpm', color: 'text-[#22c55e]', wave: imgWave, icon: imgHeaderRowFrame, iconNextToLabel: true, border: 'border border-white' },
  { label: 'SpO2', value: '89', unit: '%', color: 'text-[#06b6d4]', wave: imgWave2, icon: imgHeaderRowFrame2, border: 'border-l-[3px] border-white' },
  { label: 'PA', value: '140/90', unit: 'mmHg', color: 'text-[#eab308]', wave: imgWave3, icon: imgHeaderRowFrame2, border: 'border-l-[3px] border-white' },
];

const FIELDS = [
  { letter: 'S', label: 'Subjetivo (S)', badge: 'bg-primary-soft text-primary', placeholder: 'Ej. Paciente refiere disnea leve en reposo, refiere mejoría del dolor torácico...' },
  { letter: 'O', label: 'Objetivo (O)', badge: 'bg-warning-soft text-[#eab308]', placeholder: 'Ej. FC 120 lpm, SpO2 91% con puntas nasales a 2L, ruidos respiratorios con estertores basales...' },
  { letter: 'A', label: 'Evaluación / Análisis (A)', badge: 'bg-danger-soft text-danger', placeholder: 'Ej. Insuficiencia cardíaca congestiva en fase de descompensación moderada estable...' },
  { letter: 'P', label: 'Plan (P)', badge: 'bg-success-soft text-success', placeholder: 'Ej. Continuar con furosemida 20mg IV cada 12 horas, mantener monitoreo continuo...' },
];

const CardHeading = ({ children }: { children: string }) => <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">{children}</h2>;

export default function MedPacienteNotasSoapNueva() {
  const navigate = useNavigate();
  const toast = useToast();
  // Cerrar o cancelar vuelve al historial; guardar también, con aviso (los campos son del paso 3).
  const close = () => navigate(SOAP_HISTORY_PATH);
  const save = () => {
    toast('Nota guardada');
    navigate(SOAP_HISTORY_PATH);
  };

  return (
    <PatientLayout
      breadcrumb="SIAPPC > Pacientes > María González > Notas SOAP > Nueva"
      title="Nueva Nota SOAP"
      tab="notas"
      actions={<BackButton />}
    >
      <div className="flex w-full flex-col items-start gap-5 xl:flex-row">
        <Card className="flex w-full min-w-0 flex-col gap-[14px] xl:w-[580px] xl:shrink-0">
          <CardHeading>Monitor de Cama - Cama 03</CardHeading>
          {SIGNALS.map((s) => (
            <div key={s.label} className={cn('flex w-full flex-col gap-[10px] rounded-[10px] bg-[#0b1220] p-3', s.border)}>
              <div className="flex w-full items-center justify-between leading-[normal]">
                <div className="flex items-center gap-2">
                  <p className="font-jakarta text-[11px] font-bold uppercase text-subtle">{s.label}</p>
                  {s.iconNextToLabel && <img className="size-3.5" alt="" src={s.icon} />}
                </div>
                <div className={cn('flex items-baseline gap-1.5', s.color)}>
                  <p className="font-jakarta text-[22px] font-extrabold">{s.value}</p>
                  <p className="font-jakarta text-[12px] font-bold">{s.unit}</p>
                  {!s.iconNextToLabel && <img className="size-3.5 self-center" alt="" src={s.icon} />}
                </div>
              </div>
              <div className="relative h-14 w-full overflow-hidden rounded-lg bg-[#0b1220]">
                <img className="absolute left-0 top-[10px] h-9 w-[380px] max-w-full object-fill" alt="" src={s.wave} />
              </div>
            </div>
          ))}
        </Card>

        <div className="flex w-full min-w-0 flex-col gap-4 xl:flex-1">
          <Card className="flex w-full flex-col gap-[14px]">
            <div className="flex w-full items-center justify-between gap-3">
              <CardHeading>Última Nota SOAP</CardHeading>
              <Badge tone="neutral" size="sm">24 Oct 2025, 08:15</Badge>
            </div>
            <div className="flex items-center gap-2">
              <img className="size-6 rounded-full object-cover" alt="" src={imgAvatar2Png} />
              <p className="font-jakarta text-[13px] font-semibold leading-[normal] text-muted">Dr. Carlos Méndez</p>
            </div>
            <Divider />
            <div className="flex w-full flex-col gap-2">
              {[
                ['S', 'bg-primary-soft text-primary', 'Disnea progresiva y dificultad para respirar en reposo.'],
                ['O', 'bg-warning-soft text-[#eab308]', 'FC 134, SpO2 89%, estertores bilaterales.'],
              ].map(([letter, badge, text]) => (
                <div key={letter} className="flex w-full max-w-[344px] items-center gap-1.5">
                  <span className={cn('rounded px-1.5 py-0.5 font-jakarta text-[11px] font-extrabold leading-[normal]', badge)}>{letter}</span>
                  <p className="min-w-0 flex-1 truncate font-jakarta text-[13px] font-normal leading-[normal] text-ink">{text}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="flex w-full flex-col gap-[14px]">
            <div className="flex w-full items-center justify-between gap-3">
              <CardHeading>Dispositivo IoT</CardHeading>
              <Badge tone="success" size="sm" dot>
                En línea
              </Badge>
            </div>
            <Divider />
            <div className="flex w-full items-center justify-between gap-3 text-[13px] leading-[normal]">
              <p className="font-jakarta font-normal text-muted">ID del dispositivo</p>
              <p className="font-jakarta font-bold text-ink">RPi-UCI-003</p>
            </div>
          </Card>
        </div>
      </div>

      <Modal labelledBy="nueva-nota-soap-titulo" onClose={close} width={680} backdrop="bg-[rgba(15,23,42,0.5)]" className="gap-6 p-5 drop-shadow-[0px_20px_20px_rgba(15,23,42,0.15)] sm:p-8">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img className="size-9 shrink-0" alt="" src={imgModalHeaderFrame} />
            <h2 id="nueva-nota-soap-titulo" className="font-jakarta text-[22px] font-extrabold leading-[normal] text-ink">
              Nueva Nota SOAP
            </h2>
          </div>
          <CloseButton onClick={close} />
        </div>
        <Divider />
        <div className="flex w-full flex-col gap-4">
          <p className="font-jakarta text-[14px] font-bold uppercase leading-[normal] text-ink">Notas de Progreso Clínico</p>
          <div className="flex w-full flex-col gap-[14px]">
            {FIELDS.map((f) => (
              <div key={f.letter} className="flex w-full flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className={cn('rounded px-1.5 py-0.5 font-jakarta text-[11px] font-extrabold leading-[normal]', f.badge)}>{f.letter}</span>
                  <p className="font-jakarta text-[13px] font-semibold leading-[normal] text-muted">{f.label}</p>
                </div>
                <div className="min-h-20 w-full rounded-lg border border-line bg-white p-3">
                  <p className="font-jakarta text-[13px] font-normal leading-[1.4] text-muted">{f.placeholder}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Divider />
        <div className="flex w-full flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={close}>
            Cancelar
          </Button>
          <Button onClick={save}>
            Guardar Nota
          </Button>
        </div>
      </Modal>
    </PatientLayout>
  );
}
