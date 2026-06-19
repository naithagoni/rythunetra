import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { adminGetCropVarieties, adminGetCrop } from '@/services/adminService'
import { Plus, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import type { CropVarietyRow } from '@/types/crop'
import type { LocalizedText } from '@/types/i18n'

export function AdminCropVarietyListPage() {
    const { cropId } = useParams<{ cropId: string }>()
    const { t } = useTranslation()

    const { data: cropResult, isLoading: cropLoading } = useQuery({
        queryKey: ['admin-crop', cropId],
        queryFn: () => adminGetCrop(cropId!),
        enabled: !!cropId,
    })

    const { data: result, isLoading } = useQuery({
        queryKey: ['admin-crop-varieties', cropId],
        queryFn: () => adminGetCropVarieties(cropId!),
        enabled: !!cropId,
    })

    const varieties = (result?.data ?? []) as CropVarietyRow[]
    const cropName =
        (cropResult?.data as { name?: LocalizedText } | null)?.name?.en ??
        cropId?.slice(0, 8)

    if (isLoading || cropLoading) return <LoadingSpinner />

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Link
                        to={`/admin/crops/${cropId}`}
                        className="text-sm text-[#5E6AD2] hover:underline mb-1 inline-block"
                    >
                        ← {cropName}
                    </Link>
                    <h1 className="text-2xl font-bold text-white">
                        {t('admin.varieties')}
                    </h1>
                    <p className="text-sm text-neutral-400">
                        {varieties.length} {t('common.total')}
                    </p>
                </div>
                <Button asChild className="gap-2">
                    <Link to={`/admin/crops/${cropId}/varieties/add`}>
                        <Plus className="h-4 w-4" />
                        {t('admin.addVariety')}
                    </Link>
                </Button>
            </div>

            <div className="bg-[#161618] rounded-xl border border-white/[0.06] overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-white/[0.03] border-b border-white/[0.06]">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold">
                                ID
                            </th>
                            <th className="text-left px-4 py-3 font-semibold">
                                {t('admin.name')}
                            </th>
                            <th className="text-left px-4 py-3 font-semibold">
                                {t('admin.districts')}
                            </th>
                            <th className="text-left px-4 py-3 font-semibold">
                                {t('admin.seasons')}
                            </th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {varieties.map((v) => {
                            const en = v.name?.en
                            const te = v.name?.te
                            const districtCount = v.districts?.length ?? 0
                            const seasonCount =
                                v.recommended_seasons?.length ?? 0

                            return (
                                <tr
                                    key={v.id}
                                    className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.04]"
                                >
                                    <td className="px-4 py-3 text-xs text-neutral-400 font-mono">
                                        {v.id.slice(0, 8)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium">
                                            {en ?? '—'}
                                        </div>
                                        {te && (
                                            <div className="text-xs text-neutral-400">
                                                {te}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-neutral-400">
                                        {districtCount}
                                    </td>
                                    <td className="px-4 py-3 text-neutral-400">
                                        {seasonCount}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            to={`/admin/crops/${cropId}/varieties/${v.id}`}
                                            className="text-[#5E6AD2] hover:underline inline-flex items-center gap-1"
                                        >
                                            <Edit className="h-3.5 w-3.5" />
                                            {t('common.edit')}
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}
                        {varieties.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-12 text-center text-neutral-400"
                                >
                                    {t('admin.noVarieties')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
