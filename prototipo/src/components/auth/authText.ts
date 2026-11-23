// Textos de las pantallas de acceso en español, inglés y alemán. El idioma elegido se guarda
// en el navegador para mantenerse al pasar de una pantalla de acceso a otra. El resto del
// prototipo sigue en español.
import { useSyncExternalStore } from 'react';

export type AuthLang = 'es' | 'en' | 'de';
export const AUTH_LANGS: Array<{ id: AuthLang; label: string; name: string }> = [
  { id: 'es', label: 'ES', name: 'Español' },
  { id: 'en', label: 'EN', name: 'English' },
  { id: 'de', label: 'DE', name: 'Deutsch' },
];

const es = {
  tagline: 'Sistema Inteligente de Atención a Pacientes en estado Crítico',
  langGroup: 'Idioma',
  status: ['Sistema estable', 'Conexión segura (SSL)', 'Servidor en línea', 'Latencia: 12ms'],
  copyright: '© 2026 SIAPPC · Sistema Inteligente de Atención a Pacientes en Estado Crítico. Todos los derechos reservados.',
  compliance: ['HIPAA Compliant', 'HL7 FHIR Interoperable'],
  back: 'Volver al inicio de sesión',
  emailLabel: 'Correo institucional',
  emailPlaceholder: 'ejemplo@institucion.org',
  loginTitle: 'Iniciar sesión',
  loginText: 'Ingrese sus credenciales institucionales reguladas para acceder al panel de pacientes.',
  passwordLabel: 'Contraseña',
  showPassword: 'Mostrar contraseña',
  hidePassword: 'Ocultar contraseña',
  ssl: 'Conexión SSL Encriptada',
  forgot: '¿Olvidó su contraseña?',
  enter: 'Entrar a Central de Monitoreo',
  mfaTitle: 'Verificación de seguridad',
  mfaText: 'Ingrese el código de seguridad de 6 dígitos enviado a su dispositivo móvil registrado.',
  digit: (n: number) => `Dígito ${n} de 6`,
  noCode: '¿No recibió el código?',
  resend: 'Reenviar',
  inTime: (t: string) => `(en ${t})`,
  verify: 'Verificar',
  missingDigits: 'Ingrese los 6 dígitos',
  codeResent: 'Código reenviado',
  welcome: 'Bienvenido, Dr. Carlos Méndez',
  recoverTitle: 'Recuperar contraseña',
  recoverText: 'Ingrese su correo institucional registrado para recibir las instrucciones de restablecimiento.',
  expiry: 'El enlace de recuperación expirará automáticamente en 15 minutos por motivos de seguridad.',
  send: 'Enviar enlace de recuperación',
  sentTitle: 'Revisa tu correo',
  sentBefore: 'Enviamos un enlace de recuperación a ',
  sentAfter: '. El enlace expira en 15 minutos.',
  resendLink: 'Reenviar enlace',
  linkResent: 'Enlace reenviado',
};

export type AuthText = typeof es;

const en: AuthText = {
  tagline: 'Intelligent Care System for Critically Ill Patients',
  langGroup: 'Language',
  status: ['System stable', 'Secure connection (SSL)', 'Server online', 'Latency: 12ms'],
  copyright: '© 2026 SIAPPC · Intelligent Care System for Critically Ill Patients. All rights reserved.',
  compliance: ['HIPAA Compliant', 'HL7 FHIR Interoperable'],
  back: 'Back to sign in',
  emailLabel: 'Institutional email',
  emailPlaceholder: 'ejemplo@institucion.org',
  loginTitle: 'Sign in',
  loginText: 'Enter your regulated institutional credentials to access the patient dashboard.',
  passwordLabel: 'Password',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  ssl: 'Encrypted SSL connection',
  forgot: 'Forgot your password?',
  enter: 'Enter Monitoring Center',
  mfaTitle: 'Security verification',
  mfaText: 'Enter the 6-digit security code sent to your registered mobile device.',
  digit: (n: number) => `Digit ${n} of 6`,
  noCode: "Didn't get the code?",
  resend: 'Resend',
  inTime: (t: string) => `(in ${t})`,
  verify: 'Verify',
  missingDigits: 'Enter all 6 digits',
  codeResent: 'Code resent',
  welcome: 'Welcome, Dr. Carlos Méndez',
  recoverTitle: 'Reset password',
  recoverText: 'Enter your registered institutional email to receive reset instructions.',
  expiry: 'For security reasons, the recovery link will expire automatically in 15 minutes.',
  send: 'Send recovery link',
  sentTitle: 'Check your email',
  sentBefore: 'We sent a recovery link to ',
  sentAfter: '. The link expires in 15 minutes.',
  resendLink: 'Resend link',
  linkResent: 'Link resent',
};

const de: AuthText = {
  tagline: 'Intelligentes System zur Versorgung kritisch kranker Patienten',
  langGroup: 'Sprache',
  status: ['System stabil', 'Sichere Verbindung (SSL)', 'Server online', 'Latenz: 12 ms'],
  copyright: '© 2026 SIAPPC · Intelligentes System zur Versorgung kritisch kranker Patienten. Alle Rechte vorbehalten.',
  compliance: ['HIPAA-konform', 'HL7 FHIR interoperabel'],
  back: 'Zurück zur Anmeldung',
  emailLabel: 'Institutionelle E-Mail',
  emailPlaceholder: 'ejemplo@institucion.org',
  loginTitle: 'Anmelden',
  loginText: 'Geben Sie Ihre institutionellen Zugangsdaten ein, um das Patienten-Dashboard zu öffnen.',
  passwordLabel: 'Passwort',
  showPassword: 'Passwort anzeigen',
  hidePassword: 'Passwort verbergen',
  ssl: 'Verschlüsselte SSL-Verbindung',
  forgot: 'Passwort vergessen?',
  enter: 'Zur Überwachungszentrale',
  mfaTitle: 'Sicherheitsüberprüfung',
  mfaText: 'Geben Sie den 6-stelligen Sicherheitscode ein, der an Ihr registriertes Mobilgerät gesendet wurde.',
  digit: (n: number) => `Ziffer ${n} von 6`,
  noCode: 'Keinen Code erhalten?',
  resend: 'Erneut senden',
  inTime: (t: string) => `(in ${t})`,
  verify: 'Bestätigen',
  missingDigits: 'Geben Sie alle 6 Ziffern ein',
  codeResent: 'Code erneut gesendet',
  welcome: 'Willkommen, Dr. Carlos Méndez',
  recoverTitle: 'Passwort zurücksetzen',
  recoverText: 'Geben Sie Ihre registrierte institutionelle E-Mail-Adresse ein, um Anweisungen zum Zurücksetzen zu erhalten.',
  expiry: 'Aus Sicherheitsgründen läuft der Wiederherstellungslink nach 15 Minuten automatisch ab.',
  send: 'Wiederherstellungslink senden',
  sentTitle: 'Prüfen Sie Ihre E-Mails',
  sentBefore: 'Wir haben einen Wiederherstellungslink an ',
  sentAfter: ' gesendet. Der Link läuft in 15 Minuten ab.',
  resendLink: 'Link erneut senden',
  linkResent: 'Link erneut gesendet',
};

const TEXTS: Record<AuthLang, AuthText> = { es, en, de };
const KEY = 'siappc-auth-lang';

// Pequeño almacén con suscripción: todas las pantallas de acceso ven el mismo idioma.
let current: AuthLang = (() => {
  try {
    const saved = localStorage.getItem(KEY);
    return saved === 'en' || saved === 'de' ? saved : 'es';
  } catch {
    return 'es';
  }
})();
const listeners = new Set<() => void>();

function setLang(lang: AuthLang) {
  current = lang;
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    // Sin almacenamiento (ventana privada): el idioma vale solo mientras la pestaña esté abierta.
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Idioma de las pantallas de acceso y sus textos. */
export function useAuthText() {
  const lang = useSyncExternalStore(subscribe, () => current);
  return { lang, setLang, t: TEXTS[lang] };
}
