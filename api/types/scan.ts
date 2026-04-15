export interface RemedyRow {
    id: string
    name: unknown
    type: unknown
    how_it_works: unknown
    usage_instructions: unknown
    preparation_instructions: unknown
    ingredients: unknown
    effectiveness: unknown
}

export interface DiseaseRemedyJoinRow {
    remedy_id: string
    remedies: RemedyRow[]
}
