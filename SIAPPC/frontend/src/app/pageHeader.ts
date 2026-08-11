import { createContext, useContext, useEffect } from 'react'

export type PageHeader = { title: string; description?: string }

export type PageHeaderStore = {
  header: PageHeader
  setHeader: (header: PageHeader) => void
}

// Contexto y hooks viven aparte del componente a propósito: un archivo que
// exporta componentes no puede exportar además otras cosas sin romper el Fast
// Refresh de Vite (regla react/only-export-components de oxlint). El proveedor
// está en PageHeaderProvider.tsx.
export const PageHeaderContext = createContext<PageHeaderStore | null>(null)

/**
 * Título y descripción que la barra superior muestra para esta pantalla.
 *
 * Se pasan en la llamada, no se sacan de la tabla de rutas, para que una
 * pantalla pueda calcularlos: el saludo del panel lleva el nombre del usuario y
 * la matriz de permisos, el rol que se está editando.
 *
 * Toda pantalla dentro de AppLayout tiene que llamarlo. La que no lo haga deja
 * en la barra el encabezado de la pantalla anterior.
 */
export function usePageHeader(title: string, description?: string): void {
  const store = useContext(PageHeaderContext)
  if (!store) throw new Error('usePageHeader necesita PageHeaderProvider')

  const { setHeader } = store
  useEffect(() => {
    setHeader({ title, description })
  }, [title, description, setHeader])
}

/** Solo para AppLayout, que es quien lo pinta. */
export function usePageHeaderValue(): PageHeader {
  const store = useContext(PageHeaderContext)
  if (!store) throw new Error('usePageHeaderValue necesita PageHeaderProvider')
  return store.header
}
