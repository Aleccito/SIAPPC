import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  TextField,
  Typography,
} from '@mui/material'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import { addPatient, listPatients } from '../api/patientsApi'
import { serviceModules } from '../types'
import type { Patient, PatientStatus, ServiceModule } from '../types'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'
import { usePageHeader } from '../../../app/pageHeader'

const statusColor: Record<PatientStatus, 'default' | 'info' | 'success'> = {
  waiting: 'default',
  inService: 'info',
  discharged: 'success',
}

const statusKey: Record<PatientStatus, StringKey> = {
  waiting: 'patientStatus.waiting',
  inService: 'patientStatus.inService',
  discharged: 'patientStatus.discharged',
}

const emptyForm = {
  name: '',
  document: '',
  module: serviceModules[0] as ServiceModule,
  reason: '',
}

export function PatientsPage() {
  const { t, language } = useLanguage()
  usePageHeader(t('patients.title'))
  const queryClient = useQueryClient()
  const [moduleFilter, setModuleFilter] = useState<ServiceModule | 'all'>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [selected, setSelected] = useState<Patient | null>(null)

  const { data, isPending } = useQuery({
    queryKey: ['patients'],
    queryFn: listPatients,
  })

  const mutation = useMutation({
    mutationFn: addPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      setForm(emptyForm)
      setFormOpen(false)
    },
  })

  const visible = data?.filter(
    (patient) => moduleFilter === 'all' || patient.module === moduleFilter,
  )

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    mutation.mutate(form)
  }

  return (
    <Stack spacing={3}>
      {/* El título se fue a la barra superior (usePageHeader); queda la acción,
          alineada a la derecha como estaba. */}
      <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<PersonAddAltOutlinedIcon />}
          onClick={() => setFormOpen(true)}
        >
          {t('patients.add')}
        </Button>
      </Stack>

      {mutation.isError && (
        <Alert severity="error">{t('patients.addError')}</Alert>
      )}

      <Select
        size="small"
        value={moduleFilter}
        onChange={(event) =>
          setModuleFilter(event.target.value as ServiceModule | 'all')
        }
        sx={{ alignSelf: 'flex-start', minWidth: 200 }}
      >
        <MenuItem value="all">{t('patients.filter.all')}</MenuItem>
        {serviceModules.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </Select>

      <TableContainer component={Paper}>
        {/* Height is reserved so a refetch does not shift the table. */}
        <Box sx={{ height: 4 }}>
          {(isPending || mutation.isPending) && <LinearProgress />}
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('patients.col.name')}</TableCell>
              <TableCell>{t('patients.col.document')}</TableCell>
              <TableCell>{t('patients.col.module')}</TableCell>
              <TableCell>{t('patients.col.status')}</TableCell>
              <TableCell>{t('patients.col.arrived')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visible?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('patients.empty')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {visible?.map((patient) => (
              <TableRow
                key={patient.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => setSelected(patient)}
              >
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.document}</TableCell>
                <TableCell>{patient.module}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={t(statusKey[patient.status])}
                    color={statusColor[patient.status]}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {new Date(patient.arrivedAt).toLocaleString(language)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{t('patients.form.title')}</DialogTitle>
        <Stack component="form" onSubmit={handleSubmit} noValidate>
          <DialogContent>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <TextField
                label={t('patients.form.name')}
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                required
                autoFocus
                fullWidth
              />
              <TextField
                label={t('patients.form.document')}
                value={form.document}
                onChange={(event) =>
                  setForm({ ...form, document: event.target.value })
                }
                required
                fullWidth
              />
              <TextField
                label={t('patients.form.module')}
                value={form.module}
                onChange={(event) =>
                  setForm({
                    ...form,
                    module: event.target.value as ServiceModule,
                  })
                }
                select
                fullWidth
              >
                {serviceModules.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label={t('patients.form.reason')}
                value={form.reason}
                onChange={(event) =>
                  setForm({ ...form, reason: event.target.value })
                }
                multiline
                minRows={2}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setFormOpen(false)}>
              {t('action.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={
                mutation.isPending || !form.name.trim() || !form.document.trim()
              }
            >
              {t('patients.form.submit')}
            </Button>
          </DialogActions>
        </Stack>
      </Dialog>

      <Dialog
        open={selected !== null}
        onClose={() => setSelected(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>{t('patients.details.title')}</DialogTitle>
        <DialogContent>
          {selected && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Typography variant="h6">{selected.name}</Typography>
              <Stack spacing={1.5}>
                <DetailRow
                  label={t('patients.col.document')}
                  value={selected.document}
                />
                <DetailRow
                  label={t('patients.col.module')}
                  value={selected.module}
                />
                <DetailRow
                  label={t('patients.col.status')}
                  value={t(statusKey[selected.status])}
                />
                <DetailRow
                  label={t('patients.col.arrived')}
                  value={new Date(selected.arrivedAt).toLocaleString(language)}
                />
                <DetailRow
                  label={t('patients.details.reason')}
                  value={selected.reason || t('patients.details.none')}
                />
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setSelected(null)}>{t('action.close')}</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  )
}
