// Historial de esta pestaña dentro de la app, para el botón "Volver" de la barra superior.
//
// El navegador no deja leer la entrada anterior del historial. Aquí se anota cada pantalla con su `key` de React
// Router, en el mismo orden que el historial: así "Volver" sabe si hay una pantalla de la app a la que regresar o si
// se entró por un enlace directo (o se recargó la página), y en ese caso va a la pantalla padre.
import { useEffect } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';

type Entrada = { key: string; pathname: string };

const pila: Entrada[] = [];

/** Las pantallas de acceso no cuentan: después de entrar, "Volver" no debe llevar al Login ni al código. */
const ACCESO = new Set(['/', '/Login', '/LoginMfa', '/RecuperarContrasena', '/RecuperacionEnviada']);

/** Va una sola vez, dentro del router (App.tsx): anota cada cambio de pantalla. */
export function RegistroHistorial() {
  const { key, pathname } = useLocation();
  const tipo = useNavigationType();
  useEffect(() => {
    const i = pila.findIndex((e) => e.key === key);
    if (i >= 0) {
      // Atrás con el navegador (o el mismo cambio dos veces en desarrollo): se descarta lo que quedó adelante.
      pila.length = i + 1;
      return;
    }
    if (tipo === 'REPLACE' && pila.length) pila[pila.length - 1] = { key, pathname };
    else pila.push({ key, pathname });
  }, [key, pathname, tipo]);
  return null;
}

/**
 * Lo que hace "Volver": regresa a la pantalla anterior de la app, con sus filtros y su desplazamiento. Si no hay
 * (enlace directo, recarga o se venía del Login), va a `padre`.
 */
export function useVolver(padre: string) {
  const navigate = useNavigate();
  const { key } = useLocation();
  return () => {
    const i = pila.findIndex((e) => e.key === key);
    const anterior = i > 0 ? pila[i - 1] : null;
    if (anterior && !ACCESO.has(anterior.pathname)) navigate(-1);
    else navigate(padre);
  };
}
