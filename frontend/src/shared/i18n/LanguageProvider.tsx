import { useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import { dictionaries, locales } from './dictionary'
import type { StringKey } from './dictionary'
import { LanguageContext } from './languageContext'

// El producto está en español y no hay selector de idioma. El proveedor se
// mantiene —en vez de llamar al diccionario directamente desde cada
// componente— porque es lo que hace obligatorio pasar por `t()`: la clave está
// tipada contra el diccionario, así que un texto que no exista ahí no compila.

export function LanguageProvider({ children }: { children: ReactNode }) {
  const t = useCallback((key: StringKey, vars?: Record<string, string>) => {
    const template = dictionaries.es[key]
    if (!vars) return template
    return Object.entries(vars).reduce(
      (text, [name, value]) => text.replaceAll(`{${name}}`, value),
      template,
    )
  }, [])

  const value = useMemo(
    () => ({ language: 'es' as const, locale: locales.es, t }),
    [t],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
