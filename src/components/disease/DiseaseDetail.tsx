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

/** Render *text* as <em>text</em> for scientific names */
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
    low: { color: 'bg-green-100 text-green-700', label: 'low' },
    moderate: { color: 'bg-amber-100 text-amber-700', label: 'moderate' },
    high: { color: 'bg-orange-100 text-orange-700', label: 'high' },
    critical: { color: 'bg-red-100 text-red-700', label: 'critical' },
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

                {/* Severity + Type badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                    <span
                        className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
                            sevConf.color,
                        )}
                    >
                        <Thermometer className="h-3 w-3" />
                        {t(`diseases.${sevConf.label}`)}{' '}
                        {t('diseases.severity')}
                    </span>
                    {diseaseType && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {diseaseType}
                        </span>
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
                    <div
                        className="bg-amber-50/60 border border-amber-200/30 rounded-2xl p-4"
                        style={{
                            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.5)',
                        }}
                    >
                        <p className="text-base text-amber-800">
                            {renderInlineItalics(localize(primaryCause, lang))}
                        </p>
                    </div>
                </div>
            )}

            {/* Symptoms */}
            {symptoms.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        🔍 {t('diseases.symptoms')}
                    </h3>
                    <div
                        className="bg-red-50/60 border border-red-200/30 rounded-2xl p-4 space-y-2"
                        style={{
                            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.5)',
                        }}
                    >
                        {symptoms.map((s, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <span className="text-red-400 mt-0.5">•</span>
                                <p className="text-sm text-red-800">
                                    {localize(s, lang)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Favorable Conditions */}
            {favorableConditions.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        <AlertTriangle className="h-4 w-4 inline mr-1.5 text-amber-500" />
                        {t('diseases.favorableConditions')}
                    </h3>
                    <div
                        className="bg-yellow-50/60 border border-yellow-200/30 rounded-2xl p-4 space-y-1.5"
                        style={{
                            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.5)',
                        }}
                    >
                        {favorableConditions.map((fc, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <span className="text-yellow-500 mt-0.5">
                                    ⚠
                                </span>
                                <p className="text-sm text-yellow-800">
                                    {localize(fc, lang)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Preventions */}
            {preventions.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        <Shield className="h-4 w-4 inline mr-1.5 text-blue-500" />
                        {t('diseases.preventions')}
                    </h3>
                    <div
                        className="bg-blue-50/60 border border-blue-200/30 rounded-2xl p-4 space-y-1.5"
                        style={{
                            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.5)',
                        }}
                    >
                        {preventions.map((p, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">✓</span>
                                <p className="text-sm text-blue-800">
                                    {localize(p, lang)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Treatments */}
            {treatments.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        <LeafIcon className="h-4 w-4 inline mr-1.5 text-green-500" />
                        {t('diseases.treatments')}
                    </h3>
                    <div
                        className="bg-green-50/60 border border-green-200/30 rounded-2xl p-4 space-y-1.5"
                        style={{
                            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.5)',
                        }}
                    >
                        {treatments.map((tr, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <span className="shrink-0 w-5 h-5 rounded-full bg-green-200 text-green-700 flex items-center justify-center text-[10px] font-bold">
                                    {i + 1}
                                </span>
                                <p className="text-sm text-green-800">
                                    {localize(tr, lang)}
                                </p>
                            </div>
                        ))}
                    </div>
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
                            <span
                                key={i}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600"
                            >
                                {alias}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
