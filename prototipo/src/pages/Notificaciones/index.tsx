// Pantalla "notificaciones" (Figma node 48:447) — generada desde el diseño original de Figma.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imgActivity4 from '../../assets/activity-4.svg';
import imgBell4 from '../../assets/bell-4.svg';
import imgBell5 from '../../assets/bell-5.svg';
import imgCheckCircle from '../../assets/check-circle.svg';
import imgCpu2 from '../../assets/cpu-2.svg';
import imgCpu3 from '../../assets/cpu-3.svg';
import imgUnreadIndicatorContainer from '../../assets/unread-indicator-container.svg';
import imgUsers4 from '../../assets/users-4.svg';
import { AppLayout, Button, EmptyState, IconCheck, Select, useToast } from '../../components';

type Kind = 'Alertas' | 'Pacientes' | 'Notas SOAP' | 'Reportes' | 'Sistema';
type Notification = { icon: string; iconBg: string; title: string; text: string; time: string; kind: Kind; unread?: boolean; to?: string };

const GROUPS: Array<{ label: string; items: Notification[] }> = [
  {
    label: 'Hoy',
    items: [
      { unread: true, kind: 'Alertas', to: '/MedAlertasCentro', icon: imgBell4, iconBg: 'bg-danger-soft', title: 'Alerta Crítica: Cama 03 - Elena Rodríguez', text: 'Frecuencia cardíaca superó el límite programado (145 lpm). Requiere atención.', time: 'Hace 5 min' },
      { unread: true, kind: 'Pacientes', to: '/MedPacienteResumen', icon: imgCpu2, iconBg: 'bg-primary-soft', title: 'Asignación de Paciente: Cama 08', text: 'El paciente Javier Mendoza ha sido derivado oficialmente bajo su cuidado.', time: 'Hace 1 hora' },
      { unread: true, kind: 'Reportes', to: '/MedReportesPanel', icon: imgCheckCircle, iconBg: 'bg-success-soft', title: 'Reporte Clínico Generado con éxito', text: 'El consolidado mensual de la Unidad de Cuidados Intensivos Médica está listo para descarga.', time: 'Hace 2 horas' },
    ],
  },
  {
    label: 'Ayer',
    items: [
      { kind: 'Sistema', icon: imgActivity4, iconBg: 'bg-[#dbeafe]', title: 'Actualización de Sistema Completada', text: 'SIAPPC v2.4.1 ha sido desplegada con mejoras en la latencia de monitoreo cardíaco.', time: 'Ayer, 19:40' },
      { kind: 'Notas SOAP', to: '/MedPacienteNotasSoapHistorial', icon: imgUsers4, iconBg: 'bg-[#f5f3ff]', title: 'Nueva Nota SOAP Registrada', text: 'Dra. Ana Gómez registró una nota de evolución sobre la paciente Elena Rodríguez.', time: 'Ayer, 14:12' },
      { kind: 'Alertas', to: '/MedAlertasCentro', icon: imgBell5, iconBg: 'bg-warning-soft', title: 'Alerta Temprana: Cama 12 - Ricardo Gómez', text: 'Temperatura registrada en 38.3°C. Alerta de nivel moderado enviada.', time: 'Ayer, 09:15' },
    ],
  },
  {
    label: 'Esta semana',
    items: [
      { kind: 'Pacientes', to: '/MedPacientesLista', icon: imgCheckCircle, iconBg: 'bg-success-soft', title: 'Alta de Paciente Programada', text: 'Andrés Castro (PT-8824) cuenta con pre-alta firmada para el día 26 de Octubre.', time: 'Hace 3 días' },
      { kind: 'Sistema', to: '/MedDispositivosMonitores', icon: imgCpu3, iconBg: 'bg-line', title: 'Mantenimiento Preventivo de Dispositivos', text: 'El sensor biométrico de la cama UCI-05 será recalibrado a las 14:00 horas.', time: 'Hace 4 días' },
    ],
  },
];

const TYPES = ['Todas', 'Alertas', 'Pacientes', 'Notas SOAP', 'Reportes', 'Sistema'];
const ALL_TITLES = GROUPS.flatMap((g) => g.items.map((n) => n.title));

export default function Notificaciones() {
  const navigate = useNavigate();
  const toast = useToast();
  const [type, setType] = useState('Todas');
  const [read, setRead] = useState<Set<string>>(new Set());

  const open = (n: Notification) => {
    setRead((s) => new Set(s).add(n.title));
    if (n.to) navigate(n.to);
    else toast('Notificación marcada como leída', 'info');
  };

  const markAll = () => {
    setRead(new Set(ALL_TITLES));
    toast('Todas las notificaciones marcadas como leídas');
  };

  const groups = GROUPS.map((g) => ({ ...g, items: g.items.filter((n) => type === 'Todas' || n.kind === type) })).filter((g) => g.items.length);

  return (
    <AppLayout
      breadcrumb="SIAPPC > Notificaciones"
      title="Bandeja de Notificaciones"
      actions={
        <>
          <Button variant="secondary" icon={<IconCheck size={14} />} onClick={markAll}>
            Marcar todas como leídas
          </Button>
          <Select options={TYPES} value={type} onChange={setType} format={(l) => `Tipo: ${l}`} align="right" />
        </>
      }
    >
      <div className="flex w-full min-w-0 flex-1 flex-col gap-6 p-4 md:p-8">
        {groups.length === 0 && (
          <div className="rounded-xl border border-line bg-white">
            <EmptyState onReset={() => setType('Todas')} />
          </div>
        )}
        {groups.map((group) => (
          <section key={group.label} className="flex w-full flex-col gap-[10px]">
            <h2 className="font-jakarta text-[13px] font-extrabold uppercase leading-[normal] text-muted">{group.label}</h2>
            <ul className="flex w-full flex-col gap-2">
              {group.items.map((n) => {
                const unread = n.unread && !read.has(n.title);
                return (
                  <li key={n.title}>
                    <button
                      type="button"
                      onClick={() => open(n)}
                      className="flex w-full items-center gap-3 rounded-xl border border-line bg-white p-4 text-left transition-colors hover:border-subtle sm:gap-4"
                    >
                      {unread ? <img className="size-3 shrink-0" alt="Sin leer" src={imgUnreadIndicatorContainer} /> : <span className="size-3 shrink-0" />}
                      <div className={`flex shrink-0 rounded-full p-[10px] ${n.iconBg}`}>
                        <img className="size-4" alt="" src={n.icon} />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[normal]">
                        <p className="font-jakarta text-[14px] font-extrabold text-ink">{n.title}</p>
                        <p className="font-jakarta text-[12px] font-normal text-muted">{n.text}</p>
                        <p className="font-jakarta text-[11px] font-medium text-subtle sm:hidden">{n.time}</p>
                      </div>
                      <p className="hidden w-[100px] shrink-0 text-right font-jakarta text-[11px] font-medium leading-[normal] text-subtle sm:block">{n.time}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </AppLayout>
  );
}
