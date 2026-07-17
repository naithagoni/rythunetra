import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCrop, useCropVarieties } from '@/hooks/useCrops'
import { useLanguage } from '@/hooks/useLanguage'
import { usePageTitle } from '@/hooks/usePageTitle'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { getCropImage } from '@/utils/cropImages'
import { localize, localizeArray } from '@/types/i18n'
import type { LanguageCode } from '@/types/i18n'
import type { CropVariety } from '@/types/crop'
import { AlertTriangle, Calendar, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Section } from '@/components/common/Section'

export function CropDetailPage() {
    const { id } = useParams<{ id: string }>()
    const { t } = useTranslation()
    const { currentLanguage } = useLanguage()
    const lang = currentLanguage as LanguageCode

    const { data: crop, isLoading, error } = useCrop(id || '')
    const { data: varieties = [] } = useCropVarieties(id || '')
    usePageTitle(crop ? localize(crop.name, lang) : undefined)

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    if (error || !crop) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16">
                <EmptyState
                    icon={<AlertTriangle className="size-12" />}
                    title={t('errors.notFound')}
                />
            </div>
        )
    }

    const cropName = localize(crop.name, lang)
    const cropType = localize(crop.cropType, lang)
    const aliases = localizeArray(crop.aliases, lang)
    const imgSrc = getCropImage(crop.imageUrl)

    // Resolve soil type entries to labels via FE config + i18n
    const soilTypeLabels = crop.suitableSoilTypes.map((entry) => ({
        key: `${entry.type}::${entry.subType}`,
        label: `${t(`soilTypes.${entry.type}`)} – ${t(`soilSubTypes.${entry.type}.${entry.subType}`)}`,
    }))

    return (
        <PageContainer size="md">
            <PageHeader
                backTo="/crops"
                backLabel={t('nav.crops')}
                title={cropName}
                description={cropType || undefined}
            />

            <div className="flex flex-col gap-6">
                {/* Media */}
                <div className="aspect-16/9 overflow-hidden rounded-xl border border-border bg-muted">
                    <img
                        src={imgSrc}
                        alt={cropName}
                        className="size-full object-cover"
                    />
                </div>

                {/* Aliases + Soil — a two-up meta row of Sections */}
                {(aliases.length > 0 || soilTypeLabels.length > 0) && (
                    <div className="grid gap-6 sm:grid-cols-2">
                        {aliases.length > 0 && (
                            <Section title={t('cropDetail.aliases')}>
                                <div className="flex flex-wrap gap-2">
                                    {aliases.map((alias) => (
                                        <Badge key={alias} variant="secondary">
                                            {alias}
                                        </Badge>
                                    ))}
                                </div>
                            </Section>
                        )}
                        {soilTypeLabels.length > 0 && (
                            <Section title={t('cropDetail.suitableSoilTypes')}>
                                <div className="flex flex-wrap gap-2">
                                    {soilTypeLabels.map(({ key, label }) => (
                                        <Badge key={key} variant="secondary">
                                            <MapPin className="size-3" />
                                            {label}
                                        </Badge>
                                    ))}
                                </div>
                            </Section>
                        )}
                    </div>
                )}

                {/* Crop Varieties */}
                {varieties.length > 0 && (
                    <Section
                        title={t('cropDetail.varieties')}
                        description={`${varieties.length}`}
                    >
                        <div className="flex flex-col gap-4">
                            {varieties.map((v) => (
                                <VarietyCard
                                    key={v.id}
                                    variety={v}
                                    lang={lang}
                                />
                            ))}
                        </div>
                    </Section>
                )}
            </div>
        </PageContainer>
    )
}

// ─── Variety sub-card ─────────────────────────────────────

function VarietyCard({
    variety,
    lang,
}: {
    variety: CropVariety
    lang: LanguageCode
}) {
    const { t } = useTranslation()
    const varietyName = localize(variety.name, lang)
    const grainChars = variety.grainCharacter
        ? localizeArray(variety.grainCharacter, lang)
        : []
    const specialChars = variety.specialCharacteristics.map((sc) =>
        localize(sc, lang),
    )

    return (
        <Card className="flex flex-col p-4 gap-3">
            <div className="flex items-center gap-3">
                {variety.imageUrl && (
                    <img
                        src={variety.imageUrl}
                        alt={varietyName}
                        className="size-12 rounded-lg object-cover"
                    />
                )}
                <h4 className="font-semibold text-base text-foreground">
                    {varietyName}
                </h4>
            </div>

            {/* Seasons */}
            {variety.recommendedSeasons.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                        <Calendar className="size-3 inline mr-1" />
                        {t('cropDetail.seasons')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {variety.recommendedSeasons.map((s, i) => (
                            <span
                                key={i}
                                className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                            >
                                {localize(s.name, lang)} (
                                {s.durationInDays.join('–')}{' '}
                                {t('common.days', 'days')})
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Districts */}
            {variety.districts.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                        <MapPin className="size-3 inline mr-1" />
                        {t('cropDetail.districts')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {variety.districts.map((d) => (
                            <span
                                key={d}
                                className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                            >
                                {t(`districts.${d}`, d)}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Grain Character */}
            {grainChars.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                        {t('cropDetail.grainCharacter', 'Grain Character')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {grainChars.map((g, i) => (
                            <span
                                key={i}
                                className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                            >
                                {g}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Special Characteristics */}
            {specialChars.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                        {t(
                            'cropDetail.specialCharacteristics',
                            'Special Characteristics',
                        )}
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
                        {specialChars.map((sc, i) => (
                            <li key={i}>{sc}</li>
                        ))}
                    </ul>
                </div>
            )}
        </Card>
    )
}
