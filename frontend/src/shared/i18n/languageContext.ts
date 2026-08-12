import { createContext } from 'react'
import type { Language, StringKey } from './dictionary'

export type LanguageValue = {
  /** Siempre 'es'. Se expone porque es lo que reciben los `toLocale*String`. */
  language: Language
  t: (key: StringKey, vars?: Record<string, string>) => string
}

export const LanguageContext = createContext<LanguageValue | null>(null)
