import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Fade,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import LoginIcon from '@mui/icons-material/Login'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { useAuth } from '../useAuth'
import { BrandMark } from '../../../shared/BrandMark'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import { brandBlueSoft, sidebar } from '../../../shared/theme'
import type { StringKey } from '../../../shared/i18n/dictionary'

const capabilities: {
  icon: typeof SensorsOutlinedIcon
  title: StringKey
  body: StringKey
}[] = [
  {
    icon: SensorsOutlinedIcon,
    title: 'login.cap.iot.title',
    body: 'login.cap.iot.body',
  },
  {
    icon: NotificationsActiveOutlinedIcon,
    title: 'login.cap.alerts.title',
    body: 'login.cap.alerts.body',
  },
  {
    icon: DescriptionOutlinedIcon,
    title: 'login.cap.reporting.title',
    body: 'login.cap.reporting.body',
  },
]

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [resetSuccess] = useState(
    () => Boolean((location.state as { resetSuccess?: boolean } | null)?.resetSuccess),
  )
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setPending(true)
    try {
      await login({ email, password })
      const from = (location.state as { from?: string } | null)?.from ?? '/'
      navigate(from, { replace: true })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('login.failed'))
    } finally {
      setPending(false)
    }
  }

  return (
    // Pantalla partida: el panel de presentación toma el azul marino del shell
    // (sidebar.bg) y el formulario se queda en blanco. Antes las dos mitades
    // eran blancas y la tarjeta solo se distinguía por un borde de 1px, así que
    // nada dirigía la mirada al único control de la pantalla. Además el login
    // ya se parece a la aplicación que hay detrás en vez de a una página suelta.
    <Box
      sx={{
        // Alto fijo + overflow oculto: la página nunca produce barra de
        // desplazamiento. `minHeight` dejaba que el contenido la empujara, y
        // bastaba una ventana baja o un texto más largo para que apareciera.
        //
        // El contenido no se recorta: cada columna se desplaza por dentro
        // (`minHeight: 0` + `overflowY: auto` más abajo), así que en una
        // pantalla muy baja el botón de entrar se sigue alcanzando. Con
        // `overflow: hidden` a secas quedaría inaccesible.
        height: '100dvh',
        overflow: 'hidden',
        display: 'grid',
        // El panel oscuro no aparece hasta que hay ancho para las dos columnas;
        // en móvil sería una banda decorativa comiéndose la mitad de la
        // pantalla por encima del formulario.
        gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          // Ajustado para que la columna quepa en un portátil de 800 px de alto
          // sin barra de desplazamiento: un login que hay que bajar para leer
          // completo es un login mal medido.
          gap: 3,
          px: { md: 5, lg: 8 },
          py: { md: 3.5, lg: 4.5 },
          position: 'relative',
          // minHeight: 0 deja que un hijo de grid se encoja por debajo de su
          // contenido; sin él la columna empuja el alto de la página.
          minHeight: 0,
          // Este panel NO se desplaza nunca, ni por dentro. Todo lo que hay aquí
          // es material de presentación: si no cabe, se retira por tramos con
          // las media queries de altura de abajo, que es más limpio que dejar
          // una barra de desplazamiento en una pantalla de entrada.
          overflow: 'hidden',
          bgcolor: sidebar.bg,
          color: sidebar.text,
          // El degradado va hacia el azul de marca por la esquina inferior
          // izquierda: da profundidad sin meter una imagen que haya que cargar,
          // servir y mantener traducida.
          backgroundImage: `radial-gradient(90rem 50rem at -10% 110%, ${sidebar.activeBg}55 0%, transparent 60%)`,
        }}
      >
        {/* La versión con lema usa text.secondary, ilegible sobre el azul
            marino, así que el lema se pone aparte con el gris del shell. Es
            lo que explica qué significan las siglas SIAPPC. */}
        <Box sx={{ color: sidebar.text }}>
          <BrandMark withTagline={false} variant="onBlue" />
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 1,
              maxWidth: '48ch',
              letterSpacing: '0.02em',
              lineHeight: 1.3,
              color: sidebar.textMuted,
            }}
          >
            {t('brand.tagline')}
          </Typography>
        </Box>

        <Stack spacing={3.5} sx={{ maxWidth: 520 }}>
          <Stack spacing={2}>
            <Typography
              variant="overline"
              sx={{ letterSpacing: '0.18em', color: sidebar.textMuted }}
            >
              {t('login.eyebrow')}
            </Typography>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                // clamp contra el alto de la ventana, no solo contra el ancho:
                // lo que desbordaba esta columna era siempre la altura.
                fontSize: { md: 'clamp(1.5rem, 3.4vh, 2rem)', lg: 'clamp(1.6rem, 4vh, 2.5rem)' },
              }}
            >
              {t('login.headline1')}
              <br />
              {t('login.headline2')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                maxWidth: '52ch',
                color: sidebar.textMuted,
                // Primer tramo que se retira: el titular ya dice de qué va la
                // plataforma, así que este párrafo es el que menos se echa en
                // falta cuando no hay altura.
                '@media (max-height: 620px)': { display: 'none' },
              }}
            >
              {t('login.lead')}
            </Typography>
          </Stack>

          <Stack
            spacing={2}
            sx={{
              // Segundo tramo: la lista entera desaparece antes que el titular
              // y la marca, que son lo que identifica la pantalla.
              '@media (max-height: 720px)': { display: 'none' },
            }}
          >
            {capabilities.map((capability) => (
              <Stack
                key={capability.title}
                direction="row"
                spacing={2}
                sx={{ alignItems: 'flex-start' }}
              >
                {/* Azulejo traslúcido: sobre el marino, un icono suelto en
                    primary.main se pierde contra el fondo. */}
                <Box
                  sx={{
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: '#ffffff14',
                    border: `1px solid ${sidebar.border}`,
                  }}
                >
                  <capability.icon fontSize="small" sx={{ color: brandBlueSoft }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {t(capability.title)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ maxWidth: '48ch', color: sidebar.textMuted }}
                  >
                    {t(capability.body)}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Typography
          variant="caption"
          sx={{
            color: sidebar.textMuted,
            maxWidth: '60ch',
            // Último tramo. Por debajo de esto solo quedan marca y titular, que
            // caben en cualquier ventana en la que el panel siga visible.
            '@media (max-height: 520px)': { display: 'none' },
          }}
        >
          {t('login.securityNote')}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          px: { xs: 2, sm: 4, md: 5 },
          py: { xs: 3, md: 5 },
          '@media (max-height: 720px)': { py: 2 },
          '@media (max-height: 560px)': { py: 1 },
          '@media (max-height: 480px)': { py: 0.5 },
          minHeight: 0,
          // A diferencia del panel oscuro, aquí no se puede retirar nada: los
          // campos y el botón son la pantalla. Se compacta con las media
          // queries de abajo hasta donde da, y por debajo de eso se desplaza —
          // recortar el botón de entrar sería peor que una barra.
          overflowY: 'auto',
        }}
      >
        <Box
          component="header"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          {/* En md+ la marca ya está en el panel oscuro; repetirla aquí sería
              decir lo mismo dos veces en la misma pantalla. */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <BrandMark />
          </Box>
          <Box sx={{ ml: 'auto' }}>
          </Box>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: { xs: 4, md: 2 },
            '@media (max-height: 720px)': { py: 1 },
            '@media (max-height: 560px)': { py: 0 },
          }}
        >
          <Fade in timeout={reduceMotion ? 0 : 220}>
            <Paper
              sx={{
                p: { xs: 3, sm: 4 },
                '@media (max-height: 720px)': { p: 2.5 },
                // Teléfono en horizontal (812×375 y parecidos): aquí no se
                // puede quitar nada del formulario, así que se aprieta. Los
                // campos se compactan por CSS porque `size` es una prop de JS y
                // no entiende de media queries.
                '@media (max-height: 480px)': {
                  p: 2,
                  '& .MuiInputBase-input': { pt: 1.25, pb: 1.25 },
                },
                width: '100%',
                maxWidth: 420,
                // Sin borde y con sombra suave: el borde de 1px del tema sirve
                // para separar tarjetas entre sí en un tablero, no para levantar
                // la única tarjeta de una pantalla vacía.
                border: 'none',
                boxShadow: '0 1px 2px #0f172a0a, 0 12px 32px -12px #0f172a24',
              }}
            >
              <Stack
                spacing={3}
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                  '@media (max-height: 720px)': { gap: 2 },
                  '@media (max-height: 480px)': { gap: 1.25 },
                }}
              >
                <Stack spacing={0.5}>
                  <Typography variant="h5" component="h2">
                    {t('login.title')}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    // La única línea prescindible del formulario: los campos ya
                    // dicen "Correo institucional" y "Contraseña".
                    sx={{ '@media (max-height: 480px)': { display: 'none' } }}
                  >
                    {t('login.hint')}
                  </Typography>
                </Stack>

                {resetSuccess && <Alert severity="success">{t('verify.success')}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                  label={t('login.email')}
                  placeholder={t('login.emailPlaceholder')}
                  type="email"
                  value={email}
                  // A failure from the previous attempt no longer describes what
                  // is in the field once the user starts fixing it.
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setError(null)
                  }}
                  autoComplete="username"
                  autoFocus
                  required
                  disabled={pending}
                  fullWidth
                />
                <Stack spacing={1}>
                  <TextField
                    label={t('login.password')}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)
                      setError(null)
                    }}
                    autoComplete="current-password"
                    required
                    disabled={pending}
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={
                                showPassword
                                  ? t('login.hidePassword')
                                  : t('login.showPassword')
                              }
                              onClick={() => setShowPassword((value) => !value)}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? (
                                <VisibilityOffOutlinedIcon fontSize="small" />
                              ) : (
                                <VisibilityOutlinedIcon fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    variant="body2"
                    sx={{ alignSelf: 'flex-end', textDecoration: 'none' }}
                  >
                    {t('login.forgotPassword')}
                  </Link>
                </Stack>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  // Durante el envío el icono pasa a spinner en vez de aparecer
                  // uno nuevo: así el botón no cambia de ancho a mitad del clic.
                  startIcon={
                    pending ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <LoginIcon />
                    )
                  }
                  disabled={pending || !email || !password}
                  aria-busy={pending}
                  fullWidth
                  sx={{ py: 1.25 }}
                >
                  {pending ? t('login.pending') : t('action.signIn')}
                </Button>
              </Stack>
            </Paper>
          </Fade>
        </Box>
      </Box>
    </Box>
  )
}
