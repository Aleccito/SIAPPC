import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  Paper as MuiPaper,
  TextField,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { listReports } from '../api/reportsApi'
import { descargarActividadClinica } from '../api/exportApi'
import type { ReportStatus } from '../types'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'
import { usePageHeader } from '../../../app/pageHeader'

const statusColor: Record<ReportStatus, 'success' | 'info' | 'error'> = {
  ready: 'success',
  running: 'info',
  failed: 'error',
}

const statusKey: Record<ReportStatus, StringKey> = {
  ready: 'reportStatus.ready',
  running: 'reportStatus.running',
  failed: 'reportStatus.failed',
}

export function ReportsPage() {
  const { t, language } = useLanguage()
  usePageHeader(t('reports.title'))
  const { data, isPending } = useQuery({
    queryKey: ['reports'],
    queryFn: listReports,
  })

  // El mes en curso como punto de partida: es el periodo que se pide casi
  // siempre, y evita abrir la pantalla con dos campos vacíos.
  const hoy = new Date()
  const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  const aFecha = (f: Date) => f.toISOString().slice(0, 10)

  const [desde, setDesde] = useState(aFecha(primerDia))
  const [hasta, setHasta] = useState(aFecha(hoy))

  const descarga = useMutation({
    mutationFn: () => descargarActividadClinica(desde, hasta),
  })

  function exportar(event: FormEvent) {
    event.preventDefault()
    descarga.mutate()
  }

  return (
    <Stack spacing={3}>
      {/* Exportación a hoja de cálculo. El rango lo elige quien descarga: un
          informe de actividad sin periodo no significa nada. */}
      <MuiPaper sx={{ p: 2 }}>
        <Stack
          component="form"
          onSubmit={exportar}
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ alignItems: { sm: 'flex-end' } }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2">{t('reports.export.title')}</Typography>
            <Typography variant="caption" color="text.secondary">
              {t('reports.export.hint')}
            </Typography>
          </Box>
          <TextField
            size="small"
            type="date"
            label={t('reports.export.from')}
            value={desde}
            onChange={(event) => setDesde(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            required
          />
          <TextField
            size="small"
            type="date"
            label={t('reports.export.to')}
            value={hasta}
            onChange={(event) => setHasta(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            required
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={<DownloadOutlinedIcon />}
            disabled={descarga.isPending}
          >
            {t('reports.export.download')}
          </Button>
        </Stack>
        {descarga.isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {descarga.error.message}
          </Alert>
        )}
      </MuiPaper>

      <TableContainer component={Paper}>
        {/* Height is reserved so a refetch does not shift the table. */}
        <Box sx={{ height: 4 }}>{isPending && <LinearProgress />}</Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('reports.col.name')}</TableCell>
              <TableCell>{t('reports.col.source')}</TableCell>
              <TableCell>{t('reports.col.status')}</TableCell>
              <TableCell>{t('reports.col.updated')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('reports.empty')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {data?.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.name}</TableCell>
                <TableCell>{report.source}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={t(statusKey[report.status])}
                    color={statusColor[report.status]}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {new Date(report.updatedAt).toLocaleString(language)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}
