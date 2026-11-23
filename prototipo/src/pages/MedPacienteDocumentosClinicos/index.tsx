// Pantalla "med/paciente/documentos-clinicos" (Figma node 191:553) — generada desde el diseño original de Figma.
import { useState } from 'react';
import imgFileText7 from '../../assets/file-text-7.svg';
import imgImageIcon from '../../assets/image-icon.svg';
import imgLabIcon from '../../assets/lab-icon.svg';
import imgUpload from '../../assets/upload.svg';
import imgUpload2 from '../../assets/upload-2.svg';
import {
  BackButton,
  Button,
  Card,
  DocumentPreview,
  EmptyState,
  PatientLayout,
  rowButton,
  UploadDocumentModal,
  useToast,
  type DocumentType,
} from '../../components';
import { cn } from '../../lib/cn';

const FILTERS = ['Todos', 'Laboratorio', 'Imagen', 'Consentimiento', 'Otro'];

type Doc = { icon: string; title: string; type: DocumentType; by: string; note: string };

const ICON: Record<DocumentType, string> = { Consentimiento: imgFileText7, Laboratorio: imgLabIcon, Imagen: imgImageIcon, Otro: imgFileText7 };

const DOCS: Doc[] = [
  { icon: imgFileText7, title: 'Consentimiento Informado', type: 'Consentimiento', by: 'Admisión', note: 'Firmado por paciente y familiar responsable al ingreso UCI' },
  { icon: imgLabIcon, title: 'Resultados de Laboratorio - 23 Oct 2025', type: 'Laboratorio', by: 'Dr. Carlos Méndez', note: 'BH completa, QS, electrolitos séricos, gasometría arterial. Valores críticos marcados.' },
  { icon: imgImageIcon, title: 'Radiografía de Tórax AP', type: 'Imagen', by: 'Radiología', note: 'Infiltrados bilaterales basales compatibles con edema pulmonar. Comparar con estudio previo 18 Oct.' },
  { icon: imgImageIcon, title: 'Ecocardiograma Transtorácico', type: 'Imagen', by: 'Cardiología', note: 'FEVI 35%, hipocinesia global. Insuficiencia mitral moderada.' },
];

export default function MedPacienteDocumentosClinicos() {
  const toast = useToast();
  const [filter, setFilter] = useState('Todos');
  const [docs, setDocs] = useState(DOCS);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [preview, setPreview] = useState<Doc | null>(null);
  const shown = docs.filter((d) => filter === 'Todos' || d.type === filter);
  const download = (title: string) => toast(`Descargando ${title}`, 'info');

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
        <Button icon={<img className="size-3.5" alt="" src={imgUpload} />} onClick={() => setUploadOpen(true)}>
          Subir documento
        </Button>
      </div>

      <div className="flex w-full flex-1 flex-col items-stretch gap-5 xl:flex-row">
        <ul className="flex w-full min-w-0 flex-col gap-3 xl:flex-1">
          {shown.map((d) => (
            <li key={d.title}>
              <Card padding="sm" className="flex w-full flex-col gap-3 sm:flex-row sm:items-start">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <img className="size-10 shrink-0" alt="" src={d.icon} />
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5 leading-[normal]">
                    <p className="break-words font-jakarta text-[14px] font-bold text-ink">{d.title}</p>
                    <p className="font-jakarta text-[11px] font-medium text-muted">{`Tipo: ${d.type} · Subido por: ${d.by}`}</p>
                    <p className="font-jakarta text-[11px] font-medium italic text-muted">{d.note}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-3 pl-[52px] sm:pl-0">
                  <Button variant="secondary" size="sm" onClick={() => setPreview(d)}>
                    Ver
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => download(d.title)}>
                    Descargar
                  </Button>
                </div>
              </Card>
            </li>
          ))}
          {shown.length === 0 && (
            <li>
              <Card padding="none">
                <EmptyState message={`Sin documentos de tipo ${filter}.`} onReset={() => setFilter('Todos')} />
              </Card>
            </li>
          )}
        </ul>

        <Card padding="lg" className="flex w-full min-w-0 flex-col gap-5 xl:w-[380px] xl:shrink-0">
          <h2 className="font-jakarta text-[15px] font-bold leading-[normal] text-ink">Área de Carga</h2>
          <div
            {...rowButton(() => setUploadOpen(true))}
            aria-label="Subir documento"
            className="flex min-h-[220px] w-full flex-1 cursor-pointer flex-col items-center justify-center gap-4 rounded-[10px] border border-dashed border-primary bg-surface p-8 outline-none transition-colors hover:bg-primary-soft focus-visible:bg-primary-soft"
          >
            <img className="size-8" alt="" src={imgUpload2} />
            <div className="flex flex-col items-center gap-2 text-center leading-[normal]">
              <p className="font-jakarta text-[13px] font-bold text-ink">Arrastra archivos aquí</p>
              <p className="font-jakarta text-[11px] font-normal text-muted">o haz clic para subir</p>
              <p className="font-jakarta text-[10px] font-semibold text-subtle">PDF, JPG, PNG - máx 10MB</p>
            </div>
          </div>
        </Card>
      </div>
      <UploadDocumentModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={({ type, name }) => {
          setUploadOpen(false);
          setDocs((all) => [{ icon: ICON[type], title: name, type, by: 'Dr. Carlos Méndez', note: 'Subido hace un momento.' }, ...all]);
          setFilter('Todos');
          toast(`Documento subido · ${name}`);
        }}
      />
      <DocumentPreview
        open={preview !== null}
        title={preview?.title ?? ''}
        meta={
          preview
            ? [
                ['Paciente', 'María González'],
                ['Tipo', preview.type],
                ['Subido por', preview.by],
                ['Nota', preview.note],
              ]
            : []
        }
        onClose={() => setPreview(null)}
        onDownload={() => preview && download(preview.title)}
      />
    </PatientLayout>
  );
}
