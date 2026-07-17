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
import { PageHeader } from '@/components/common/PageHeader'
import { PageContainer } from '@/components/common/PageContainer'
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
        <PageContainer size="lg">
            <PageHeader
                backTo="/admin"
                backLabel={t('admin.dashboard')}
                title={t('admin.crops')}
                description={`${totalCount} ${t('common.total')}`}
                action={
                    <Button asChild>
                        <Link to="/admin/crops/add">
                            <Plus data-icon="inline-start" />
                            {t('admin.addCrop')}
                        </Link>
                    </Button>
                }
            />

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
                                            variant="outline"
                                            size="sm"
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
        </PageContainer>
    )
}
