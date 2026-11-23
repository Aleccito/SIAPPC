import { useEffect, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { AUTH_LANGS, useAuthText } from './authText';

/** Fondo de puntos de Figma (360 círculos sueltos) como un patrón CSS equivalente. */
const DOTS = {
  backgroundImage: 'radial-gradient(circle, #131C33 1px, transparent 1.2px)',
  backgroundSize: '62.52px 64.14px',
  backgroundPosition: '-30.26px -31.07px',
};

/**
 * Estructura de las pantallas de acceso (Login, verificación y recuperación de contraseña):
 * barra superior con el selector de idioma, fondo de puntos, la tarjeta de la pantalla al
 * centro, barra de estado y pie. A 1440×900 reproduce la pantalla "siappc-login" de Figma.
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  const { lang, setLang, t } = useAuthText();

  // El documento anuncia el idioma de estas pantallas; al salir vuelve a español.
  useEffect(() => {
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = 'es';
    };
  }, [lang]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-white font-geist leading-[normal]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-35" style={DOTS} />

      <header className="relative flex h-[72px] shrink-0 items-center justify-between gap-4 border-b border-line px-4 sm:px-16">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-primary text-[16px] font-black text-white">S</span>
          <div className="flex min-w-0 flex-col gap-0.5 whitespace-nowrap">
            <p className="text-[18px] font-extrabold text-ink">SIAPPC</p>
            <p className="hidden text-[11px] font-semibold uppercase text-muted sm:block">{t.tagline}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5" role="group" aria-label={t.langGroup}>
          {AUTH_LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              lang={l.id}
              aria-label={l.name}
              aria-pressed={lang === l.id}
              onClick={() => setLang(l.id)}
              className={cn(
                'flex h-8 items-center justify-center rounded-lg border border-line bg-white px-3 text-[12px] transition-colors',
                lang === l.id ? 'font-extrabold text-ink' : 'font-semibold text-ink-muted hover:bg-surface',
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-16 sm:pb-0 sm:pt-8">{children}</main>

      <div className="relative mx-auto flex w-full max-w-[460px] flex-wrap justify-center gap-x-4 gap-y-2 px-4 pb-2 pt-4 leading-4 sm:flex-nowrap sm:justify-start sm:px-0">
        {t.status.map((s) => (
          <p key={s} className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[12px] font-semibold text-subtle">
            <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
            {s}
          </p>
        ))}
      </div>

      <footer className="relative flex flex-col items-center gap-2 border-t border-line bg-white px-4 py-6 text-center text-[12px] leading-[15px] text-ink-muted sm:flex-row sm:items-start sm:justify-between sm:px-16 sm:text-left">
        <p className="font-normal">{t.copyright}</p>
        <div className="flex shrink-0 gap-4 font-semibold">
          {t.compliance.map((c) => (
            <p key={c}>{c}</p>
          ))}
        </div>
      </footer>
    </div>
  );
}
