import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { listRuns, models, startRun } from '../api/flexsimApi'
import type { RunStatus } from '../types'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'
import { usePageHeader } from '../../../app/pageHeader'

const statusColor: Record<RunStatus, 'default' | 'info' | 'success' | 'error'> =
  {
    queued: 'default',
    running: 'info',
    completed: 'success',
    failed: 'error',
  }

const statusKey: Record<RunStatus, StringKey> = {
  queued: 'runStatus.queued',
  running: 'runStatus.running',
  completed: 'runStatus.completed',
  failed: 'runStatus.failed',
}

export function FlexSimPage() {
  const { t } = useLanguage()
  usePageHeader(t('flexsim.title'))
  const queryClient = useQueryClient()
  const [model, setModel] = useState(models[0])

  const { data, isPending } = useQuery({
    queryKey: ['flexsim', 'runs'],
    queryFn: listRuns,
    // Runs finish on the backend, not here — poll while any is in flight.
    refetchInterval: (query) =>
      query.state.data?.some(
        (run) => run.status === 'queued' || run.status === 'running',
      )
        ? 1000
        : false,
  })

  const mutation = useMutation({
    mutationFn: startRun,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['flexsim', 'runs'] }),
  })

  return (
    <Stack spacing={3}>
      {mutation.isError && (
        <Alert severity="error">{t('flexsim.queueError')}</Alert>
      )}

      <Stack direction="row" spacing={2}>
        <Select
          size="small"
          value={model}
          onChange={(event) => setModel(event.target.value)}
          sx={{ minWidth: 200 }}
        >
          {models.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          startIcon={<PlayArrowIcon />}
          disabled={mutation.isPending}
          onClick={() => mutation.mutate(model)}
        >
          {t('flexsim.queueRun')}
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        {/* Height is reserved so the 1s poll does not shift the table. */}
        <Box sx={{ height: 4 }}>
          {(isPending || mutation.isPending) && <LinearProgress />}
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('flexsim.col.run')}</TableCell>
              <TableCell>{t('flexsim.col.model')}</TableCell>
              <TableCell>{t('flexsim.col.status')}</TableCell>
              <TableCell align="right">{t('flexsim.col.throughput')}</TableCell>
              <TableCell align="right">{t('flexsim.col.utilization')}</TableCell>
              <TableCell>{t('flexsim.col.bottleneck')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('flexsim.empty')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {data?.map((run) => (
              <TableRow key={run.id}>
                <TableCell>{run.id}</TableCell>
                <TableCell>{run.model}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={t(statusKey[run.status])}
                    color={statusColor[run.status]}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  {run.result ? run.result.throughput : '—'}
                </TableCell>
                <TableCell align="right">
                  {run.result
                    ? `${Math.round(run.result.utilization * 100)}%`
                    : '—'}
                </TableCell>
                <TableCell>{run.result ? run.result.bottleneck : '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}
