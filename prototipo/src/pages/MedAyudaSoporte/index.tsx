// Pantalla "med/ayuda/soporte" (Figma node 331:1578) — generada desde el diseño original de Figma.
import { useState } from 'react';
import imgActivity5 from '../../assets/activity-5.svg';
import imgBook from '../../assets/book.svg';
import imgChevronDown2 from '../../assets/chevron-down-2.svg';
import imgChevronDown4 from '../../assets/chevron-down-4.svg';
import imgClipboard3 from '../../assets/clipboard-3.svg';
import imgIconAssetBe1a93ac from '../../assets/icon-asset-be1a93ac.svg';
import imgLiveIndicatorEllipse from '../../assets/live-indicator-ellipse.svg';
import imgPhone from '../../assets/phone.svg';
import imgWrench from '../../assets/wrench.svg';
import { AppLayout, Badge, Button, Card, EmptyState, Modal, ModalHeader, Select, TextArea, useToast } from '../../components';
import { cn } from '../../lib/cn';

const CATEGORIES = [
  { icon: imgBook, title: 'Uso del Sistema', text: 'Guías generales y primeros pasos' },
  { icon: imgActivity5, title: 'Monitoreo y Alertas', text: 'Configuración y gestión de umbrales clínicos' },
  { icon: imgClipboard3, title: 'Notas SOAP e Historia Clínica', text: 'Documentación y registro clínico estructurado' },
  { icon: imgWrench, title: 'Problemas Técnicos / Conectividad', text: 'Diagnósticos de red y sensores inalámbricos' },
];

// Las respuestas que no estaban en Figma son de ejemplo.
const FAQ = [
  {
    q: '¿Cómo confirmo una alerta?',
    category: 'Monitoreo y Alertas',
    a: "Para confirmar una alerta activa, presione el indicador de alerta en el panel de monitoreo y seleccione 'Confirmar Atención'. Deberá registrar brevemente la acción realizada en el paciente para archivar la alerta correctamente en el historial.",
  },
  {
    q: '¿Qué hago si un sensor se desconecta?',
    category: 'Problemas Técnicos / Conectividad',
    a: 'Revise que el cable del sensor esté bien conectado al monitor y al paciente. Si la señal no regresa en 2 minutos, reporte la falla desde Dispositivos para que el equipo técnico lo atienda.',
  },
  {
    q: '¿Cómo registro una nota SOAP?',
    category: 'Notas SOAP e Historia Clínica',
    a: "Desde el expediente del paciente, toque 'Nueva Nota SOAP', complete Subjetivo, Objetivo, Análisis y Plan y guarde. La nota aparecerá en el historial de notas SOAP.",
  },
  {
    q: '¿Puedo modificar umbrales de un paciente?',
    category: 'Monitoreo y Alertas',
    a: "Sí. En el Resumen del paciente toque 'Configurar Umbrales' para ajustar los límites mínimo y máximo y la severidad de cada signo vital.",
  },
  {
    q: '¿Cómo genero un reporte de turno?',
    category: 'Uso del Sistema',
    a: "Vaya a Reportes y abra 'Reporte de Entrega de Turno', o use 'Generar Reporte' en la pantalla de Entrega de Turno.",
  },
  {
    q: '¿Dónde veo el historial de signos vitales?',
    category: 'Monitoreo y Alertas',
    a: 'En el expediente del paciente, pestaña Monitoreo, toque el monitor para ver las tendencias de las últimas 24 horas.',
  },
];

const REASONS = ['Falla de dispositivo', 'Problema de acceso', 'Error en el sistema', 'Otro'];
const PRIORITIES = ['Alta', 'Media', 'Baja'];

export default function MedAyudaSoporte() {
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<Set<string>>(new Set([FAQ[0].q]));
  const [contactOpen, setContactOpen] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);
  const [priority, setPriority] = useState(PRIORITIES[1]);

  const q = query.trim().toLowerCase();
  const faq = FAQ.filter((f) => (!category || f.category === category) && (!q || `${f.q} ${f.a}`.toLowerCase().includes(q)));

  const toggleFaq = (question: string) =>
    setOpenFaq((s) => {
      const next = new Set(s);
      if (next.has(question)) next.delete(question);
      else next.add(question);
      return next;
    });

  const sendTicket = () => {
    setContactOpen(false);
    toast('Solicitud enviada · Folio #4821');
  };

  return (
    <AppLayout breadcrumb="SIAPPC > Ayuda y Soporte" title="Centro de Soporte" actions={<Badge tone="success" dot>Servicios Operativos</Badge>}>
      <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-7 p-4 md:p-8">
        <div className="flex w-full flex-col gap-1.5 leading-[normal]">
          <h2 className="font-jakarta text-[24px] font-extrabold text-ink">Ayuda y Soporte</h2>
          <p className="font-jakarta text-[14px] font-normal text-muted">Encuentra respuestas o contacta al equipo técnico</p>
        </div>

        <label className="flex w-full items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.02)] focus-within:border-primary">
          <img className="size-[18px] shrink-0" alt="" src={imgIconAssetBe1a93ac} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca en la base de conocimiento..."
            aria-label="Buscar en la base de conocimiento"
            className="min-w-0 flex-1 bg-transparent font-jakarta text-[15px] font-normal leading-[normal] text-ink outline-none placeholder:text-subtle"
          />
        </label>

        <section className="flex w-full flex-col gap-4">
          <h3 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">Base de conocimiento</h3>
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            {CATEGORIES.map((c) => {
              const active = category === c.title;
              return (
                <button
                  key={c.title}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(active ? null : c.title)}
                  className="rounded-xl text-left"
                >
                  <Card raised padding="lg" className={cn('flex h-full items-center gap-4 transition-colors hover:border-subtle', active && 'border-primary')}>
                    <div className="flex shrink-0 items-center justify-center rounded-[10px] bg-primary/15 p-3">
                      <img className="size-6" alt="" src={c.icon} />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1 leading-[normal]">
                      <p className="font-jakarta text-[16px] font-bold text-ink">{c.title}</p>
                      <p className="font-jakarta text-[13px] font-normal text-muted">{c.text}</p>
                    </div>
                  </Card>
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex w-full flex-col gap-4">
          <h3 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">
            Preguntas frecuentes{category && <span className="font-semibold text-muted"> · {category}</span>}
          </h3>
          <div className="flex w-full flex-col gap-3">
            {faq.length === 0 && (
              <div className="rounded-[10px] border border-line bg-white">
                <EmptyState
                  message="No hay preguntas que coincidan."
                  onReset={() => {
                    setQuery('');
                    setCategory(null);
                  }}
                />
              </div>
            )}
            {faq.map(({ q: question, a }) => {
              const open = openFaq.has(question);
              const answerId = `faq-${FAQ.findIndex((f) => f.q === question)}`;
              return (
                <div key={question} className="flex w-full flex-col gap-3 rounded-[10px] border border-line bg-white p-[18px]">
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={answerId}
                    onClick={() => toggleFaq(question)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <span className="min-w-0 flex-1 font-jakarta text-[15px] font-semibold leading-[normal] text-ink">{question}</span>
                    <img className="size-4 shrink-0" alt="" src={open ? imgChevronDown2 : imgChevronDown4} />
                  </button>
                  {open && (
                    <p id={answerId} className="w-full pt-1 font-jakarta text-[14px] font-normal leading-[22px] text-muted">
                      {a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <div className="flex w-full flex-col gap-5 rounded-2xl border border-line bg-white p-6 drop-shadow-[0px_4px_8px_rgba(0,0,0,0.03)] md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="font-jakarta text-[18px] font-extrabold leading-[normal] text-ink">Contacto directo</p>
            <p className="font-jakarta text-[14px] font-normal leading-[normal] text-muted">Soporte técnico 24/7 disponible para incidencias clínicas críticas</p>
            <a href="tel:+528001234567" className="flex items-center gap-2 pt-2 hover:underline">
              <img className="size-4 shrink-0" alt="" src={imgPhone} />
              <span className="whitespace-nowrap font-jakarta text-[16px] font-bold leading-[normal] text-primary">+52 800 123 4567</span>
            </a>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
            <Button size="lg" onClick={() => setContactOpen(true)}>
              Contactar Soporte Técnico
            </Button>
            <div className="flex items-center gap-1.5">
              <img className="size-1.5" alt="" src={imgLiveIndicatorEllipse} />
              <p className="font-jakarta text-[12px] font-normal leading-[normal] text-muted">Todos los sistemas operativos</p>
            </div>
          </div>
        </div>
      </div>

      <Modal labelledBy="contacto-titulo" open={contactOpen} onClose={() => setContactOpen(false)} width={480} className="gap-4 p-5 shadow-xl sm:p-6">
        <ModalHeader id="contacto-titulo" title="Contactar Soporte Técnico" onClose={() => setContactOpen(false)} />
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <Select variant="input" fieldLabel="Motivo" options={REASONS} value={reason} onChange={setReason} />
          <Select variant="input" fieldLabel="Prioridad" options={PRIORITIES} value={priority} onChange={setPriority} />
        </div>
        <TextArea id="contacto-descripcion" label="Descripción" rows={4} placeholder="Describe el problema (opcional)" />
        <div className="flex w-full flex-wrap justify-end gap-3 pt-1">
          <Button variant="secondary" onClick={() => setContactOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={sendTicket}>Enviar solicitud</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
