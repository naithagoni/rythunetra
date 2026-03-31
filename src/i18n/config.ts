import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import te from './locales/te.json'
import { DEFAULT_LANGUAGE } from '@/config/env'

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            te: { translation: te },
        },
        fallbackLng: DEFAULT_LANGUAGE,
        interpolation: { escapeValue: false },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    })

// Sync <html lang> with detected language on init and on every change
document.documentElement.lang = i18n.language
i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng
})

export default i18n
