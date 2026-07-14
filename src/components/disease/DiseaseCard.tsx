import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Leaf, Thermometer } from 'lucide-react'
import type { DiseaseListItem } from '@/types/disease'
import { localize } from '@/types/i18n'
import type { LanguageCode } from '@/types/i18n'

interface DiseaseCardProps {
    disease: DiseaseListItem
    language: string
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
            className="group relative block aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_4px_16px_-4px_rgba(16,24,40,0.12)] ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_-8px_rgba(16,24,40,0.22)]"
        >
            {/* Full-bleed image */}
            {image ? (
                <img
                    src={image}
                    alt={name}
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground/40">
                    <Leaf className="size-14" />
                </div>
            )}
            {/* Bottom gradient scrim for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

            {/* Name + sub-text overlaid at bottom */}
            <div className="absolute inset-x-0 bottom-0 p-3.5">
                <h3 className="truncate text-base font-semibold text-white drop-shadow-sm">
                    {name}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-medium text-white/70">
                    <span className="inline-flex items-center gap-1">
                        <Thermometer className="size-3" />
                        {t(`diseases.${severity}`)}
                    </span>
                    {diseaseType && (
                        <>
                            <span className="text-white/40">·</span>
                            <span>{diseaseType}</span>
                        </>
                    )}
                    {remedyCount > 0 && (
                        <>
                            <span className="text-white/40">·</span>
                            <span>
                                {remedyCount}{' '}
                                {t('diseases.recommendedRemedies')}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </Link>
    )
}
