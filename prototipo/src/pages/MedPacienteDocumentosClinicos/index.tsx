// Pantalla "med/paciente/documentos-clinicos" (Figma node 191:553) — generada desde el diseño original de Figma.
// Documentos del expediente (GET /historia/:id, `documentos`). "Subir" registra la ficha con
// POST /historia/:id/documentos: el backend todavía no guarda el archivo (docs/CONEXION-BACKEND.md, pedido 15).
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ApiError, request } from '../../api/http';
import type { HistoriaEntry } from '../../api/types/clinical';
import imgFileText7 from '../../assets/file-text-7.svg';
import imgImageIcon from '../../assets/image-icon.svg';
import imgLabIcon from '../../assets/lab-icon.svg';
import imgUpload2 from '../../assets/upload-2.svg';
import { BackButton, Button, Card, DocumentPreview, type DocumentType, EmptyState, IconUpload, PatientLayout, type PatientView, rowButton, UploadDocumentModal, usePatient, useToast } from '../../components';
import { fmtDate, staffName } from '../../lib/clinical';
import { cn } from '../../lib/cn';

const FILTERS = ['Todos', 'Laboratorio', 'Imagen', 'Consentimiento', 'Otro'];

type Doc = { id: string; icon: string; title: string; type: DocumentType; by: string; note: string; date: string };

const ICON: Record<DocumentType, string> = { Consentimiento: imgFileText7, Laboratorio: imgLabIcon, Imagen: imgImageIcon, Otro: imgFileText7 };

/** `TipoDocumento` del backend ⇄ los filtros de la pantalla. */
const FROM_API: Record<string, DocumentType> = { laboratorio: 'Laboratorio', imagenologia: 'Imagen', consentimiento: 'Consentimiento' };
const TO_API: Record<DocumentType, string> = { Laboratorio: 'laboratorio', Imagen: 'imagenologia', Consentimiento: 'consentimiento', Otro: 'otro' };

function toDoc(e: HistoriaEntry): Doc {
  const type = FROM_API[String(e.type)] ?? 'Otro';
  return {
    id: e.id,
    icon: ICON[type],
    title: String(e.title),
    type,
    // `uploadedBy` lo agrega el simulador; el backend guarda quién lo registró pero no lo devuelve.
    by: staffName((e.uploadedBy as string | undefined) ?? null),
    note: String(e.description ?? ''),
    date: fmtDate((e.documentedOn as string | null) ?? null),
  };
}

export default function MedPacienteDocumentosClinicos() {
  const { view } = usePatient();
  return (
    <PatientLayout
      breadcrumb={`SIAPPC > Pacientes > ${view?.name ?? '…'} > Historia Clínica > Documentos`}
      title="Documentos Clínicos Adjuntos"
      tab="documentos"
      actions={<BackButton />}
    >
      {view && <Documentos v={view} />}
    </PatientLayout>
  );
}

function Documentos({ v }: { v: PatientView }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('Todos');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [preview, setPreview] = useState<Doc | null>(null);
  const docs = (v.expediente?.documentos ?? []).map(toDoc);
  const shown = docs.filter((d) => filter === 'Todos' || d.type === filter);

  const upload = async (type: DocumentType, name: string) => {
    try {
      await request(`/historia/${v.id}/documentos`, {
        method: 'POST',
        body: JSON.stringify({ type: TO_API[type], title: name, description: 'Subido hace un momento.', documentedOn: new Date().toISOString().slice(0, 10), uploadedBy: 'Carlos Méndez' }),
      });
      await queryClient.invalidateQueries({ queryKey: ['expediente', v.id] });
      setUploadOpen(false);
      setFilter('Todos');
      toast(`Documento subido · ${name}`);
    } catch (e) {
      toast(e instanceof ApiError && e.status === 403 ? 'Su rol no puede subir documentos' : 'No se pudo subir el documento', 'info');
    }
  };

  return (
    <>
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
        <Button icon={<IconUpload size={14} />} onClick={() => setUploadOpen(true)}>
          Subir documento
        </Button>
      </div>

      <div className="flex w-full flex-1 flex-col items-stretch gap-5 xl:flex-row">
        <ul className="flex w-full min-w-0 flex-col gap-3 xl:flex-1">
          {shown.map((d) => (
            <li key={d.id}>
              <Card padding="sm" className="flex w-full flex-col gap-3 sm:flex-row sm:items-start">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <img className="size-10 shrink-0" alt="" src={d.icon} />
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5 leading-[normal]">
                    <p className="break-words font-jakarta text-[14px] font-bold text-ink">{d.title}</p>
                    <p className="font-jakarta text-[11px] font-medium text-muted">{`Tipo: ${d.type} · Subido por: ${d.by} · ${d.date}`}</p>
                    <p className="font-jakarta text-[11px] font-medium italic text-muted">{d.note}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-3 pl-[52px] sm:pl-0">
                  <Button variant="secondary" size="sm" onClick={() => setPreview(d)}>
                    Ver
                  </Button>
                </div>
              </Card>
            </li>
          ))}
          {shown.length === 0 && (
            <li>
              <Card padding="none">
                {docs.length === 0 ? (
                  <p className="p-4 font-jakarta text-[13px] text-muted">Este paciente todavía no tiene documentos.</p>
                ) : (
                  <EmptyState message={`Sin documentos de tipo ${filter}.`} onReset={() => setFilter('Todos')} />
                )}
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
        onUpload={({ type, name }) => void upload(type, name)}
      />
      <DocumentPreview
        open={preview !== null}
        title={preview?.title ?? ''}
        meta={
          preview
            ? [
                ['Paciente', v.name],
                ['Tipo', preview.type],
                ['Subido por', preview.by],
                ['Nota', preview.note],
              ]
            : []
        }
        onClose={() => setPreview(null)}
      />
    </>
  );
}
