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
    Loader2,
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
    if (score >= 85) return 'text-green-700 bg-green-50 border-green-200'
    if (score >= 70) return 'text-emerald-700 bg-emerald-50 border-emerald-200'
    if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-200'
    return 'text-orange-700 bg-orange-50 border-orange-200'
}

const waterIcon: Record<string, string> = {
    low: '💧',
    moderate: '💧💧',
    high: '💧💧💧',
}

const demandBadge: Record<string, string> = {
    low: 'bg-neutral-100 text-neutral-600',
    moderate: 'bg-amber-100 text-amber-700',
    high: 'bg-green-100 text-green-700',
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
            if (session?.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`
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
            <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50">
                    <Sparkles className="h-8 w-8 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold text-neutral-900">
                    {t('settings.aiFeatures')}
                </h2>
                <p className="text-sm text-neutral-500 max-w-md mx-auto">
                    {t('settings.aiDisabledMessage')}
                </p>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Header Banner */}
            <div className="page-header-banner rounded-2xl">
                <div className="relative text-center space-y-2">
                    <div className="page-header-icon">
                        <Sprout className="h-6 w-6 text-primary-600" />
                    </div>
                    <h1 className="page-title">{t('recommend.title')}</h1>
                    <p className="page-subtitle">{t('recommend.subtitle')}</p>
                </div>
            </div>

            {/* Form */}
            {!result && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Soil Type */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            {t('recommend.soilType')}{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <CustomDropdown
                            options={soilTypeOptions}
                            value={soilType}
                            onChange={setSoilType}
                            placeholder={t('recommend.selectSoilType')}
                            variant="form"
                            ariaLabel={t('recommend.soilType')}
                        />
                    </div>

                    {/* pH Level */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            {t('recommend.phLevel')}
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="14"
                            value={phLevel}
                            onChange={(e) => setPhLevel(e.target.value)}
                            placeholder={t('recommend.phPlaceholder')}
                            className="input"
                        />
                        <p className="text-xs text-neutral-500 mt-0.5">
                            {t('recommend.phHint')}
                        </p>
                    </div>

                    {/* Season */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            {t('recommend.season')}{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <CustomDropdown
                            options={seasonOptions}
                            value={season}
                            onChange={setSeason}
                            placeholder={t('recommend.selectSeason')}
                            variant="form"
                            ariaLabel={t('recommend.season')}
                        />
                    </div>

                    {/* District */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            {t('recommend.district')}
                        </label>
                        <CustomDropdown
                            options={districtOptions}
                            value={district}
                            onChange={setDistrict}
                            placeholder={t('recommend.selectDistrict')}
                            variant="form"
                            ariaLabel={t('recommend.district')}
                        />
                    </div>

                    {/* Irrigation */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            {t('recommend.irrigation')}
                        </label>
                        <CustomDropdown
                            options={irrigationOptions}
                            value={irrigation}
                            onChange={setIrrigation}
                            placeholder={t('recommend.selectIrrigation')}
                            variant="form"
                            ariaLabel={t('recommend.irrigation')}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading || !soilType || !season}
                        className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                {t('recommend.analyzing')}
                            </>
                        ) : (
                            <>
                                <Sprout className="h-5 w-5" />
                                {t('recommend.getRecommendations')}
                            </>
                        )}
                    </button>
                </form>
            )}

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-red-800">
                            {t('recommend.errorTitle')}
                        </p>
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                </div>
            )}

            {/* Results */}
            {result && (
                <div className="space-y-4 animate-fade-in">
                    {/* Soil Analysis */}
                    <div className="bg-amber-50/60 border border-amber-200/30 rounded-xl p-5">
                        <h3 className="font-semibold text-sm flex items-center gap-2 text-amber-800">
                            <Leaf className="h-4 w-4" />
                            {t('recommend.soilAnalysis')}
                        </h3>
                        <p className="text-sm mt-1 text-amber-900">
                            {isTe ? result.soilAnalysisTe : result.soilAnalysis}
                        </p>
                    </div>

                    {/* Crop Cards */}
                    <h3 className="font-semibold text-lg text-neutral-900">
                        {t('recommend.recommendedCrops')} (
                        {result.recommendations.length})
                    </h3>

                    <div className="space-y-3">
                        {result.recommendations.map((crop, i) => {
                            const isExpanded = expandedCrop === i
                            return (
                                <div
                                    key={i}
                                    className="bg-white border border-neutral-200 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-sm"
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
                                        <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-600 font-bold text-sm flex items-center justify-center shrink-0">
                                            {i + 1}
                                        </span>

                                        {/* Name + category */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate">
                                                {isTe
                                                    ? crop.cropNameTe
                                                    : crop.cropName}
                                                {isTe && (
                                                    <span className="text-xs text-neutral-400 ml-1">
                                                        ({crop.cropName})
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-xs text-neutral-500 capitalize">
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
                                            <ChevronUp className="h-4 w-4 text-neutral-400 shrink-0" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-neutral-400 shrink-0" />
                                        )}
                                    </button>

                                    {/* Expanded details */}
                                    {isExpanded && (
                                        <div className="px-4 pb-4 space-y-3 border-t border-neutral-100 pt-3">
                                            {/* Stat pills */}
                                            <div className="flex flex-wrap gap-2">
                                                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                                                    <Droplets className="h-3 w-3" />
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
                                                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full">
                                                    <Clock className="h-3 w-3" />
                                                    {isTe
                                                        ? crop.growingDurationTe
                                                        : crop.growingDuration}
                                                </span>
                                                <span
                                                    className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${demandBadge[crop.marketDemand]}`}
                                                >
                                                    <TrendingUp className="h-3 w-3" />
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
                                                    <p className="text-xs font-semibold text-neutral-600 mb-1 flex items-center gap-1">
                                                        <Lightbulb className="h-3 w-3" />
                                                        {t(
                                                            'recommend.growingTips',
                                                        )}
                                                    </p>
                                                    <ul className="space-y-1">
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
                                </div>
                            )
                        })}
                    </div>

                    {/* General Advice */}
                    <div className="bg-green-50/80 border border-green-200/40 rounded-xl p-4">
                        <h3 className="font-semibold text-sm flex items-center gap-2 text-green-800">
                            <Lightbulb className="h-4 w-4" />
                            {t('recommend.generalAdvice')}
                        </h3>
                        <p className="text-sm mt-1 text-green-900">
                            {isTe
                                ? result.generalAdviceTe
                                : result.generalAdvice}
                        </p>
                    </div>

                    {/* Try Again */}
                    <button
                        onClick={resetForm}
                        className="w-full border border-neutral-200 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-50/50 hover:border-primary-200 transition-all duration-200"
                    >
                        {t('recommend.tryAgain')}
                    </button>
                </div>
            )}
        </div>
    )
}
