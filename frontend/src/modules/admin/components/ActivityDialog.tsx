import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Alert,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { LoadingBar } from '../../../shared/LoadingBar'
import CloseIcon from '@mui/icons-material/Close'
import { listUserActivity } from '../api/usersApi'
import type { User } from '../../auth/types'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'

type Props = {
  user: User | null
  onClose: () => void
}

const RANGES = [
  { days: 1, label: 'users.activity.range24h' },
  { days: 7, label: 'users.activity.range7d' },
  { days: 30, label: 'users.activity.range30d' },
] as const satisfies readonly { days: number; label: StringKey }[]

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Paper sx={{ p: 2, flexGrow: 1 }}>
      <Typography variant="overline" sx={{ display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="h6">{value}</Typography>
    </Paper>
  )
}

export function ActivityDialog({ user, onClose }: Props) {
  const { t, locale } = useLanguage()
  const [days, setDays] = useState(30)

  const { data, isPending, isError } = useQuery({
    queryKey: ['activity', user?.id, days],
    queryFn: () => listUserActivity(user!.id, days),
    enabled: Boolean(user),
  })

  const logins = data?.filter((entry) => entry.action === 'LOGIN').length ?? 0

  return (
    <Dialog open={Boolean(user)} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pr: 6 }}>
        <Typography variant="h6">
          {t('users.activity.title')} — {user?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.roleLabel}
          {user?.unit ? ` · ${user.unit}` : ''}
        </Typography>
        <IconButton
          onClick={onClose}
          aria-label={t('action.close')}
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <Stat
              label={t('users.activity.lastLogin')}
              value={
                user?.lastActivity
                  ? new Date(user.lastActivity).toLocaleString(locale)
                  : t('users.never')
              }
            />
            <Stat label={t('users.activity.sessions')} value={String(logins)} />
            <Stat
              label={t('users.activity.actions')}
              value={String(data?.length ?? 0)}
            />
          </Stack>

          <ButtonGroup size="small">
            {RANGES.map((range) => (
              <Button
                key={range.days}
                variant={days === range.days ? 'contained' : 'outlined'}
                onClick={() => setDays(range.days)}
              >
                {t(range.label)}
              </Button>
            ))}
          </ButtonGroup>

          {isError && <Alert severity="error">{t('users.activity.error')}</Alert>}

          <Paper>
            <LoadingBar loading={isPending} />
            <Table aria-label={t('users.activity.title')} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('users.activity.col.when')}</TableCell>
                  <TableCell>{t('users.activity.col.action')}</TableCell>
                  <TableCell>{t('users.activity.col.module')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('users.activity.empty')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {data?.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{new Date(entry.at).toLocaleString(locale)}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {t(`audit.${entry.action}` as StringKey)}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{entry.entity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
