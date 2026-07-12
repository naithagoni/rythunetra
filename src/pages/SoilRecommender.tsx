import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import { usePageTitle } from '@/hooks/usePageTitle'
import { CustomDropdown } from '@/components/common/CustomDropdown'
import {
    ALL_SOIL_ENTRIES,
    soilEntryKey,
    parseSoilEntryKey,
} from '@/config/soilTypes'
import { DISTRICT_KEYS } from '@/config/districts'
import { AI_ENABLED } from '@/config/env'
import {
    Sprout,
    AlertTriangle,
    Droplets,
    TrendingUp,
    Clock,
    Lightbulb,
    ChevronDown,
    ChevronUp,
    Leaf,
    Sparkles,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Card } from '@/components/ui/card'
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field'

// ─── Types ────────────────────────────────────────────

interface CropRecommendation {
    cropName: string
    cropNameTe: string
    suitabilityScore: number
    category: string
    expectedYield: string
    expectedYieldTe: string
    waterRequirement: 'low' | 'moderate' | 'high'
    growingDuration: string
    growingDurationTe: string
    tips: string[]
    tipsTe: string[]
    marketDemand: 'low' | 'moderate' | 'high'
}

interface RecommendationResult {
    recommendations: CropRecommendation[]
    soilAnalysis: string
    soilAnalysisTe: string
    generalAdvice: string
    generalAdviceTe: string
}

// ─── Constants ────────────────────────────────────────

const SEASONS = ['kharif', 'rabi', 'zaid'] as const

const IRRIGATION_OPTIONS = ['full', 'limited', 'rainfed'] as const

const scoreColor = (score: number) => {
    if (score >= 85) return 'text-[#4DA34D] bg-[#4DA34D]/10 border-[#4DA34D]/20'
    if (score >= 70) return 'text-emerald-400 bg-emerald-950/50 border-emerald-800/40'
    if (score >= 50) return 'text-[#D4A72C] bg-[#D4A72C]/10 border-[#D4A72C]/20'
    return 'text-[#F2994A] bg-[#F2994A]/10 border-[#F2994A]/20'
}

const waterIcon: Record<string, string> = {
    low: '💧',
    moderate: '💧💧',
    high: '💧💧💧',
}

const demandBadge: Record<string, string> = {
    low: 'bg-[#161618] text-neutral-400',
    moderate: 'bg-[#D4A72C]/10 text-[#D4A72C]',
    high: 'bg-[#4DA34D]/10 text-[#4DA34D]',
}

// ─── Component ────────────────────────────────────────

export function SoilRecommenderPage() {
    const { t } = useTranslation()
    const { currentLanguage } = useLanguage()
    const { session } = useAuth()
    usePageTitle('Crop Recommender — AI Soil Analysis')
    const isTe = currentLanguage === 'te'

    const [soilType, setSoilType] = useState('')
    const [phLevel, setPhLevel] = useState('')
    const [season, setSeason] = useState('')
    const [district, setDistrict] = useState('')
    const [irrigation, setIrrigation] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<RecommendationResult | null>(null)
    const [expandedCrop, setExpandedCrop] = useState<number | null>(null)

    const soilTypeOptions = useMemo(
        () =>
            ALL_SOIL_ENTRIES.map((entry) => ({
                value: soilEntryKey(entry),
                label: `${t(`soilTypes.${entry.type}`)} – ${t(`soilSubTypes.${entry.type}.${entry.subType}`)}`,
            })),
        [t],
    )

    const seasonOptions = useMemo(
        () =>
            SEASONS.map((s) => ({
                value: s,
                label: t(`seasons.${s}`),
            })),
        [t],
    )

    const districtOptions = useMemo(
        () =>
            DISTRICT_KEYS.map((d) => ({
                value: d,
                label: t(`districts.${d}`),
            })),
        [t],
    )

    const irrigationOptions = useMemo(
        () =>
            IRRIGATION_OPTIONS.map((opt) => ({
                value: opt,
                label: t(`recommend.irrigationOptions.${opt}`),
            })),
        [t],
    )

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!soilType || !season) return

        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            }
            if (session?.accessToken) {
                headers['Authorization'] = `Bearer ${session.accessToken}`
            }
            const res = await fetch('/api/ai/recommend', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    soilType: (() => {
                        const parsed = parseSoilEntryKey(soilType)
                        return parsed ? t(`soilTypes.${parsed.type}`) : soilType
                    })(),
                    soilSubType: (() => {
                        const parsed = parseSoilEntryKey(soilType)
                        return parsed
                            ? t(`soilSubTypes.${parsed.type}.${parsed.subType}`)
                            : ''
                    })(),
                    phLevel,
                    season: t(`seasons.${season}`),
                    district: district ? t(`districts.${district}`) : undefined,
                    irrigation: irrigation
                        ? t(`recommend.irrigationOptions.${irrigation}`)
                        : undefined,
                    language: currentLanguage,
                }),
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || 'Failed to get recommendations')
            }

            const data: RecommendationResult = await res.json()
            setResult(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : t('recommend.error'))
        } finally {
            setLoading(false)
        }
    }

    function resetForm() {
        setResult(null)
        setError(null)
        setExpandedCrop(null)
    }

    if (!AI_ENABLED) {
        return (
            <div className="flex flex-col max-w-3xl mx-auto px-4 py-16 text-center gap-4">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-[#D4A72C]/10">
                    <Sparkles className="size-8 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold text-white">
                    {t('settings.aiFeatures')}
                </h2>
                <p className="text-sm text-neutral-400 max-w-md mx-auto">
                    {t('settings.aiDisabledMessage')}
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
            {/* Header Banner */}
            <div className="page-header-banner rounded-2xl">
                <div className="flex flex-col relative text-center gap-2">
                    <div className="page-header-icon">
                        <Sprout className="size-6 text-neutral-400" />
                    </div>
                    <h1 className="page-title">{t('recommend.title')}</h1>
                    <p className="page-subtitle">{t('recommend.subtitle')}</p>
                </div>
            </div>

            {/* Form */}
            {!result && (
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        {/* Soil Type */}
                        <Field>
                            <FieldLabel htmlFor="recommend-soil-type">
                                {t('recommend.soilType')}{' '}
                                <span className="text-destructive">*</span>
                            </FieldLabel>
                            <CustomDropdown
                                options={soilTypeOptions}
                                value={soilType}
                                onChange={setSoilType}
                                placeholder={t('recommend.selectSoilType')}
                                variant="form"
                                ariaLabel={t('recommend.soilType')}
                            />
                        </Field>

                        {/* pH Level */}
                        <Field>
                            <FieldLabel htmlFor="recommend-ph">
                                {t('recommend.phLevel')}
                            </FieldLabel>
                            <Input
                                id="recommend-ph"
                                type="number"
                                step="0.1"
                                min="0"
                                max="14"
                                value={phLevel}
                                onChange={(e) => setPhLevel(e.target.value)}
                                placeholder={t('recommend.phPlaceholder')}
                            />
                            <FieldDescription>
                                {t('recommend.phHint')}
                            </FieldDescription>
                        </Field>

                        {/* Season */}
                        <Field>
                            <FieldLabel htmlFor="recommend-season">
                                {t('recommend.season')}{' '}
                                <span className="text-destructive">*</span>
                            </FieldLabel>
                            <CustomDropdown
                                options={seasonOptions}
                                value={season}
                                onChange={setSeason}
                                placeholder={t('recommend.selectSeason')}
                                variant="form"
                                ariaLabel={t('recommend.season')}
                            />
                        </Field>

                        {/* District */}
                        <Field>
                            <FieldLabel htmlFor="recommend-district">
                                {t('recommend.district')}
                            </FieldLabel>
                            <CustomDropdown
                                options={districtOptions}
                                value={district}
                                onChange={setDistrict}
                                placeholder={t('recommend.selectDistrict')}
                                variant="form"
                                ariaLabel={t('recommend.district')}
                            />
                        </Field>

                        {/* Irrigation */}
                        <Field>
                            <FieldLabel htmlFor="recommend-irrigation">
                                {t('recommend.irrigation')}
                            </FieldLabel>
                            <CustomDropdown
                                options={irrigationOptions}
                                value={irrigation}
                                onChange={setIrrigation}
                                placeholder={t('recommend.selectIrrigation')}
                                variant="form"
                                ariaLabel={t('recommend.irrigation')}
                            />
                        </Field>

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={loading || !soilType || !season}
                            size="lg"
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <Spinner data-icon="inline-start" />
                                    {t('recommend.analyzing')}
                                </>
                            ) : (
                                <>
                                    <Sprout data-icon="inline-start" />
                                    {t('recommend.getRecommendations')}
                                </>
                            )}
                        </Button>
                    </FieldGroup>
                </form>
            )}

            {/* Error */}
            {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex gap-3">
                    <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-destructive">
                            {t('recommend.errorTitle')}
                        </p>
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                </div>
            )}

            {/* Results */}
            {result && (
                <div className="flex flex-col gap-4 animate-fade-in">
                    {/* Soil Analysis */}
                    <div className="bg-[#D4A72C]/5 border border-[#D4A72C]/15 rounded-xl p-5">
                        <h3 className="font-semibold text-sm flex items-center gap-2 text-[#D4A72C]">
                            <Leaf className="size-4" />
                            {t('recommend.soilAnalysis')}
                        </h3>
                        <p className="text-sm mt-1 text-amber-200">
                            {isTe ? result.soilAnalysisTe : result.soilAnalysis}
                        </p>
                    </div>

                    {/* Crop Cards */}
                    <h3 className="font-semibold text-lg text-white">
                        {t('recommend.recommendedCrops')} (
                        {result.recommendations.length})
                    </h3>

                    <div className="flex flex-col gap-3">
                        {result.recommendations.map((crop, i) => {
                            const isExpanded = expandedCrop === i
                            return (
                                <Card
                                    key={i}
                                    className="p-0 overflow-hidden transition-all duration-200 hover:shadow-sm"
                                >
                                    {/* Crop header */}
                                    <button
                                        onClick={() =>
                                            setExpandedCrop(
                                                isExpanded ? null : i,
                                            )
                                        }
                                        className="w-full text-left px-4 py-3 flex items-center gap-3"
                                    >
                                        {/* Rank */}
                                        <span className="size-7 rounded-full bg-white/[0.06] text-neutral-300 font-bold text-sm flex items-center justify-center shrink-0">
                                            {i + 1}
                                        </span>

                                        {/* Name + category */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate">
                                                {isTe
                                                    ? crop.cropNameTe
                                                    : crop.cropName}
                                                {isTe && (
                                                    <span className="text-xs text-neutral-500 ml-1">
                                                        ({crop.cropName})
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-xs text-neutral-400 capitalize">
                                                {t(
                                                    `recommend.categories.${crop.category}`,
                                                )}
                                            </p>
                                        </div>

                                        {/* Score badge */}
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-bold border ${scoreColor(crop.suitabilityScore)}`}
                                        >
                                            {crop.suitabilityScore}%
                                        </span>

                                        {isExpanded ? (
                                            <ChevronUp className="size-4 text-neutral-500 shrink-0" />
                                        ) : (
                                            <ChevronDown className="size-4 text-neutral-500 shrink-0" />
                                        )}
                                    </button>

                                    {/* Expanded details */}
                                    {isExpanded && (
                                        <div className="flex flex-col px-4 pb-4 gap-3 border-t border-white/[0.06] pt-3">
                                            {/* Stat pills */}
                                            <div className="flex flex-wrap gap-2">
                                                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-blue-950/50 text-blue-400 rounded-full">
                                                    <Droplets className="size-3" />
                                                    {
                                                        waterIcon[
                                                            crop
                                                                .waterRequirement
                                                        ]
                                                    }{' '}
                                                    {t(
                                                        `recommend.water.${crop.waterRequirement}`,
                                                    )}
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-[#161618] text-neutral-400 rounded-full">
                                                    <Clock className="size-3" />
                                                    {isTe
                                                        ? crop.growingDurationTe
                                                        : crop.growingDuration}
                                                </span>
                                                <span
                                                    className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${demandBadge[crop.marketDemand]}`}
                                                >
                                                    <TrendingUp className="size-3" />
                                                    {t(
                                                        `recommend.demand.${crop.marketDemand}`,
                                                    )}
                                                </span>
                                            </div>

                                            {/* Yield */}
                                            <div className="text-sm">
                                                <span className="font-medium">
                                                    {t(
                                                        'recommend.expectedYield',
                                                    )}
                                                    :
                                                </span>{' '}
                                                {isTe
                                                    ? crop.expectedYieldTe
                                                    : crop.expectedYield}
                                            </div>

                                            {/* Tips */}
                                            {crop.tips.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-semibold text-neutral-400 mb-1 flex items-center gap-1">
                                                        <Lightbulb className="size-3" />
                                                        {t(
                                                            'recommend.growingTips',
                                                        )}
                                                    </p>
                                                    <ul className="flex flex-col gap-1">
                                                        {(isTe
                                                            ? crop.tipsTe
                                                            : crop.tips
                                                        ).map((tip, j) => (
                                                            <li
                                                                key={j}
                                                                className="flex gap-2 text-sm"
                                                            >
                                                                <span className="text-green-500 shrink-0">
                                                                    •
                                                                </span>
                                                                {tip}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Card>
                            )
                        })}
                    </div>

                    {/* General Advice */}
                    <div className="bg-[#4DA34D]/5 border border-[#4DA34D]/15 rounded-xl p-4">
                        <h3 className="font-semibold text-sm flex items-center gap-2 text-[#4DA34D]">
                            <Lightbulb className="size-4" />
                            {t('recommend.generalAdvice')}
                        </h3>
                        <p className="text-sm mt-1 text-green-200">
                            {isTe
                                ? result.generalAdviceTe
                                : result.generalAdvice}
                        </p>
                    </div>

                    {/* Try Again */}
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={resetForm}
                        className="w-full"
                    >
                        {t('recommend.tryAgain')}
                    </Button>
                </div>
            )}
        </div>
    )
}
