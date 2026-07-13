import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Leaf, Thermometer } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { DiseaseListItem } from '@/types/disease'
import { localize } from '@/types/i18n'
import type { LanguageCode } from '@/types/i18n'
import {
    Card,
    CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { severityColor } from '@/utils/statusColors'

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
        <Link to={`/diseases/${disease.id}`}>
            <Card className="group overflow-hidden hover:-translate-y-0.5 transition-all duration-150 hover:shadow-card-hover">
                {/* Image */}
                <div className="aspect-3/2 bg-muted overflow-hidden">
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="size-full flex items-center justify-center text-muted-foreground/40">
                            <Leaf className="size-12" />
                        </div>
                    )}
                </div>

                <CardContent className="p-4">
                    {/* Badges row */}
                    <div className="flex items-center flex-wrap gap-1.5 mb-2">
                        <Badge
                            variant="secondary"
                            className={cn(
                                'gap-0.5 text-[10px]',
                                severityColor(severity).chip,
                            )}
                        >
                            <Thermometer className="size-2.5" />
                            {t(`diseases.${severity}`)}
                        </Badge>
                        {diseaseType && (
                            <Badge
                                variant="secondary"
                                className="text-[10px] bg-purple-100 text-purple-900"
                            >
                                {diseaseType}
                            </Badge>
                        )}
                        {remedyCount > 0 && (
                            <Badge
                                variant="secondary"
                                className="text-[10px] bg-blue-100 text-blue-900"
                            >
                                {remedyCount} {t('diseases.recommendedRemedies')}
                            </Badge>
                        )}
                    </div>

                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 mb-1">
                        {name}
                    </h3>
                </CardContent>
            </Card>
        </Link>
    )
}
