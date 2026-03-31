export const SEASON_KEYS = ['kharif', 'rabi', 'zaid'] as const

export type SeasonKey = (typeof SEASON_KEYS)[number]

export const SEASON_MONTHS: Record<SeasonKey, string[]> = {
    kharif: ['june', 'july', 'august', 'september', 'october'],
    rabi: ['november', 'december', 'january', 'february', 'march'],
    zaid: ['march', 'april', 'may', 'june'],
}
