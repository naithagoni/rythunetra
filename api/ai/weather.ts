// Telangana district → approximate lat/lon mapping (fallback when mandal not specified)
const DISTRICT_COORDS: Record<string, { lat: number; lon: number }> = {
    adilabad: { lat: 19.67, lon: 78.53 },
    bhadradri_kothagudem: { lat: 17.55, lon: 80.62 },
    hyderabad: { lat: 17.39, lon: 78.49 },
    jagtial: { lat: 18.79, lon: 78.91 },
    jangaon: { lat: 17.73, lon: 79.15 },
    jayashankar_bhupalpally: { lat: 18.2, lon: 79.95 },
    jogulamba_gadwal: { lat: 16.23, lon: 77.81 },
    kamareddy: { lat: 18.32, lon: 78.34 },
    karimnagar: { lat: 18.44, lon: 79.13 },
    khammam: { lat: 17.25, lon: 80.15 },
    komaram_bheem_asifabad: { lat: 19.36, lon: 79.28 },
    mahabubabad: { lat: 17.6, lon: 80.0 },
    mahabubnagar: { lat: 16.74, lon: 78.0 },
    mancherial: { lat: 18.87, lon: 79.44 },
    medak: { lat: 18.05, lon: 78.26 },
    medchal_malkajgiri: { lat: 17.53, lon: 78.48 },
    mulugu: { lat: 18.19, lon: 79.94 },
    nagarkurnool: { lat: 16.48, lon: 78.31 },
    nalgonda: { lat: 17.06, lon: 79.27 },
    narayanpet: { lat: 16.74, lon: 77.5 },
    nirmal: { lat: 19.1, lon: 78.35 },
    nizamabad: { lat: 18.67, lon: 78.1 },
    peddapalli: { lat: 18.62, lon: 79.38 },
    rajanna_sircilla: { lat: 18.39, lon: 78.83 },
    ranga_reddy: { lat: 17.32, lon: 78.35 },
    sangareddy: { lat: 17.63, lon: 78.09 },
    siddipet: { lat: 18.1, lon: 78.85 },
    suryapet: { lat: 17.14, lon: 79.63 },
    vikarabad: { lat: 17.34, lon: 77.9 },
    wanaparthy: { lat: 16.36, lon: 78.06 },
    warangal_rural: { lat: 17.97, lon: 79.53 },
    warangal_urban: { lat: 17.97, lon: 79.6 },
    yadadri_bhuvanagiri: { lat: 17.59, lon: 78.96 },
}

// Mandal-level coordinates for precise weather (loaded lazily)
let mandalCoordsCache: Record<
    string,
    Record<string, { lat: number; lon: number }>
> | null = null

async function getMandalCoordsMap(): Promise<
    Record<string, Record<string, { lat: number; lon: number }>>
> {
    if (mandalCoordsCache) return mandalCoordsCache
    try {
        const { DISTRICT_MANDALS } = await import('../../src/config/mandals.js')
        mandalCoordsCache = {}
        for (const [district, mandals] of Object.entries(DISTRICT_MANDALS) as [string, Array<{ key: string; lat: number; lon: number }>][]) {
            mandalCoordsCache[district] = {}
            for (const m of mandals) {
                mandalCoordsCache[district][m.key] = { lat: m.lat, lon: m.lon }
            }
        }
        return mandalCoordsCache
    } catch {
        mandalCoordsCache = {}
        return mandalCoordsCache
    }
}

interface WeatherData {
    temp: number
    feelsLike: number
    humidity: number
    windSpeed: number
    description: string
    rainChance: boolean
    forecast: string[]
}

/**
 * Fetches weather data for a Telangana district/mandal.
 * If mandal is provided, uses mandal-level coordinates for precision.
 * Falls back to district-level coordinates.
 * Returns null if API key is missing or fetch fails (non-blocking).
 */
export async function getWeatherForDistrict(
    districtKey: string,
    mandalKey?: string,
): Promise<WeatherData | null> {
    const apiKey = process.env.WEATHER_API_KEY
    const baseUrl = process.env.WEATHER_API_URL
    if (!apiKey || !baseUrl) return null

    // Sanitize inputs: only allow alphanumeric + underscores (matching our key format)
    const sanitizedDistrict = districtKey
        .replace(/[^a-z0-9_]/gi, '')
        .toLowerCase()
    const sanitizedMandal = mandalKey?.replace(/[^a-z0-9_]/gi, '').toLowerCase()

    // Try mandal-level coords first, then fall back to district
    let coords: { lat: number; lon: number } | undefined
    if (sanitizedMandal) {
        const mandalMap = await getMandalCoordsMap()
        coords = mandalMap[sanitizedDistrict]?.[sanitizedMandal]
    }
    if (!coords) {
        coords = DISTRICT_COORDS[sanitizedDistrict]
    }
    if (!coords) return null

    try {
        // Current weather
        const currentRes = await fetch(
            `${baseUrl}/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${apiKey}`,
        )
        if (!currentRes.ok) return null
        const current = await currentRes.json()

        // 5-day / 3-hour forecast
        const forecastRes = await fetch(
            `${baseUrl}/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&cnt=8&appid=${apiKey}`,
        )
        const forecastData = forecastRes.ok ? await forecastRes.json() : null

        // Summarize next 24 hours from forecast
        const forecastSummary: string[] = []
        let rainExpected = false

        if (forecastData?.list) {
            for (const entry of forecastData.list.slice(0, 8)) {
                const time = new Date(entry.dt * 1000).toLocaleTimeString(
                    'en-IN',
                    { hour: '2-digit', minute: '2-digit', hour12: true },
                )
                const desc = entry.weather?.[0]?.description || ''
                const temp = Math.round(entry.main?.temp || 0)
                forecastSummary.push(`${time}: ${temp}°C, ${desc}`)

                if (
                    desc.includes('rain') ||
                    desc.includes('drizzle') ||
                    desc.includes('thunderstorm') ||
                    (entry.pop && entry.pop > 0.3)
                ) {
                    rainExpected = true
                }
            }
        }

        return {
            temp: Math.round(current.main?.temp || 0),
            feelsLike: Math.round(current.main?.feels_like || 0),
            humidity: current.main?.humidity || 0,
            windSpeed: Math.round((current.wind?.speed || 0) * 3.6), // m/s → km/h
            description: current.weather?.[0]?.description || '',
            rainChance: rainExpected,
            forecast: forecastSummary,
        }
    } catch (err) {
        console.error('Weather fetch failed:', err)
        return null
    }
}

/**
 * Builds a weather context string for AI prompts.
 * Returns empty string if weather data is unavailable.
 */
export function buildWeatherContext(
    weather: WeatherData | null,
    districtName?: string,
): string {
    if (!weather) return ''

    const lines = [
        `\n--- CURRENT WEATHER${districtName ? ` (${districtName})` : ''} ---`,
        `Temperature: ${weather.temp}°C (feels like ${weather.feelsLike}°C)`,
        `Humidity: ${weather.humidity}%`,
        `Wind: ${weather.windSpeed} km/h`,
        `Conditions: ${weather.description}`,
        weather.rainChance
            ? '⚠️ Rain expected in next 24 hours'
            : 'No rain expected in next 24 hours',
    ]

    if (weather.forecast.length > 0) {
        lines.push('\nNext 24-hour forecast:')
        lines.push(...weather.forecast)
    }

    lines.push('--- END WEATHER ---')

    return lines.join('\n')
}
