import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Leaf, Thermometer } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { DiseaseListItem } from '@/types/disease'
import { localize } from '@/types/i18n'
import type { LanguageCode } from '@/types/i18n'

interface DiseaseCardProps {
    disease: DiseaseListItem
    language: string
}

const severityBadge: Record<string, string> = {
    low: 'bg-green-100 text-green-700',
    moderate: 'bg-amber-100 text-amber-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
}

export function DiseaseCard({ disease, language }: DiseaseCardProps) {
    const { t } = useTranslation()
    const lang = language as LanguageCode

    const name = localize(disease.name, lang)
    const image = disease.image_urls?.[0]
    const severity = disease.severity ?? 'moderate'
    const diseaseType = localize(disease.type, lang)
    const remedyCount = disease.disease_remedies?.length ?? 0

    if (!name) return null

    return (
        <Link
            to={`/diseases/${disease.id}`}
            className="card group block overflow-hidden hover:-translate-y-0.5 transition-all duration-200"
        >
            {/* Image */}
            <div className="aspect-3/2 bg-neutral-100 overflow-hidden">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                        <Leaf className="h-12 w-12" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Badges row */}
                <div className="flex items-center flex-wrap gap-1.5 mb-2">
                    <span
                        className={cn(
                            'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium',
                            severityBadge[severity],
                        )}
                    >
                        <Thermometer className="h-2.5 w-2.5" />
                        {t(`diseases.${severity}`)}
                    </span>
                    {diseaseType && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium">
                            {diseaseType}
                        </span>
                    )}
                    {remedyCount > 0 && (
                        <span className="badge-info text-[10px]">
                            {remedyCount} {t('diseases.recommendedRemedies')}
                        </span>
                    )}
                </div>

                <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors duration-200 mb-1">
                    {name}
                </h3>
            </div>
        </Link>
    )
}
