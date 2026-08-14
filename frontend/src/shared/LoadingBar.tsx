import { Box, LinearProgress } from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import type { SxProps, Theme } from '@mui/material/styles'
import { useLanguage } from './i18n/useLanguage'

/**
 * La barra fina de "estoy cargando" que abre casi todas las pantallas.
 *
 * Existe como componente y no como tres líneas repetidas veinticuatro veces
 * porque las tres líneas venían mal en las veinticuatro: `LinearProgress` pone
 * `role="progressbar"` pero no le da nombre, así que un lector de pantalla
 * anunciaba "barra de progreso" y nada más; y al aparecer y desaparecer sin
 * región viva, quien no ve la pantalla no se entera ni de que empezó a cargar
 * ni de que terminó.
 *
 * Aquí eso se resuelve una vez:
 *
 *  - `aria-busy` en el contenedor dice si la región está ocupada.
 *  - `aria-live="polite"` hace que el cambio se anuncie sin interrumpir lo que
 *    el lector esté diciendo. Nunca `assertive`: cargar una tabla no es una
 *    urgencia, y en una pantalla que se refresca cada 5 s sería insoportable.
 *  - El texto oculto es lo que realmente se anuncia; la barra es solo la parte
 *    visible de lo mismo.
 *
 * El hueco de 4 px se reserva SIEMPRE, cargando o no: si apareciera y
 * desapareciera ocupando sitio, la pantalla entera daría un salto de 4 px cada
 * vez que la consulta se refresca.
 */
export function LoadingBar({ loading, sx }: { loading: boolean; sx?: SxProps<Theme> }) {
  const { t } = useLanguage()

  return (
    <Box aria-live="polite" aria-busy={loading} sx={[{ height: 4 }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {loading && (
        <>
          <LinearProgress aria-label={t('action.loading')} />
          <Box component="span" sx={visuallyHidden}>
            {t('action.loading')}
          </Box>
        </>
      )}
    </Box>
  )
}
