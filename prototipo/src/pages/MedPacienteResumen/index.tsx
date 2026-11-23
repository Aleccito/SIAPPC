// Pantalla "med/paciente/resumen" (Figma node 100:256) — generada desde el diseño original de Figma.
import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import imgAlertTextEllipse from '../../assets/alert-text-ellipse.svg';
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgAvatar2Png from '../../assets/avatar-2.png';
import imgCpuIcon from '../../assets/cpu-icon.svg';
import imgLiveIndicatorEllipse from '../../assets/live-indicator-ellipse.svg';
import imgWaveLine from '../../assets/wave-line.svg';
import { BackButton, Badge, Button, Card, Divider, PatientLayout, SoapSections } from '../../components';
import { CONFIRM_PATH, type AlertInfo, type AttendedState, type ConfirmState } from '../../data/alerts';

const VITALS: Array<[string, string, string, string]> = [
  ['FC (Frecuencia Cardíaca)', '112', 'lpm', 'text-danger'],
  ['SpO2 (Oxígeno)', '93', '%', 'text-warning'],
  ['PA (Presión Arterial)', '145/92', 'mmHg', 'text-warning'],
  ['Temp (Temperatura)', '37.8', '°C', 'text-warning'],
  ['FR (Frecuencia Resp.)', '22', 'rpm', 'text-white'],
];

const DETAILS: Array<[string, ReactNode]> = [
  ['Nombre Completo', 'María González'],
  ['Fecha de Nacimiento', '14 May 1959 (67 años)'],
  ['Grupo Sanguíneo', 'A+ (Positivo)'],
  ['Alergias', <Badge key="a" tone="danger" size="sm">Penicilina</Badge>],
  ['Médico Responsable', 'Dr. Carlos Méndez'],
  ['Diagnóstico Principal', 'Insuficiencia Cardíaca Congestiva'],
  ['Contacto de Emergencia', 'Juan González — +52 55 1234 5678'],
  ['Seguro Médico', 'IMSS — Póliza #4821903'],
];

const LAST_SOAP = {
  s: 'Disnea progresiva y dificultad para respirar en reposo.',
  o: 'FC 134, SpO2 89%, estertores bilaterales.',
  a: 'Descompensación aguda ICC.',
  p: 'Ajustar diurético IV, O2 por mascarilla.',
};

const SELF = '/MedPacienteResumen';

const ALERTS: Array<[string, string, string, AlertInfo]> = [
  [
    imgAlertTextEllipse,
    'SpO2 < 95% — Advertencia de Saturación',
    'Saturación actual 93%. Detectada hace 8 min',
    { id: 'C-03-spo2', patient: 'María González', bed: 'UCI Cama C-03', title: 'Advertencia — SpO2 por debajo de 95% (93%)', detail: 'Detectada hace 8 minutos' },
  ],
  [
    imgAlertTextEllipse2,
    'FC > 110 bpm — Alerta Taquicardia',
    'Ritmo actual 112 lpm. Detectada hace 12 min',
    { id: 'C-03-fc', patient: 'María González', bed: 'UCI Cama C-03', title: 'Alerta — Taquicardia, FC por encima de 110 bpm (112 lpm)', detail: 'Detectada hace 12 minutos' },
  ],
];

const SideTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">{children}</h2>
);

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[13px] leading-[normal]">
    <p className="font-jakarta font-medium text-muted">{label}</p>
    <div className="font-jakarta font-bold text-ink">{children}</div>
  </div>
);

export default function MedPacienteResumen() {
  const navigate = useNavigate();
  const location = useLocation();
  // Al volver de "Confirmar atención", la alerta atendida sale de la lista.
  const attendedId = (location.state as AttendedState | null)?.attendedId;
  const [attended] = useState(() => attendedId);
  useEffect(() => {
    if (attendedId) navigate(SELF, { replace: true, state: null });
  }, [attendedId, navigate]);
  const alerts = ALERTS.filter(([, , , info]) => info.id !== attended);
  const attend = (alert: AlertInfo) => {
    const state: ConfirmState = { alert, from: SELF };
    navigate(CONFIRM_PATH, { state });
  };

  return (
    <PatientLayout
      breadcrumb="SIAPPC > Monitoreo > Mapa de Camas > C-03"
      title="Cama C-03 — María González"
      tab="resumen"
      actions={<BackButton to="/MedMonitoreoGridUci">Volver al Mapa</BackButton>}
    >
      <div className="flex w-full flex-col items-start gap-5 xl:flex-row">
        <div className="flex w-full min-w-0 flex-col xl:max-w-[630px] xl:flex-1">
          <div className="flex w-full flex-col gap-4 rounded-xl bg-[#0b1220] p-4 drop-shadow-[0px_8px_10px_rgba(0,0,0,0.25)] sm:p-5 xl:min-h-[571px]">
            <div className="flex w-full flex-wrap items-center justify-between gap-3">
              <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-white">Monitor de Signos Vitales — Cama C-03</h2>
              <div className="flex items-center gap-1.5">
                <img className="size-1.5" alt="" src={imgLiveIndicatorEllipse} />
                <p className="font-jakarta text-[12px] font-bold leading-[normal] text-success">En vivo</p>
              </div>
              <Link
                to="/MedPacienteConfigUmbrales"
                className="flex items-center justify-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-[10px] py-1 leading-[normal] text-subtle hover:bg-white/15"
              >
                <span className="font-inter text-[12px] font-normal">⚙</span>
                <span className="font-inter text-[11px] font-medium">Configurar Umbrales</span>
              </Link>
            </div>

            <div className="flex w-full flex-col gap-[10px] rounded-[10px] border border-ink-soft bg-[#090e17] p-3">
              <div className="flex w-full items-center justify-between font-jakarta font-bold leading-[normal]">
                <p className="text-[11px] uppercase text-subtle">ECG II</p>
                <p className="text-[12px] text-[#22c55e]">Filtro: Activo</p>
              </div>
              <div className="relative h-[60px] w-full overflow-hidden">
                <img className="absolute inset-x-0 top-3 h-9 w-full object-fill" alt="" src={imgWaveLine} />
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              {VITALS.map(([label, value, unit, color], i) => (
                <div key={label} className={`flex flex-col gap-1.5 rounded-lg border border-ink-soft bg-[#0b1220] p-[14px] leading-[normal] ${i === VITALS.length - 1 ? 'sm:col-span-2' : ''}`}>
                  <p className="font-jakarta text-[11px] font-bold uppercase text-subtle">{label}</p>
                  <div className={`flex items-baseline gap-1.5 ${color}`}>
                    <p className="font-jakarta text-[28px] font-extrabold">{value}</p>
                    <p className="font-jakarta text-[12px] font-bold">{unit}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto flex w-full flex-wrap items-center justify-between gap-2 border-t border-ink-soft pt-2 text-[12px] leading-[normal] text-subtle">
              <p className="font-jakarta font-normal">Última actualización: hace 3 seg</p>
              <p className="font-jakarta font-bold">Ref: RPi-UCI-003</p>
            </div>
          </div>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-4 xl:w-[474px] xl:shrink-0">
          <Card raised padding="none" className="flex w-full flex-col gap-3 p-[18px]">
            <SideTitle>Información del Paciente</SideTitle>
            <Divider />
            <div className="flex w-full flex-col gap-2">
              {DETAILS.map(([label, value]) => (
                <Row key={label} label={label}>
                  {value}
                </Row>
              ))}
            </div>
          </Card>

          <Card raised className="flex w-full flex-col gap-[14px]">
            <div className="flex w-full items-center justify-between gap-3">
              <SideTitle>Última Nota SOAP</SideTitle>
              <Badge tone="neutral" size="sm">24 Oct 2025, 08:15</Badge>
            </div>
            <div className="flex items-center gap-2">
              <img className="size-6 rounded-full object-cover" alt="" src={imgAvatar2Png} />
              <p className="font-jakarta text-[12px] font-semibold leading-[normal] text-muted">Dr. Carlos Méndez</p>
            </div>
            <Divider />
            <SoapSections note={LAST_SOAP} size="sm" />
          </Card>

          <Card raised padding="none" className="flex w-full flex-col gap-3 p-[18px]">
            <div className="flex w-full items-center justify-between gap-3">
              <SideTitle>Alertas Activas</SideTitle>
              <Badge tone="danger" size="sm">{alerts.length}</Badge>
            </div>
            <Divider />
            <div className="flex w-full flex-col gap-3">
              {alerts.length === 0 && <p className="font-jakarta text-[13px] font-medium leading-[normal] text-muted">Sin alertas activas.</p>}
              {alerts.map(([dot, title, text, info]) => (
                <div key={title} className="flex w-full items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-[10px]">
                    <img className="size-2 shrink-0" alt="" src={dot} />
                    <div className="flex min-w-0 flex-col gap-0.5 leading-[normal]">
                      <p className="font-jakarta text-[13px] font-bold text-ink">{title}</p>
                      <p className="font-jakarta text-[11px] font-normal text-muted">{text}</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => attend(info)}>
                    Atender
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card raised className="flex w-full flex-col gap-[14px]">
            <div className="flex w-full items-center justify-between gap-3">
              <SideTitle>Dispositivo IoT</SideTitle>
              <Badge tone="success" size="sm" dot>
                En línea
              </Badge>
            </div>
            <Divider />
            <div className="flex w-full flex-col gap-[10px] leading-[normal]">
              <div className="flex w-full items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <img className="size-3.5" alt="" src={imgCpuIcon} />
                  <p className="font-jakarta text-[12px] font-normal text-muted">ID del dispositivo</p>
                </div>
                <p className="font-jakarta text-[13px] font-bold text-ink">RPi-UCI-003</p>
              </div>
              <div className="flex w-full items-center justify-between gap-3">
                <p className="font-jakarta text-[12px] font-normal text-muted">Señal</p>
                <Badge tone="success" size="sm">Excelente</Badge>
              </div>
              <div className="flex w-full items-center justify-between gap-3">
                <p className="font-jakarta text-[12px] font-normal text-muted">Uptime</p>
                <p className="font-jakarta text-[13px] font-bold text-ink">72h continuas</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PatientLayout>
  );
}
