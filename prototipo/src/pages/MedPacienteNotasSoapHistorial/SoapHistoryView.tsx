// Lista de notas SOAP + detalle de la nota seleccionada. La usan el historial y el detalle de notas.
import { useState, type SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import imgAvatar2Png from '../../assets/avatar-2.png';
import imgChevronRight from '../../assets/chevron-right.svg';
import imgChevronRight2 from '../../assets/chevron-right-2.svg';
import imgIconwrapper15 from '../../assets/iconwrapper-15.svg';
import imgSliders from '../../assets/sliders.svg';
import { Badge, Card, Divider, EmptyState, rowButton, Select, SoapSections } from '../../components';
import { soapDetailPath, SOAP_NOTES } from '../../data/soap';
import { cn } from '../../lib/cn';
import { matches } from '../../lib/text';

const FILTERS = ['Todas', 'Completadas', 'En progreso'];
const stop = (e: SyntheticEvent) => e.stopPropagation();

/**
 * Historial de notas SOAP: tocar una fila la muestra a la derecha; la flecha abre su detalle.
 * Empieza con la nota del 24 Oct seleccionada, como en Figma.
 */
export function SoapHistoryView() {
  const [selected, setSelected] = useState(0);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(FILTERS[0]);
  const current = SOAP_NOTES[selected];

  const visible = SOAP_NOTES.map((n, i) => ({ n, i })).filter(
    ({ n }) =>
      (filter === 'Todas' || (filter === 'Completadas') === n.done) &&
      matches(query, n.date, n.doctor, n.note.s, n.note.o, n.note.a, n.note.p),
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
              icon={<img className="size-3" alt="" src={imgSliders} />}
              chevron={false}
              ariaLabel={`Filtrar notas: ${filter}`}
              align="right"
            />
          </div>
        </div>
        <ul className="flex w-full flex-col gap-[10px]">
          {visible.map(({ n, i }) => {
            const isSelected = i === selected;
            return (
              <li key={n.date}>
                <div
                  {...rowButton(() => setSelected(i))}
                  aria-pressed={isSelected}
                  aria-label={`Nota del ${n.date}, ${n.doctor}`}
                  className={cn(
                    'flex w-full cursor-pointer flex-col gap-3 rounded-[10px] bg-white p-4 text-left outline-none drop-shadow-[0px_2px_3px_rgba(0,0,0,0.02)] transition-colors hover:bg-surface focus-visible:bg-primary-soft sm:flex-row sm:items-center sm:gap-4',
                    isSelected ? 'border-[1.5px] border-primary' : 'border border-line',
                  )}
                >
                  <div className="flex w-full flex-col gap-1 leading-[normal] sm:w-[150px] sm:shrink-0">
                    <p className="font-jakarta text-[13px] font-bold text-ink">{n.date}</p>
                    <p className="truncate font-jakarta text-[12px] font-normal text-muted">{n.doctor}</p>
                  </div>
                  <p className="min-w-0 flex-1 font-jakarta text-[13px] font-normal leading-[1.4] text-ink sm:truncate">
                    <span className="font-bold text-primary">S: </span>
                    {n.summary}
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge tone={n.done ? 'success' : 'warning'}>{n.done ? 'Completada' : 'En progreso'}</Badge>
                    <Link
                      to={soapDetailPath(i)}
                      onClick={stop}
                      onKeyDown={stop}
                      aria-label={`Abrir el detalle de la nota del ${n.date}`}
                      title="Ver detalle"
                      className="-m-1 flex shrink-0 rounded p-1 hover:bg-line"
                    >
                      <img className="size-3.5" alt="" src={isSelected ? imgChevronRight : imgChevronRight2} />
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
          {visible.length === 0 && (
            <li>
              <EmptyState
                message="Sin notas con esta búsqueda."
                onReset={() => {
                  setQuery('');
                  setFilter(FILTERS[0]);
                }}
              />
            </li>
          )}
        </ul>
      </Card>

      <Card raised className="flex w-full min-w-0 flex-col gap-[14px] xl:w-[380px] xl:shrink-0">
        <div className="flex w-full items-center justify-between gap-3">
          <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">Detalle de Nota Seleccionada</h2>
          <Badge tone="neutral" size="sm">{current.date}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <img className="size-6 rounded-full object-cover" alt="" src={imgAvatar2Png} />
          <p className="font-jakarta text-[12px] font-semibold leading-[normal] text-muted">{current.doctor}</p>
        </div>
        <Divider />
        <SoapSections note={current.note} />
      </Card>
    </div>
  );
}
