// Pantalla "med/paciente/indicaciones-medicas" (Figma node 183:782) — generada desde el diseño original de Figma.
// Fármacos y soluciones: los medicamentos del expediente (GET/POST /historia/:id/medicamentos).
// Dieta, cuidados, estudios e interconsultas no existen en el backend (src/api/sinBackend.ts).
import { useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import imgBulletItemEllipse from '../../assets/bullet-item-ellipse.svg';
import imgHeart4 from '../../assets/heart-4.svg';
import { ApiError, request } from '../../api/http';
import { getIndicacionesExtra, useExtra } from '../../api/sinBackend';
import type { HistoriaEntry } from '../../api/types/clinical';
import { BackButton, Badge, Button, Card, Combobox, FieldError, IconPlus, IconSparkles, INTERACTIONS_QUESTION, Modal, ModalHeader, PatientLayout, Select, Table, useAiPanel, usePatient, useSession, useToast, useValidation, type PatientView } from '../../components';
import { checkText } from '../../lib/validate';

/** Vía del backend ⇄ abreviatura de la pantalla. */
const ROUTE_SHORT: Record<string, string> = { oral: 'VO', intravenosa: 'IV', subcutanea: 'SC', subcutánea: 'SC', inhalada: 'Inh', intramuscular: 'IM' };
const ROUTE_API: Record<string, string> = { VO: 'oral', IV: 'intravenosa', SC: 'subcutanea', IM: 'intramuscular' };
/** "cada 12 h" → "c/12h". */
const freqShort = (f: unknown) => String(f ?? '—').replace(/^cada (\d+) ?h$/i, 'c/$1h');
const isSolution = (m: HistoriaEntry) => /^soluci/i.test(String(m.name));

type Kind = 'Solución intravenosa' | 'Medicamento';
const KINDS: Kind[] = ['Solución intravenosa', 'Medicamento'];

/** Opciones de ejemplo de "Nueva indicación". La solución o el medicamento también se pueden escribir (paso 3). */
const OPTIONS: Record<Kind, { labels: [string, string, string]; values: [string[], string[], string[]] }> = {
  'Solución intravenosa': {
    labels: ['Solución / composición', 'Infusión', 'Vía'],
    values: [
      ['Solución salina 0.9% 1000ml', 'Solución Hartmann 1000ml', 'Solución Glucosada 5% 500ml', 'Solución mixta 1000ml'],
      ['42 ml/hr', '80 ml/hr', '125 ml/hr'],
      ['Vía Central', 'Periférica'],
    ],
  },
  Medicamento: {
    labels: ['Medicamento / dosis', 'Vía', 'Frecuencia'],
    values: [
      ['Furosemida 20mg', 'Paracetamol 1g', 'Ceftriaxona 1g', 'Metoclopramida 10mg', 'Insulina rápida (esquema)'],
      ['IV', 'VO', 'SC', 'IM'],
      ['c/6h', 'c/8h', 'c/12h', 'c/24h', 'PRN'],
    ],
  },
};

function NewOrderModal({ kind, onClose, onAdd }: { kind: Kind | null; onClose: () => void; onAdd: (kind: Kind, row: string[]) => void }) {
  const [type, setType] = useState<Kind>(kind ?? KINDS[0]);
  const [picked, setPicked] = useState<Record<Kind, string[]>>({
    'Solución intravenosa': OPTIONS['Solución intravenosa'].values.map((v) => v[0]),
    Medicamento: OPTIONS.Medicamento.values.map((v) => v[0]),
  });
  const { labels, values } = OPTIONS[type];
  const set = (i: number) => (v: string) => setPicked((p) => ({ ...p, [type]: p[type].map((x, j) => (j === i ? v : x)) }));
  // La primera lista (solución o medicamento) acepta texto libre: obligatorio, de 3 a 80 caracteres.
  const form = useValidation({ 'indicacion-nombre': () => checkText(picked[type][0], { required: true, min: 3, max: 80, requiredMessage: `Escriba o elija ${type === 'Medicamento' ? 'un medicamento' : 'una solución'}` }) });
  const add = () => {
    form.markAll();
    if (form.errors['indicacion-nombre']) {
      document.getElementById('indicacion-nombre')?.focus();
      return;
    }
    onAdd(type, picked[type].map((x) => x.trim()));
  };

  return (
    <Modal labelledBy="nueva-indicacion-titulo" open={kind !== null} onClose={onClose} width={480} className="gap-4 p-5 shadow-xl sm:p-6">
      <ModalHeader id="nueva-indicacion-titulo" title="Nueva indicación" onClose={onClose} />
      <Select variant="input" fieldLabel="Tipo" options={KINDS} value={type} onChange={(v) => setType(v as Kind)} />
      {labels.map((label, i) =>
        i === 0 ? (
          <div key={`${type}-${label}`} className="flex min-w-0 flex-col gap-1.5">
            <label htmlFor="indicacion-nombre" className="font-jakarta text-[12px] font-semibold leading-[normal] text-muted">
              {label}
            </label>
            <Combobox
              id="indicacion-nombre"
              label={label}
              freeText
              options={values[0].map((v) => ({ value: v, label: v }))}
              value={picked[type][0]}
              onChange={set(0)}
              onBlur={() => form.touch('indicacion-nombre')}
              placeholder="Escriba o elija de la lista…"
              error={form.show('indicacion-nombre')}
            />
            <FieldError forId="indicacion-nombre" error={form.show('indicacion-nombre')} />
          </div>
        ) : (
          <Select key={`${type}-${label}`} variant="input" fieldLabel={label} options={values[i]} value={picked[type][i]} onChange={set(i)} />
        ),
      )}
      <div className="flex w-full flex-wrap justify-end gap-3 pt-1">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={add}>Agregar indicación</Button>
      </div>
    </Modal>
  );
}

const CardHeading = ({ children }: { children: ReactNode }) => <h2 className="font-jakarta text-[15px] font-bold leading-[normal] text-ink">{children}</h2>;

function OrdersTable({ head, rows, firstWidth }: { head: string[]; rows: string[][]; firstWidth: string }) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-line">
      <Table minWidth={680}>
        <div className="flex w-full items-center border-b border-line bg-surface px-3 py-[10px] font-jakarta text-[11px] font-bold uppercase leading-[normal] text-muted">
          <p className={`${firstWidth} min-w-[136px]`}>{head[0]}</p>
          <p className="w-[180px] shrink-0">{head[1]}</p>
          <p className="w-[240px] shrink-0">{head[2]}</p>
          <p className="w-[100px] shrink-0">ESTADO</p>
        </div>
        {rows.map(([name, a, b]) => (
          <div key={name} className="flex w-full items-center border-b border-line p-3 font-jakarta text-[13px] leading-[normal] text-ink last:border-b-0">
            <p className={`${firstWidth} min-w-[136px] font-bold`}>{name}</p>
            <p className="w-[180px] shrink-0 font-medium">{a}</p>
            <p className="w-[240px] shrink-0 font-medium">{b}</p>
            <div className="w-[100px] shrink-0">
              <Badge tone="success">Activa</Badge>
            </div>
          </div>
        ))}
      </Table>
    </div>
  );
}

export default function MedPacienteIndicacionesMedicas() {
  const { view } = usePatient();
  const { can } = useSession();
  // null = ventana cerrada; si no, el tipo con el que se abre.
  const [modal, setModal] = useState<Kind | null>(null);
  const canAdd = can('historia_clinica', 'crear');
  return (
    <PatientLayout
      breadcrumb={`SIAPPC > Pacientes > ${view?.name ?? '…'} > Indicaciones Médicas`}
      title="Indicaciones Médicas"
      tab="historia"
      actions={
        <>
          <BackButton />
          {canAdd && (
            <Button icon={<IconPlus size={14} />} onClick={() => setModal('Solución intravenosa')}>
              Nueva Indicación
            </Button>
          )}
        </>
      }
    >
      {view && <Indicaciones v={view} modal={modal} setModal={setModal} canAdd={canAdd} />}
    </PatientLayout>
  );
}

function Indicaciones({ v, modal, setModal, canAdd }: { v: PatientView; modal: Kind | null; setModal: (k: Kind | null) => void; canAdd: boolean }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const extra = useExtra('indicaciones', v.cedula, getIndicacionesExtra).data;
  const ai = useAiPanel();
  const active = (v.expediente?.medicamentos ?? []).filter((m) => m.status === 'activo');
  const solutions = [
    ...active.filter(isSolution).map((m) => [`${String(m.name)}${m.dose ? ` ${m.dose}` : ''}`, String(m.frequency ?? '—'), ROUTE_SHORT[String(m.route)] === 'IV' ? 'Periférica' : String(m.route ?? '—')]),
    ...(extra?.soluciones ?? []),
  ];
  const meds = active.filter((m) => !isSolution(m)).map((m) => [`${String(m.name)} ${String(m.dose ?? '')}`.trim(), ROUTE_SHORT[String(m.route)] ?? String(m.route ?? '—'), freqShort(m.frequency)]);

  const add = async (kind: Kind, row: string[]) => {
    const body =
      kind === 'Medicamento'
        ? { name: row[0], dose: null, route: ROUTE_API[row[1]] ?? row[1], frequency: row[2], status: 'activo', startedOn: new Date().toISOString().slice(0, 10) }
        : { name: row[0], dose: null, route: 'intravenosa', frequency: row[1], indication: row[2], status: 'activo', startedOn: new Date().toISOString().slice(0, 10) };
    try {
      await request(`/historia/${v.id}/medicamentos`, { method: 'POST', body: JSON.stringify(body) });
      await queryClient.invalidateQueries({ queryKey: ['expediente', v.id] });
      setModal(null);
      toast(`Indicación agregada · ${row[0]}`);
    } catch (e) {
      toast(e instanceof ApiError && e.status === 403 ? 'Su rol no puede indicar medicamentos' : 'No se pudo agregar la indicación', 'info');
    }
  };

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <Card className="flex w-full flex-col gap-[14px]">
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <CardHeading>Soluciones Intravenosas</CardHeading>
            {canAdd && (
              <Button variant="soft" size="sm" onClick={() => setModal('Solución intravenosa')}>
                + Agregar Solución
              </Button>
            )}
          </div>
          <OrdersTable head={['SOLUCIÓN / COMPOSICIÓN', 'INFUSIÓN', 'VÍA']} rows={solutions} firstWidth="flex-1" />
        </Card>

        <Card className="flex w-full flex-col gap-[14px]">
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <CardHeading>Medicamentos Farmacológicos</CardHeading>
            <div className="flex flex-wrap items-center gap-2">
              {/* No viene de Figma (PR 3): antes de indicar, revisar alergias e interacciones (el aviso del backend lo pide). */}
              {ai.available && (
                <Button variant="ghost" size="sm" icon={<IconSparkles size={14} />} onClick={() => ai.open({ cedula: v.cedula, question: INTERACTIONS_QUESTION })}>
                  Revisar interacciones con IA
                </Button>
              )}
              {canAdd && (
                <Button variant="soft" size="sm" onClick={() => setModal('Medicamento')}>
                  + Agregar Medicamento
                </Button>
              )}
            </div>
          </div>
          <OrdersTable head={['MEDICAMENTO / DOSIS', 'VÍA', 'FRECUENCIA']} rows={meds} firstWidth="flex-1" />
        </Card>

        <div className="grid w-full grid-cols-1 items-start gap-4 xl:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-4">
            <Card className="flex w-full flex-col gap-3">
              <CardHeading>Dieta e Hidratación</CardHeading>
              <div className="flex flex-wrap items-center gap-3">
                {(extra?.dieta ?? []).map((d) => (
                  <span key={d} className="rounded-lg bg-primary-soft px-3 py-1.5 font-jakarta text-[13px] font-bold leading-[normal] text-primary">
                    {d}
                  </span>
                ))}
                {extra?.restriccion && (
                  <span className="rounded-lg bg-danger-soft px-3 py-1.5 font-jakarta text-[13px] font-bold leading-[normal] text-danger">{extra.restriccion}</span>
                )}
              </div>
            </Card>
            <Card className="flex w-full flex-col gap-3">
              <CardHeading>Cuidados Generales de Enfermería</CardHeading>
              <ul className="flex w-full flex-col gap-[10px]">
                {(extra?.cuidados ?? []).map((c) => (
                  <li key={c} className="flex w-full items-center gap-2">
                    <img className="size-1.5 shrink-0" alt="" src={imgBulletItemEllipse} />
                    <p className="min-w-0 flex-1 font-jakarta text-[13px] font-medium leading-[normal] text-ink">{c}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <Card className="flex w-full flex-col gap-3">
              <CardHeading>Estudios Solicitados</CardHeading>
              <div className="w-full overflow-hidden rounded-lg border border-line">
                <Table minWidth={360}>
                <div className="flex w-full gap-[10px] border-b border-line bg-surface px-[10px] py-2 font-jakarta text-[11px] font-bold leading-[normal] text-muted">
                  <p className="min-w-[110px] flex-1">ESTUDIO</p>
                  <p className="w-[100px] shrink-0">TIPO</p>
                  <p className="w-[110px] shrink-0">ESTADO / FECHA</p>
                </div>
                {(extra?.estudios ?? []).map(([name, type, status, tone]) => (
                  <div key={name} className="flex w-full items-center gap-[10px] border-b border-line px-[10px] py-2 leading-[normal] last:border-b-0">
                    <p className="min-w-[110px] flex-1 font-jakarta text-[12px] font-bold text-ink">{name}</p>
                    <p className="w-[100px] shrink-0 font-jakarta text-[11px] font-medium text-muted">{type}</p>
                    <div className="w-[110px] shrink-0">
                      <Badge tone={tone} size="sm">{status}</Badge>
                    </div>
                  </div>
                ))}
                </Table>
              </div>
            </Card>
            <Card className="flex w-full flex-col gap-3">
              <CardHeading>Interconsultas</CardHeading>
              {extra?.interconsulta ? (
                <div className="flex w-full items-center gap-3 rounded-lg border border-line bg-surface p-3">
                  <img className="size-8 shrink-0" alt="" src={imgHeart4} />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[normal]">
                    <p className="font-jakarta text-[13px] font-bold text-ink">{extra.interconsulta.servicio}</p>
                    <p className="font-jakarta text-[12px] font-medium text-muted">{extra.interconsulta.motivo}</p>
                  </div>
                  <Badge tone={extra.interconsulta.estado === 'Urgente' ? 'danger' : 'warning'}>{extra.interconsulta.estado}</Badge>
                </div>
              ) : (
                <p className="font-jakarta text-[13px] font-medium text-muted">Sin interconsultas.</p>
              )}
            </Card>
          </div>
        </div>
      </div>
      {/* La key reinicia la ventana con el tipo elegido cada vez que se abre. */}
      <NewOrderModal key={modal ?? 'cerrada'} kind={modal} onClose={() => setModal(null)} onAdd={(k, r) => void add(k, r)} />
    </>
  );
}
