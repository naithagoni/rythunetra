export interface WeatherData {
    temp: number
    feelsLike: number
    humidity: number
    windSpeed: number
    description: string
    rainChance: boolean
    forecast: string[]
}

export interface Coordinates {
    lat: number
    lon: number
}

export interface OpenWeatherCondition {
    description?: string
}

export interface OpenWeatherCurrentResponse {
    main?: {
        temp?: number
        feels_like?: number
        humidity?: number
    }
    wind?: {
        speed?: number
    }
    weather?: OpenWeatherCondition[]
}

export interface OpenWeatherForecastEntry {
    dt: number
    main?: {
        temp?: number
    }
    weather?: OpenWeatherCondition[]
    pop?: number
}

export interface OpenWeatherForecastResponse {
    list?: OpenWeatherForecastEntry[]
}
