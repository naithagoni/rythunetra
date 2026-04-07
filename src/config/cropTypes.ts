export const CROP_TYPE_KEYS = [
    'cereal',
    'flower',
    'fruit',
    'oilseed',
    'pulse',
    'spice',
    'vegetable',
] as const

export type CropTypeKey = (typeof CROP_TYPE_KEYS)[number]
