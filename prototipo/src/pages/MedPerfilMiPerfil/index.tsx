// Pantalla "med/perfil/mi-perfil" (Figma node 137:9) — generada desde el diseño original de Figma.
import { useState, type FormEvent } from 'react';
import imgSwitchTrack from '../../assets/switch-track.svg';
import imgSwitchTrack2 from '../../assets/switch-track-2.svg';
import { AppLayout, Badge, Button, Card, CardTitle, Divider, focusFirst, Input, Modal, ModalHeader, TopBarDate, useToast, useValidation } from '../../components';
import { checkNewPassword } from '../../lib/validate';

const PRO_INFO = [
  ['Especialidad principal', 'Medicina Crítica y Terapia Intensiva'],
  ['Cédula Profesional', 'DE-882194-X'],
  ['Años de experiencia', '15 años'],
  ['Unidad asignada', 'Unidad de Cuidados Intensivos (UCI) - Camas UCI-01 a UCI-06'],
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

const QR_SIZE = 21;
/** Código QR de ejemplo (no se puede escanear): patrón fijo con las tres esquinas de un QR. */
function SampleQr() {
  const finder = (x: number, y: number) => {
    for (const [ox, oy] of [[0, 0], [QR_SIZE - 7, 0], [0, QR_SIZE - 7]]) {
      const dx = x - ox;
      const dy = y - oy;
      if (dx >= 0 && dx < 7 && dy >= 0 && dy < 7) {
        const ring = Math.min(dx, dy, 6 - dx, 6 - dy);
        return ring !== 1;
      }
    }
    return null;
  };
  const cells: Array<[number, number]> = [];
  for (let y = 0; y < QR_SIZE; y++) {
    for (let x = 0; x < QR_SIZE; x++) {
      const f = finder(x, y);
      if (f ?? (x * 7 + y * 13 + x * y) % 5 < 2) cells.push([x, y]);
    }
  }
  return (
    <svg viewBox={`-1 -1 ${QR_SIZE + 2} ${QR_SIZE + 2}`} className="size-40 shrink-0 rounded-lg border border-line bg-white" role="img" aria-label="Código QR de ejemplo">
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#0f172a" />
      ))}
    </svg>
  );
}

export default function MedPerfilMiPerfil() {
  const toast = useToast();
  const [toggles, setToggles] = useState(TOGGLES.map(([, on]) => on));
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [mfaOpen, setMfaOpen] = useState(false);
  const [mfaActive, setMfaActive] = useState(false);
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [mfaCode, setMfaCode] = useState('');
  // Contraseña nueva: 12 o más caracteres, mayúscula, número y símbolo, distinta de la actual (REVISION.md, paso 3, punto 8).
  const pwdForm = useValidation({
    'password-actual': () => (pwd.current ? null : 'Escriba su contraseña actual'),
    'password-nueva': () => checkNewPassword(pwd.next, pwd.current),
    'password-confirmar': () => (!pwd.confirm ? 'Confirme la nueva contraseña' : pwd.confirm !== pwd.next ? 'No coincide con la nueva contraseña' : null),
  });
  const mfaForm = useValidation({ 'mfa-codigo': () => (/^\d{6}$/.test(mfaCode) ? null : 'Escriba los 6 dígitos del código') });
  const closePassword = () => {
    setPasswordOpen(false);
    setPwd({ current: '', next: '', confirm: '' });
    pwdForm.reset();
  };
  const closeMfa = () => {
    setMfaOpen(false);
    setMfaCode('');
    mfaForm.reset();
  };

  const flip = (i: number) => {
    setToggles((t) => t.map((on, j) => (j === i ? !on : on)));
    toast('Preferencia guardada');
  };

  const savePassword = (e: FormEvent) => {
    e.preventDefault();
    pwdForm.markAll();
    const bad = (Object.keys(pwdForm.errors) as Array<keyof typeof pwdForm.errors>).find((k) => pwdForm.errors[k]);
    if (bad) {
      focusFirst([bad]);
      return;
    }
    closePassword();
    setPasswordChanged(true);
    toast('Contraseña actualizada');
  };

  const activateMfa = (e: FormEvent) => {
    e.preventDefault();
    mfaForm.markAll();
    if (mfaForm.errors['mfa-codigo']) {
      focusFirst(['mfa-codigo']);
      return;
    }
    closeMfa();
    setMfaActive(true);
    toast('MFA activado');
  };

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
                  {`${passwordChanged ? 'Contraseña cambiada hoy.' : 'Último cambio de contraseña hace 3 meses.'} ${
                    mfaActive ? 'MFA activo: tu cuenta pide un código al iniciar sesión.' : 'El acceso MFA añade protección crítica.'
                  }`}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-[10px]">
                <Button variant="secondary" onClick={() => setPasswordOpen(true)}>
                  Cambiar Contraseña
                </Button>
                {mfaActive ? (
                  <Badge tone="success" dot>
                    MFA activo
                  </Badge>
                ) : (
                  <Button onClick={() => setMfaOpen(true)}>Configurar MFA</Button>
                )}
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
              {TOGGLES.map(([label], i) => (
                <div key={label} className="flex w-full items-center justify-between gap-4 py-2">
                  <p id={`pref-${i}`} className="font-jakarta text-[14px] font-medium leading-[normal] text-ink">
                    {label}
                  </p>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={toggles[i]}
                    aria-labelledby={`pref-${i}`}
                    onClick={() => flip(i)}
                    className="flex shrink-0 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <img className="h-5 w-9" alt="" src={toggles[i] ? imgSwitchTrack : imgSwitchTrack2} />
                  </button>
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

      <Modal labelledBy="password-titulo" open={passwordOpen} onClose={closePassword} width={440} className="p-5 shadow-xl sm:p-6">
        <form onSubmit={savePassword} className="flex flex-col gap-4">
          <ModalHeader id="password-titulo" title="Cambiar contraseña" onClose={closePassword} />
          <Input
            id="password-actual"
            label="Contraseña actual"
            type="password"
            autoComplete="current-password"
            value={pwd.current}
            onChange={(e) => setPwd((x) => ({ ...x, current: e.target.value }))}
            onBlur={() => pwdForm.touch('password-actual')}
            error={pwdForm.show('password-actual')}
          />
          <Input
            id="password-nueva"
            label="Nueva contraseña"
            type="password"
            autoComplete="new-password"
            value={pwd.next}
            onChange={(e) => setPwd((x) => ({ ...x, next: e.target.value }))}
            onBlur={() => pwdForm.touch('password-nueva')}
            error={pwdForm.show('password-nueva')}
          />
          <Input
            id="password-confirmar"
            label="Confirmar nueva contraseña"
            type="password"
            autoComplete="new-password"
            value={pwd.confirm}
            onChange={(e) => setPwd((x) => ({ ...x, confirm: e.target.value }))}
            onBlur={() => pwdForm.touch('password-confirmar')}
            error={pwdForm.show('password-confirmar')}
          />
          <p className="font-jakarta text-[12px] font-normal leading-[1.5] text-muted">Mínimo 12 caracteres, con mayúsculas, números y un símbolo.</p>
          <div className="flex w-full flex-wrap justify-end gap-3 pt-1">
            <Button variant="secondary" onClick={closePassword}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>

      <Modal labelledBy="mfa-titulo" open={mfaOpen} onClose={closeMfa} width={520} className="p-5 shadow-xl sm:p-6">
        <form onSubmit={activateMfa} className="flex flex-col gap-4">
          <ModalHeader id="mfa-titulo" title="Configurar MFA" onClose={closeMfa} />
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            <SampleQr />
            <ol className="flex list-decimal flex-col gap-2 pl-5 font-jakarta text-[13px] font-normal leading-[1.5] text-ink">
              <li>Abre tu aplicación de autenticación (Google Authenticator, Microsoft Authenticator…).</li>
              <li>Escanea el código QR.</li>
              <li>Escribe el código de 6 dígitos que muestra la aplicación.</li>
            </ol>
          </div>
          <Input
            id="mfa-codigo"
            label="Código de verificación"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            autoComplete="one-time-code"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
            onBlur={() => mfaForm.touch('mfa-codigo')}
            error={mfaForm.show('mfa-codigo')}
          />
          <div className="flex w-full flex-wrap justify-end gap-3 pt-1">
            <Button variant="secondary" onClick={closeMfa}>
              Cancelar
            </Button>
            <Button type="submit">Activar</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
