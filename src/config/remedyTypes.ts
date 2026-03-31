export const REMEDY_TYPE_KEYS = [
    'bioFungicide',
    'bioPesticide',
    'botanicalExtract',
    'culturalPractice',
    'homemadeSpray',
    'mineralSupplement',
    'organicFertilizer',
    'trapOrLure',
] as const

export type RemedyTypeKey = (typeof REMEDY_TYPE_KEYS)[number]
