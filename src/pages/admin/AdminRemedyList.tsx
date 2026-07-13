import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminGetRemedies, adminDeleteRemedy } from '@/services/adminService'
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

export function AdminRemedyListPage() {
    const { t } = useTranslation()
    const [page, setPage] = useState(1)
    const queryClient = useQueryClient()

    const { data: result, isLoading } = useQuery({
        queryKey: ['admin-remedies', page],
        queryFn: () => adminGetRemedies(page),
    })

    const remedies = result?.data ?? []
    const totalCount = result?.count ?? 0
    const totalPages = Math.ceil(totalCount / ADMIN_PAGE_SIZE)

    const handleDelete = async (id: string) => {
        if (!confirm(t('admin.deleteConfirm'))) return
        const { error } = await adminDeleteRemedy(id)
        if (error) return
        queryClient.invalidateQueries({ queryKey: ['admin-remedies'] })
    }

    if (isLoading) return <LoadingSpinner />

    return (
        <PageContainer size="lg">
            <PageHeader
                backTo="/admin"
                backLabel={t('admin.dashboard')}
                title={t('admin.remedies')}
                description={`${totalCount} ${t('common.total')}`}
                action={
                    <Button asChild>
                        <Link to="/admin/remedies/add">
                            <Plus data-icon="inline-start" />
                            {t('admin.addRemedy')}
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
                            <TableHead className="text-center">
                                {t('diseases.effectiveness')}
                            </TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {remedies.map((r: Record<string, unknown>) => {
                            const name = r.name as
                                | { en: string; te: string }
                                | undefined
                            const enName = name?.en ?? '—'
                            const teName = name?.te ?? ''

                            return (
                                <TableRow key={r.id as string}>
                                    <TableCell className="text-xs text-muted-foreground font-mono">
                                        {(r.id as string).slice(0, 8)}
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
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                r.effectiveness === 'high'
                                                    ? 'bg-green-100 text-green-900'
                                                    : r.effectiveness ===
                                                        'medium'
                                                      ? 'bg-amber-100 text-amber-900'
                                                      : 'bg-muted text-muted-foreground'
                                            }`}
                                        >
                                            {t(
                                                `diseases.${(r.effectiveness as string) ?? 'medium'}`,
                                            )}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="inline-flex items-center gap-1">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                            >
                                                <Link
                                                    to={`/admin/remedies/${r.id}`}
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
                                                    handleDelete(r.id as string)
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
                        {remedies.length === 0 && (
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
