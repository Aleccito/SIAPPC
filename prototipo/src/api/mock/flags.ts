// Interruptores del simulador para demostrar y probar estados (docs/historial/REVISION-IA.md, sección 2).
// Se leen de la URL al cargar y se guardan en sessionStorage: valen para toda la visita.
//
//   ?retraso=0          sin esperas (pruebas automáticas y capturas)
//   ?sesion=vencida     la próxima llamada responde 401
//   ?ia=lenta|caida|corte|sin-analisis   (los usa el simulador de IA, PR 3)

const KEY = 'mock.flags';

export type MockFlags = { retraso?: string; sesion?: string; ia?: string };

function read(): MockFlags {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? '{}') as MockFlags;
  } catch {
    return {};
  }
}

function write(flags: MockFlags) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(flags));
  } catch {
    // Sin sessionStorage los interruptores duran lo que la página.
  }
}

let flags: MockFlags = read();

if (typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search);
  let changed = false;
  for (const name of ['retraso', 'sesion', 'ia'] as const) {
    const value = params.get(name);
    if (value !== null) {
      flags = { ...flags, [name]: value };
      changed = true;
    }
  }
  if (changed) write(flags);
}

export function mockFlags(): MockFlags {
  return flags;
}

/** Quita un interruptor de un solo uso (por ejemplo, la sesión vencida ya se usó). */
export function clearFlag(name: keyof MockFlags) {
  const { [name]: _, ...rest } = flags;
  flags = rest;
  write(flags);
}
