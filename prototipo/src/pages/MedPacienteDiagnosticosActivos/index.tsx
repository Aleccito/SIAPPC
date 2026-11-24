// Pantalla "med/paciente/diagnosticos-activos" (Figma node 191:230) — generada desde el diseño original de Figma.
// Diagnósticos del expediente (GET /historia/:id, `diagnosticos`): activos arriba, resueltos abajo.
// La nota correlativa no existe en el backend (src/api/sinBackend.ts).
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import imgFileText6 from '../../assets/file-text-6.svg';
import { getNotaCorrelativa, saveNotaCorrelativa, useExtra } from '../../api/sinBackend';
import { BackButton, Badge, Button, Card, focusFirst, PatientLayout, Table, TextArea, usePatient, useSession, useToast, useValidation, type PatientView } from '../../components';
import { fmtDate } from '../../lib/clinical';
import { checkText } from '../../lib/validate';

const REGISTER_PATH = '/MedPacienteRegistroDiagnostico';

const TYPE: Record<string, { label: string; tone: 'success' | 'warning' | 'info' }> = {
  definitivo: { label: 'Definitivo', tone: 'success' },
  presuntivo: { label: 'Presuntivo', tone: 'warning' },
  diferencial: { label: 'Diferencial', tone: 'info' },
};

const SectionTitle = ({ children }: { children: string }) => (
  <h2 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">{children}</h2>
);

export default function MedPacienteDiagnosticosActivos() {
  const { view } = usePatient();
  return (
    <PatientLayout breadcrumb={`SIAPPC > Pacientes > ${view?.name ?? '…'} > Historia Clínica > Diagnósticos`} title="Diagnósticos y Problemas Activos" tab="historia" actions={<BackButton />}>
      {view && <Diagnosticos v={view} />}
    </PatientLayout>
  );
}

function Diagnosticos({ v }: { v: PatientView }) {
  const { can } = useSession();
  const all = v.expediente?.diagnosticos ?? [];
  const active = all.filter((d) => d.status === 'activo');
  const resolved = all.filter((d) => d.status === 'resuelto');
  const note = useExtra('correlativa', v.cedula, getNotaCorrelativa);

  return (
    <div className="flex w-full flex-col items-start gap-5 xl:flex-row">
      <div className="flex w-full min-w-0 flex-col gap-4 xl:flex-1">
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <SectionTitle>Problemas Médicos Activos</SectionTitle>
          {can('historia_clinica', 'crear') && <Button to={REGISTER_PATH}>+ Nuevo Diagnóstico</Button>}
        </div>
        <Card padding="none" className="w-full overflow-hidden">
          <Table minWidth={714}>
            <div className="flex w-full gap-3 border-b border-line bg-surface p-3 font-jakarta text-[11px] font-bold leading-[normal] text-muted">
              <p className="w-[90px] shrink-0">CIE-10</p>
              <p className="min-w-[150px] flex-1">DESCRIPCIÓN</p>
              <p className="w-[110px] shrink-0">TIPO</p>
              <p className="w-[100px] shrink-0">FECHA DX</p>
              <p className="w-[100px] shrink-0">ESTADO</p>
              <p className="w-[80px] shrink-0 text-right">ACCIONES</p>
            </div>
            {active.map((d) => {
              const type = TYPE[String(d.type)] ?? TYPE.presuntivo;
              return (
                <div key={d.id} className="flex w-full items-center gap-3 border-b border-line p-3 font-jakarta text-[13px] leading-[normal] last:border-b-0">
                  <p className="w-[90px] shrink-0 font-bold text-ink">{String(d.code ?? '—')}</p>
                  <p className="min-w-[150px] flex-1 font-semibold text-ink">{String(d.description)}</p>
                  <div className="w-[110px] shrink-0">
                    <Badge tone={type.tone}>{type.label}</Badge>
                  </div>
                  <p className="w-[100px] shrink-0 font-normal text-muted">{fmtDate(d.diagnosedOn as string | null)}</p>
                  <div className="w-[100px] shrink-0">
                    <Badge tone="danger">Activo</Badge>
                  </div>
                  <div className="flex w-[80px] shrink-0 justify-end">
                    {can('historia_clinica', 'editar') && (
                      <Button variant="link" to={`${REGISTER_PATH}?diagnostico=${d.id}`} aria-label={`Editar ${String(d.description)}`}>
                        editar
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
            {active.length === 0 && <p className="p-3 font-jakarta text-[13px] text-muted">Sin diagnósticos activos.</p>}
          </Table>
        </Card>

        <SectionTitle>Problemas Resueltos Históricos</SectionTitle>
        <Card padding="none" className="w-full overflow-hidden">
          <Table minWidth={710}>
            {resolved.map((d) => (
              <div key={d.id} className="flex w-full items-center gap-3 border-b border-line p-3 font-jakarta text-[13px] leading-[normal] last:border-b-0">
                <p className="w-[90px] shrink-0 font-bold text-muted">{String(d.code ?? '—')}</p>
                <p className="min-w-[170px] flex-1 font-semibold text-ink">{String(d.description)}</p>
                <div className="w-[110px] shrink-0">
                  <Badge tone="success">Resuelto</Badge>
                </div>
                <p className="w-[280px] shrink-0 font-normal text-muted">{`Fecha de Resolución: ${fmtDate(d.diagnosedOn as string | null)}`}</p>
              </div>
            ))}
            {resolved.length === 0 && <p className="p-3 font-jakarta text-[13px] text-muted">Sin problemas resueltos registrados.</p>}
          </Table>
        </Card>
      </div>

      {note.data !== undefined && <NotaCorrelativa key={v.cedula} cedula={v.cedula} initial={note.data} editable={can('historia_clinica', 'editar')} />}
    </div>
  );
}

function NotaCorrelativa({ cedula, initial, editable }: { cedula: string; initial: string; editable: boolean }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [note, setNote] = useState(initial);
  const form = useValidation({ 'nota-correlativa': () => checkText(note, { required: true, min: 20, max: 2000, requiredMessage: 'Escriba la nota correlativa' }) });
  const updateNote = async () => {
    form.markAll();
    if (form.errors['nota-correlativa']) {
      toast('Revise los campos marcados', 'info');
      focusFirst(['nota-correlativa']);
      return;
    }
    await saveNotaCorrelativa(cedula, note);
    await queryClient.invalidateQueries({ queryKey: ['sinBackend', 'correlativa', cedula] });
    toast('Nota actualizada');
  };

  return (
    <Card className="flex w-full min-w-0 flex-col gap-4 xl:w-[380px] xl:shrink-0">
      <div className="flex items-center gap-2">
        <img className="size-[18px]" alt="" src={imgFileText6} />
        <h2 className="font-jakarta text-[15px] font-bold leading-[normal] text-ink">Notas Clínicas Correlativas</h2>
      </div>
      <label htmlFor="nota-correlativa" className="font-jakarta text-[12px] font-normal leading-[normal] text-muted">
        Nota general sobre evolución e interrelación fisiopatológica de los diagnósticos:
      </label>
      <TextArea
        id="nota-correlativa"
        value={note}
        onChange={setNote}
        onBlur={() => form.touch('nota-correlativa')}
        tone="surface"
        leading="relaxed"
        maxLength={2000}
        aria-required
        readOnly={!editable}
        error={form.show('nota-correlativa')}
      />
      {editable && (
        <Button fullWidth onClick={() => void updateNote()}>
          Actualizar Nota
        </Button>
      )}
    </Card>
  );
}
