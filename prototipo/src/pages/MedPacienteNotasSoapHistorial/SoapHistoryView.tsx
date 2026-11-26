// Lista de notas SOAP + detalle de la nota seleccionada. La usan el historial y el detalle de notas.
// Las notas son las del paciente de la URL (GET /soap/notes?patientId=…).
import { useState, type SyntheticEvent } from 'react';
import imgAvatar2Png from '../../assets/avatar-2.png';
import imgIconwrapper15 from '../../assets/iconwrapper-15.svg';
import { useSoapNotes } from '../../api/queries';
import { AppLink, Badge, Card, Divider, EmptyState, IconChevronRight, IconSliders, type PatientView, rowButton, Select, SoapSections } from '../../components';
import { soapDetailPath, toSoapSections } from '../../data/soap';
import { fmtDateTime, staffName } from '../../lib/clinical';
import { cn } from '../../lib/cn';
import { matches } from '../../lib/text';

const FILTERS = ['Todas', 'Completadas', 'En progreso'];
const stop = (e: SyntheticEvent) => e.stopPropagation();

/**
 * Historial de notas SOAP: tocar una fila la muestra a la derecha; la flecha abre su detalle.
 * Empieza con la nota más reciente seleccionada.
 */
export function SoapHistoryView({ v }: { v: PatientView }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(FILTERS[0]);
  const notesQuery = useSoapNotes(v.id);
  const notes = notesQuery.data ?? [];
  const current = notes.find((n) => n.id === selected) ?? notes[0];

  const visible = notes.filter(
    (n) =>
      (filter === 'Todas' || (filter === 'Completadas') === (n.status === 'firmada')) &&
      matches(query, fmtDateTime(n.at), n.authorName, n.subjective ?? '', n.objective ?? '', n.assessment ?? '', n.plan ?? ''),
  );

  return (
    <div className="flex w-full flex-col items-start gap-5 xl:flex-row">
      <Card className="flex w-full min-w-0 flex-col gap-4 xl:flex-1">
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">Historial de Notas SOAP</h2>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 focus-within:border-primary">
              <img className="size-3" alt="" src={imgIconwrapper15} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar notas..."
                aria-label="Buscar notas"
                className="w-[84px] min-w-0 bg-transparent font-jakarta text-[12px] font-normal leading-[normal] text-ink outline-none placeholder:text-muted"
              />
            </label>
            <Select
              variant="button"
              options={FILTERS}
              value={filter}
              onChange={setFilter}
              format={(l) => (l === 'Todas' ? 'Filtrar' : l)}
              icon={<IconSliders size={12} />}
              chevron={false}
              ariaLabel={`Filtrar notas: ${filter}`}
              align="right"
            />
          </div>
        </div>
        <ul className="flex w-full flex-col gap-[10px]">
          {visible.map((n) => {
            const isSelected = n.id === current?.id;
            const done = n.status === 'firmada';
            return (
              <li key={n.id}>
                <div
                  {...rowButton(() => setSelected(n.id))}
                  aria-pressed={isSelected}
                  aria-label={`Nota del ${fmtDateTime(n.at)}, ${staffName(n.authorName)}`}
                  className={cn(
                    'flex w-full cursor-pointer flex-col gap-3 rounded-[10px] bg-white p-4 text-left outline-none drop-shadow-[0px_2px_3px_rgba(0,0,0,0.02)] transition-colors hover:bg-surface focus-visible:bg-primary-soft sm:flex-row sm:items-center sm:gap-4',
                    isSelected ? 'border-[1.5px] border-primary' : 'border border-line',
                  )}
                >
                  <div className="flex w-full flex-col gap-1 leading-[normal] sm:w-[150px] sm:shrink-0">
                    <p className="font-jakarta text-[13px] font-bold text-ink">{fmtDateTime(n.at)}</p>
                    <p className="truncate font-jakarta text-[12px] font-normal text-muted">{staffName(n.authorName)}</p>
                  </div>
                  <p className="min-w-0 flex-1 font-jakarta text-[13px] font-normal leading-[1.4] text-ink sm:truncate">
                    {/* Una adenda (PR de conexión 2 y 3) cuelga de una nota firmada y suele traer una sola sección. */}
                    <span className="font-bold text-primary">{n.parentId ? `Adenda de NS-${n.parentId.padStart(6, '0')}: ` : 'S: '}</span>
                    {n.parentId ? (n.subjective ?? n.objective ?? n.assessment ?? n.plan ?? '—') : (n.subjective ?? '—')}
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge tone={done ? 'success' : 'warning'}>{done ? 'Completada' : 'En progreso'}</Badge>
                    <AppLink
                      to={soapDetailPath(n.id)}
                      onClick={stop}
                      onKeyDown={stop}
                      aria-label={`Abrir el detalle de la nota del ${fmtDateTime(n.at)}`}
                      title="Ver detalle"
                      className="-m-1 flex shrink-0 rounded p-1 hover:bg-line"
                    >
                      <IconChevronRight size={14} className={isSelected ? 'text-primary' : 'text-muted'} />
                    </AppLink>
                  </div>
                </div>
              </li>
            );
          })}
          {visible.length === 0 && (
            <li>
              {notesQuery.isPending ? (
                <p className="p-4 font-jakarta text-[13px] text-muted">Cargando notas…</p>
              ) : notes.length === 0 ? (
                <p className="p-4 font-jakarta text-[13px] text-muted">Este paciente todavía no tiene notas SOAP.</p>
              ) : (
                <EmptyState
                  message="Sin notas con esta búsqueda."
                  onReset={() => {
                    setQuery('');
                    setFilter(FILTERS[0]);
                  }}
                />
              )}
            </li>
          )}
        </ul>
      </Card>

      <Card raised className="flex w-full min-w-0 flex-col gap-[14px] xl:w-[380px] xl:shrink-0">
        <div className="flex w-full items-center justify-between gap-3">
          <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">Detalle de Nota Seleccionada</h2>
          {current && <Badge tone="neutral" size="sm">{fmtDateTime(current.at)}</Badge>}
        </div>
        {current ? (
          <>
            <div className="flex items-center gap-2">
              <img className="size-6 rounded-full object-cover" alt="" src={imgAvatar2Png} />
              <p className="font-jakarta text-[12px] font-semibold leading-[normal] text-muted">{staffName(current.authorName)}</p>
            </div>
            <Divider />
            <SoapSections note={toSoapSections(current)} />
          </>
        ) : (
          <p className="font-jakarta text-[13px] text-muted">Sin nota seleccionada.</p>
        )}
      </Card>
    </div>
  );
}
