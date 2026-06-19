import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import {
    adminGetAllCropVarieties,
    adminGetAllCrops,
} from '@/services/adminService'
import { Edit, Plus, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { CustomDropdown } from '@/components/common/CustomDropdown'
import type { LocalizedText } from '@/types/i18n'

interface VarietyRow {
    id: string
    name: LocalizedText
    major_crop: string
}

export function AdminVarietyListPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [selectedCropId, setSelectedCropId] = useState('')

    const { data: varietiesResult, isLoading } = useQuery({
        queryKey: ['admin-all-varieties'],
        queryFn: () => adminGetAllCropVarieties(),
    })

    const { data: cropsResult } = useQuery({
        queryKey: ['admin-all-crops'],
        queryFn: adminGetAllCrops,
    })

    const varieties = (varietiesResult?.data ?? []) as VarietyRow[]
    const crops = (cropsResult?.data ?? []) as {
        id: string
        name: LocalizedText
    }[]
    const cropMap = new Map(crops.map((c) => [c.id, c.name]))

    const handleAddVariety = () => {
        if (!selectedCropId) return
        navigate(`/admin/crops/${selectedCropId}/varieties/add`)
    }

    if (isLoading) return <LoadingSpinner />

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Link
                        to="/admin"
                        className="text-sm text-[#5E6AD2] hover:underline mb-1 inline-block"
                    >
                        ← {t('admin.dashboard')}
                    </Link>
                    <h1 className="text-2xl font-bold text-white">
                        {t('admin.varieties')}
                    </h1>
                    <p className="text-sm text-neutral-400">
                        {varieties.length} {t('common.total')}
                    </p>
                </div>
                {crops.length === 0 ? (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#D4A72C]/10 border border-[#D4A72C]/20 text-[#D4A72C] text-sm">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>
                            {t('admin.noCropsYet')}{' '}
                            <Link
                                to="/admin/crops/add"
                                className="font-medium underline hover:text-[#D4A72C]/80"
                            >
                                {t('admin.addCrop')}
                            </Link>
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <CustomDropdown
                            options={crops.map((c) => ({
                                value: c.id,
                                label: c.name?.en ?? c.id.slice(0, 8),
                            }))}
                            value={selectedCropId}
                            onChange={setSelectedCropId}
                            placeholder={t('admin.selectCrops')}
                            ariaLabel={t('admin.majorCrop')}
                            variant="form"
                        />
                        <Button
                            onClick={handleAddVariety}
                            disabled={!selectedCropId}
                            className="gap-2 whitespace-nowrap"
                        >
                            <Plus className="h-4 w-4" />
                            {t('admin.addVariety')}
                        </Button>
                    </div>
                )}
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
                                {t('admin.majorCrop')}
                            </th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {varieties.map((v) => {
                            const en = v.name?.en
                            const te = v.name?.te
                            const cropName = cropMap.get(v.major_crop)

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
                                        {cropName?.en ??
                                            v.major_crop.slice(0, 8)}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            to={`/admin/crops/${v.major_crop}/varieties/${v.id}`}
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
                                    colSpan={4}
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
