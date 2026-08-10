import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { dictionaries } from './dictionary'
import type { Language, StringKey } from './dictionary'
import { LanguageContext } from './languageContext'

const STORAGE_KEY = 'app.language'

// Spanish is the default. A visitor who switched to English keeps English on
// their next visit, which is why this outlives the session.
function storedLanguage(): Language {
  return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'es'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(storedLanguage)

  // Screen readers and browser translation prompts read this attribute, so it
  // has to follow the choice rather than stay at whatever index.html declared.
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = useCallback((next: Language) => {
    localStorage.setItem(STORAGE_KEY, next)
    setLanguageState(next)
  }, [])

  const t = useCallback(
    (key: StringKey, vars?: Record<string, string>) => {
      const template = dictionaries[language][key]
      if (!vars) return template
      return Object.entries(vars).reduce(
        (text, [name, value]) => text.replaceAll(`{${name}}`, value),
        template,
      )
    },
    [language],
  )

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t],
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}
