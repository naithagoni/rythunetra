import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/hooks/useLanguage'
import { Globe } from 'lucide-react'
import type { LanguageCode } from '@/types/i18n'
import { Button } from '@/components/ui/button'

const NATIVE_LABELS: Record<LanguageCode, string> = {
    en: 'En',
    te: 'తె',
}

export function LanguageToggle() {
    const { t } = useTranslation()
    const { currentLanguage, toggleLanguage, supportedLanguages } =
        useLanguage()

    const idx = supportedLanguages.indexOf(currentLanguage)
    const nextLang = supportedLanguages[(idx + 1) % supportedLanguages.length]

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="rounded-full gap-1.5 border text-neutral-300 hover:text-white bg-white/8 border-white/12 hover:bg-white/14 hover:border-white/20"
            aria-label={t('common.language')}
            title={t(`languages.${nextLang}`)}
        >
            <Globe className="h-3.5 w-3.5" />
            {NATIVE_LABELS[nextLang]}
        </Button>
    )
}
