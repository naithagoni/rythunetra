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

interface DiseaseCardProps {
    disease: DiseaseListItem
    language: string
}

const severityVariant: Record<string, string> = {
    low: 'bg-green-950/50 text-green-400 hover:bg-green-950/50',
    moderate: 'bg-amber-950/50 text-amber-400 hover:bg-amber-950/50',
    high: 'bg-orange-950/50 text-orange-400 hover:bg-orange-950/50',
    critical: 'bg-red-950/50 text-red-400 hover:bg-red-950/50',
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
            <Card className="group overflow-hidden hover:-translate-y-0.5 transition-all duration-200 hover:shadow-md">
                {/* Image */}
                <div className="aspect-3/2 bg-muted overflow-hidden">
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                            <Leaf className="h-12 w-12" />
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
                                severityVariant[severity],
                            )}
                        >
                            <Thermometer className="h-2.5 w-2.5" />
                            {t(`diseases.${severity}`)}
                        </Badge>
                        {diseaseType && (
                            <Badge
                                variant="secondary"
                                className="text-[10px] bg-purple-950/50 text-purple-400 hover:bg-purple-950/50"
                            >
                                {diseaseType}
                            </Badge>
                        )}
                        {remedyCount > 0 && (
                            <Badge
                                variant="secondary"
                                className="text-[10px] bg-blue-950/50 text-blue-400 hover:bg-blue-950/50"
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
