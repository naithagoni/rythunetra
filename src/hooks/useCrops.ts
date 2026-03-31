import { useQuery } from '@tanstack/react-query'
import { getCrops, getCropById, getCropVarieties } from '@/services/cropService'
import type { CropRow, CropVarietyRow } from '@/types/crop'
import { toCrop, toCropVariety } from '@/types/crop'

export function useCrops() {
    return useQuery({
        queryKey: ['crops'],
        queryFn: async () => {
            const { data, error } = await getCrops()
            if (error) throw error
            return ((data as CropRow[]) ?? []).map(toCrop)
        },
    })
}

export function useCrop(id: string) {
    return useQuery({
        queryKey: ['crop', id],
        queryFn: async () => {
            const { data, error } = await getCropById(id)
            if (error) throw error
            return data ? toCrop(data) : null
        },
        enabled: !!id,
    })
}

export function useCropVarieties(cropId: string) {
    return useQuery({
        queryKey: ['cropVarieties', cropId],
        queryFn: async () => {
            const { data, error } = await getCropVarieties(cropId)
            if (error) throw error
            return ((data as CropVarietyRow[]) ?? []).map(toCropVariety)
        },
        enabled: !!cropId,
    })
}
