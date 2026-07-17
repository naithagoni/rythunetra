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
import { Section } from '@/components/common/Section'
import { severityColor } from '@/utils/statusColors'

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

export function DiseaseDetail({ disease, language }: DiseaseDetailProps) {
    const { t } = useTranslation()
    const lang = language as LanguageCode

    const title = localize(disease.name, lang)

    if (!title) return null

    const severity = disease.severity ?? 'moderate'
    const sevChip = severityColor(severity)
    const diseaseType = localize(disease.type, lang)

    const symptoms = disease.symptoms ?? []
    const primaryCause = disease.primaryCause
    const favorableConditions = disease.favorableConditions ?? []
    const preventions = disease.preventions ?? []
    const treatments = disease.treatments ?? []
    const images = disease.imageUrl ?? []
    const aliases = localizeArray(disease.aliases, lang)

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
                <h1 className="text-display-md mb-2">{title}</h1>
                <div className="flex flex-wrap gap-2">
                    <Badge
                        variant="secondary"
                        className={cn('gap-1', sevChip.chip)}
                    >
                        <Thermometer className="size-3" />
                        {t(`diseases.${severity}`)} {t('diseases.severity')}
                    </Badge>
                    {diseaseType && (
                        <Badge variant="secondary">{diseaseType}</Badge>
                    )}
                </div>
            </div>

            {/* Images */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-xl">
                    {images.slice(0, 4).map((url, i) => (
                        <img
                            key={i}
                            src={url}
                            alt={title}
                            className="aspect-video w-full object-cover"
                        />
                    ))}
                </div>
            )}

            {/* Primary Cause */}
            {primaryCause && localize(primaryCause, lang) && (
                <Section
                    title={t('diseases.primaryCause')}
                    headerAction={<Bug className="size-4 text-aux-accent-4" />}
                >
                    <p className="text-sm text-foreground">
                        {renderInlineItalics(localize(primaryCause, lang))}
                    </p>
                </Section>
            )}

            {/* Symptoms */}
            {symptoms.length > 0 && (
                <Section
                    title={t('diseases.symptoms')}
                    headerAction={
                        <AlertTriangle className="size-4 text-aux-accent-2" />
                    }
                >
                    <ul className="flex flex-col gap-1.5">
                        {symptoms.map((s, i) => (
                            <li
                                key={i}
                                className="flex gap-2 text-sm text-foreground"
                            >
                                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-aux-accent-2" />
                                {localize(s, lang)}
                            </li>
                        ))}
                    </ul>
                </Section>
            )}

            {/* Favorable Conditions */}
            {favorableConditions.length > 0 && (
                <Section
                    title={t('diseases.favorableConditions')}
                    headerAction={
                        <AlertTriangle className="size-4 text-aux-accent-4" />
                    }
                >
                    <ul className="flex flex-col gap-1.5">
                        {favorableConditions.map((fc, i) => (
                            <li
                                key={i}
                                className="flex gap-2 text-sm text-foreground"
                            >
                                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-aux-accent-4" />
                                {localize(fc, lang)}
                            </li>
                        ))}
                    </ul>
                </Section>
            )}

            {/* Preventions */}
            {preventions.length > 0 && (
                <Section
                    title={t('diseases.preventions')}
                    headerAction={<Shield className="size-4 text-aux-accent-8" />}
                >
                    <ul className="flex flex-col gap-1.5">
                        {preventions.map((p, i) => (
                            <li
                                key={i}
                                className="flex gap-2 text-sm text-foreground"
                            >
                                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-aux-accent-8" />
                                {localize(p, lang)}
                            </li>
                        ))}
                    </ul>
                </Section>
            )}

            {/* Treatments */}
            {treatments.length > 0 && (
                <Section
                    title={t('diseases.treatments')}
                    headerAction={<LeafIcon className="size-4 text-aux-accent-6" />}
                >
                    <ol className="flex flex-col gap-2">
                        {treatments.map((tr, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground">
                                    {i + 1}
                                </span>
                                <p className="text-sm text-foreground">
                                    {localize(tr, lang)}
                                </p>
                            </li>
                        ))}
                    </ol>
                </Section>
            )}

            {/* Remedies */}
            {disease.remedies && disease.remedies.length > 0 && (
                <div>
                    <h2 className="text-display-sm mb-3">
                        {t('diseases.recommendedRemedies')}
                    </h2>
                    <LinkedRemedies
                        remedyIds={disease.remedies}
                        language={language}
                    />
                </div>
            )}

            {/* Aliases */}
            {aliases.length > 0 && (
                <Section title={t('diseases.aliases')}>
                    <div className="flex flex-wrap gap-2">
                        {aliases.map((alias, i) => (
                            <Badge key={i} variant="secondary">
                                {alias}
                            </Badge>
                        ))}
                    </div>
                </Section>
            )}
        </div>
    )
}
