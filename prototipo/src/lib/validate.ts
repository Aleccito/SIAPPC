// Validaciones de los formularios del prototipo (paso 3). Cada función devuelve el mensaje de
// error en español o null si el valor es válido.

export type ErrorText = string | null;

type TextRule = { required?: boolean; min?: number; max?: number; requiredMessage?: string };

/** Texto libre: obligatorio y largo mínimo/máximo (sin contar espacios al inicio y al final). */
export function checkText(value: string, { required = false, min = 0, max = Infinity, requiredMessage = 'Campo obligatorio' }: TextRule): ErrorText {
  const v = value.trim();
  if (!v) return required ? requiredMessage : null;
  if (v.length < min) return `Escriba al menos ${min} caracteres`;
  if (v.length > max) return `Máximo ${max} caracteres`;
  return null;
}

/** Rango y formato de un número escrito como texto ("37.8"). */
export type NumberRule = { min: number; max: number; decimals?: number; unit?: string; required?: boolean };

export function parseNumber(value: string): number | null {
  const v = value.trim().replace(',', '.');
  if (!v || !/^-?\d+(\.\d+)?$/.test(v)) return null;
  return Number(v);
}

export function checkNumber(value: string, { min, max, decimals = 0, unit = '', required = true }: NumberRule): ErrorText {
  const v = value.trim();
  if (!v) return required ? 'Campo obligatorio' : null;
  const n = parseNumber(v);
  if (n === null) return 'Escriba un número';
  const dec = v.replace(',', '.').split('.')[1]?.length ?? 0;
  if (dec > decimals) return decimals ? `Máximo ${decimals} decimal` : 'Escriba un número entero';
  if (n < min || n > max) return `Entre ${min} y ${max}${unit ? ` ${unit}` : ''}`;
  return null;
}

/** Tensión arterial "120/80": sistólica 50–260, diastólica 30–160 y la sistólica mayor. */
export function checkPressure(value: string): ErrorText {
  const v = value.trim();
  if (!v) return 'Campo obligatorio';
  const m = /^(\d{2,3})\s*\/\s*(\d{2,3})$/.exec(v);
  if (!m) return 'Formato 120/80';
  const sys = Number(m[1]);
  const dia = Number(m[2]);
  if (sys < 50 || sys > 260) return 'Sistólica entre 50 y 260';
  if (dia < 30 || dia > 160) return 'Diastólica entre 30 y 160';
  if (sys <= dia) return 'La sistólica debe ser mayor que la diastólica';
  return null;
}

/** Rangos posibles de los signos vitales (docs/historial/REVISION.md, paso 3): rechazan errores de tecleo. */
export const VITAL_RANGES = {
  fc: { min: 20, max: 250, unit: 'lpm' },
  fr: { min: 4, max: 60, unit: 'rpm' },
  paSys: { min: 50, max: 260, unit: 'mmHg' },
  paDia: { min: 30, max: 160, unit: 'mmHg' },
  temp: { min: 30, max: 43, decimals: 1, unit: '°C' },
  spo2: { min: 50, max: 100, unit: '%' },
  gcs: { min: 3, max: 15 },
  weight: { min: 1, max: 300, decimals: 1, unit: 'kg' },
  height: { min: 40, max: 230, unit: 'cm' },
  waist: { min: 40, max: 200, unit: 'cm' },
} satisfies Record<string, NumberRule>;

/** Fecha ISO (aaaa-mm-dd) obligatoria, no futura y no anterior a `notBefore`. */
export function checkDate(iso: string, { notBefore, notBeforeLabel }: { notBefore?: string; notBeforeLabel?: string } = {}): ErrorText {
  if (!iso) return 'Campo obligatorio';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso) || Number.isNaN(Date.parse(iso))) return 'Fecha no válida';
  if (iso > todayIso()) return 'La fecha no puede ser futura';
  if (notBefore && iso < notBefore) return `No puede ser anterior a ${notBeforeLabel ?? formatDate(notBefore)}`;
  return null;
}

export function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/** "2026-08-02" → "02 Ago 2026", como en Figma. */
export function formatDate(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${m[3]} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

/** Contraseña nueva: 12 o más caracteres, con mayúscula, número y símbolo. */
export function checkNewPassword(value: string, current: string): ErrorText {
  if (!value) return 'Campo obligatorio';
  if (value.length < 12) return 'Mínimo 12 caracteres';
  if (!/[A-ZÁÉÍÓÚÑ]/.test(value)) return 'Agregue una mayúscula';
  if (!/\d/.test(value)) return 'Agregue un número';
  if (!/[^A-Za-z0-9ÁÉÍÓÚÑáéíóúñ]/.test(value)) return 'Agregue un símbolo';
  if (value === current) return 'Debe ser distinta de la actual';
  return null;
}
