// Pantalla "med/paciente/documentos-clinicos" (Figma node 191:553) — generada desde el diseño original de Figma.
import { useState } from 'react';
import imgFileText7 from '../../assets/file-text-7.svg';
import imgImageIcon from '../../assets/image-icon.svg';
import imgLabIcon from '../../assets/lab-icon.svg';
import imgUpload from '../../assets/upload.svg';
import imgUpload2 from '../../assets/upload-2.svg';
import { BackButton, Button, Card, PatientLayout } from '../../components';
import { cn } from '../../lib/cn';

const FILTERS = ['Todos', 'Laboratorio', 'Imagen', 'Consentimiento', 'Otro'];

const DOCS = [
  { icon: imgFileText7, title: 'Consentimiento Informado', meta: 'Tipo: Consentimiento · Subido por: Admisión', note: 'Firmado por paciente y familiar responsable al ingreso UCI' },
  { icon: imgLabIcon, title: 'Resultados de Laboratorio - 23 Oct 2025', meta: 'Tipo: Laboratorio · Subido por: Dr. Carlos Méndez', note: 'BH completa, QS, electrolitos séricos, gasometría arterial. Valores críticos marcados.' },
  { icon: imgImageIcon, title: 'Radiografía de Tórax AP', meta: 'Tipo: Imagen · Subido por: Radiología', note: 'Infiltrados bilaterales basales compatibles con edema pulmonar. Comparar con estudio previo 18 Oct.' },
  { icon: imgImageIcon, title: 'Ecocardiograma Transtorácico', meta: 'Tipo: Imagen · Subido por: Cardiología', note: 'FEVI 35%, hipocinesia global. Insuficiencia mitral moderada.' },
];

export default function MedPacienteDocumentosClinicos() {
  const [filter, setFilter] = useState('Todos');

  return (
    <PatientLayout
      breadcrumb="SIAPPC > Pacientes > María González > Historia Clínica > Documentos"
      title="Documentos Clínicos Adjuntos"
      tab="documentos"
      actions={<BackButton />}
    >
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tipo">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-full border border-line px-4 py-2 font-jakarta text-[13px] font-semibold leading-[normal] transition-colors',
                filter === f ? 'bg-primary text-white' : 'bg-white text-muted hover:bg-surface',
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <Button icon={<img className="size-3.5" alt="" src={imgUpload} />}>Subir documento</Button>
      </div>

      <div className="flex w-full flex-1 flex-col items-stretch gap-5 xl:flex-row">
        <ul className="flex w-full min-w-0 flex-col gap-3 xl:flex-1">
          {DOCS.map((d) => (
            <li key={d.title}>
              <Card padding="sm" className="flex w-full flex-col gap-3 sm:flex-row sm:items-start">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <img className="size-10 shrink-0" alt="" src={d.icon} />
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5 leading-[normal]">
                    <p className="truncate font-jakarta text-[14px] font-bold text-ink">{d.title}</p>
                    <p className="font-jakarta text-[11px] font-medium text-muted">{d.meta}</p>
                    <p className="font-jakarta text-[11px] font-medium italic text-muted">{d.note}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-3 pl-[52px] sm:pl-0">
                  <Button variant="secondary" size="sm">Ver</Button>
                  <Button variant="secondary" size="sm">Descargar</Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>

        <Card padding="lg" className="flex w-full min-w-0 flex-col gap-5 xl:w-[380px] xl:shrink-0">
          <h2 className="font-jakarta text-[15px] font-bold leading-[normal] text-ink">Área de Carga</h2>
          <div className="flex min-h-[220px] w-full flex-1 flex-col items-center justify-center gap-4 rounded-[10px] border border-dashed border-primary bg-surface p-8">
            <img className="size-8" alt="" src={imgUpload2} />
            <div className="flex flex-col items-center gap-2 text-center leading-[normal]">
              <p className="font-jakarta text-[13px] font-bold text-ink">Arrastra archivos aquí</p>
              <p className="font-jakarta text-[11px] font-normal text-muted">o haz clic para subir</p>
              <p className="font-jakarta text-[10px] font-semibold text-subtle">PDF, JPG, PNG - máx 10MB</p>
            </div>
          </div>
        </Card>
      </div>
    </PatientLayout>
  );
}
