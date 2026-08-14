import {
  Box,
  Chip,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import LocalHotelOutlinedIcon from '@mui/icons-material/LocalHotelOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { agoKey, figure, metricSpecs, metricsOf, stateHex } from '../presentation'
import { isOccupied } from '../queries'
import { clinicalState, clinicalStateColor, clinicalStateKey } from '../../dashboard/presentation'
import { ageFrom } from '../../patients/presentation'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { MonitoredBed } from '../types'

// El ancho del bloque de telemetría sale de `metricSpecs.length` y no de una
// constante escrita a mano: si un día se publica una variable más, la cabecera
// agrupada se estira sola en vez de quedar corta sobre sus columnas.

export function BedTable({ beds }: { beds: MonitoredBed[] }) {
  const { t } = useLanguage()

  return (
    <TableContainer component={Paper} variant="outlined">
      {/* La tabla no encoge por debajo de su ancho útil: con nueve columnas, en
          una pantalla estrecha se desplaza dentro de su caja en vez de aplastar
          las cifras hasta partirlas en dos líneas. */}
      <Table size="small" sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow>
            {/* Las tres primeras columnas atraviesan las dos filas de cabecera:
                identifican la cama y no son telemetría. */}
            <TableCell rowSpan={2}>{t('central.col.bed')}</TableCell>
            <TableCell rowSpan={2}>{t('central.col.patient')}</TableCell>
            <TableCell rowSpan={2}>{t('central.col.state')}</TableCell>
            <TableCell colSpan={metricSpecs.length} align="center">
              {t('central.vitalsGroup')}
            </TableCell>
            <TableCell rowSpan={2} align="right">
              {t('central.col.updated')}
            </TableCell>
          </TableRow>
          <TableRow>
            {/* Las cabeceras salen de la misma lista de la que salen las celdas
                (metricSpecs), así que el orden de una y otra no pueden
                separarse. */}
            {metricSpecs.map((metric) => (
              <TableCell key={metric.id} align="right">
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ alignItems: 'center', justifyContent: 'flex-end' }}
                >
                  <span>{t(metric.label)}</span>
                  {metric.hint && (
                    <Tooltip title={t(metric.hint)}>
                      <InfoOutlinedIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
                    </Tooltip>
                  )}
                </Stack>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {beds.map((bed) => {
            const occupied = isOccupied(bed)
            const state = clinicalState(bed.worstSeverity)
            const age = bed.birthDate ? ageFrom(bed.birthDate) : null
            const ago = agoKey(bed.vitals.at)

            return (
              <TableRow key={bed.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    {/* La pastilla de color a la izquierda es lo que permite
                        recorrer la columna de camas sin leer la columna de
                        estado, que está tres columnas más allá. */}
                    <Box
                      sx={{
                        width: 14,
                        height: 8,
                        borderRadius: 0.5,
                        bgcolor: occupied ? stateHex[state] : 'action.disabled',
                      }}
                    />
                    <LocalHotelOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {bed.device ? (
                        <Link
                          component={RouterLink}
                          to={`/monitoring/${bed.device}`}
                          underline="hover"
                          color="inherit"
                          aria-label={`${t('central.openMonitor')} ${bed.bed}`}
                        >
                          {bed.bed}
                        </Link>
                      ) : (
                        bed.bed
                      )}
                    </Typography>
                  </Stack>
                </TableCell>

                <TableCell>
                  {occupied ? (
                    <Stack spacing={0}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {bed.patientName}
                      </Typography>
                      {age !== null && (
                        <Typography variant="caption" color="text.secondary">
                          {t('central.years', { count: String(age) })}
                        </Typography>
                      )}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {t('central.noPatient')}
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  {occupied ? (
                    <Chip
                      size="small"
                      variant="outlined"
                      color={clinicalStateColor[state]}
                      label={t(clinicalStateKey[state])}
                    />
                  ) : (
                    <Chip
                      size="small"
                      variant="outlined"
                      color="info"
                      label={t('central.available')}
                    />
                  )}
                </TableCell>

                {metricsOf(bed).map((metric) => (
                  <TableCell key={metric.id} align="right">
                    <Stack
                      direction="row"
                      spacing={0.5}
                      sx={{ alignItems: 'baseline', justifyContent: 'flex-end' }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          fontVariantNumeric: 'tabular-nums',
                          // Sin medición no hay color: la raya ya dice lo que
                          // hay que saber, y pintarla de un color la haría
                          // parecer un valor.
                          color:
                            metric.value === null
                              ? 'text.disabled'
                              : metric.tone
                                ? `${metric.tone}.main`
                                : 'text.primary',
                        }}
                      >
                        {figure(metric.value)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t(metric.unit)}
                      </Typography>
                    </Stack>
                  </TableCell>
                ))}

                <TableCell align="right">
                  <Typography variant="caption" color="text.secondary">
                    {t(ago.key, ago.params)}
                  </Typography>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
