import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Box,
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
import { listUsers, setUserRole } from '../api/usersApi'
import { useAuth } from '../../auth/useAuth'
import type { Role } from '../../auth/types'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import type { StringKey } from '../../../shared/i18n/dictionary'

const roles: Role[] = ['admin', 'user']

const roleKey: Record<Role, StringKey> = {
  admin: 'role.admin',
  user: 'role.user',
}

export function UsersPage() {
  const { t } = useLanguage()
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()

  const { data, isPending } = useQuery({
    queryKey: ['users'],
    queryFn: listUsers,
  })

  const mutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) =>
      setUserRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })

  return (
    <Stack spacing={3}>
      <Typography variant="h5">{t('users.title')}</Typography>

      {mutation.isError && (
        <Alert severity="error">{t('users.updateError')}</Alert>
      )}

      <TableContainer component={Paper}>
        {/* Height is reserved so a role change does not shift the table. */}
        <Box sx={{ height: 4 }}>
          {(isPending || mutation.isPending) && <LinearProgress />}
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('users.col.name')}</TableCell>
              <TableCell>{t('users.col.email')}</TableCell>
              <TableCell sx={{ width: 160 }}>{t('users.col.role')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('users.empty')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {data?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    size="small"
                    fullWidth
                    value={user.role}
                    // An admin demoting themselves would lock the last admin
                    // out of this screen.
                    disabled={user.email === currentUser?.email}
                    onChange={(event) =>
                      mutation.mutate({
                        id: user.id,
                        role: event.target.value as Role,
                      })
                    }
                  >
                    {roles.map((role) => (
                      <MenuItem key={role} value={role}>
                        {t(roleKey[role])}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}
