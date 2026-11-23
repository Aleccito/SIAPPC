// Pantalla "med/perfil/mi-perfil" (Figma node 137:9) — generada desde el diseño original de Figma.
import imgSwitchTrack from '../../assets/switch-track.svg';
import imgSwitchTrack2 from '../../assets/switch-track-2.svg';
import { AppLayout, Badge, Button, Card, CardTitle, Divider, TopBarDate } from '../../components';

const PRO_INFO = [
  ['Especialidad principal', 'Medicina Crítica y Terapia Intensiva'],
  ['Cédula Profesional', 'DE-882194-X'],
  ['Años de experiencia', '15 años'],
  ['Unidad asignada', 'Unidad de Cuidados Intensivos (UCI) - Cama 01 a 12'],
  ['Turno asignado', 'Matutino (07:00 AM - 15:00 PM)'],
];

const TOGGLES: Array<[string, boolean]> = [
  ['Alertas críticas en tiempo real', true],
  ['Alertas de prioridad alta', true],
  ['Nuevas asignaciones de pacientes', true],
  ['Reportes de turno semanales', false],
  ['Sonido y vibración de alerta médica', true],
];

const STATS = [
  ['Pacientes atendidos', '23', 'text-primary'],
  ['Notas SOAP registradas', '47', 'text-success'],
  ['Alertas respondidas', '31', 'text-danger'],
  ['Tiempo resp. promedio', '2.1 min', 'text-warning'],
];

export default function MedPerfilMiPerfil() {
  return (
    <AppLayout breadcrumb="SIAPPC > Mi Perfil" title="Mi Perfil" actions={<TopBarDate>24 Oct 2025, 08:30</TopBarDate>}>
      <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-6 p-4 md:p-8 xl:flex-row">
        <div className="flex w-full min-w-0 flex-col gap-5 xl:max-w-[680px] xl:flex-1">
          <Card padding="lg" className="flex w-full flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-primary">
              <p className="font-jakarta text-[28px] font-extrabold leading-[normal] text-white">CM</p>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h2 className="font-jakarta text-[22px] font-extrabold leading-[normal] text-ink">Dr. Carlos Méndez Herrera</h2>
                <Badge tone="info">Médico</Badge>
              </div>
              <div className="flex w-full flex-col gap-1 font-jakarta text-[13px] font-normal leading-[normal] text-muted">
                <p>
                  Especialidad: <span className="font-semibold text-ink">Médico Intensivista</span>
                </p>
                <p className="break-all sm:break-normal">
                  Email: <span className="font-semibold text-ink">c.mendez@hospital.gob.mx</span>
                </p>
                <p>
                  ID Empleado: <span className="font-semibold text-ink">MED-0042</span>
                </p>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="flex w-full flex-col gap-4">
            <CardTitle>Información Profesional</CardTitle>
            <Divider />
            <dl className="flex w-full flex-col gap-3 font-jakarta text-[13px] leading-[normal]">
              {PRO_INFO.map(([label, value]) => (
                <div key={label} className="flex w-full flex-wrap items-start justify-between gap-x-4 gap-y-1 py-1">
                  <dt className="font-medium text-muted">{label}</dt>
                  <dd className="font-semibold text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card padding="lg" className="flex w-full flex-col gap-4">
            <CardTitle>Seguridad y Acceso</CardTitle>
            <Divider />
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-1 flex-col gap-1 leading-[normal]">
                <p className="font-jakarta text-[14px] font-semibold text-ink">Autenticación y Seguridad</p>
                <p className="font-jakarta text-[12px] font-normal text-muted">
                  Último cambio de contraseña hace 3 meses. El acceso MFA añade protección crítica.
                </p>
              </div>
              <div className="flex flex-wrap gap-[10px]">
                <Button variant="secondary">Cambiar Contraseña</Button>
                <Button>Configurar MFA</Button>
              </div>
            </div>
            <div className="w-full border-t border-line pt-[10px]">
              <p className="font-jakarta text-[11px] font-normal leading-[normal] text-muted">
                Último inicio de sesión: Hoy 24 Oct, 07:02 AM desde IP 192.168.10.45
              </p>
            </div>
          </Card>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-5 xl:w-[420px] xl:shrink-0">
          <Card padding="lg" className="flex w-full flex-col gap-4">
            <CardTitle>Preferencias de Notificaciones</CardTitle>
            <Divider />
            <div className="flex w-full flex-col gap-1">
              {TOGGLES.map(([label, on]) => (
                <div key={label} className="flex w-full items-center justify-between gap-4 py-2">
                  <p className="font-jakarta text-[14px] font-medium leading-[normal] text-ink">{label}</p>
                  <img className="h-5 w-9 shrink-0" alt={on ? 'Activado' : 'Desactivado'} src={on ? imgSwitchTrack : imgSwitchTrack2} />
                </div>
              ))}
            </div>
          </Card>

          <Card padding="lg" className="flex w-full flex-col gap-4">
            <CardTitle>Estadísticas del Mes</CardTitle>
            <Divider />
            <div className="flex w-full flex-col gap-3 leading-[normal]">
              {STATS.map(([label, value, color]) => (
                <div key={label} className="flex w-full items-center justify-between gap-4 rounded-[10px] bg-surface p-4">
                  <p className="font-jakarta text-[13px] font-semibold text-muted">{label}</p>
                  <p className={`whitespace-nowrap font-jakarta text-[18px] font-extrabold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
