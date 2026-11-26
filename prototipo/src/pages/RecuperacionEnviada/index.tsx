// Pantalla "siappc-recovery-confirmation" (Figma node 345:19, página LOGIN). Expira en 15 minutos y
// usa el dominio @institucion.org, como la pantalla de recuperación (docs/historial/REVISION.md, puntos 1 y 2).
import { useLocation } from 'react-router-dom';
import imgClock from '../../assets/login-clock.svg';
import imgMailCheck from '../../assets/login-mail-check.svg';
import { AuthBackLink, AuthCard, AuthDivider, AuthLayout, useAuthText, useCountdown, useToast } from '../../components';
import { cn } from '../../lib/cn';
import type { RecoveryState } from '../RecuperarContrasena';

/** Correo que se muestra si se llega sin haber escrito uno (cuenta del médico del README). */
const FALLBACK_EMAIL = 'medico@institucion.org';

export default function RecuperacionEnviada() {
  const toast = useToast();
  const { t } = useAuthText();
  const { state } = useLocation() as { state: RecoveryState };
  const { left, label, restart } = useCountdown(45);
  const email = state?.email || FALLBACK_EMAIL;
  const waiting = left > 0;

  return (
    <AuthLayout>
      <AuthCard
        icon={imgMailCheck}
        title={t.sentTitle}
        description={
          <>
            {t.sentBefore}
            <span className="break-all font-bold text-ink">{email}</span>
            {t.sentAfter}
          </>
        }
      >
        <AuthDivider />
        <button
          type="button"
          disabled={waiting}
          onClick={() => {
            restart();
            toast(t.linkResent, 'info');
          }}
          className={cn(
            'flex h-[52px] w-full items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-line bg-white text-[15px] font-bold text-ink-muted transition-colors',
            waiting ? 'cursor-default opacity-60' : 'hover:bg-surface',
          )}
        >
          <img className="size-4" alt="" src={imgClock} />
          {waiting ? `${t.resend} ${t.inTime(label)}` : t.resendLink}
        </button>
        <AuthDivider />
        <AuthBackLink />
      </AuthCard>
    </AuthLayout>
  );
}
