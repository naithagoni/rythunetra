import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import type { LanguageCode } from '@/types/i18n'

const SUPPORTED_LANGUAGES: LanguageCode[] = ['en', 'te']

export function useLanguage() {
    const { i18n } = useTranslation()

    // Normalise to the base code ("en-US" → "en") so a regional navigator
    // locale never leaks through; fall back to the first supported language.
    const base = (i18n.language || '').split('-')[0] as LanguageCode
    const currentLanguage: LanguageCode = SUPPORTED_LANGUAGES.includes(base)
        ? base
        : SUPPORTED_LANGUAGES[0]

    /** Cycle through en → te → en */
    const toggleLanguage = useCallback(() => {
        const idx = SUPPORTED_LANGUAGES.indexOf(currentLanguage)
        // idx is always ≥ 0 because currentLanguage is normalised above.
        const nextIdx = (idx + 1) % SUPPORTED_LANGUAGES.length
        const newLang = SUPPORTED_LANGUAGES[nextIdx]
        i18n.changeLanguage(newLang)
    }, [currentLanguage, i18n])

    const setLanguage = useCallback(
        (lang: LanguageCode) => {
            i18n.changeLanguage(lang)
        },
        [i18n],
    )

    return {
        currentLanguage,
        toggleLanguage,
        setLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
    }
}
