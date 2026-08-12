import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { listRoleChanges } from '../api/rolesApi'
import { usePageHeader } from '../../../app/pageHeader'
import { useLanguage } from '../../../shared/i18n/useLanguage'

// Historial de cambios de permisos. Antes eran los tres últimos al pie de Roles
// y Permisos, donde competían con la matriz que se estaba editando; aquí caben
// todos y se leen en una tabla.
//
// No duplica Auditoría: esta pantalla es solo `rol_permiso`, ya filtrada. La
// bitácora completa —altas de usuarios, accesos, bloqueos— sigue en Auditoría,
// y el botón de arriba lleva allí.
export function PermissionChangesPage() {
  const { t } = useLanguage()
  usePageHeader(t('permissionChanges.title'), t('permissionChanges.subtitle'))
  const locale = 'es-MX'

  const changes = useQuery({ queryKey: ['roleChanges'], queryFn: listRoleChanges })

  return (
    <Stack spacing={3}>
      <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
        <Button
          component={RouterLink}
          to="/admin/audit"
          endIcon={<ArrowForwardIcon />}
        >
          {t('permissionChanges.seeAudit')}
        </Button>
      </Stack>

      {changes.isError && <Alert severity="error">{t('permissionChanges.error')}</Alert>}

      <TableContainer component={Paper}>
        <Box sx={{ height: 4 }}>{changes.isFetching && <LinearProgress />}</Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 200 }}>{t('permissionChanges.col.when')}</TableCell>
              <TableCell sx={{ width: 200 }}>{t('permissionChanges.col.author')}</TableCell>
              <TableCell>{t('permissionChanges.col.change')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {changes.data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('permissionChanges.empty')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {changes.data?.map((change) => (
              <TableRow key={change.id} hover>
                <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                  {new Date(change.at).toLocaleString(locale)}
                </TableCell>
                {/* `author` es null cuando la cuenta que hizo el cambio se
                    borró: la bitácora usa ON DELETE SET NULL para no perder el
                    renglón con ella. */}
                <TableCell sx={{ fontWeight: 600 }}>{change.author ?? '—'}</TableCell>
                <TableCell>{change.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}
