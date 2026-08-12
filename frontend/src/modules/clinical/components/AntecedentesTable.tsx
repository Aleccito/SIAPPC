import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import type { Antecedente } from '../api/antecedentesApi'
import { useLanguage } from '../../../shared/i18n/useLanguage'

// La tabla de una sub-pestaña de antecedentes.
//
// Cuatro columnas, y cada una sale de una columna real de la tabla
// `antecedente`:
//
//   Enfermedad / condición  → `descripcion`
//   Relación familiar       → `parentesco` (nulo salvo en los heredofamiliares)
//   Estado                  → `activo`
//   Observaciones           → `anio`
//
// Sobre el estado: el diseño distingue "Positivo" de un guion para lo negado, y
// el modelo no guarda antecedentes negados —guarda los que hay, y `activo=false`
// significa dado de baja por error de captura, que no es lo mismo—. Así que un
// registro vigente sale como Positivo y uno de baja lo dice tal cual, sin
// disfrazarse de "negado".
//
// La columna de observaciones tampoco tiene campo propio en el modelo: el único
// texto libre es `descripcion`, que ya ocupa la primera columna. Se muestra el
// año cuando lo hay y un guion cuando no, en lugar de repetir la descripción.

export function AntecedentesTable({ rows }: { rows: Antecedente[] }) {
  const { t } = useLanguage()

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('antecedentes.col.condition')}</TableCell>
            <TableCell>{t('antecedentes.col.relationship')}</TableCell>
            <TableCell>{t('antecedentes.col.status')}</TableCell>
            <TableCell>{t('antecedentes.col.details')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell sx={{ fontWeight: 600 }}>{row.description}</TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {row.relationship ?? '—'}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={row.active ? 'error' : 'default'}
                  variant={row.active ? 'filled' : 'outlined'}
                  label={t(row.active ? 'antecedentes.positive' : 'antecedentes.inactive')}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {row.year === null ? '—' : `${t('antecedentes.year')} ${row.year}`}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
