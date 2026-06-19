import { useTranslation } from 'react-i18next'
import {
    Shield,
    AlertTriangle,
    Thermometer,
    Bug,
    Leaf as LeafIcon,
} from 'lucide-react'
import type { Disease } from '@/types/disease'
import { LinkedRemedies } from './LinkedRemedies'
import { localize, localizeArray } from '@/types/i18n'
import type { LanguageCode } from '@/types/i18n'
import { cn } from '@/utils/cn'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

function renderInlineItalics(text: string) {
    const parts = text.split(/\*([^*]+)\*/g)
    if (parts.length === 1) return text
    return parts.map((part, i) =>
        i % 2 === 1 ? <em key={i}>{part}</em> : part,
    )
}

interface DiseaseDetailProps {
    disease: Disease
    language: string
}

const severityConfig = {
    low: { color: 'bg-[#4DA34D]/10 text-[#4DA34D] hover:bg-[#4DA34D]/10', label: 'low' },
    moderate: { color: 'bg-[#D4A72C]/10 text-[#D4A72C] hover:bg-[#D4A72C]/10', label: 'moderate' },
    high: { color: 'bg-[#F2994A]/10 text-[#F2994A] hover:bg-[#F2994A]/10', label: 'high' },
    critical: { color: 'bg-[#D94F4F]/10 text-[#D94F4F] hover:bg-[#D94F4F]/10', label: 'critical' },
}

export function DiseaseDetail({ disease, language }: DiseaseDetailProps) {
    const { t } = useTranslation()
    const lang = language as LanguageCode

    const title = localize(disease.name, lang)

    if (!title) return null

    const severity = disease.severity ?? 'moderate'
    const sevConf = severityConfig[severity] ?? severityConfig.moderate
    const diseaseType = localize(disease.type, lang)

    const symptoms = disease.symptoms ?? []
    const primaryCause = disease.primaryCause
    const favorableConditions = disease.favorableConditions ?? []
    const preventions = disease.preventions ?? []
    const treatments = disease.treatments ?? []
    const images = disease.imageUrl ?? []
    const aliases = localizeArray(disease.aliases, lang)

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold mb-2">{title}</h1>
                <div className="flex flex-wrap gap-2 mb-3">
                    <Badge
                        variant="secondary"
                        className={cn('gap-1', sevConf.color)}
                    >
                        <Thermometer className="h-3 w-3" />
                        {t(`diseases.${sevConf.label}`)}{' '}
                        {t('diseases.severity')}
                    </Badge>
                    {diseaseType && (
                        <Badge
                            variant="secondary"
                            className="bg-purple-950/50 text-purple-400 hover:bg-purple-950/50 gap-1"
                        >
                            {diseaseType}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Images */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
                    {images.slice(0, 4).map((url, i) => (
                        <img
                            key={i}
                            src={url}
                            alt={title}
                            className="w-full aspect-video object-cover"
                        />
                    ))}
                </div>
            )}

            {/* Primary Cause */}
            {primaryCause && localize(primaryCause, lang) && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        <Bug className="h-4 w-4 inline mr-1.5" />
                        {t('diseases.primaryCause')}
                    </h3>
                    <Card className="border-[#D4A72C]/15 bg-[#D4A72C]/5">
                        <CardContent className="p-4">
                            <p className="text-base text-[#D4A72C]">
                                {renderInlineItalics(localize(primaryCause, lang))}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Symptoms */}
            {symptoms.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        🔍 {t('diseases.symptoms')}
                    </h3>
                    <Card className="border-[#D94F4F]/15 bg-[#D94F4F]/5">
                        <CardContent className="p-4 space-y-2">
                            {symptoms.map((s, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <span className="text-[#D94F4F] mt-0.5">•</span>
                                    <p className="text-sm text-[#D94F4F]">
                                        {localize(s, lang)}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Favorable Conditions */}
            {favorableConditions.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        <AlertTriangle className="h-4 w-4 inline mr-1.5 text-amber-500" />
                        {t('diseases.favorableConditions')}
                    </h3>
                    <Card className="border-yellow-800/30 bg-yellow-950/30">
                        <CardContent className="p-4 space-y-1.5">
                            {favorableConditions.map((fc, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <span className="text-yellow-500 mt-0.5">
                                        ⚠
                                    </span>
                                    <p className="text-sm text-yellow-300">
                                        {localize(fc, lang)}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Preventions */}
            {preventions.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        <Shield className="h-4 w-4 inline mr-1.5 text-blue-500" />
                        {t('diseases.preventions')}
                    </h3>
                    <Card className="border-blue-800/30 bg-blue-950/30">
                        <CardContent className="p-4 space-y-1.5">
                            {preventions.map((p, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-0.5">✓</span>
                                    <p className="text-sm text-blue-300">
                                        {localize(p, lang)}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Treatments */}
            {treatments.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        <LeafIcon className="h-4 w-4 inline mr-1.5 text-green-500" />
                        {t('diseases.treatments')}
                    </h3>
                    <Card className="border-[#4DA34D]/15 bg-[#4DA34D]/5">
                        <CardContent className="p-4 space-y-1.5">
                            {treatments.map((tr, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <span className="shrink-0 w-5 h-5 rounded-full bg-[#4DA34D]/20 text-[#4DA34D] flex items-center justify-center text-[10px] font-bold">
                                        {i + 1}
                                    </span>
                                    <p className="text-sm text-[#4DA34D]">
                                        {localize(tr, lang)}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Remedies */}
            {disease.remedies && disease.remedies.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-3">
                        💊 {t('diseases.recommendedRemedies')}
                    </h3>
                    <LinkedRemedies
                        remedyIds={disease.remedies}
                        language={language}
                    />
                </div>
            )}

            {/* Aliases */}
            {aliases.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        📝 {t('diseases.aliases')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {aliases.map((alias, i) => (
                            <Badge key={i} variant="secondary">
                                {alias}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
