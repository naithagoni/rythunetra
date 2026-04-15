import type { DistrictKey } from './districts'
import type { SoilTypeKey } from './soilTypes'

export const AGRO_CLIMATIC_ZONE_KEYS = [
    'northern_telangana',
    'central_telangana',
    'southern_telangana',
] as const

export type AgroClimaticZoneKey = (typeof AGRO_CLIMATIC_ZONE_KEYS)[number]

/** Rainfall breakdown by season (mm) */
export interface SeasonalRainfall {
    southWest: number
    northEast: number
    winter: number
    summer: number
}

/** Temperature range in °C */
export interface TemperatureRange {
    min: number
    max: number
}

export interface AgroClimaticZone {
    key: AgroClimaticZoneKey
    districts: DistrictKey[]
    mandalCount: number
    /** sq. km */
    geographicalArea: number
    /** Annual average rainfall in mm */
    annualRainfall: { avg: number; min: number; max: number }
    seasonalRainfall: SeasonalRainfall
    temperature: {
        annualMean: TemperatureRange
        annualMax: TemperatureRange
        annualMin: TemperatureRange
        winterMin: TemperatureRange
        summerMax: TemperatureRange
    }
    /** Dependable rainfall (75% probability) Jun–Oct in mm */
    dependableRainfall: TemperatureRange
    /** Dominant soil types ordered by prevalence */
    dominantSoils: { type: SoilTypeKey; percentage: number }[]
    /** Major crops grown in this zone */
    majorCrops: string[]
}

export const AGRO_CLIMATIC_ZONES: Record<AgroClimaticZoneKey, AgroClimaticZone> =
    {
        northern_telangana: {
            key: 'northern_telangana',
            districts: [
                'adilabad',
                'komaram_bheem_asifabad',
                'nirmal',
                'mancherial',
                'nizamabad',
                'jagtial',
                'peddapalli',
                'kamareddy',
                'rajanna_sircilla',
                'karimnagar',
            ],
            mandalCount: 180,
            geographicalArea: 33110.85,
            annualRainfall: { avg: 1033, min: 867, max: 1189 },
            seasonalRainfall: {
                southWest: 840,
                northEast: 104,
                winter: 30,
                summer: 58,
            },
            temperature: {
                annualMean: { min: 26.7, max: 27.2 },
                annualMax: { min: 33.1, max: 33.9 },
                annualMin: { min: 20.1, max: 20.9 },
                winterMin: { min: 15.7, max: 16.9 },
                summerMax: { min: 38.7, max: 39.9 },
            },
            dependableRainfall: { min: 237, max: 812 },
            dominantSoils: [
                { type: 'red', percentage: 45 },
                { type: 'black', percentage: 24 },
                { type: 'calcareous', percentage: 20 },
            ],
            majorCrops: [
                'mango',
                'sapota',
                'guava',
                'sitaphal',
                'tomato',
                'french beans',
                'leafy vegetables',
                'green chilli',
                'turmeric',
                'coriander',
            ],
        },

        central_telangana: {
            key: 'central_telangana',
            districts: [
                'sangareddy',
                'medak',
                'siddipet',
                'jangaon',
                'warangal_urban',
                'warangal_rural',
                'mahabubabad',
                'jayashankar_bhupalpally',
                'mulugu',
                'bhadradri_kothagudem',
                'khammam',
            ],
            mandalCount: 187,
            geographicalArea: 38746.57,
            annualRainfall: { avg: 978, min: 779, max: 1213 },
            seasonalRainfall: {
                southWest: 758,
                northEast: 121,
                winter: 24,
                summer: 75,
            },
            temperature: {
                annualMean: { min: 26.8, max: 27.9 },
                annualMax: { min: 32.8, max: 33.7 },
                annualMin: { min: 20.4, max: 22.4 },
                winterMin: { min: 16.6, max: 18.7 },
                summerMax: { min: 37.2, max: 38.9 },
            },
            dependableRainfall: { min: 250, max: 766 },
            dominantSoils: [
                { type: 'red', percentage: 54 },
                { type: 'calcareous', percentage: 13 },
                { type: 'alluvioColluvial', percentage: 8 },
                { type: 'black', percentage: 6 },
            ],
            majorCrops: [
                'mango',
                'guava',
                'banana',
                'sitaphal',
                'oil palm',
                'coconut',
                'cashew nut',
                'watermelon',
                'pomegranate',
                'papaya',
                'paprika',
                'gourds',
                'tomato',
                'brinjal',
                'potato',
                'onion',
                'green chilli',
                'dolichus beans',
                'leafy vegetables',
                'red chillies',
                'ginger',
            ],
        },

        southern_telangana: {
            key: 'southern_telangana',
            districts: [
                'vikarabad',
                'medchal_malkajgiri',
                'hyderabad',
                'yadadri_bhuvanagiri',
                'ranga_reddy',
                'mahabubnagar',
                'nalgonda',
                'suryapet',
                'wanaparthy',
                'nagarkurnool',
                'narayanpet',
                'jogulamba_gadwal',
            ],
            mandalCount: 217,
            geographicalArea: 40177.23,
            annualRainfall: { avg: 731, min: 606, max: 853 },
            seasonalRainfall: {
                southWest: 524,
                northEast: 130,
                winter: 17,
                summer: 61,
            },
            temperature: {
                annualMean: { min: 26.9, max: 27.8 },
                annualMax: { min: 33.2, max: 33.9 },
                annualMin: { min: 20.6, max: 22.1 },
                winterMin: { min: 16.9, max: 18.3 },
                summerMax: { min: 38.2, max: 38.9 },
            },
            dependableRainfall: { min: 166, max: 469 },
            dominantSoils: [
                { type: 'red', percentage: 54.8 },
                { type: 'alluvioColluvial', percentage: 14.4 },
                { type: 'calcareous', percentage: 11.2 },
            ],
            majorCrops: [
                'grapes',
                'papaya',
                'sweet orange',
                'mango',
                'sitaphal',
                'watermelon',
                'pomegranate',
                'tomato',
                'brinjal',
                'bhendi',
                'gourds',
                'gherkins',
                'colocasia',
                'sweet potato',
                'onion',
                'leafy vegetables',
                'green chilli',
                'cucumber',
                'flower crops',
                'aromatic plants',
            ],
        },
    }

/** Look up the agro-climatic zone for a given district */
export function getZoneByDistrict(
    district: DistrictKey,
): AgroClimaticZone | undefined {
    return Object.values(AGRO_CLIMATIC_ZONES).find((zone) =>
        zone.districts.includes(district),
    )
}

/** Get the zone key for a given district */
export function getZoneKeyByDistrict(
    district: DistrictKey,
): AgroClimaticZoneKey | undefined {
    for (const zone of Object.values(AGRO_CLIMATIC_ZONES)) {
        if (zone.districts.includes(district)) return zone.key
    }
    return undefined
}

type CropKey =
        | 'rice'
        | 'sorghum'
        | 'cotton'
        | 'groundnut'
        | 'sugarcane'
        | 'maize'
        | 'redGram'

type SoilCompatibility = Partial<Record<SoilTypeKey, readonly string[]>>

export const CROP_SOIL_COMPATIBILITY: Record<CropKey, SoilCompatibility> = {
        rice: {
                alluvioColluvial: ['alluvial'],
                black: ['deep'],
        },

        sorghum: {
                black: ['medium', 'deep'],
                red: ['clayey', 'gravellyLoam'],
        },

        cotton: {
                black: ['deep'],
        },

        groundnut: {
                red: ['sandyLoam', 'gravellyLoam'],
        },

        sugarcane: {
                alluvioColluvial: ['alluvial'],
                black: ['deep'],
                calcareous: ['deepCalcareous'],
        },

        maize: {
                red: ['sandyLoam', 'gravellyLoam'],
                black: ['medium', 'deep'],
        },
        redGram: {
                red: ['clayey', 'gravellyLoam', 'sandyLoam'],
                black: ['shallow', 'medium'],
        },
} as const
