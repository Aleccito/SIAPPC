import { Link as RouterLink, useParams } from 'react-router-dom'
import { Button, Stack } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { PermissionMatrix } from '../components/PermissionMatrix'
import { useLanguage } from '../../../shared/i18n/useLanguage'
import { usePageHeader } from '../../../app/pageHeader'

// La edición de permisos ahora vive dentro de Roles y Permisos, en un panel bajo
// la rejilla de roles. Esta ruta se queda para que los enlaces guardados a
// /admin/roles/:id/permissions sigan abriendo algo útil, y para eso reusa el
// mismo componente: una sola matriz que mantener.
export function PermissionMatrixPage() {
  const { t } = useLanguage()
  const { id = '' } = useParams()
  // Sin esto la barra se quedaría con el encabezado de la pantalla anterior:
  // es una ruta de detalle, no una entrada del menú.
  usePageHeader(t('matrix.title'))

  return (
    <Stack spacing={3}>
      <Button
        component={RouterLink}
        to="/admin/roles"
        startIcon={<ArrowBackIcon />}
        sx={{ alignSelf: 'flex-start' }}
      >
        {t('matrix.back')}
      </Button>

      <PermissionMatrix roleId={id} />
    </Stack>
  )
}
