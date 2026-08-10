import { createTheme } from '@mui/material/styles'

// Sidebar tokens live outside the palette: the shell is dark navy while the
// rest of the app stays white, so a single palette mode cannot express both.
export const sidebar = {
  bg: '#0f172a',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  activeBg: '#2563eb',
  hoverBg: '#1e293b',
  border: '#1e293b',
  width: 240,
  // Plegada: solo los iconos. Suficiente para el icono y su zona de clic.
  collapsedWidth: 72,
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
    primary: { main: '#2563eb' },
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
