import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    primary: { main: '#1f2933' },
    divider: '#e4e7eb',
    text: {
      primary: '#1f2933',
      secondary: '#6b7280',
    },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: '1px solid #e4e7eb' },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: {
        root: { borderBottom: '1px solid #e4e7eb' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
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
  },
})
