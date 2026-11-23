// Pantalla "med-notificaciones-centro" (Figma node 333:4) — generada desde el diseño original de Figma.
import imgBell6 from '../../assets/bell-6.svg';
import imgBell7 from '../../assets/bell-7.svg';
import imgClipboard2 from '../../assets/clipboard-2.svg';
import imgCpu4 from '../../assets/cpu-4.svg';
import imgFileText5 from '../../assets/file-text-5.svg';
import imgUnreadIndicatorContainer2 from '../../assets/unread-indicator-container-2.svg';
import imgUsers5 from '../../assets/users-5.svg';
import { AppLayout, Badge, Button, Card, Divider, IconCheck, Select } from '../../components';

type Tone = 'danger' | 'warning' | 'success' | 'info' | 'neutral';
type Row = { icon: string; iconBg: string; title: string; text: string; time: string; tag: string; tone: Tone; unread?: boolean };

const SECTIONS: Array<{ label: string; rows: Row[] }> = [
  {
    label: 'Hoy',
    rows: [
      { unread: true, icon: imgBell6, iconBg: 'bg-danger-soft', title: 'Alerta Crítica: María González - Cama C-03', text: 'SpO2 descendió a 87%. Frecuencia cardíaca 134 bpm. Requiere atención inmediata.', time: 'Hace 5 min', tag: 'Clínica', tone: 'danger' },
      { unread: true, icon: imgUsers5, iconBg: 'bg-primary-soft', title: 'Nueva Asignación de Paciente', text: 'Ricardo Gómez (PT-9102) ha sido asignado a su cargo. Cama C-09, diagnóstico: TEP.', time: 'Hace 23 min', tag: 'Asignación', tone: 'info' },
      { unread: true, icon: imgFileText5, iconBg: 'bg-success-soft', title: 'Resultados de Laboratorio Listos', text: 'BH completa y gasometría arterial de María González disponibles. 2 valores fuera de rango.', time: 'Hace 1 hora', tag: 'Laboratorio', tone: 'success' },
      { icon: imgClipboard2, iconBg: 'bg-warning-soft', title: 'Nota SOAP Pendiente - Juan Pérez', text: 'Llevas 8 horas sin registrar evolución para el paciente Juan Pérez (Cama C-05).', time: 'Hace 3 horas', tag: 'Recordatorio', tone: 'warning' },
    ],
  },
  {
    label: 'Ayer',
    rows: [
      { icon: imgBell7, iconBg: 'bg-warning-soft', title: 'Alerta Alta: Francisco Díaz - Cama C-09', text: 'Presión arterial 150/95 mmHg. Tendencia ascendente en últimas 2 horas.', time: 'Ayer, 22:15', tag: 'Clínica', tone: 'danger' },
      { icon: imgFileText5, iconBg: 'bg-success-soft', title: 'Radiografía de Tórax Disponible', text: 'Estudio de María González procesado por radiología. Disponible para revisión.', time: 'Ayer, 18:40', tag: 'Imagen', tone: 'success' },
      { icon: imgCpu4, iconBg: 'bg-[#f1f5f9]', title: 'Actualización del Sistema', text: 'Mantenimiento programado completado. Nuevas funciones de exportación de reportes disponibles.', time: 'Ayer, 06:00', tag: 'Sistema', tone: 'neutral' },
    ],
  },
  {
    label: 'Esta semana',
    rows: [
      { icon: imgUsers5, iconBg: 'bg-primary-soft', title: 'Transferencia de Paciente Completada', text: 'Sofía Martínez transferida a Dra. Lucía Torres (turno vespertino) exitosamente.', time: 'Lun, 14:30', tag: 'Asignación', tone: 'info' },
    ],
  },
];

export default function MedNotificacionesCentro() {
  return (
    <AppLayout
      breadcrumb="SIAPPC > Notificaciones"
      title="Centro de Notificaciones"
      notifications={12}
      actions={
        <>
          <Button variant="secondary" icon={<IconCheck size={14} />}>
            Marcar todas como leídas
          </Button>
          <Select>Tipo: Todas</Select>
        </>
      }
    >
      <div className="flex w-full min-w-0 flex-1 flex-col p-4 md:p-8">
        <Card padding="none" className="flex w-full flex-col p-3 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.01)]">
          {SECTIONS.map((section) => (
            <section key={section.label} className="flex w-full flex-col">
              <div className="flex w-full flex-col gap-1 pb-0.5 pt-2">
                <h2 className="font-jakarta text-[11px] font-bold uppercase leading-[normal] text-muted">{section.label}</h2>
                <Divider />
              </div>
              <ul className="flex w-full flex-col">
                {section.rows.map((r) => (
                  <li
                    key={r.title}
                    className={`flex w-full flex-wrap items-center gap-3 border-b border-line px-3 py-2 sm:flex-nowrap ${r.unread ? 'bg-primary-soft' : 'bg-white'}`}
                  >
                    <div className="flex w-14 shrink-0 items-center gap-2">
                      <img className="h-2 w-4 shrink-0" alt={r.unread ? 'Sin leer' : ''} src={imgUnreadIndicatorContainer2} />
                      <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${r.iconBg}`}>
                        <img className="size-4" alt="" src={r.icon} />
                      </div>
                    </div>
                    <div className="flex min-w-0 flex-1 basis-48 flex-col gap-0.5">
                      <p className={`font-jakarta text-[13px] leading-[normal] text-ink ${r.unread ? 'font-bold' : 'font-semibold'}`}>{r.title}</p>
                      <p className="font-jakarta text-[12px] font-normal leading-4 text-muted">{r.text}</p>
                    </div>
                    <div className="ml-[68px] flex shrink-0 items-center justify-end gap-3 sm:ml-0 sm:w-[220px]">
                      <p className="font-jakarta text-[11px] font-medium leading-[normal] text-muted sm:w-[90px] sm:text-right">{r.time}</p>
                      <Badge tone={r.tone} className="uppercase">
                        {r.tag}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </Card>
      </div>
    </AppLayout>
  );
}
