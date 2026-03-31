/**
 * Multi-language text field.
 * Following sample-data.ts pattern: { en, te }
 * Used throughout all entities for farmer-focused multi-language support.
 */
export interface LocalizedText {
    en: string
    te: string
}

/**
 * Multi-language text arrays (e.g. symptoms, aliases).
 */
export interface LocalizedTextArray {
    en: string[]
    te: string[]
}

/** Supported language codes */
export type LanguageCode = 'en' | 'te'

/** Helper to pick the right text for a given language */
export function localize(
    text: LocalizedText | undefined | null,
    lang: LanguageCode,
): string {
    if (!text) return ''
    return text[lang] || text.en || ''
}

/** Helper to pick the right array for a given language */
export function localizeArray(
    text: LocalizedTextArray | undefined | null,
    lang: LanguageCode,
): string[] {
    if (!text) return []
    return text[lang] || text.en || []
}
