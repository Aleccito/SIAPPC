import { useState } from 'react';
import { IconFileText } from '../icons';
import { Button } from '../ui/Button';
import { Modal, ModalHeader } from '../ui/Modal';
import { Select } from '../ui/Select';

export type DocumentType = 'Laboratorio' | 'Imagen' | 'Consentimiento' | 'Otro';
export type UploadedDocument = { type: DocumentType; name: string };

/** Tipos de documento y un archivo de ejemplo para cada uno (no se sube nada de verdad). */
const SAMPLE_FILES: Record<DocumentType, string> = {
  Laboratorio: 'Biometria_Hematica_02Ago2026.pdf',
  Imagen: 'Rx_Torax_PA_02Ago2026.png',
  Consentimiento: 'Consentimiento_Cateter_Venoso_Central.pdf',
  Otro: 'Interconsulta_Cardiologia.pdf',
};
const TYPES = Object.keys(SAMPLE_FILES) as DocumentType[];

type UploadDocumentModalProps = {
  open: boolean;
  onClose: () => void;
  onUpload: (doc: UploadedDocument) => void;
};

/** Ventana "Subir documento": tipo de documento y archivo de ejemplo. */
export function UploadDocumentModal({ open, onClose, onUpload }: UploadDocumentModalProps) {
  const [type, setType] = useState<DocumentType>('Laboratorio');
  const name = SAMPLE_FILES[type];
  return (
    <Modal labelledBy="subir-documento-titulo" open={open} onClose={onClose} width={460} className="gap-4 p-5 shadow-xl sm:p-6">
      <ModalHeader id="subir-documento-titulo" title="Subir documento" onClose={onClose} />
      <Select variant="input" fieldLabel="Tipo de documento" options={TYPES} value={type} onChange={(v) => setType(v as DocumentType)} />
      <div className="flex flex-col gap-1.5">
        <p className="font-jakarta text-[12px] font-semibold leading-[normal] text-muted">Archivo</p>
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-primary bg-surface p-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <IconFileText size={16} />
          </span>
          <div className="flex min-w-0 flex-col gap-0.5 leading-[normal]">
            <p className="break-all font-jakarta text-[13px] font-bold text-ink">{name}</p>
            <p className="font-jakarta text-[11px] font-medium text-muted">Archivo de ejemplo · 1.2 MB</p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-wrap justify-end gap-3 pt-1">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={() => onUpload({ type, name })}>Subir</Button>
      </div>
    </Modal>
  );
}
