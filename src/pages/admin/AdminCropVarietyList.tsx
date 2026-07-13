import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { adminGetCropVarieties, adminGetCrop } from '@/services/adminService'
import { Plus, Edit } from 'lucide-react'
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
        <PageContainer size="lg">
            <PageHeader
                backTo={`/admin/crops/${cropId}`}
                backLabel={cropName}
                title={t('admin.varieties')}
                description={`${varieties.length} ${t('common.total')}`}
                action={
                    <Button asChild>
                        <Link to={`/admin/crops/${cropId}/varieties/add`}>
                            <Plus data-icon="inline-start" />
                            {t('admin.addVariety')}
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
                            <TableHead>{t('admin.districts')}</TableHead>
                            <TableHead>{t('admin.seasons')}</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {varieties.map((v) => {
                            const en = v.name?.en
                            const te = v.name?.te
                            const districtCount = v.districts?.length ?? 0
                            const seasonCount =
                                v.recommended_seasons?.length ?? 0

                            return (
                                <TableRow key={v.id}>
                                    <TableCell className="text-xs text-muted-foreground font-mono">
                                        {v.id.slice(0, 8)}
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
                                    <TableCell className="text-muted-foreground">
                                        {districtCount}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {seasonCount}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="sm"
                                            className="text-primary"
                                        >
                                            <Link
                                                to={`/admin/crops/${cropId}/varieties/${v.id}`}
                                            >
                                                <Edit data-icon="inline-start" />
                                                {t('common.edit')}
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {varieties.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="py-12 text-center text-muted-foreground"
                                >
                                    {t('admin.noVarieties')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </PageContainer>
    )
}
