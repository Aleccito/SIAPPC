import { useQuery } from '@tanstack/react-query'
import {
  Box,
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
import type { ReportStatus } from '../types'
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

  return (
    <Stack spacing={3}>
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
