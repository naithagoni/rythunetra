/** Major soil type keys */
export const SOIL_TYPE_KEYS = [
    'red',
    'black',
    'calcareous',
    'alluvioColluvial',
] as const

export type SoilTypeKey = (typeof SOIL_TYPE_KEYS)[number]

/** Sub-type keys grouped by major type */
export const SOIL_SUB_TYPE_MAP: Record<SoilTypeKey, readonly string[]> = {
    red: ['clayey', 'shallowGravelly', 'gravellyLoam', 'sandyLoam'],
    black: ['shallow', 'medium', 'deep'],
    calcareous: ['deepCalcareous'],
    alluvioColluvial: ['alluvial', 'colluvial', 'alluvioColluvial'],
} as const

/** A single soil type entry with explicit type + subType */
export interface SoilTypeEntry {
    type: SoilTypeKey
    subType: string
}

/** Flat list of all soil type entries */
export const ALL_SOIL_ENTRIES: SoilTypeEntry[] = SOIL_TYPE_KEYS.flatMap(
    (major) =>
        SOIL_SUB_TYPE_MAP[major].map((sub) => ({ type: major, subType: sub })),
)

/**
 * Unique string key for a soil type entry (used as option value / React key).
 * e.g. { type: 'red', subType: 'clayey' } → 'red::clayey'
 */
export function soilEntryKey(entry: { type: string; subType: string }): string {
    return `${entry.type}::${entry.subType}`
}

/**
 * Parse a key string back into a SoilTypeEntry.
 * e.g. 'red::clayey' → { type: 'red', subType: 'clayey' }
 */
export function parseSoilEntryKey(key: string): SoilTypeEntry | null {
    const [type, subType] = key.split('::')
    if (!type || !subType) return null
    if (!SOIL_TYPE_KEYS.includes(type as SoilTypeKey)) return null
    if (!SOIL_SUB_TYPE_MAP[type as SoilTypeKey]?.includes(subType)) return null
    return { type: type as SoilTypeKey, subType }
}
