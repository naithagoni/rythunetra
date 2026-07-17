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
    Leaf,
    Sparkles,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { scoreColor, demandColor } from '@/utils/statusColors'
import { PageHeader } from '@/components/common/PageHeader'
import { PageContainer } from '@/components/common/PageContainer'
import { Section } from '@/components/common/Section'
import { InfoCallout } from '@/components/common/InfoCallout'
import { EmptyState } from '@/components/common/EmptyState'

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
    }

    if (!AI_ENABLED) {
        return (
            <PageContainer size="sm">
                <PageHeader
                    title={t('recommend.title')}
                    description={t('recommend.subtitle')}
                />
                <EmptyState
                    icon={<Sparkles className="size-12" />}
                    title={t('settings.aiFeatures')}
                    description={t('settings.aiDisabledMessage')}
                />
            </PageContainer>
        )
    }

    return (
        <PageContainer size="sm">
            <PageHeader
                title={t('recommend.title')}
                description={t('recommend.subtitle')}
            />
            <div className="flex flex-col gap-6">
            {/* Form */}
            {!result && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <Section
                        title={t('recommend.soilType')}
                        description={t('recommend.phHint')}
                    >
                        <FieldGroup>
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
                            </Field>
                        </FieldGroup>
                    </Section>

                    <Section title={t('recommend.season')}>
                        <FieldGroup>
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
                        </FieldGroup>
                    </Section>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={loading || !soilType || !season}
                            size="lg"
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
                    </div>
                </form>
            )}

            {/* Error */}
            {error && (
                <InfoCallout
                    tone="red"
                    icon={<AlertTriangle className="size-5" />}
                    title={t('recommend.errorTitle')}
                >
                    {error}
                </InfoCallout>
            )}

            {/* Results */}
            {result && (
                <div className="flex flex-col gap-6">
                    {/* Soil Analysis */}
                    <InfoCallout
                        tone="amber"
                        icon={<Leaf className="size-5" />}
                        title={t('recommend.soilAnalysis')}
                    >
                        {isTe ? result.soilAnalysisTe : result.soilAnalysis}
                    </InfoCallout>

                    {/* Crop recommendations */}
                    <Section
                        title={`${t('recommend.recommendedCrops')} (${result.recommendations.length})`}
                        flush
                    >
                        <Accordion type="single" collapsible className="w-full">
                            {result.recommendations.map((crop, i) => (
                                <AccordionItem
                                    key={i}
                                    value={`crop-${i}`}
                                    className="border-b border-border px-6 last:border-b-0"
                                >
                                    <AccordionTrigger className="py-4 hover:no-underline">
                                        <div className="flex flex-1 items-center gap-3 pr-3">
                                            <div className="min-w-0 flex-1 text-left">
                                                <p className="truncate font-medium text-foreground">
                                                    {isTe
                                                        ? crop.cropNameTe
                                                        : crop.cropName}
                                                </p>
                                                <p className="text-xs text-muted-foreground capitalize">
                                                    {t(
                                                        `recommend.categories.${crop.category}`,
                                                    )}
                                                </p>
                                            </div>
                                            <span
                                                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${scoreColor(crop.suitabilityScore).chip}`}
                                            >
                                                {crop.suitabilityScore}%
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-3 pb-4">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                                                <Droplets className="size-3" />
                                                {t(
                                                    `recommend.water.${crop.waterRequirement}`,
                                                )}
                                            </span>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                                                <Clock className="size-3" />
                                                {isTe
                                                    ? crop.growingDurationTe
                                                    : crop.growingDuration}
                                            </span>
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${demandColor(crop.marketDemand).chip}`}
                                            >
                                                <TrendingUp className="size-3" />
                                                {t(
                                                    `recommend.demand.${crop.marketDemand}`,
                                                )}
                                            </span>
                                        </div>
                                        <p className="text-sm text-foreground">
                                            <span className="font-medium">
                                                {t('recommend.expectedYield')}:
                                            </span>{' '}
                                            {isTe
                                                ? crop.expectedYieldTe
                                                : crop.expectedYield}
                                        </p>
                                        {crop.tips.length > 0 && (
                                            <div>
                                                <p className="mb-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                                    <Lightbulb className="size-3" />
                                                    {t('recommend.growingTips')}
                                                </p>
                                                <ul className="flex flex-col gap-1">
                                                    {(isTe
                                                        ? crop.tipsTe
                                                        : crop.tips
                                                    ).map((tip, j) => (
                                                        <li
                                                            key={j}
                                                            className="flex gap-2 text-sm text-foreground"
                                                        >
                                                            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground" />
                                                            {tip}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </Section>

                    {/* General Advice */}
                    <InfoCallout
                        tone="green"
                        icon={<Lightbulb className="size-5" />}
                        title={t('recommend.generalAdvice')}
                    >
                        {isTe ? result.generalAdviceTe : result.generalAdvice}
                    </InfoCallout>

                    {/* Try Again */}
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={resetForm}
                        >
                            {t('recommend.tryAgain')}
                        </Button>
                    </div>
                </div>
            )}
            </div>
        </PageContainer>
    )
}
