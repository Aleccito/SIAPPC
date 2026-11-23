// Pantalla "med/paciente/diagnosticos-activos" (Figma node 191:230) — generada desde el diseño original de Figma.
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import imgFileText6 from '../../assets/file-text-6.svg';
import { BackButton, Badge, Button, Card, PatientLayout, Table, useToast } from '../../components';

const SELF = '/MedPacienteDiagnosticosActivos';
const REGISTER_PATH = '/MedPacienteRegistroDiagnostico';

/** Al registrar un diagnóstico se vuelve aquí con este estado y aparece primero en la tabla. */
export type RegisteredState = { registered: { code: string; description: string } };

type Diagnosis = { code: string; description: string; type: 'Definitivo' | 'Presuntivo'; date: string };

const ACTIVE: Diagnosis[] = [
  { code: 'I50.9', description: 'Insuficiencia Cardíaca Congestiva', type: 'Definitivo', date: '15 Oct 2025' },
  { code: 'J81', description: 'Edema Pulmonar', type: 'Presuntivo', date: '15 Oct 2025' },
  { code: 'I10', description: 'Hipertensión Arterial', type: 'Definitivo', date: 'Año 2018' },
  { code: 'E11', description: 'Diabetes Mellitus Tipo 2', type: 'Definitivo', date: 'Año 2020' },
];

const SectionTitle = ({ children }: { children: string }) => (
  <h2 className="font-jakarta text-[16px] font-extrabold leading-[normal] text-ink">{children}</h2>
);

export default function MedPacienteDiagnosticosActivos() {
  const toast = useToast();
  const navigate = useNavigate();
  const { state } = useLocation() as { state: RegisteredState | null };
  const [rows] = useState<Diagnosis[]>(() =>
    state?.registered ? [{ ...state.registered, type: 'Presuntivo', date: 'Hoy' }, ...ACTIVE.filter((d) => d.code !== state.registered.code)] : ACTIVE,
  );
  useEffect(() => {
    if (state) navigate(SELF, { replace: true, state: null });
  }, [state, navigate]);

  return (
    <PatientLayout
      breadcrumb="SIAPPC > Pacientes > María González > Historia Clínica > Diagnósticos"
      title="Diagnósticos y Problemas Activos"
      tab="historia"
      actions={<BackButton />}
    >
      <div className="flex w-full flex-col items-start gap-5 xl:flex-row">
        <div className="flex w-full min-w-0 flex-col gap-4 xl:flex-1">
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <SectionTitle>Problemas Médicos Activos</SectionTitle>
            <Button to={REGISTER_PATH}>+ Nuevo Diagnóstico</Button>
          </div>
          <Card padding="none" className="w-full overflow-hidden">
            <Table minWidth={640}>
              <div className="flex w-full gap-3 border-b border-line bg-surface p-3 font-jakarta text-[11px] font-bold leading-[normal] text-muted">
                <p className="w-[90px] shrink-0">CIE-10</p>
                <p className="min-w-0 flex-1">DESCRIPCIÓN</p>
                <p className="w-[110px] shrink-0">TIPO</p>
                <p className="w-[100px] shrink-0">FECHA DX</p>
                <p className="w-[100px] shrink-0">ESTADO</p>
                <p className="w-[80px] shrink-0 text-right">ACCIONES</p>
              </div>
              {rows.map((d) => (
                <div key={d.code} className="flex w-full items-center gap-3 border-b border-line p-3 font-jakarta text-[13px] leading-[normal] last:border-b-0">
                  <p className="w-[90px] shrink-0 font-bold text-ink">{d.code}</p>
                  <p className="min-w-0 flex-1 font-semibold text-ink">{d.description}</p>
                  <div className="w-[110px] shrink-0">
                    <Badge tone={d.type === 'Definitivo' ? 'success' : 'warning'}>{d.type}</Badge>
                  </div>
                  <p className="w-[100px] shrink-0 font-normal text-muted">{d.date}</p>
                  <div className="w-[100px] shrink-0">
                    <Badge tone="danger">Activo</Badge>
                  </div>
                  <div className="flex w-[80px] shrink-0 justify-end">
                    <Button variant="link" to={REGISTER_PATH} aria-label={`Editar ${d.description}`}>
                      editar
                    </Button>
                  </div>
                </div>
              ))}
            </Table>
          </Card>

          <SectionTitle>Problemas Resueltos Históricos</SectionTitle>
          <Card padding="none" className="w-full overflow-hidden">
            <Table minWidth={560}>
              <div className="flex w-full items-center gap-3 p-3 font-jakarta text-[13px] leading-[normal]">
                <p className="w-[90px] shrink-0 font-bold text-muted">N39.0</p>
                <p className="min-w-0 flex-1 font-semibold text-ink">Infección de Vías Urinarias Complicada</p>
                <div className="w-[110px] shrink-0">
                  <Badge tone="success">Resuelto</Badge>
                </div>
                <p className="w-[280px] shrink-0 font-normal text-muted">Fecha de Resolución: Julio 2024</p>
              </div>
            </Table>
          </Card>
        </div>

        <Card className="flex w-full min-w-0 flex-col gap-4 xl:w-[380px] xl:shrink-0">
          <div className="flex items-center gap-2">
            <img className="size-[18px]" alt="" src={imgFileText6} />
            <h2 className="font-jakarta text-[15px] font-bold leading-[normal] text-ink">Notas Clínicas Correlativas</h2>
          </div>
          <p className="font-jakarta text-[12px] font-normal leading-[normal] text-muted">Nota general sobre evolución e interrelación fisiopatológica de los diagnósticos:</p>
          <div className="flex w-full flex-col gap-[1.5em] rounded-lg border border-line bg-surface p-3 font-jakarta text-[13px] font-normal leading-[1.5] text-ink">
            <p>Paciente ingresa con cuadro severo de descompensación de ICC secundario a crisis hipertensiva. Se identifica edema pulmonar agudo clínico y radiológico.</p>
            <p>El manejo hemodinámico requiere estrecha vigilancia metabólica debido a su antecedente de Diabetes Tipo 2. Se prioriza el uso de diuréticos de asa y soporte de ventilación no invasiva.</p>
          </div>
          <Button fullWidth onClick={() => toast('Nota actualizada')}>
            Actualizar Nota
          </Button>
        </Card>
      </div>
    </PatientLayout>
  );
}
