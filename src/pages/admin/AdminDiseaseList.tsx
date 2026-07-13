import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminGetDiseases, adminDeleteDisease } from '@/services/adminService'
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
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
        <PageContainer size="lg">
            <PageHeader
                backTo="/admin"
                backLabel={t('admin.dashboard')}
                title={t('admin.diseases')}
                description={`${totalCount} ${t('common.total')}`}
                action={
                    <Button asChild>
                        <Link to="/admin/diseases/add">
                            <Plus data-icon="inline-start" />
                            {t('admin.addDisease')}
                        </Link>
                    </Button>
                }
            />

            <Card className="p-0 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>{t('admin.name')}</TableHead>
                            <TableHead className="text-center">Images</TableHead>
                            <TableHead className="text-center">
                                {t('admin.remedyCount')}
                            </TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
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
                                <TableRow key={d.id as string}>
                                    <TableCell className="text-xs text-muted-foreground font-mono">
                                        {(d.id as string).slice(0, 8)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">
                                            {enName}
                                        </div>
                                        {teName && (
                                            <div className="text-xs text-muted-foreground">
                                                {teName}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {imageCount}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {remedyCount}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="inline-flex items-center gap-1">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                            >
                                                <Link
                                                    to={`/admin/diseases/${d.id}`}
                                                >
                                                    <Edit data-icon="inline-start" />
                                                    {t('common.edit')}
                                                </Link>
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() =>
                                                    handleDelete(d.id as string)
                                                }
                                            >
                                                <Trash2 data-icon="inline-start" />
                                                {t('common.delete')}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {diseases.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="py-8 text-center text-muted-foreground"
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
                        {t('common.previous')}
                    </Button>
                    <span className="text-sm font-medium text-muted-foreground">
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
                        {t('common.next')}
                        <ChevronRight data-icon="inline-end" />
                    </Button>
                </div>
            )}
        </PageContainer>
    )
}
