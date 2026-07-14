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

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                {cards.map((card) => (
                    <Link
                        key={card.to}
                        to={card.to}
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[0_4px_16px_-4px_rgba(16,24,40,0.10)] ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_-8px_rgba(16,24,40,0.18)]"
                    >
                        {/* Faint green accent wash, intensifies on hover */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        {/* Large watermark icon in the corner */}
                        <span className="pointer-events-none absolute -right-3 -top-3 text-primary/10 transition-all duration-300 group-hover:text-primary/20 [&_svg]:size-20">
                            {card.icon}
                        </span>

                        <div className="relative flex items-center justify-between">
                            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 transition-colors duration-300 [&_svg]:size-5 [&_svg]:text-foreground group-hover:bg-primary group-hover:[&_svg]:text-primary-foreground">
                                {card.icon}
                            </span>
                            <ArrowUpRight className="size-4 -translate-x-1 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-primary group-hover:opacity-100" />
                        </div>

                        <p className="relative mt-6 text-display-lg leading-none tracking-tight text-foreground tabular-nums">
                            {card.count}
                        </p>
                        <p className="relative mt-2 font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {card.label}
                        </p>
                    </Link>
                ))}
            </div>
        </PageContainer>
    )
}
