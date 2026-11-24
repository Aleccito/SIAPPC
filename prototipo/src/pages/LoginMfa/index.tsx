// Pantalla "SIAPPC - MFA" (Figma node 345:426, página LOGIN), con la tarjeta del Login (REVISION.md, punto 5).
// Paso temporal después del login: el backend no tiene MFA, así que solo pasa el código fijo 000000 (lo dice la
// pantalla). Sin pasarlo no se entra a la app. Pendiente para cuando exista (CONEXION-BACKEND.md, pedido 17).
import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import imgShield from '../../assets/login-shield.svg';
import { AuthBackLink, AuthButton, AuthCard, AuthLayout, useAuthText, useCountdown, useDisplayUser, useToast } from '../../components';
import { landingFor, useSession } from '../../components/auth/session';
import { cn } from '../../lib/cn';

const LENGTH = 6;

export default function LoginMfa() {
  const navigate = useNavigate();
  const volver = (useLocation().state as { volver?: string } | null)?.volver;
  const toast = useToast();
  const { t } = useAuthText();
  const { left, label, restart } = useCountdown(45);
  const [digits, setDigits] = useState<string[]>(() => Array(LENGTH).fill(''));
  const [error, setError] = useState(false);
  const [wrong, setWrong] = useState(false);
  const { user, mfaPending, verifyMfa } = useSession();
  const me = useDisplayUser();
  const boxes = useRef<Array<HTMLInputElement | null>>([]);

  const focus = (i: number) => boxes.current[Math.max(0, Math.min(LENGTH - 1, i))]?.focus();

  /** Escribe dígitos desde la casilla `from` (uno al teclear, varios al pegar). */
  const fill = (from: number, text: string) => {
    const chars = text.replace(/\D/g, '').slice(0, LENGTH - from).split('');
    if (!chars.length) return;
    setDigits((d) => d.map((x, i) => (i >= from && i < from + chars.length ? chars[i - from] : x)));
    setError(false);
    setWrong(false);
    focus(from + chars.length);
  };

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      e.preventDefault();
      setDigits((d) => d.map((x, j) => (j === i - 1 ? '' : x)));
      focus(i - 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focus(i - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focus(i + 1);
    }
  };

  const onPaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    fill(i, e.clipboardData.getData('text'));
  };

  const verify = () => {
    if (digits.some((d) => !d)) {
      setError(true);
      focus(digits.findIndex((d) => !d));
      return;
    }
    if (!verifyMfa(digits.join(''))) {
      setWrong(true);
      setDigits(Array(LENGTH).fill(''));
      focus(0);
      return;
    }
    toast(t.welcome(me.name));
    // Vuelve a la pantalla que pidió el Login, si la hubo (sesión vencida o enlace directo); si no, la de su rol.
    navigate(volver ?? landingFor(user?.role), { replace: true });
  };

  // Sin login hecho no hay nada que verificar; con la sesión ya abierta, tampoco.
  if (!user) return <Navigate to="/Login" replace state={{ volver }} />;
  if (!mfaPending) return <Navigate to={volver ?? landingFor(user.role)} replace />;

  return (
    <AuthLayout>
      <AuthCard icon={imgShield} title={t.mfaTitle} description={t.mfaText} onSubmit={verify}>
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full justify-center gap-2 sm:gap-3">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  boxes.current[i] = el;
                }}
                value={d}
                inputMode="numeric"
                autoComplete={i === 0 ? 'one-time-code' : 'off'}
                maxLength={LENGTH}
                placeholder="-"
                aria-label={t.digit(i + 1)}
                aria-invalid={error && !d}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '');
                  if (!v) {
                    setDigits((all) => all.map((x, j) => (j === i ? '' : x)));
                    return;
                  }
                  // Si la casilla ya tenía un dígito, el nuevo es el último que se escribió.
                  fill(i, d && v.length > 1 && v.startsWith(d) ? v.slice(1) : v);
                }}
                onKeyDown={(e) => onKeyDown(i, e)}
                onPaste={(e) => onPaste(i, e)}
                onFocus={(e) => e.target.select()}
                className={cn(
                  'h-14 w-12 min-w-0 shrink rounded-[10px] border text-center text-[18px] font-extrabold outline-none transition-colors placeholder:text-muted focus:border-primary',
                  d ? 'bg-white text-ink' : 'bg-surface text-muted',
                  error && !d ? 'border-danger' : 'border-line',
                )}
              />
            ))}
          </div>
          {(error || wrong) && (
            <p className="text-center text-[13px] font-semibold text-danger" role="alert">
              {wrong ? t.wrongCode : t.missingDigits}
            </p>
          )}
          <p className="text-center text-[12px] font-medium text-muted">{t.tempCode}</p>
        </div>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
          <span className="font-normal text-muted">{t.noCode}</span>
          <button
            type="button"
            disabled={left > 0}
            onClick={() => {
              restart();
              toast(t.codeResent, 'info');
            }}
            className="font-bold text-primary enabled:hover:underline disabled:cursor-default"
          >
            {t.resend}
            {left > 0 && <span className="text-muted">{` ${t.inTime(label)}`}</span>}
          </button>
        </p>
        <div className="flex w-full flex-col gap-3">
          <AuthButton>{t.verify}</AuthButton>
          <AuthBackLink />
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
