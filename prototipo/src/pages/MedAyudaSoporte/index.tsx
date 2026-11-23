// Pantalla "med/ayuda/soporte" (Figma node 331:1578) — generada desde el diseño original de Figma.
import imgActivity5 from '../../assets/activity-5.svg';
import imgBook from '../../assets/book.svg';
import imgChevronDown2 from '../../assets/chevron-down-2.svg';
import imgChevronDown4 from '../../assets/chevron-down-4.svg';
import imgClipboard3 from '../../assets/clipboard-3.svg';
import imgIconAssetBe1a93ac from '../../assets/icon-asset-be1a93ac.svg';
import imgLiveIndicatorEllipse from '../../assets/live-indicator-ellipse.svg';
import imgPhone from '../../assets/phone.svg';
import imgWrench from '../../assets/wrench.svg';
import { AppLayout, Badge, Button, Card } from '../../components';

const CATEGORIES = [
  { icon: imgBook, title: 'Uso del Sistema', text: 'Guías generales y primeros pasos' },
  { icon: imgActivity5, title: 'Monitoreo y Alertas', text: 'Configuración y gestión de umbrales clínicos' },
  { icon: imgClipboard3, title: 'Notas SOAP e Historia Clínica', text: 'Documentación y registro clínico estructurado' },
  { icon: imgWrench, title: 'Problemas Técnicos / Conectividad', text: 'Diagnósticos de red y sensores inalámbricos' },
];

const FAQ = [
  {
    q: '¿Cómo confirmo una alerta?',
    a: "Para confirmar una alerta activa, presione el indicador de alerta en el panel de monitoreo y seleccione 'Confirmar Atención'. Deberá registrar brevemente la acción realizada en el paciente para archivar la alerta correctamente en el historial.",
  },
  { q: '¿Qué hago si un sensor se desconecta?' },
  { q: '¿Cómo registro una nota SOAP?' },
  { q: '¿Puedo modificar umbrales de un paciente?' },
  { q: '¿Cómo genero un reporte de turno?' },
  { q: '¿Dónde veo el historial de signos vitales?' },
];

export default function MedAyudaSoporte() {
  return (
    <AppLayout breadcrumb="SIAPPC > Ayuda y Soporte" title="Centro de Soporte" actions={<Badge tone="success" dot>Servicios Operativos</Badge>}>
      <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-7 p-4 md:p-8">
        <div className="flex w-full flex-col gap-1.5 leading-[normal]">
          <h2 className="font-jakarta text-[24px] font-extrabold text-ink">Ayuda y Soporte</h2>
          <p className="font-jakarta text-[14px] font-normal text-muted">Encuentra respuestas o contacta al equipo técnico</p>
        </div>

        <div className="flex w-full items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.02)]">
          <img className="size-[18px] shrink-0" alt="" src={imgIconAssetBe1a93ac} />
          <p className="min-w-0 flex-1 font-jakarta text-[15px] font-normal leading-[normal] text-subtle">Busca en la base de conocimiento...</p>
        </div>

        <section className="flex w-full flex-col gap-4">
          <h3 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">Base de conocimiento</h3>
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            {CATEGORIES.map((c) => (
              <Card key={c.title} raised padding="lg" className="flex items-center gap-4">
                <div className="flex shrink-0 items-center justify-center rounded-[10px] bg-primary/15 p-3">
                  <img className="size-6" alt="" src={c.icon} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1 leading-[normal]">
                  <p className="font-jakarta text-[16px] font-bold text-ink">{c.title}</p>
                  <p className="font-jakarta text-[13px] font-normal text-muted">{c.text}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="flex w-full flex-col gap-4">
          <h3 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">Preguntas frecuentes</h3>
          <div className="flex w-full flex-col gap-3">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="flex w-full flex-col gap-3 rounded-[10px] border border-line bg-white p-[18px]">
                <div className="flex w-full items-center justify-between gap-3">
                  <p className="min-w-0 flex-1 font-jakarta text-[15px] font-semibold leading-[normal] text-ink">{q}</p>
                  <img className="size-4 shrink-0" alt="" src={a ? imgChevronDown2 : imgChevronDown4} />
                </div>
                {a && <p className="w-full pt-1 font-jakarta text-[14px] font-normal leading-[22px] text-muted">{a}</p>}
              </div>
            ))}
          </div>
        </section>

        <div className="flex w-full flex-col gap-5 rounded-2xl border border-line bg-white p-6 drop-shadow-[0px_4px_8px_rgba(0,0,0,0.03)] md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="font-jakarta text-[18px] font-extrabold leading-[normal] text-ink">Contacto directo</p>
            <p className="font-jakarta text-[14px] font-normal leading-[normal] text-muted">Soporte técnico 24/7 disponible para incidencias clínicas críticas</p>
            <div className="flex items-center gap-2 pt-2">
              <img className="size-4 shrink-0" alt="" src={imgPhone} />
              <p className="whitespace-nowrap font-jakarta text-[16px] font-bold leading-[normal] text-primary">+52 800 123 4567</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
            <Button size="lg">Contactar Soporte Técnico</Button>
            <div className="flex items-center gap-1.5">
              <img className="size-1.5" alt="" src={imgLiveIndicatorEllipse} />
              <p className="font-jakarta text-[12px] font-normal leading-[normal] text-muted">Todos los sistemas operativos</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
