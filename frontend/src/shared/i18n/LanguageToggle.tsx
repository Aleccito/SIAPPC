import { Button } from '@mui/material'
import TranslateIcon from '@mui/icons-material/Translate'
import { useLanguage } from './useLanguage'

export function LanguageToggle({ color }: { color?: 'inherit' }) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <Button
      size="small"
      color={color}
      startIcon={<TranslateIcon />}
      aria-label={t('language.switch')}
      onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
    >
      {language === 'es' ? 'EN' : 'ES'}
    </Button>
  )
}
