import { Button } from './Button';
import { Modal, ModalHeader } from './Modal';

type DocumentPreviewProps = {
  open: boolean;
  /** Nombre del archivo o del documento. */
  title: string;
  /** Datos de la cabecera de la hoja (Paciente, Tipo, Fecha…). */
  meta: Array<[string, string]>;
  onClose: () => void;
  /** Sin esto no hay botón de descarga (los documentos clínicos no guardan el archivo, pedido 15). */
  onDownload?: () => void;
};

const LINES = ['w-full', 'w-11/12', 'w-full', 'w-4/5', 'w-full', 'w-2/3'];

/** Vista previa de un reporte o documento: hoja de ejemplo con su cabecera y texto simulado. */
export function DocumentPreview({ open, title, meta, onClose, onDownload }: DocumentPreviewProps) {
  return (
    <Modal labelledBy="vista-previa-titulo" open={open} onClose={onClose} width={640} className="gap-4 p-5 shadow-xl sm:p-6">
      <ModalHeader id="vista-previa-titulo" title={<span className="break-all">{title}</span>} onClose={onClose} />
      <div className="flex w-full flex-col gap-5 rounded-lg border border-line bg-surface p-3 sm:p-5">
        <div className="flex w-full flex-col gap-5 rounded-md bg-white p-5 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
            <p className="font-jakarta text-[14px] font-extrabold leading-[normal] text-primary">SIAPPC · Hospital General</p>
            <p className="font-jakarta text-[11px] font-semibold leading-[normal] text-muted">Vista previa</p>
          </div>
          <dl className="grid grid-cols-1 gap-3 font-jakarta text-[12px] leading-[normal] sm:grid-cols-2">
            {meta.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-0.5">
                <dt className="font-semibold uppercase text-muted">{label}</dt>
                <dd className="font-semibold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          {[0, 1].map((block) => (
            <div key={block} className="flex flex-col gap-2" aria-hidden="true">
              <span className="h-2.5 w-1/3 rounded bg-line" />
              {LINES.map((w, i) => (
                <span key={i} className={`h-2 rounded bg-[#f1f5f9] ${w}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full flex-wrap justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
        {onDownload && <Button onClick={onDownload}>Descargar</Button>}
      </div>
    </Modal>
  );
}
