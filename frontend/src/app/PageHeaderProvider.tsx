import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { PageHeaderContext } from './pageHeader'
import type { PageHeader } from './pageHeader'

// Este archivo solo exporta el componente: contexto y hooks están en
// pageHeader.ts para no romper el Fast Refresh de Vite.
export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [header, setHeaderState] = useState<PageHeader>({ title: '' })

  // Identidad estable: `setHeader` entra en las dependencias del efecto de
  // usePageHeader, y si cambiara en cada render el efecto se dispararía en
  // bucle.
  const setHeader = useCallback((next: PageHeader) => {
    setHeaderState((current) =>
      current.title === next.title && current.description === next.description
        ? current
        : next,
    )
  }, [])

  const value = useMemo(() => ({ header, setHeader }), [header, setHeader])

  return <PageHeaderContext.Provider value={value}>{children}</PageHeaderContext.Provider>
}
