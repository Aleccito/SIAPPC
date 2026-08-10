import { createContext } from 'react'
import type { Language, StringKey } from './dictionary'

export type LanguageValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: StringKey, vars?: Record<string, string>) => string
}

export const LanguageContext = createContext<LanguageValue | null>(null)
