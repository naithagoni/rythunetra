/**
 * Translation service using Google Translate (free, no API key required).
 * Supports EN → TE translation for RythuNetra admin forms.
 *
 * For higher volume or production use, swap to Google Cloud Translation (paid).
 */

import { TRANSLATION_API_URL } from '@/config/env'

/**
 * Translate a single text string from source to target language.
 * Returns original text on failure (never throws).
 */
export async function translateText(
    text: string,
    from = 'en',
    to = 'te',
): Promise<string> {
    if (!text.trim()) return ''

    try {
        const params = new URLSearchParams({
            client: 'gtx',
            sl: from,
            tl: to,
            dt: 't',
            q: text,
        })

        const response = await fetch(`${TRANSLATION_API_URL}?${params}`)
        if (!response.ok) return text

        const data = await response.json()

        // Google returns [[["translated","original",...],...],...]
        if (Array.isArray(data) && Array.isArray(data[0])) {
            const translated = data[0]
                .map((segment: [string]) => segment[0])
                .join('')
            if (translated) return translated
        }

        return text
    } catch {
        console.warn('Translation failed, returning original text')
        return text
    }
}

/**
 * Translate multiple text strings in parallel.
 * Returns an array of translated strings (same order as input).
 */
export async function translateBatch(
    texts: string[],
    from = 'en',
    to = 'te',
): Promise<string[]> {
    return Promise.all(texts.map((t) => translateText(t, from, to)))
}
