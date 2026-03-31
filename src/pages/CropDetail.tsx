import { useParams, useNavigate } from 'react-router-dom'
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
import {
    AlertTriangle,
    ArrowLeft,
    Calendar,
    MapPin,
    Sprout,
    Tag,
    Bug,
} from 'lucide-react'

export function CropDetailPage() {
    const { id } = useParams<{ id: string }>()
    const { t } = useTranslation()
    const { currentLanguage } = useLanguage()
    const navigate = useNavigate()
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
                    icon={<AlertTriangle className="h-12 w-12" />}
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Back nav banner */}
            <div className="page-header-banner rounded-2xl mb-6">
                <div className="relative">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t('common.back')}
                    </button>
                </div>
            </div>

            {/* Hero */}
            <div className="relative rounded-2xl overflow-hidden mb-8 border border-neutral-200 shadow-card">
                <img
                    src={imgSrc}
                    alt={cropName}
                    className="w-full h-52 sm:h-72 object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
                    {cropType && (
                        <span className="badge-info text-[11px] mb-1.5 inline-block">
                            {cropType}
                        </span>
                    )}
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        {cropName}
                    </h1>
                </div>
            </div>

            <div className="space-y-6">
                {/* Aliases */}
                {aliases.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-neutral-900">
                            <Tag className="h-4 w-4 inline mr-1.5" />
                            {t('cropDetail.aliases')}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {aliases.map((alias) => (
                                <span
                                    key={alias}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700"
                                >
                                    {alias}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Suitable Soil Types */}
                {soilTypeLabels.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-neutral-900">
                            <MapPin className="h-4 w-4 inline mr-1.5" />
                            {t('cropDetail.suitableSoilTypes')}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {soilTypeLabels.map(({ key, label }) => (
                                <span
                                    key={key}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"
                                >
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Crop Varieties */}
                {varieties.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-neutral-900">
                            <Sprout className="h-4 w-4 inline mr-1.5" />
                            {t('cropDetail.varieties')}
                        </h3>
                        <div className="space-y-4">
                            {varieties.map((v) => (
                                <VarietyCard
                                    key={v.id}
                                    variety={v}
                                    lang={lang}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* View Diseases CTA */}
                <button
                    onClick={() =>
                        navigate(
                            `/diseases?crop=${localize(crop.name, 'en' as LanguageCode)}`,
                        )
                    }
                    className="w-full btn-primary py-3.5 rounded-xl text-base inline-flex items-center justify-center gap-2"
                >
                    <Bug className="h-5 w-5" />
                    {t('cropDetail.viewDiseases')}
                </button>
            </div>
        </div>
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
        <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-3">
            <div className="flex items-center gap-3">
                {variety.imageUrl && (
                    <img
                        src={variety.imageUrl}
                        alt={varietyName}
                        className="h-12 w-12 rounded-lg object-cover"
                    />
                )}
                <h4 className="font-semibold text-base text-neutral-900">
                    {varietyName}
                </h4>
            </div>

            {/* Seasons */}
            {variety.recommendedSeasons.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-neutral-500 mb-1">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {t('cropDetail.seasons')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {variety.recommendedSeasons.map((s, i) => (
                            <span
                                key={i}
                                className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700"
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
                    <p className="text-xs font-semibold text-neutral-500 mb-1">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {t('cropDetail.districts')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {variety.districts.map((d) => (
                            <span
                                key={d}
                                className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700"
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
                    <p className="text-xs font-semibold text-neutral-500 mb-1">
                        {t('cropDetail.grainCharacter', 'Grain Character')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {grainChars.map((g, i) => (
                            <span
                                key={i}
                                className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700"
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
                    <p className="text-xs font-semibold text-neutral-500 mb-1">
                        {t(
                            'cropDetail.specialCharacteristics',
                            'Special Characteristics',
                        )}
                    </p>
                    <ul className="list-disc list-inside text-sm text-neutral-600 space-y-0.5">
                        {specialChars.map((sc, i) => (
                            <li key={i}>{sc}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
