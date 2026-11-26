import { IconArrowLeft } from '../icons';
import { useEffect, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { useAuthText } from './authText';

type AuthCardProps = {
  /** Ícono del paso (escudo, llave, sobre); sin ícono el título va a la izquierda, como en el Login. */
  icon?: string;
  title: string;
  description: ReactNode;
  children: ReactNode;
  /** Para envolver el contenido en un formulario (Enter envía). */
  onSubmit?: () => void;
};

/** Tarjeta de las pantallas de acceso: cabecera "SIAPPC Central", ícono opcional, título y texto. */
export function AuthCard({ icon, title, description, children, onSubmit }: AuthCardProps) {
  const centered = !!icon;
  const body = (
    <>
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-[13px] font-black text-white" aria-hidden="true">
            S
          </span>
          <p className="whitespace-nowrap text-[16px] font-extrabold text-ink">SIAPPC Central</p>
        </div>
        {icon && (
          <div className="flex w-full justify-center py-3">
            <span className="flex size-16 items-center justify-center rounded-full bg-primary-soft">
              <img className="size-7" alt="" src={icon} />
            </span>
          </div>
        )}
        <div className={cn('flex w-full flex-col gap-1.5', centered && 'items-center text-center')}>
          <h1 className="text-[24px] font-extrabold text-ink">{title}</h1>
          <p className="text-[13px] font-normal leading-[1.5] text-ink-muted">{description}</p>
        </div>
      </div>
      {children}
    </>
  );
  const classes =
    'flex w-full max-w-[460px] flex-col gap-6 rounded-[20px] bg-white p-6 [filter:drop-shadow(0px_20px_20px_rgba(0,0,0,0.25))_drop-shadow(0px_1px_1.5px_rgba(0,0,0,0.1))] sm:p-10';
  if (!onSubmit) return <section className={classes}>{body}</section>;
  return (
    <form
      noValidate
      className={classes}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {body}
    </form>
  );
}

/** Línea divisoria de la tarjeta. */
export const AuthDivider = () => <div className="h-px w-full shrink-0 bg-line" role="separator" />;

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  /** Elemento a la derecha dentro del campo (ej. el ojo de la contraseña). */
  trailing?: ReactNode;
};

/** Campo del login: etiqueta en negrita y caja de 48 px con borde de 1.5 px. */
export function AuthField({ id, label, trailing, className, ...rest }: AuthFieldProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className="text-[13px] font-bold text-ink">
        {label}
      </label>
      <span className="flex h-12 w-full items-center gap-3 rounded-[10px] border-[1.5px] border-line bg-white px-4 focus-within:border-primary">
        <input
          id={id}
          className={cn('min-w-0 flex-1 bg-transparent text-[14px] font-normal text-ink outline-none placeholder:text-ink-muted', className)}
          {...rest}
        />
        {trailing}
      </span>
    </div>
  );
}

type AuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { size?: 'md' | 'lg' };

/** Botón principal de las pantallas de acceso (52 px en el Login, 48 px en las demás, como en Figma). */
export function AuthButton({ size = 'md', className, children, type = 'submit', ...rest }: AuthButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'flex w-full shrink-0 items-center justify-center rounded-[10px] bg-primary font-extrabold text-white transition-colors hover:bg-[#1d4ed8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        size === 'lg' ? 'h-[52px] text-[15px] drop-shadow-[0px_4px_6px_rgba(37,99,235,0.2)]' : 'h-12 text-[14px]',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Enlace "Volver al inicio de sesión", igual en las tres pantallas que lo llevan. */
export function AuthBackLink() {
  const { t } = useAuthText();
  return (
    <Link to="/Login" className="flex w-fit items-center gap-2 text-[14px] font-bold text-primary hover:underline">
      <IconArrowLeft size={16} />
      {t.back}
    </Link>
  );
}

/** Cuenta regresiva en segundos (para "Reenviar"). */
export function useCountdown(from: number) {
  const [left, setLeft] = useState(from);
  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);
  const label = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
  return { left, label, restart: () => setLeft(from) };
}
