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
        <PageContainer size="lg">
            <PageHeader
                backTo="/admin"
                backLabel={t('admin.dashboard')}
                title={t('admin.varieties')}
                description={`${varieties.length} ${t('common.total')}`}
                action={
                    crops.length === 0 ? (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-md bg-amber-100 border border-amber-400 text-amber-900 text-sm">
                            <AlertTriangle className="size-4 shrink-0" />
                            <span>
                                {t('admin.noCropsYet')}{' '}
                                <Link
                                    to="/admin/crops/add"
                                    className="font-medium underline hover:text-amber-900/80"
                                >
                                    {t('admin.addCrop')}
                                </Link>
                            </span>
                        </div>
                    ) : (
                        <>
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
                                className="whitespace-nowrap"
                            >
                                <Plus data-icon="inline-start" />
                                {t('admin.addVariety')}
                            </Button>
                        </>
                    )
                }
            />

            <Card className="p-0 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>{t('admin.name')}</TableHead>
                            <TableHead>{t('admin.majorCrop')}</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {varieties.map((v) => {
                            const en = v.name?.en
                            const te = v.name?.te
                            const cropName = cropMap.get(v.major_crop)

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
                                        {cropName?.en ??
                                            v.major_crop.slice(0, 8)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="sm"
                                            className="text-primary"
                                        >
                                            <Link
                                                to={`/admin/crops/${v.major_crop}/varieties/${v.id}`}
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
                                    colSpan={4}
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
