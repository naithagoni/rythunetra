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
            icon: <Bug className="h-5 w-5" />,
            label: t('admin.diseases'),
            count: counts?.diseases ?? 0,
            gradient: 'from-red-500 to-rose-600',
            glow: 'shadow-red-500/20',
        },
        {
            to: '/admin/remedies',
            icon: <FlaskConical className="h-5 w-5" />,
            label: t('admin.remedies'),
            count: counts?.remedies ?? 0,
            gradient: 'from-emerald-500 to-green-600',
            glow: 'shadow-emerald-500/20',
        },
        {
            to: '/admin/crops',
            icon: <Sprout className="h-5 w-5" />,
            label: t('admin.crops'),
            count: counts?.crops ?? 0,
            gradient: 'from-amber-500 to-orange-600',
            glow: 'shadow-amber-500/20',
        },
        {
            to: '/admin/varieties',
            icon: <Wheat className="h-5 w-5" />,
            label: t('admin.varieties'),
            count: counts?.varieties ?? 0,
            gradient: 'from-violet-500 to-purple-600',
            glow: 'shadow-violet-500/20',
        },
    ]

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-6 text-neutral-900">
                {t('admin.dashboard')}
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <Link
                        key={card.to}
                        to={card.to}
                        className="group relative bg-white rounded-2xl border border-neutral-200 p-5 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-200 overflow-hidden"
                    >
                        {/* Gradient accent bar */}
                        <div
                            className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${card.gradient}`}
                        />

                        <div className="flex items-center justify-between mb-4">
                            <div
                                className={`w-10 h-10 rounded-xl bg-linear-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg ${card.glow} group-hover:scale-110 transition-transform duration-200`}
                            >
                                {card.icon}
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-neutral-300 group-hover:text-neutral-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                        </div>
                        <p className="text-3xl font-extrabold text-neutral-900 tracking-tight leading-none">
                            {card.count}
                        </p>
                        <p className="text-xs font-semibold text-neutral-400 mt-1.5 uppercase tracking-wider">
                            {card.label}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    )
}
