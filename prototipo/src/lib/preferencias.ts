// Preferencias de avisos de este navegador (Mi Perfil → Preferencias de Notificaciones). Las usa el aviso de alertas en
// vivo (components/layout/EnVivo.tsx). Van en localStorage: son de quien usa este equipo, no de la cuenta.

export type Preferencias = {
  /** Aviso en pantalla de una alerta crítica de un paciente a cargo. */
  criticas: boolean;
  /** Aviso en pantalla de una alerta de prioridad alta. */
  altas: boolean;
  /** Un sonido corto con la alerta crítica. */
  sonido: boolean;
};

const CLAVE = 'siappc.preferencias';
const POR_DEFECTO: Preferencias = { criticas: true, altas: false, sonido: false };

export function leerPreferencias(): Preferencias {
  try {
    return { ...POR_DEFECTO, ...(JSON.parse(localStorage.getItem(CLAVE) ?? '{}') as Partial<Preferencias>) };
  } catch {
    return POR_DEFECTO;
  }
}

export function guardarPreferencias(p: Preferencias) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(p));
  } catch {
    // Sin almacenamiento (ventana privada): la preferencia vale hasta recargar.
  }
}

/** Dos tonos cortos, como un monitor. Si el navegador no deja reproducir audio todavía, no suena. */
export function sonarAlerta() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    [0, 0.28].forEach((inicio) => {
      const osc = ctx.createOscillator();
      const vol = ctx.createGain();
      osc.frequency.value = 880;
      vol.gain.setValueAtTime(0.0001, ctx.currentTime + inicio);
      vol.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + inicio + 0.02);
      vol.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + inicio + 0.22);
      osc.connect(vol).connect(ctx.destination);
      osc.start(ctx.currentTime + inicio);
      osc.stop(ctx.currentTime + inicio + 0.24);
    });
    setTimeout(() => void ctx.close(), 1000);
  } catch {
    // Audio bloqueado hasta que la persona toque la página: queda el aviso en pantalla.
  }
}
