import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { adminGetCrops } from '@/services/adminService'
import { Plus, Edit, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ADMIN_PAGE_SIZE } from '@/config/env'
import { getCropImage } from '@/utils/cropImages'
import type { CropRow } from '@/types/crop'

export function AdminCropListPage() {
    const { t } = useTranslation()
    const [page, setPage] = useState(1)

    const { data: result, isLoading } = useQuery({
        queryKey: ['admin-crops', page],
        queryFn: () => adminGetCrops(page),
    })

    const crops = result?.data ?? []
    const totalCount = result?.count ?? 0
    const totalPages = Math.ceil(totalCount / ADMIN_PAGE_SIZE)

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
                        {t('admin.crops')}
                    </h1>
                    <p className="text-sm text-neutral-400">
                        {totalCount} {t('common.total')}
                    </p>
                </div>
                <Button asChild className="gap-2">
                    <Link to="/admin/crops/add">
                        <Plus className="h-4 w-4" />
                        {t('admin.addCrop')}
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
                                {t('admin.cropImage')}
                            </th>
                            <th className="text-left px-4 py-3 font-semibold">
                                {t('admin.name')}
                            </th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {crops.map((crop: CropRow) => {
                            const en = crop.name?.en
                            const te = crop.name?.te

                            return (
                                <tr
                                    key={crop.id}
                                    className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.04]"
                                >
                                    <td className="px-4 py-3 text-xs text-neutral-400 font-mono">
                                        {crop.id.slice(0, 8)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <img
                                            src={getCropImage(crop.image_url)}
                                            alt={en ?? ''}
                                            className="h-10 w-14 object-cover rounded-md"
                                        />
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
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            to={`/admin/crops/${crop.id}`}
                                            className="text-[#5E6AD2] hover:underline inline-flex items-center gap-1"
                                        >
                                            <Edit className="h-3.5 w-3.5" />
                                            {t('common.edit')}
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}
                        {crops.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-4 py-12 text-center text-neutral-400"
                                >
                                    {t('common.noResults')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg hover:bg-white/[0.04] disabled:opacity-30"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="text-sm">
                        {page} / {totalPages}
                    </span>
                    <button
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                        className="p-2 rounded-lg hover:bg-white/[0.04] disabled:opacity-30"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            )}
        </div>
    )
}
