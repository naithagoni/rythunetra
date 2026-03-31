import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/hooks/useLanguage'
import { Globe } from 'lucide-react'
import type { LanguageCode } from '@/types/i18n'

/** Native-script labels shown on the toggle button */
const NATIVE_LABELS: Record<LanguageCode, string> = {
    en: 'En',
    te: 'తె',
}

/** Shows the NEXT language label so users know what they'll switch to */
export function LanguageToggle({
    variant = 'light',
}: {
    variant?: 'light' | 'dark'
}) {
    const { t } = useTranslation()
    const { currentLanguage, toggleLanguage, supportedLanguages } =
        useLanguage()

    const idx = supportedLanguages.indexOf(currentLanguage)
    const nextLang = supportedLanguages[(idx + 1) % supportedLanguages.length]

    return (
        <button
            onClick={toggleLanguage}
            className={
                variant === 'dark'
                    ? 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-neutral-300 hover:text-white bg-white/8 border border-white/12 hover:bg-white/14 hover:border-white/20 transition-all duration-200'
                    : 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-white/60 border border-neutral-200/80 hover:bg-white hover:border-neutral-300 hover:shadow-sm transition-all duration-200'
            }
            aria-label={t('common.language')}
            title={t(`languages.${nextLang}`)}
        >
            <Globe className="h-3.5 w-3.5" />
            {NATIVE_LABELS[nextLang]}
        </button>
    )
}
