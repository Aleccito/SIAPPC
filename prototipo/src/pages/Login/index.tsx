// Pantalla "siappc-login" (Figma node 345:1264, página LOGIN). Entra con POST /auth/login (src/api/auth.ts).
// Con el backend real, las cuentas de backend/db/seed.sql (README de la raíz, "5. Entrar"); con el login simulado,
// cualquier dato sirve y esas cuentas entran con su rol. Después siempre viene el código de verificación.
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ApiError } from '../../api/http';
import { useSession } from '../../components/auth/session';
import { AuthButton, AuthCard, AuthDivider, AuthField, AuthLayout, IconEye, useAuthText } from '../../components';

/** Ojo tachado (contraseña visible), con el mismo trazo que el ojo de Figma. */
const EyeOff = () => (
  <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="#475569" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
    <path d="m2 2 20 20" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const { t } = useAuthText();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { signIn } = useSession();
  const volver = (useLocation().state as { volver?: string } | null)?.volver;

  const enter = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await signIn({ email, password });
      // El backend no tiene MFA: el código es un paso temporal con un valor fijo (docs/CONEXION-BACKEND.md, sección 2).
      navigate('/LoginMfa', { state: { volver } });
    } catch (e) {
      const status = e instanceof ApiError ? e.status : 0;
      setError(
        status === 400
          ? 'Escriba su correo y su contraseña.'
          : status === 401
            ? 'Correo o contraseña incorrectos.'
            : status === 429
              ? 'Demasiados intentos. Espere 15 minutos.'
              : 'No se pudo entrar. Intente de nuevo.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard title={t.loginTitle} description={t.loginText} onSubmit={() => void enter()}>
        <AuthDivider />
        <div className="flex w-full flex-col gap-[18px]">
          <AuthField
            id="login-correo"
            label={t.emailLabel}
            type="email"
            autoComplete="username"
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <AuthField
            id="login-contrasena"
            label={t.passwordLabel}
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            trailing={
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? t.hidePassword : t.showPassword}
                aria-pressed={show}
                className="-m-1 flex shrink-0 rounded p-1 hover:bg-surface"
              >
                {show ? <EyeOff /> : <IconEye size={18} className="text-muted" />}
              </button>
            }
          />
        </div>
        {error && (
          <p role="alert" className="w-full text-[13px] font-semibold leading-[normal] text-danger">
            {error}
          </p>
        )}
        <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="flex items-center gap-1.5 whitespace-nowrap text-[12px] font-semibold text-ink-muted">
            <span className="size-[5px] rounded-full bg-primary" aria-hidden="true" />
            {t.ssl}
          </p>
          <Link to="/RecuperarContrasena" state={{ email }} className="whitespace-nowrap text-[13px] font-bold text-primary hover:underline">
            {t.forgot}
          </Link>
        </div>
        <AuthButton size="lg">{t.enter}</AuthButton>
      </AuthCard>
    </AuthLayout>
  );
}
