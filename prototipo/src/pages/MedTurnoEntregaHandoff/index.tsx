// Pantalla "med/turno/entrega-handoff" (Figma node 137:356) — generada desde el diseño original de Figma.
// Los pacientes asignados con alertas (los de entrega directa) y el resumen salen de src/api/; lo que se
// dice de cada uno y el borrador, de src/api/sinBackend.ts (la entrega de turno no existe en el backend).
import { Fragment, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getBorradorEntrega, getTurno, guardarEntrega, saveBorradorEntrega } from '../../api/sinBackend';
import { useNavigate } from 'react-router-dom';
import imgInfo from '../../assets/info.svg';
import { AppLayout, Badge, Button, Card, ConfirmDialog, Divider, focusFirst, IconFileText, rowLinkClass, Table, Tabs, TextArea, useDisplayUser, useRowLink, useToast, useValidation } from '../../components';
import { turnoDe } from '../../lib/clinical';
import { imprimirElemento } from '../../lib/imprimir';
import { usePatientRows } from '../../data/patients';
import { cn } from '../../lib/cn';
import { patientPath } from '../../lib/patientLink';
import { checkText } from '../../lib/validate';
import type { HandoffState } from '../MedTurnoHistorial';

const TURNO_TABS = [
  { id: 'nueva', label: 'Nueva Entrega', to: '/MedTurnoEntregaHandoff' },
  { id: 'historial', label: 'Historial de Entregas', to: '/MedTurnoHistorial' },
];

const CHIP = {
  danger: 'bg-danger-soft text-danger',
  info: 'bg-primary-soft text-primary',
  success: 'bg-success-soft text-success',
  warning: 'bg-[#fffbeb] text-warning',
} as const;

/** Pone en minúscula la primera letra de una frase, pero no la de una sigla (FC, SpO2, TC). */
const lowerFirst = (s: string) => (/^\p{Lu}\p{Ll}*(?![\p{L}\d])/u.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s);

export default function MedTurnoEntregaHandoff() {
  const { rows } = usePatientRows();
  const turno = useQuery({ queryKey: ['sinBackend', 'turno'], queryFn: getTurno });
  const draft = useQuery({ queryKey: ['sinBackend', 'entrega-borrador'], queryFn: getBorradorEntrega });
  // Entrega directa: los que tienen alertas (críticos y en atención); los estables solo cuentan.
  const direct = rows.filter((r) => r.state !== 'estable');
  const count = (s: string) => rows.filter((r) => r.state === s).length;
  const pendingTasks = (turno.data ?? []).filter((t) => t.tono !== 'success').length;
  const summary: Array<[string, string]> = [
    [`${rows.length} pacientes a cargo`, 'text-ink'],
    [`${count('critico')} críticos`, 'text-danger'],
    [`${count('atencion')} en atención`, 'text-primary'],
    [`${count('estable')} estables`, 'text-success'],
    [`${pendingTasks} tareas pendientes`, 'text-warning'],
  ];
  // Notas sugeridas: un renglón por cada paciente de entrega directa.
  const suggested = rows.length
    ? [
        `Se entrega guardia con ${rows.length} pacientes.`,
        ...direct.slice(0, 3).map((r) => {
          const t = turno.data?.find((x) => x.cedula === r.document);
          return t ? `Cama ${r.bed} (${r.name}): ${lowerFirst(t.novedad)}; pendiente ${lowerFirst(t.pendiente)}.` : '';
        }),
      ]
        .filter(Boolean)
        .join(' ')
    : '';
  const ready = rows.length > 0 && turno.isSuccess && draft.isSuccess;
  return ready ? (
    <Entrega key="entrega" rows={direct} todos={rows} total={rows.length} summary={summary} turno={turno.data ?? []} initialNotes={draft.data ?? suggested} />
  ) : (
    <Entrega rows={[]} todos={[]} total={0} summary={summary} turno={[]} initialNotes="" loading />
  );
}

function Entrega({
  rows,
  todos,
  total,
  summary,
  turno,
  initialNotes,
  loading,
}: {
  rows: ReturnType<typeof usePatientRows>['rows'];
  /** Todos los pacientes a cargo: van en la entrega guardada (los de `rows` son los de entrega directa). */
  todos: ReturnType<typeof usePatientRows>['rows'];
  total: number;
  summary: Array<[string, string]>;
  turno: Awaited<ReturnType<typeof getTurno>>;
  initialNotes: string;
  loading?: boolean;
}) {
  const rowLink = useRowLink();
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const me = useDisplayUser();
  // El turno de ahora, por la hora (antes era siempre "Matutino").
  const turnoActual = turnoDe();
  const contenido = useRef<HTMLDivElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [notes, setNotes] = useState(initialNotes);
  // Las notas son obligatorias para confirmar (20 a 2000 caracteres); el borrador guarda lo que haya.
  const form = useValidation({
    'entrega-notas': () => checkText(notes, { required: true, min: 20, max: 2000, requiredMessage: 'Escriba las notas de entrega' }),
  });
  const saveDraft = async () => {
    await saveBorradorEntrega(notes);
    toast('Borrador guardado');
  };
  const askConfirm = () => {
    form.markAll();
    if (form.errors['entrega-notas']) {
      toast('Revise los campos marcados', 'info');
      focusFirst(['entrega-notas']);
      return;
    }
    setConfirmOpen(true);
  };

  // SIMULADO: la entrega se guarda en el prototipo (sinBackend.ts) con lo que se ve en pantalla; nadie recibe aviso.
  const confirm = async () => {
    setConfirmOpen(false);
    await guardarEntrega({
      at: new Date().toISOString(),
      turno: `${turnoActual.nombre} (${turnoActual.horas})`,
      entrego: me.name,
      pacientes: todos.map((r) => {
        const t = turno.find((x) => x.cedula === r.document);
        return { cedula: r.document, nombre: r.name, cama: r.bed, novedad: t?.novedad ?? '', pendiente: t?.pendiente ?? '' };
      }),
      notas: notes.trim(),
    });
    await queryClient.invalidateQueries({ queryKey: ['sinBackend', 'entregas'] });
    toast('Entrega registrada (en este navegador: el sistema todavía no avisa al turno que recibe)');
    const state: HandoffState = { handedOff: true };
    navigate('/MedTurnoHistorial', { state });
  };

  return (
    <AppLayout
      breadcrumb="SIAPPC > Resumen de Turno"
      title={`Entrega de Turno — ${turnoActual.nombre}`}
      actions={
        <>
          <Badge tone="neutral">{`Turno: ${turnoActual.horas}`}</Badge>
          {/* Imprime la entrega (o la guarda en PDF desde el navegador). */}
          <Button icon={<IconFileText size={14} />} onClick={() => imprimirElemento(contenido.current, `Entrega de turno ${turnoActual.nombre}`)}>
            Generar Reporte
          </Button>
        </>
      }
    >
      <div className="w-full px-4 pt-4 md:px-8">
        <Tabs items={TURNO_TABS} active="nueva" />
      </div>
      <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-5 p-4 md:p-8 xl:flex-row">
        <div ref={contenido} className="flex w-full min-w-0 flex-col gap-5 xl:max-w-[740px] xl:flex-1">
          <Card padding="sm" className="flex w-full flex-wrap items-center gap-3">
            {summary.map(([label, color], i) => (
              <Fragment key={label}>
                {i > 0 && <span className="h-4 w-px bg-line" aria-hidden="true" />}
                <p className={`whitespace-nowrap font-jakarta text-[14px] font-bold leading-[normal] ${color}`}>{label}</p>
              </Fragment>
            ))}
          </Card>

          <Card className="flex w-full flex-col gap-3">
            <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">Pacientes de Entrega Directa</h2>
            {/* Novedades y pendientes completos en dos líneas en vez de cortarse (REVISION.md, V9). */}
            <Table minWidth={680}>
              <div className="flex w-full gap-2 bg-[#f1f5f9] p-[10px] font-jakarta text-[11px] font-bold leading-[normal] text-muted">
                <p className="w-[60px] shrink-0">CAMA</p>
                <p className="w-[130px] shrink-0">PACIENTE</p>
                <p className="w-[90px] shrink-0">ESTADO</p>
                <p className="w-[220px] shrink-0">NOVEDADES DEL TURNO</p>
                <p className="min-w-0 flex-1">PENDIENTES</p>
              </div>
              {loading && <p className="p-[10px] font-jakarta text-[13px] text-muted">Cargando pacientes…</p>}
              {rows.map((p) => {
                const t = turno.find((x) => x.cedula === p.document);
                return (
                  <div
                    key={p.id}
                    {...rowLink(patientPath('/MedPacienteResumen', p.document))}
                    aria-label={`Ver a ${p.name}, cama ${p.bed}`}
                    className={cn('flex w-full items-center gap-2 border-b border-line p-[10px] leading-[normal]', rowLinkClass)}
                  >
                    <p className="w-[60px] shrink-0 font-jakarta text-[13px] font-bold text-ink">{p.bed}</p>
                    <p className="w-[130px] shrink-0 font-jakarta text-[13px] font-semibold leading-[1.35] text-ink">
                      {p.name}
                    </p>
                    <Badge tone={p.state === 'critico' ? 'danger' : 'info'} size="sm" className="w-[90px] justify-center">
                      {p.stateLabel}
                    </Badge>
                    <p className="w-[220px] shrink-0 font-jakarta text-[12px] font-normal leading-[1.35] text-muted">{t?.novedad ?? '—'}</p>
                    <p className={`min-w-[120px] flex-1 rounded-md px-2 py-0.5 font-jakarta text-[11px] font-semibold leading-[1.35] ${CHIP[t?.tono ?? 'success']}`}>{t?.pendiente ?? '—'}</p>
                  </div>
                );
              })}
            </Table>
          </Card>

          <Card className="flex w-full flex-col gap-3">
            <h2 id="entrega-notas-titulo" className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">
              Notas Generales de Entrega
            </h2>
            <TextArea
              id="entrega-notas"
              aria-labelledby="entrega-notas-titulo"
              value={notes}
              onChange={setNotes}
              onBlur={() => form.touch('entrega-notas')}
              placeholder="Resumen general del turno para quien recibe..."
              tone="gray"
              leading="relaxed"
              minHeight={100}
              maxLength={2000}
              aria-required
              error={form.show('entrega-notas')}
            />
            <div className="flex w-full flex-wrap justify-end gap-3">
              <Button variant="secondary" disabled={loading} onClick={() => void saveDraft()}>
                Guardar Borrador
              </Button>
              <Button variant="success" disabled={loading} onClick={askConfirm}>
                Confirmar Entrega de Turno
              </Button>
            </div>
          </Card>
        </div>

        <div className="flex w-full min-w-0 flex-col xl:w-[360px] xl:shrink-0">
          <Card padding="lg" className="flex w-full flex-col gap-4">
            <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">Quién entrega</h2>
            <Divider />
            <div className="flex w-full flex-col gap-0.5 rounded-lg bg-[#f1f5f9] p-3 leading-[normal]">
              <p className="font-jakarta text-[14px] font-bold text-ink">{me.name}</p>
              <p className="font-jakarta text-[12px] font-normal text-muted">{`Turno ${turnoActual.nombre} (${turnoActual.horas})`}</p>
            </div>
            {/* SIMULADO: el backend no tiene entrega de turno ni a quién avisarle (CONEXION-BACKEND.md, pedido 11). */}
            <div className="flex w-full items-start gap-2">
              <img className="size-4 shrink-0" alt="" src={imgInfo} />
              <p className="min-w-0 flex-1 font-jakarta text-[12px] font-normal leading-[1.4] text-muted">
                Al confirmar, la entrega queda registrada en este navegador y aparece en el Historial de Entregas. Todavía no
                se le avisa a nadie: el sistema no tiene entrega de turno.
              </p>
            </div>
          </Card>
        </div>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="¿Confirmar entrega de turno?"
        confirmLabel="Confirmar entrega"
        confirmVariant="success"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirm}
      >
        {`Se registrará la entrega de ${total} pacientes del turno ${turnoActual.nombre.toLowerCase()}, con sus novedades y pendientes y estas notas.`}
      </ConfirmDialog>
    </AppLayout>
  );
}
