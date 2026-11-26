// Pantalla "SIAPPC - Recovery" (Figma node 345:849, página LOGIN), con la tarjeta y el campo del Login
// (docs/historial/REVISION.md, puntos 5 y 7). Sin backend: cualquier correo sirve.
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import imgAlertTriangle from '../../assets/login-alert-triangle.svg';
import imgKey from '../../assets/login-key.svg';
import { AuthBackLink, AuthButton, AuthCard, AuthField, AuthLayout, useAuthText } from '../../components';

/** Correo que viaja del Login a la recuperación y de ahí a "Revisa tu correo". */
export type RecoveryState = { email?: string } | null;

export default function RecuperarContrasena() {
  const navigate = useNavigate();
  const { t } = useAuthText();
  const { state } = useLocation() as { state: RecoveryState };
  const [email, setEmail] = useState(state?.email ?? '');

  return (
    <AuthLayout>
      <AuthCard
        icon={imgKey}
        title={t.recoverTitle}
        description={t.recoverText}
        onSubmit={() => navigate('/RecuperacionEnviada', { state: { email: email.trim() } satisfies RecoveryState })}
      >
        <AuthField
          id="recuperar-correo"
          label={t.emailLabel}
          type="email"
          autoComplete="username"
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex w-full items-center gap-[10px] rounded-[10px] border border-[#fde68a] bg-warning-soft p-3">
          <img className="size-4 shrink-0" alt="" src={imgAlertTriangle} />
          <p className="min-w-0 flex-1 text-[13px] font-medium text-[#92400e]">{t.expiry}</p>
        </div>
        <div className="flex w-full flex-col gap-3">
          <AuthButton>{t.send}</AuthButton>
          <AuthBackLink />
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
