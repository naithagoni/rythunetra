export const DISEASE_TYPE_KEYS = [
    'bacterial',
    'fungal',
    'nutritional',
    'viral',
] as const

export type DiseaseTypeKey = (typeof DISEASE_TYPE_KEYS)[number]
