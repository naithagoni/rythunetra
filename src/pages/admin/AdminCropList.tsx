import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { adminGetCrops } from '@/services/adminService'
import { Plus, Edit, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table'
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
                        className="text-sm text-primary hover:underline mb-1 inline-block"
                    >
                        ← {t('admin.dashboard')}
                    </Link>
                    <h1 className="text-2xl font-bold text-foreground">
                        {t('admin.crops')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {totalCount} {t('common.total')}
                    </p>
                </div>
                <Button asChild className="gap-2">
                    <Link to="/admin/crops/add">
                        <Plus className="size-4" />
                        {t('admin.addCrop')}
                    </Link>
                </Button>
            </div>

            <Card className="p-0 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>{t('admin.cropImage')}</TableHead>
                            <TableHead>{t('admin.name')}</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {crops.map((crop: CropRow) => {
                            const en = crop.name?.en
                            const te = crop.name?.te

                            return (
                                <TableRow key={crop.id}>
                                    <TableCell className="text-xs text-muted-foreground font-mono">
                                        {crop.id.slice(0, 8)}
                                    </TableCell>
                                    <TableCell>
                                        <img
                                            src={getCropImage(crop.image_url)}
                                            alt={en ?? ''}
                                            className="h-10 w-14 object-cover rounded-md"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">
                                            {en ?? '—'}
                                        </div>
                                        {te && (
                                            <div className="text-xs text-muted-foreground">
                                                {te}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="sm"
                                            className="text-primary"
                                        >
                                            <Link
                                                to={`/admin/crops/${crop.id}`}
                                            >
                                                <Edit data-icon="inline-start" />
                                                {t('common.edit')}
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {crops.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="py-12 text-center text-muted-foreground"
                                >
                                    {t('common.noResults')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeft data-icon="inline-start" />
                    </Button>
                    <span className="text-sm">
                        {page} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                    >
                        <ChevronRight data-icon="inline-end" />
                    </Button>
                </div>
            )}
        </div>
    )
}
