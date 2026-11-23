// Pantalla "siappc-login" (Figma node 345:1264, página LOGIN). Sin backend: cualquier dato sirve.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import imgEye from '../../assets/login-eye.svg';
import { AuthButton, AuthCard, AuthDivider, AuthField, AuthLayout, useAuthText } from '../../components';

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

  return (
    <AuthLayout>
      <AuthCard title={t.loginTitle} description={t.loginText} onSubmit={() => navigate('/LoginMfa')}>
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
                {show ? <EyeOff /> : <img className="size-[18px]" alt="" src={imgEye} />}
              </button>
            }
          />
        </div>
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
