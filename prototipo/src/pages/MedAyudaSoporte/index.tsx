// Pantalla "med/ayuda/soporte" (Figma node 331:1578) — generada desde el diseño original de Figma.
import { useState } from 'react';
import imgActivity5 from '../../assets/activity-5.svg';
import imgBook from '../../assets/book.svg';
import imgClipboard3 from '../../assets/clipboard-3.svg';
import imgIconAssetBe1a93ac from '../../assets/icon-asset-be1a93ac.svg';
import imgWrench from '../../assets/wrench.svg';
import { AppLayout, Card, EmptyState, IconChevronDown } from '../../components';
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
    a: "Todavía no: los umbrales son los del sistema, iguales para todos los pacientes. En el Resumen del paciente, 'Ver umbrales' muestra cuáles son.",
  },
  {
    q: '¿Cómo genero un reporte de turno?',
    category: 'Uso del Sistema',
    a: "En Entrega de Turno, 'Generar Reporte' abre la entrega lista para imprimir o guardar en PDF. La hoja de un paciente sale de 'Generar Reporte' en su ficha o de Reportes.",
  },
  {
    q: '¿Dónde veo el historial de signos vitales?',
    category: 'Monitoreo y Alertas',
    a: 'En el expediente del paciente, pestaña Monitoreo, toque el monitor para ver las tendencias de las últimas 24 horas.',
  },
];


// "Contacto directo" (un teléfono de relleno y una solicitud con folio inventado) y la insignia "Servicios
// Operativos" se quitaron: el proyecto no tiene un canal de soporte todavía (REVISION-MEDICO.md, 6).
export default function MedAyudaSoporte() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<Set<string>>(new Set([FAQ[0].q]));

  const q = query.trim().toLowerCase();
  const faq = FAQ.filter((f) => (!category || f.category === category) && (!q || `${f.q} ${f.a}`.toLowerCase().includes(q)));

  const toggleFaq = (question: string) =>
    setOpenFaq((s) => {
      const next = new Set(s);
      if (next.has(question)) next.delete(question);
      else next.add(question);
      return next;
    });


  return (
    <AppLayout breadcrumb="SIAPPC > Ayuda y Soporte" title="Centro de Soporte">
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
                    <IconChevronDown size={16} className={open ? 'rotate-180 text-muted' : 'text-muted'} />
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

      </div>

    </AppLayout>
  );
}
