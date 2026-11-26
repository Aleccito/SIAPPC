// Alergias del paciente: verlas y, para el médico, registrarlas, corregirlas o marcarlas inactivas (docs/historial/REVISION-DETALLES.md,
// parte D). Va en el Resumen y en la subpestaña "Alergias" de Antecedentes.
//
// El backend ya tenía GET/POST/PATCH /historia/:id/alergias pero ninguna pantalla las escribía. Nada se borra: una
// alergia equivocada se corrige o pasa a "resuelta" o "descartada" y queda plegada en "Inactivas".
// Al guardar se refresca el expediente: la alergia aparece enseguida en el Resumen, la cabecera del paciente, Historia
// clínica, la hoja imprimible y "Lo que verá la IA" (la IA del backend la lee de la base en cada consulta).
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createAlergia, ESTADO_TEXTO, ESTADOS_ALERGIA, SEVERIDAD_TEXTO, SEVERIDADES, updateAlergia, type Alergia, type DatosAlergia, type EstadoAlergia, type Severidad } from '../../api/alergias';
import { ApiError } from '../../api/http';
import type { HistoriaEntry } from '../../api/types/clinical';
import { fmtDate } from '../../lib/clinical';
import { cn } from '../../lib/cn';
import { useSession } from '../auth/session';
import { DateField } from '../form/DateField';
import { TextArea } from '../form/TextArea';
import { IconPlus } from '../icons';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Modal, ModalHeader } from '../ui/Modal';
import { Select } from '../ui/Select';
import { useToast } from '../ui/Toast';

/** Una entrada genérica del expediente como alergia (el backend manda estas claves). */
export const comoAlergia = (e: HistoriaEntry): Alergia => ({
  id: e.id,
  substance: String(e.substance ?? ''),
  reaction: e.reaction ? String(e.reaction) : null,
  severity: (SEVERIDADES as readonly string[]).includes(String(e.severity)) ? (e.severity as Severidad) : 'leve',
  status: (ESTADOS_ALERGIA as readonly string[]).includes(String(e.status)) ? (e.status as EstadoAlergia) : 'activa',
  detectedOn: e.detectedOn ? String(e.detectedOn) : null,
});

export const TONO_SEVERIDAD: Record<Severidad, 'danger' | 'warning' | 'neutral'> = { anafilaxia: 'danger', grave: 'danger', moderada: 'warning', leve: 'neutral' };

const VACIO: DatosAlergia = { substance: '', reaction: '', severity: 'moderada', status: 'activa', detectedOn: '' };

function Formulario({ inicial, titulo, onCancel, onSave }: { inicial: DatosAlergia; titulo: string; onCancel: () => void; onSave: (d: DatosAlergia) => Promise<void> }) {
  const [d, setD] = useState<DatosAlergia>(inicial);
  const [intento, setIntento] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const sinSustancia = !d.substance.trim();
  const guardar = async () => {
    setIntento(true);
    if (sinSustancia) return;
    setGuardando(true);
    try {
      await onSave({ ...d, substance: d.substance.trim(), reaction: d.reaction?.trim() || undefined, detectedOn: d.detectedOn || undefined });
    } finally {
      setGuardando(false);
    }
  };
  return (
    <Modal labelledBy="alergia-titulo" onClose={onCancel} width={480} className="gap-4 p-5 shadow-xl sm:p-6">
      <ModalHeader id="alergia-titulo" title={titulo} onClose={onCancel} />
      <Input
        id="alergia-sustancia"
        label="Sustancia o medicamento"
        value={d.substance}
        maxLength={150}
        onChange={(e) => setD({ ...d, substance: e.target.value })}
        error={intento && sinSustancia ? 'Escriba la sustancia' : null}
        autoFocus
      />
      <TextArea id="alergia-reaccion" label="Reacción" value={d.reaction ?? ''} onChange={(v) => setD({ ...d, reaction: v })} maxLength={2000} minHeight={72} />
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        <Select
          variant="input"
          fieldLabel="Severidad"
          options={SEVERIDADES.map((s) => ({ value: s, label: SEVERIDAD_TEXTO[s] }))}
          value={d.severity}
          onChange={(v) => setD({ ...d, severity: v as Severidad })}
        />
        <Select
          variant="input"
          fieldLabel="Estado"
          options={ESTADOS_ALERGIA.map((s) => ({ value: s, label: ESTADO_TEXTO[s] }))}
          value={d.status}
          onChange={(v) => setD({ ...d, status: v as EstadoAlergia })}
        />
      </div>
      <DateField id="alergia-fecha" label="Fecha de detección (opcional)" value={d.detectedOn ?? ''} onChange={(v) => setD({ ...d, detectedOn: v })} max={new Date().toISOString().slice(0, 10)} />
      <div className="flex w-full flex-wrap justify-end gap-3 pt-1">
        <Button variant="secondary" onClick={onCancel} disabled={guardando}>
          Cancelar
        </Button>
        <Button onClick={() => void guardar()} disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar'}
        </Button>
      </div>
    </Modal>
  );
}

function Fila({ a, puedeEditar, onCorregir, onInactivar }: { a: Alergia; puedeEditar: boolean; onCorregir: () => void; onInactivar?: () => void }) {
  const activa = a.status === 'activa';
  return (
    <li className={cn('flex w-full flex-wrap items-start justify-between gap-3 rounded-lg border p-3', activa ? 'border-line bg-white' : 'border-line bg-surface')}>
      <div className="flex min-w-0 flex-1 flex-col gap-1 leading-[normal]">
        <div className="flex flex-wrap items-center gap-2">
          <p className={cn('font-jakarta text-[14px] font-bold', activa ? 'text-ink' : 'text-muted line-through')}>{a.substance}</p>
          <Badge tone={activa ? TONO_SEVERIDAD[a.severity] : 'neutral'} size="sm">
            {SEVERIDAD_TEXTO[a.severity].toUpperCase()}
          </Badge>
          {!activa && <Badge tone="neutral" size="sm">{ESTADO_TEXTO[a.status]}</Badge>}
        </div>
        <p className="font-jakarta text-[12px] font-normal text-muted">
          {[a.reaction || 'Sin reacción registrada', a.detectedOn && `detectada el ${fmtDate(a.detectedOn)}`].filter(Boolean).join(' · ')}
        </p>
      </div>
      {puedeEditar && (
        <div className="flex shrink-0 gap-2">
          <Button size="sm" variant="ghost" onClick={onCorregir}>
            Corregir
          </Button>
          {onInactivar && (
            <Button size="sm" variant="secondary" onClick={onInactivar}>
              Marcar inactiva
            </Button>
          )}
        </div>
      )}
    </li>
  );
}

export function AlergiasCard({ pacienteId, nombre, entradas, className }: { pacienteId: string; nombre: string; entradas: HistoriaEntry[] | undefined; className?: string }) {
  const { can } = useSession();
  const toast = useToast();
  const queryClient = useQueryClient();
  const puedeCrear = can('historia_clinica', 'crear');
  const puedeEditar = can('historia_clinica', 'editar');
  const [editando, setEditando] = useState<Alergia | 'nueva' | null>(null);
  const [inactivando, setInactivando] = useState<Alergia | null>(null);
  const [estadoInactiva, setEstadoInactiva] = useState<EstadoAlergia>('resuelta');

  const todas = (entradas ?? []).map(comoAlergia);
  const activas = todas.filter((a) => a.status === 'activa');
  const inactivas = todas.filter((a) => a.status !== 'activa');

  const fallo = (e: unknown, accion: string) =>
    toast(e instanceof ApiError && e.status === 403 ? 'Su rol no puede registrar alergias' : `No se pudo ${accion} la alergia`, 'info');
  const refrescar = () => queryClient.invalidateQueries({ queryKey: ['expediente', pacienteId] });

  const guardar = async (d: DatosAlergia) => {
    const actual = editando;
    try {
      if (actual === 'nueva') {
        await createAlergia(pacienteId, d);
        toast(`Alergia registrada · ${d.substance}`);
      } else if (actual) {
        await updateAlergia(pacienteId, actual.id, d);
        toast(`Alergia corregida · ${d.substance}`);
      }
      await refrescar();
      setEditando(null);
    } catch (e) {
      fallo(e, actual === 'nueva' ? 'registrar' : 'corregir');
    }
  };

  const inactivar = async () => {
    const a = inactivando;
    setInactivando(null);
    if (!a) return;
    try {
      await updateAlergia(pacienteId, a.id, { status: estadoInactiva });
      await refrescar();
      toast(`${a.substance}: marcada ${ESTADO_TEXTO[estadoInactiva].toLowerCase()}`);
    } catch (e) {
      fallo(e, 'actualizar');
    }
  };

  return (
    <Card raised padding="none" className={cn('flex w-full flex-col gap-3 p-[18px]', className)}>
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-jakarta text-[15px] font-extrabold leading-[normal] text-ink">Alergias</h2>
          <Badge tone={activas.length ? 'danger' : 'neutral'} size="sm">{activas.length}</Badge>
        </div>
        {puedeCrear && (
          <Button size="sm" variant="soft" icon={<IconPlus size={14} />} onClick={() => setEditando('nueva')}>
            Registrar alergia
          </Button>
        )}
      </div>
      <ul className="flex w-full flex-col gap-2">
        {activas.map((a) => (
          <Fila key={a.id} a={a} puedeEditar={puedeEditar} onCorregir={() => setEditando(a)} onInactivar={() => { setEstadoInactiva('resuelta'); setInactivando(a); }} />
        ))}
        {entradas && activas.length === 0 && <li className="font-jakarta text-[13px] font-medium text-muted">Sin alergias conocidas.</li>}
        {!entradas && <li className="font-jakarta text-[13px] font-medium text-muted">Cargando…</li>}
      </ul>
      {inactivas.length > 0 && (
        <details className="group w-full">
          <summary className="cursor-pointer list-none font-jakarta text-[12px] font-bold text-muted hover:text-ink">{`Inactivas (${inactivas.length})`}</summary>
          <ul className="mt-2 flex w-full flex-col gap-2">
            {inactivas.map((a) => (
              <Fila key={a.id} a={a} puedeEditar={puedeEditar} onCorregir={() => setEditando(a)} />
            ))}
          </ul>
        </details>
      )}

      {editando && (
        <Formulario
          titulo={editando === 'nueva' ? `Registrar alergia de ${nombre}` : `Corregir alergia a ${editando.substance}`}
          inicial={editando === 'nueva' ? VACIO : { substance: editando.substance, reaction: editando.reaction ?? '', severity: editando.severity, status: editando.status, detectedOn: editando.detectedOn ?? '' }}
          onCancel={() => setEditando(null)}
          onSave={guardar}
        />
      )}
      {inactivando && (
        <Modal labelledBy="alergia-inactiva-titulo" onClose={() => setInactivando(null)} width={440} className="gap-4 p-5 shadow-xl sm:p-6">
          <ModalHeader id="alergia-inactiva-titulo" title={`¿Marcar inactiva la alergia a ${inactivando.substance}?`} onClose={() => setInactivando(null)} />
          <p className="font-jakarta text-[13px] leading-[1.5] text-muted">
            No se borra: deja de contar como activa (para la IA, la hoja y los avisos) y queda en "Inactivas", donde se puede corregir.
          </p>
          <Select
            variant="input"
            fieldLabel="Motivo"
            options={[
              { value: 'resuelta', label: 'Resuelta (ya no la tiene)' },
              { value: 'descartada', label: 'Descartada (no era alergia)' },
            ]}
            value={estadoInactiva}
            onChange={(v) => setEstadoInactiva(v as EstadoAlergia)}
          />
          <div className="flex w-full flex-wrap justify-end gap-3 pt-1">
            <Button variant="secondary" onClick={() => setInactivando(null)}>
              Cancelar
            </Button>
            <Button onClick={() => void inactivar()}>Marcar inactiva</Button>
          </div>
        </Modal>
      )}
    </Card>
  );
}
