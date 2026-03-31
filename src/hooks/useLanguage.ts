import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import type { LanguageCode } from '@/types/i18n'

const SUPPORTED_LANGUAGES: LanguageCode[] = ['en', 'te']

export function useLanguage() {
    const { i18n } = useTranslation()

    const currentLanguage = i18n.language as LanguageCode

    /** Cycle through en → te → en */
    const toggleLanguage = useCallback(() => {
        const idx = SUPPORTED_LANGUAGES.indexOf(currentLanguage)
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
