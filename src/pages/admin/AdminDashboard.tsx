import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import {
    adminGetDiseases,
    adminGetRemedies,
    adminGetCrops,
    adminGetCropVarietyCount,
} from '@/services/adminService'
import { Bug, FlaskConical, Sprout, Wheat, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/common/PageHeader'
import { PageContainer } from '@/components/common/PageContainer'

interface DashboardCounts {
    diseases: number
    remedies: number
    crops: number
    varieties: number
}

export function AdminDashboardPage() {
    const { t } = useTranslation()

    const { data: counts } = useQuery<DashboardCounts>({
        queryKey: ['admin-dashboard-counts'],
        queryFn: async () => {
            const [diseases, remedies, crops, varieties] = await Promise.all([
                adminGetDiseases(1, 1),
                adminGetRemedies(1, 1),
                adminGetCrops(1, 1),
                adminGetCropVarietyCount(),
            ])
            return {
                diseases: diseases?.count ?? 0,
                remedies: remedies?.count ?? 0,
                crops: crops?.count ?? 0,
                varieties: varieties?.count ?? 0,
            }
        },
        staleTime: 5 * 60 * 1000,
    })

    const cards = [
        {
            to: '/admin/diseases',
            icon: <Bug className="size-5" />,
            label: t('admin.diseases'),
            count: counts?.diseases ?? 0,
        },
        {
            to: '/admin/remedies',
            icon: <FlaskConical className="size-5" />,
            label: t('admin.remedies'),
            count: counts?.remedies ?? 0,
        },
        {
            to: '/admin/crops',
            icon: <Sprout className="size-5" />,
            label: t('admin.crops'),
            count: counts?.crops ?? 0,
        },
        {
            to: '/admin/varieties',
            icon: <Wheat className="size-5" />,
            label: t('admin.varieties'),
            count: counts?.varieties ?? 0,
        },
    ]

    return (
        <PageContainer size="md">
            <PageHeader title={t('admin.dashboard')} />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <Link key={card.to} to={card.to} className="group">
                        <Card className="relative gap-0 p-5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-card-hover">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground transition-colors duration-150 group-hover:bg-accent">
                                    {card.icon}
                                </div>
                                <ArrowUpRight className="size-4 text-muted-foreground transition-all duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                            </div>
                            <p className="text-display-lg leading-none tracking-tight text-foreground tabular-nums">
                                {card.count}
                            </p>
                            <p className="mt-1.5 font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                {card.label}
                            </p>
                        </Card>
                    </Link>
                ))}
            </div>
        </PageContainer>
    )
}
