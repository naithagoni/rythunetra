export interface RecommendRequestBody {
    soilType: string
    soilSubType?: string
    phLevel?: number
    season: string
    district?: string
    mandal?: string
    irrigation?: string
    language?: string
}
