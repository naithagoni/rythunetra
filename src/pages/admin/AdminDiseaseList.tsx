import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminGetDiseases, adminDeleteDisease } from '@/services/adminService'
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ADMIN_PAGE_SIZE } from '@/config/env'

export function AdminDiseaseListPage() {
    const { t } = useTranslation()
    const [page, setPage] = useState(1)
    const queryClient = useQueryClient()

    const { data: result, isLoading } = useQuery({
        queryKey: ['admin-diseases', page],
        queryFn: () => adminGetDiseases(page),
    })

    const diseases = result?.data ?? []
    const totalCount = result?.count ?? 0
    const totalPages = Math.ceil(totalCount / ADMIN_PAGE_SIZE)

    const handleDelete = async (id: string) => {
        if (!confirm(t('admin.deleteConfirm'))) return
        const { error } = await adminDeleteDisease(id)
        if (error) return
        queryClient.invalidateQueries({ queryKey: ['admin-diseases'] })
        queryClient.invalidateQueries({ queryKey: ['diseases'] })
    }

    if (isLoading) return <LoadingSpinner />

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Link
                        to="/admin"
                        className="text-sm text-primary-600 hover:underline mb-1 inline-block"
                    >
                        ← {t('admin.dashboard')}
                    </Link>
                    <h1 className="text-2xl font-bold text-neutral-900">
                        {t('admin.diseases')}
                    </h1>
                    <p className="text-sm text-neutral-400">
                        {totalCount} {t('common.total')}
                    </p>
                </div>
                <Link
                    to="/admin/diseases/add"
                    className="btn-primary inline-flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    {t('admin.addDisease')}
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold">
                                ID
                            </th>
                            <th className="text-left px-4 py-3 font-semibold">
                                {t('admin.name')}
                            </th>
                            <th className="text-center px-4 py-3 font-semibold">
                                Images
                            </th>
                            <th className="text-center px-4 py-3 font-semibold">
                                {t('admin.remedyCount')}
                            </th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100">
                        {diseases.map((d: Record<string, unknown>) => {
                            const name = d.name as
                                | { en: string; te: string }
                                | undefined
                            const enName = name?.en ?? '—'
                            const teName = name?.te ?? ''
                            const imageUrls = d.image_urls as
                                | string[]
                                | undefined
                            const imageCount = imageUrls?.length ?? 0
                            const remedyCount = 0 // Not fetched in list view

                            return (
                                <tr
                                    key={d.id as string}
                                    className="hover:bg-neutral-50"
                                >
                                    <td className="px-4 py-3 text-xs text-neutral-400 font-mono">
                                        {(d.id as string).slice(0, 8)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium">
                                            {enName}
                                        </div>
                                        {teName && (
                                            <div className="text-xs text-neutral-400">
                                                {teName}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {imageCount}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {remedyCount}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="inline-flex items-center gap-3">
                                            <Link
                                                to={`/admin/diseases/${d.id}`}
                                                className="text-primary-600 hover:underline inline-flex items-center gap-1 text-sm"
                                            >
                                                <Edit className="h-3.5 w-3.5" />
                                                {t('common.edit')}
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(d.id as string)
                                                }
                                                className="text-red-500 hover:text-red-700 inline-flex items-center gap-1 text-sm cursor-pointer"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                {t('common.delete')}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        {diseases.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-8 text-center text-neutral-400"
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
                        className="px-4 py-2 rounded-lg bg-neutral-100 text-sm font-medium disabled:opacity-30 inline-flex items-center gap-1"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        {t('common.previous')}
                    </button>
                    <span className="text-sm font-medium text-neutral-600">
                        {page} / {totalPages}
                    </span>
                    <button
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-lg bg-neutral-100 text-sm font-medium disabled:opacity-30 inline-flex items-center gap-1"
                    >
                        {t('common.next')}
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    )
}
