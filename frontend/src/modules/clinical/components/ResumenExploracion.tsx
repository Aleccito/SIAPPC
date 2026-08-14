import { Alert, Box, Chip, Paper, Stack, Typography } from '@mui/material'
import { K, REGIONES, REGION_KEY, TECNICAS, TECNICA_KEY } from './exploracionFisica'
import type { ExploracionForm, Hallazgo } from './exploracionFisica'
import { useLanguage } from '../../../shared/i18n/useLanguage'

// Resumen de la exploración física: lo mismo que la pestaña de captura, pero de
// lectura y de un vistazo.
//
// Existe porque la pestaña «Historia Clínica» es un formulario de seis regiones
// por cuatro técnicas —veinticuatro casillas—, y leer ahí lo que se encontró
// obliga a recorrerlas todas, incluidas las que nadie exploró. Aquí solo sale
// lo que TIENE valor, y lo anormal se ve sin buscarlo.
//
// No consulta nada: recibe el mismo formulario que la pestaña de captura, así
// que refleja lo que hay en pantalla —guardado o no— y no una segunda lectura
// de la base que podría discrepar.

/** Índice de masa corporal, o null si falta un dato o no es interpretable. */
function imcDe(pesoKg: string, tallaCm: string): number | null {
  const peso = Number(pesoKg)
  const talla = Number(tallaCm)
  if (!Number.isFinite(peso) || !Number.isFinite(talla) || peso <= 0 || talla <= 0) return null
  const metros = talla / 100
  return peso / (metros * metros)
}

/** Una cifra con su rótulo; ausente se pinta como raya, nunca como cero. */
function Medida({ label, value, unit }: { label: string; value: string; unit?: string }) {
  const vacio = value.trim() === ''
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="h6" component="p">
        {vacio ? '—' : value}
        {!vacio && unit && (
          <Typography component="span" variant="body2" color="text.secondary">
            {` ${unit}`}
          </Typography>
        )}
      </Typography>
    </Box>
  )
}

/** Un hallazgo cuenta cuando se marcó su estado o se escribió algo. */
function tieneContenido(hallazgo: Hallazgo): boolean {
  return hallazgo.estado !== '' || hallazgo.texto.trim() !== ''
}

export function ResumenExploracion({ form }: { form: ExploracionForm }) {
  const { t } = useLanguage()

  const imc = imcDe(form.pesoKg, form.tallaCm)

  // Las regiones con algo explorado, y dentro de cada una solo sus técnicas con
  // contenido. Una región intacta no se pinta: en una pantalla de resumen, seis
  // tarjetas vacías esconden la única que importa.
  const exploradas = REGIONES.map((region) => ({
    region,
    hallazgos: TECNICAS.map((tecnica) => ({ tecnica, ...form.regiones[region][tecnica] })).filter(
      tieneContenido,
    ),
  })).filter((entrada) => entrada.hallazgos.length > 0)

  const anormales = exploradas.reduce(
    (total, entrada) => total + entrada.hallazgos.filter((h) => h.estado === 'anormal').length,
    0,
  )

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t(K.somatometria)}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(5, 1fr)' },
          }}
        >
          <Medida label={t(K.peso)} value={form.pesoKg} unit="kg" />
          <Medida label={t(K.talla)} value={form.tallaCm} unit="cm" />
          <Medida label={t(K.perimetro)} value={form.perimetroCm} unit="cm" />
          {/* El IMC se calcula, no se captura: es peso y talla, y guardarlo
              aparte sería un tercer sitio donde puede quedar desfasado. */}
          <Medida label={t(K.imc)} value={imc === null ? '' : imc.toFixed(1)} />
          <Medida label={t(K.glasgow)} value={form.glasgow} unit="pts" />
        </Box>
      </Paper>

      <Paper sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}
        >
          <Typography variant="h6">{t(K.detalle)}</Typography>
          <Box sx={{ flexGrow: 1 }} />
          {anormales > 0 && (
            <Chip
              size="small"
              color="error"
              label={t('exploracion.resumen.anormales', { count: String(anormales) })}
            />
          )}
          <Chip
            size="small"
            variant="outlined"
            label={t('exploracion.resumen.exploradas', {
              count: String(exploradas.length),
              total: String(REGIONES.length),
            })}
          />
        </Stack>

        {exploradas.length === 0 ? (
          <Alert severity="info">{t('exploracion.resumen.vacio')}</Alert>
        ) : (
          <Stack spacing={2}>
            {exploradas.map((entrada) => (
              <Box key={entrada.region}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  {t(REGION_KEY[entrada.region])}
                </Typography>
                <Stack spacing={0.5}>
                  {entrada.hallazgos.map((hallazgo) => (
                    <Stack
                      key={hallazgo.tecnica}
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'baseline', flexWrap: 'wrap' }}
                    >
                      <Chip
                        size="small"
                        variant={hallazgo.estado === 'anormal' ? 'filled' : 'outlined'}
                        color={hallazgo.estado === 'anormal' ? 'error' : 'default'}
                        label={t(TECNICA_KEY[hallazgo.tecnica])}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {hallazgo.texto.trim() === ''
                          ? t(
                              hallazgo.estado === 'anormal'
                                ? K.hallazgoAnormal
                                : K.hallazgoNormal,
                            )
                          : hallazgo.texto}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  )
}
