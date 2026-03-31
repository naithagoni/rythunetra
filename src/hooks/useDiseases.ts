import { useQuery } from '@tanstack/react-query'
import { getDiseases, getDiseaseById } from '@/services/diseaseService'

export function useDiseases(options?: {
    language?: string
    page?: number
    search?: string
    severity?: string
}) {
    return useQuery({
        queryKey: ['diseases', options],
        queryFn: () => getDiseases(options),
    })
}

export function useDisease(id: string) {
    return useQuery({
        queryKey: ['disease', id],
        queryFn: () => getDiseaseById(id),
        enabled: !!id,
    })
}
