import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'soft' | 'ghost' | 'danger' | 'warning' | 'success' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex shrink-0 items-center justify-center whitespace-nowrap border font-jakarta leading-[normal] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-primary font-bold text-white hover:bg-[#1d4ed8]',
  secondary: 'border-line bg-white font-semibold text-ink hover:bg-surface',
  outline: 'border-line bg-white font-bold text-primary hover:bg-primary-soft',
  soft: 'border-transparent bg-primary-soft font-semibold text-primary hover:bg-[#dbeafe]',
  ghost: 'border-transparent bg-transparent font-semibold text-muted hover:bg-surface hover:text-ink',
  danger: 'border-transparent bg-danger font-bold text-white hover:bg-[#dc2626]',
  warning: 'border-transparent bg-[#d97706] font-bold text-white hover:bg-[#b45309]',
  success: 'border-transparent bg-success font-bold text-white hover:bg-[#059669]',
  link: 'border-transparent bg-transparent font-bold text-primary underline decoration-from-font [text-underline-position:from-font] hover:text-[#1d4ed8]',
};

const linkSizes: Record<ButtonSize, string> = {
  sm: 'gap-1 text-[12px]',
  md: 'gap-1.5 text-[13px]',
  lg: 'gap-2 text-[14px]',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'gap-1.5 rounded-md px-3 py-1.5 text-[12px]',
  md: 'gap-1.5 rounded-lg px-4 py-2 text-[13px]',
  lg: 'gap-2 rounded-lg px-6 py-3 text-[14px]',
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ícono a la izquierda del texto. */
  icon?: ReactNode;
  /** Ícono a la derecha del texto. */
  iconRight?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
};

type ButtonAsButton = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { to?: undefined };
type ButtonAsLink = CommonProps & { to: string; onClick?: () => void; 'aria-label'?: string; title?: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/** Botón del diseño. Con `to` se comporta como enlace a otra pantalla. */
export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', icon, iconRight, fullWidth, className, children } = props;
  const classes = cn(base, variants[variant], variant === 'link' ? linkSizes[size] : sizes[size], fullWidth && 'w-full', className);
  const content = (
    <>
      {icon}
      {children}
      {iconRight}
    </>
  );

  if (props.to !== undefined) {
    return (
      <Link to={props.to} onClick={props.onClick} aria-label={props['aria-label']} title={props.title} className={classes}>
        {content}
      </Link>
    );
  }

  const { variant: _v, size: _s, icon: _i, iconRight: _r, fullWidth: _f, className: _c, children: _ch, to: _t, type = 'button', ...rest } = props;
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}
