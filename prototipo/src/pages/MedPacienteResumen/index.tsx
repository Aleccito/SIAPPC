// Pantalla "med/paciente/resumen" (Figma node 100:256) — generada desde el diseño original de Figma.
// Datos: el paciente de la URL (src/api/), sus signos del seed, alertas agrupadas y última nota.
import { useEffect, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import imgAlertTextEllipse from '../../assets/alert-text-ellipse.svg';
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgAvatar2Png from '../../assets/avatar-2.png';
import imgCpuIcon from '../../assets/cpu-icon.svg';
import imgLiveIndicatorEllipse from '../../assets/live-indicator-ellipse.svg';
import { useAlerts, useAssignments, useDeviceStatus, useMonitoredBeds, useSoapNotes } from '../../api/queries';
import { getDatosExtra, getSignosExtra, useExtra } from '../../api/sinBackend';
import { AiIdeasCard, AppLink, BackButton, Badge, Button, Card, Divider, PatientLayout, SoapSections, usePatient, type PatientView } from '../../components';
import { EcgLive } from '../../components/monitor/EcgLive';
import { alertInfoFrom, attendedAlerts, CONFIRM_PATH, type AttendedState, type ConfirmState } from '../../data/alerts';
import { toSoapSections } from '../../data/soap';
import { alertTitle, alertValueText, esActiva, groupAlerts, vitalTone } from '../../lib/alerts';
import { AnterioresSinAtender } from '../../components/ui/AnterioresSinAtender';
import { fmtAgo, fmtDate, fmtDateTime, staffName } from '../../lib/clinical';

const SELF = '/MedPacienteResumen';

const TONE_CLASS = { danger: 'text-danger', warning: 'text-warning', normal: 'text-white' } as const;

const BLOOD: Record<string, string> = { '+': 'Positivo', '-': 'Negativo' };

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
  const patient = usePatient();
  const v = patient.view;
  const bed = v?.bed ?? '…';
  return (
    <PatientLayout
      breadcrumb={`SIAPPC > Monitoreo > Mapa de Camas > ${bed}`}
      title={v ? `Cama ${v.bed ?? '—'} — ${v.name}` : 'Cargando…'}
      tab="resumen"
      actions={<BackButton to={v?.assigned?.unit ? `/MedMonitoreoGridUci?unidad=${encodeURIComponent(v.assigned.unit)}` : '/MedMonitoreoGridUci'}>Volver al Mapa</BackButton>}
    >
      {v && <Resumen v={v} />}
    </PatientLayout>
  );
}

function Resumen({ v }: { v: PatientView }) {
  const navigate = useNavigate();
  const location = useLocation();
  // Al volver de "Confirmar atención", la alerta atendida sale de la lista.
  const attendedId = (location.state as AttendedState | null)?.attendedId;
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!attendedId) return;
    attendedAlerts.add(attendedId);
    setTick((t) => t + 1);
    navigate(`${SELF}${location.search}`, { replace: true, state: null });
  }, [attendedId, navigate, location.search]);

  const device = v.assigned?.device ?? undefined;
  const beds = useMonitoredBeds();
  const monitored = beds.data?.find((b) => b.patientId === v.id);
  const signos = useExtra('signos', v.cedula, getSignosExtra);
  const datos = useExtra('datos', v.cedula, getDatosExtra);
  const team = useAssignments(v.id);
  const notes = useSoapNotes(v.id);
  const alerts = useAlerts({ device, limit: 500 }, !!device);
  const devices = useDeviceStatus();
  const deviceStatus = devices.data?.find((d) => d.code === device);

  const vitals = monitored?.vitals ?? { hr: v.assigned?.vitals.hr ?? null, spo2: v.assigned?.vitals.spo2 ?? null, resp: null, at: v.assigned?.vitals.at ?? null };
  const pa = signos.data?.pa;
  const VITALS: Array<[string, string, string, keyof typeof TONE_CLASS]> = [
    ['FC (Frecuencia Cardíaca)', vitals.hr?.toString() ?? '—', 'lpm', vitalTone('hr', vitals.hr)],
    ['SpO2 (Oxígeno)', vitals.spo2?.toString() ?? '—', '%', vitalTone('spo2', vitals.spo2)],
    ['PA (Presión Arterial)', pa ? `${pa.sis}/${pa.dia}` : '—', 'mmHg', vitalTone('pa', pa?.sis)],
    ['Temp (Temperatura)', signos.data ? signos.data.temp.toFixed(1) : '—', '°C', vitalTone('temp', signos.data?.temp)],
    ['FR (Frecuencia Resp.)', vitals.resp?.toString() ?? '—', 'rpm', vitalTone('resp', vitals.resp)],
  ];

  const allergies = (v.expediente?.alergias ?? []).filter((a) => a.status === 'activa');
  const blood = v.patient.bloodType ? `${v.patient.bloodType} (${BLOOD[v.patient.bloodType.slice(-1)] ?? ''})` : '—';
  const DETAILS: Array<[string, ReactNode]> = [
    ['Nombre Completo', v.name],
    ['Fecha de Nacimiento', `${fmtDate(v.patient.birthDate)} (${v.age ?? '—'} años)`],
    ['Grupo Sanguíneo', blood],
    [
      'Alergias',
      allergies.length ? (
        <span key="a" className="flex flex-wrap justify-end gap-1.5">
          {allergies.map((a) => (
            <Badge key={a.id} tone="danger" size="sm">
              {String(a.substance)}
            </Badge>
          ))}
        </span>
      ) : (
        'Sin alergias conocidas'
      ),
    ],
    ['Médico Responsable', staffName(team.data?.[0]?.name)],
    ['Diagnóstico Principal', v.mainDx ? String(v.mainDx.description) : '—'],
    ['Contacto de Emergencia', v.patient.emergencyContact ?? '—'],
    // No viene del backend: `paciente` no tiene aseguradora (src/api/sinBackend.ts).
    ['Seguro Médico', datos.data ? `${datos.data.seguro.tipo.replace(/ \(.*\)$/, '')} — Póliza ${datos.data.seguro.poliza}` : '—'],
  ];

  // La última nota que no es adenda (una adenda trae solo una sección), con cuántas adendas tiene.
  const last = notes.data?.find((n) => n.parentId === null);
  const adendas = last ? (notes.data ?? []).filter((n) => n.parentId === last.id).length : 0;
  const sinAtender = groupAlerts(alerts.data ?? []).filter((g) => !attendedAlerts.has(g.key));
  // Activas: con un aviso en los últimos 30 min; las demás sin atender van plegadas.
  const groups = sinAtender.filter((g) => esActiva(g));
  const anteriores = sinAtender.filter((g) => !esActiva(g));
  const attend = (key: string) => {
    const group = groups.find((g) => g.key === key);
    if (!group) return;
    const state: ConfirmState = { alert: alertInfoFrom(group, v), from: `${SELF}${location.search}` };
    navigate(`${CONFIRM_PATH}${location.search}`, { state });
  };
  const online = deviceStatus?.lastReadingAt ? Date.now() - Date.parse(deviceStatus.lastReadingAt) < 5 * 60_000 : false;
  // Sin dato de instalación en DeviceStatus: el equipo está puesto desde el ingreso.
  const uptimeHours = v.assigned?.admittedAt ? Math.max(1, Math.round((Date.now() - Date.parse(v.assigned.admittedAt)) / 3_600_000)) : null;

  return (
    <div className="flex w-full flex-col items-start gap-5 xl:flex-row">
      <div className="flex w-full min-w-0 flex-col gap-4 xl:max-w-[630px] xl:flex-1">
        <div className="flex w-full flex-col gap-4 rounded-xl bg-[#0b1220] p-4 drop-shadow-[0px_8px_10px_rgba(0,0,0,0.25)] sm:p-5 xl:min-h-[571px]">
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-white">{`Monitor de Signos Vitales — Cama ${v.bed ?? '—'}`}</h2>
            <div className="flex items-center gap-1.5">
              <img className="size-1.5" alt="" src={imgLiveIndicatorEllipse} />
              <p className="font-jakarta text-[12px] font-bold leading-[normal] text-success">En vivo</p>
            </div>
            <AppLink
              to="/MedPacienteConfigUmbrales"
              className="flex items-center justify-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-[10px] py-1 leading-[normal] text-subtle hover:bg-white/15"
            >
              <span className="font-inter text-[12px] font-normal">⚙</span>
              <span className="font-inter text-[11px] font-medium">Ver umbrales</span>
            </AppLink>
          </div>

          <div className="flex w-full flex-col gap-[10px] rounded-[10px] border border-ink-soft bg-[#090e17] p-3">
            <div className="flex w-full items-center justify-between font-jakarta font-bold leading-[normal]">
              <p className="text-[11px] uppercase text-subtle">ECG II</p>
              <p className="text-[12px] text-[#22c55e]">Filtro: Activo</p>
            </div>
            {/* La onda real del equipo (GET /monitoring/:device/waveform); sin equipo o sin lotes: "Sin señal de ECG". */}
            <div className="relative h-[60px] w-full overflow-hidden">
              <EcgLive device={device ?? monitored?.device} />
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            {VITALS.map(([label, value, unit, tone], i) => (
              <div key={label} className={`flex flex-col gap-1.5 rounded-lg border border-ink-soft bg-[#0b1220] p-[14px] leading-[normal] ${i === VITALS.length - 1 ? 'sm:col-span-2' : ''}`}>
                <p className="font-jakarta text-[11px] font-bold uppercase text-subtle">{label}</p>
                <div className={`flex items-baseline gap-1.5 ${TONE_CLASS[tone]}`}>
                  <p className="font-jakarta text-[28px] font-extrabold">{value}</p>
                  <p className="font-jakarta text-[12px] font-bold">{unit}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto flex w-full flex-wrap items-center justify-between gap-2 border-t border-ink-soft pt-2 text-[12px] leading-[normal] text-subtle">
            <p className="font-jakarta font-normal">{`Última actualización: ${fmtAgo(vitals.at)}`}</p>
            <p className="font-jakarta font-bold">{`Ref: ${device ?? '—'}`}</p>
          </div>
        </div>
        {/* No viene de Figma (PR 3): ideas de la IA en el espacio libre bajo el monitor, para los 8 (C4). */}
        <AiIdeasCard patientId={v.id} cedula={v.cedula} />
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
            {last && <Badge tone="neutral" size="sm">{fmtDateTime(last.at)}</Badge>}
          </div>
          {last ? (
            <>
              <div className="flex items-center gap-2">
                <img className="size-6 rounded-full object-cover" alt="" src={imgAvatar2Png} />
                <p className="font-jakarta text-[12px] font-semibold leading-[normal] text-muted">{staffName(last.authorName)}</p>
              </div>
              <Divider />
              <SoapSections note={toSoapSections(last)} size="sm" />
              {adendas > 0 && <p className="font-jakarta text-[12px] font-semibold leading-[normal] text-muted">{adendas === 1 ? "Con 1 adenda" : `Con ${adendas} adendas`}</p>}
            </>
          ) : (
            <p className="font-jakarta text-[13px] font-medium leading-[normal] text-muted">{notes.isPending ? 'Cargando…' : 'Sin notas SOAP todavía.'}</p>
          )}
        </Card>

        <Card raised padding="none" className="flex w-full flex-col gap-3 p-[18px]">
          <div className="flex w-full items-center justify-between gap-3">
            <SideTitle>Alertas Activas</SideTitle>
            <Badge tone={groups.length ? 'danger' : 'neutral'} size="sm">{groups.length}</Badge>
          </div>
          <Divider />
          <div className="flex w-full flex-col gap-3">
            {groups.length === 0 && <p className="font-jakarta text-[13px] font-medium leading-[normal] text-muted">{alerts.isPending ? 'Cargando…' : 'Sin alertas activas.'}</p>}
            {[...groups, ...anteriores].map((g, i) => {
              const fila = (
              <div key={g.key} className="flex w-full items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-[10px]">
                  <img className="size-2 shrink-0" alt="" src={g.severity === 'critica' ? imgAlertTextEllipse2 : imgAlertTextEllipse} />
                  <div className="flex min-w-0 flex-col gap-0.5 leading-[normal]">
                    <p className="font-jakarta text-[13px] font-bold text-ink">{alertTitle(g.variable, g.severity, g.latest.value)}</p>
                    <p className="font-jakarta text-[11px] font-normal text-muted">{`${alertValueText(g.variable, g.latest.value)}. ${g.count} ${g.count === 1 ? 'aviso' : 'avisos'}, el último ${fmtAgo(g.latest.at)}`}</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => attend(g.key)}>
                  Atender
                </Button>
              </div>
              );
              // Las anteriores van juntas, plegadas, después de la última activa.
              if (i < groups.length) return fila;
              return i === groups.length ? (
                <AnterioresSinAtender key="anteriores" cantidad={anteriores.length}>
                  {anteriores.map((a) => (
                    <div key={a.key} className="flex w-full items-center justify-between gap-3">
                      <div className="flex min-w-0 flex-col gap-0.5 leading-[normal]">
                        <p className="font-jakarta text-[13px] font-bold text-ink">{alertTitle(a.variable, a.severity, a.latest.value)}</p>
                        <p className="font-jakarta text-[11px] font-normal text-muted">{`${a.count} ${a.count === 1 ? 'aviso' : 'avisos'}, el último ${fmtAgo(a.latest.at)}`}</p>
                      </div>
                      <Button size="sm" variant="secondary" onClick={() => attend(a.key)}>
                        Atender
                      </Button>
                    </div>
                  ))}
                </AnterioresSinAtender>
              ) : null;
            })}
          </div>
        </Card>

        <Card raised className="flex w-full flex-col gap-[14px]">
          <div className="flex w-full items-center justify-between gap-3">
            <SideTitle>Dispositivo IoT</SideTitle>
            <Badge tone={online ? 'success' : 'neutral'} size="sm" dot>
              {online ? 'En línea' : 'Sin lecturas'}
            </Badge>
          </div>
          <Divider />
          <div className="flex w-full flex-col gap-[10px] leading-[normal]">
            <div className="flex w-full items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <img className="size-3.5" alt="" src={imgCpuIcon} />
                <p className="font-jakarta text-[12px] font-normal text-muted">ID del dispositivo</p>
              </div>
              <p className="font-jakarta text-[13px] font-bold text-ink">{device ?? '—'}</p>
            </div>
            <div className="flex w-full items-center justify-between gap-3">
              <p className="font-jakarta text-[12px] font-normal text-muted">Modelo</p>
              <p className="font-jakarta text-[13px] font-bold text-ink">{deviceStatus?.model ?? '—'}</p>
            </div>
            <div className="flex w-full items-center justify-between gap-3">
              <p className="font-jakarta text-[12px] font-normal text-muted">Uptime</p>
              <p className="font-jakarta text-[13px] font-bold text-ink">{uptimeHours ? `${uptimeHours}h continuas` : '—'}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
