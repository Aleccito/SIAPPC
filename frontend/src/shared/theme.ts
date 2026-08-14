import { createTheme } from '@mui/material/styles'

// El azul de la marca, tomado del logo. Vive aquí y no dentro de BrandLogo para
// que el color de la interfaz y el del logo no puedan separarse: si algún día
// cambia la marca, se cambia en este renglón y arrastra botones, enlaces, el
// elemento activo del menú y el propio logo.
//
// Sobre blanco da 7:1 de contraste, así que aguanta texto pequeño encima.
// El único sitio donde hay que repetirlo a mano es public/favicon.svg, que el
// navegador pide como archivo suelto y no puede importar nada.
export const brandBlue = '#2b5c86'
// Tinte claro del mismo azul, para iconos y acentos sobre fondo oscuro.
export const brandBlueSoft = '#9dc0dd'

// Sidebar tokens live outside the palette: the shell is dark navy while the
// rest of the app stays white, so a single palette mode cannot express both.
export const sidebar = {
  bg: '#0f172a',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  activeBg: brandBlue,
  hoverBg: '#1e293b',
  border: '#1e293b',
  width: 240,
  // Plegada: solo los iconos. Suficiente para el icono y su zona de clic.
  collapsedWidth: 72,
} as const

// Curvas y tiempos de las animaciones, en un solo sitio.
//
// Esta es una interfaz de vigilancia: el movimiento se reserva para lo que
// significa algo —una cama que se descompensa, un aviso que acaba de entrar, una
// señal que sigue llegando— y se mantiene por debajo del umbral en el que
// distrae a quien está mirando cifras. Nada rebota, nada gira, nada se repite en
// pantalla salvo el barrido del trazo y el latido de una cama crítica.
//
// Las curvas de CSS de serie son demasiado flojas; estas son las variantes
// fuertes. `enter` para lo que aparece (empieza rápido: la interfaz responde
// antes de que el ojo llegue), `move` para lo que se desplaza en pantalla.
export const motion = {
  enter: 'cubic-bezier(0.23, 1, 0.32, 1)',
  move: 'cubic-bezier(0.77, 0, 0.175, 1)',
  /** Un ciclo del latido de una cama crítica. Lento a propósito. */
  pulse: '2400ms',
  /** Un barrido completo del trazo de ECG: cuatro complejos ≈ 60 lpm. */
  sweep: '4000ms',
} as const

export const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      // Content area is white. Cards sit on it and are told apart by their
      // border, not by a background shift.
      default: '#ffffff',
      paper: '#ffffff',
    },
    primary: { main: brandBlue },
    success: { main: '#16a34a' },
    warning: { main: '#d97706' },
    error: { main: '#dc2626' },
    divider: '#e4e7eb',
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 700 },
    overline: {
      fontWeight: 600,
      letterSpacing: '0.08em',
      color: '#64748b',
    },
  },
  components: {
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: '1px solid #e4e7eb', backgroundImage: 'none' },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: {
        root: { borderBottom: '1px solid #e4e7eb', backgroundColor: '#ffffff' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          // Press feedback: the button acknowledges the click before the
          // navigation or mutation it triggers has a chance to respond.
          transition: 'transform 160ms cubic-bezier(0.23, 1, 0.32, 1)',
          '&:active': { transform: 'scale(0.97)' },
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
            '&:active': { transform: 'none' },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
        sizeSmall: { height: 22, fontSize: 11, letterSpacing: '0.04em' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#64748b',
          backgroundColor: '#f8fafc',
        },
      },
    },
  },
})
