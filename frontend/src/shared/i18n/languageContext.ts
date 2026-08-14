import { createContext } from 'react'
import type { Language, StringKey } from './dictionary'

export type LanguageValue = {
  /** Siempre 'es'. Elige el diccionario. */
  language: Language
  /**
   * El BCP-47 del idioma activo ('es-MX'). Es lo que reciben `toLocale*String`
   * y los `Intl.*`, y NO es intercambiable con `language`: pasar 'es' a secas
   * deja que el navegador elija la región, y con ella el orden de la fecha.
   */
  locale: string
  t: (key: StringKey, vars?: Record<string, string>) => string
}

export const LanguageContext = createContext<LanguageValue | null>(null)
