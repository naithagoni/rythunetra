import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDiseases } from '@/hooks/useDiseases'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import { usePageTitle } from '@/hooks/usePageTitle'
import { DiseaseGrid } from '@/components/disease/DiseaseGrid'
import { AI_ENABLED } from '@/config/env'
import {
    ChevronLeft,
    ChevronRight,
    X,
    Search,
    Filter,
    Camera,
    Upload,
    Loader2,
    AlertTriangle,
    CheckCircle,
    ShieldAlert,
    Leaf,
    ChevronDown,
    ChevronUp,
    History,
    Trash2,
} from 'lucide-react'
import imageCompression from 'browser-image-compression'
import {
    scanImage,
    saveScanResult,
    getScanHistory,
    deleteScanResult,
} from '@/services/aiService'
import type { ScanResult, ScanHistoryRow } from '@/services/aiService'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { CustomDropdown } from '@/components/common/CustomDropdown'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from '@/components/ui/input-group'

const SEVERITY_OPTIONS = ['low', 'moderate', 'high', 'critical'] as const

const severityConfig: Record<
    string,
    { color: string; bg: string; border: string }
> = {
    low: {
        color: 'text-[#4DA34D]',
        bg: 'bg-[#4DA34D]/10',
        border: 'border-[#4DA34D]/20',
    },
    moderate: {
        color: 'text-[#D4A72C]',
        bg: 'bg-[#D4A72C]/10',
        border: 'border-[#D4A72C]/20',
    },
    high: {
        color: 'text-[#F2994A]',
        bg: 'bg-[#F2994A]/10',
        border: 'border-[#F2994A]/20',
    },
    critical: {
        color: 'text-destructive',
        bg: 'bg-destructive/10',
        border: 'border-destructive/20',
    },
    none: {
        color: 'text-[#4DA34D]',
        bg: 'bg-[#4DA34D]/10',
        border: 'border-[#4DA34D]/20',
    },
}

export function DiseaseListPage() {
    const { t } = useTranslation()
    const { currentLanguage } = useLanguage()
    const { user } = useAuth()
    usePageTitle('Diseases — Crop Disease Encyclopedia')
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)
    const [searchInput, setSearchInput] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [severityFilter, setSeverityFilter] = useState<string | undefined>()
    const [showFilters, setShowFilters] = useState(false)

    // Scanner state
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [showScanner, setShowScanner] = useState(false)
    const [scanning, setScanning] = useState(false)
    const [scanResult, setScanResult] = useState<ScanResult | null>(null)
    const [scanPreview, setScanPreview] = useState<string | null>(null)
    const [scanError, setScanError] = useState<string | null>(null)
    const [showRemedies, setShowRemedies] = useState(true)
    const [showHistory, setShowHistory] = useState(false)

    // Scan history for logged-in users
    const { data: historyResult, isLoading: historyLoading } = useQuery({
        queryKey: ['scan-history', user?.id],
        queryFn: () => getScanHistory(user!.id),
        enabled: !!user && showHistory,
    })
    const history: ScanHistoryRow[] =
        (historyResult?.data as ScanHistoryRow[] | null) ?? []

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput)
            setPage(1)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchInput])

    const { data: result, isLoading } = useDiseases({
        language: currentLanguage,
        page,
        search: debouncedSearch || undefined,
        severity: severityFilter,
    })

    const diseases = result?.data ?? []
    const totalCount = result?.count ?? 0
    const totalPages = Math.ceil(totalCount / 12)

    const hasActiveFilters = !!severityFilter

    // Scanner handlers
    async function handleImageSelect(file: File) {
        setScanError(null)
        setScanResult(null)

        const reader = new FileReader()
        reader.onload = (e) => setScanPreview(e.target?.result as string)
        reader.readAsDataURL(file)

        setScanning(true)
        try {
            const compressed = await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
            })
            const result = await scanImage(compressed)
            setScanResult(result)

            if (user && result.isPlant) {
                await saveScanResult(user.id, result)
                queryClient.invalidateQueries({ queryKey: ['scan-history'] })
            }
        } catch (err) {
            setScanError(
                err instanceof Error ? err.message : t('scanner.error'),
            )
        } finally {
            setScanning(false)
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) handleImageSelect(file)
    }

    async function handleDeleteHistory(id: string) {
        await deleteScanResult(id)
        queryClient.invalidateQueries({ queryKey: ['scan-history'] })
    }

    function loadHistoryResult(row: ScanHistoryRow) {
        setScanResult(row.result)
        setScanPreview(row.image_url)
        setShowHistory(false)
    }

    function closeScanner() {
        setShowScanner(false)
        setScanResult(null)
        setScanPreview(null)
        setScanError(null)
        setShowHistory(false)
    }

    const sev = scanResult
        ? (severityConfig[scanResult.severity] ?? severityConfig.none)
        : null

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header Banner */}
            <div className="page-header-banner rounded-2xl mb-6">
                <div className="relative">
                    <h1 className="page-title mb-1">{t('diseases.title')}</h1>
                </div>
            </div>

            {/* Search + Scan + Filter */}
            <div className="flex items-center gap-2 mb-4">
                <InputGroup className="flex-1 max-w-lg">
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                    <InputGroupInput
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder={t('common.search')}
                    />
                    {searchInput && (
                        <InputGroupAddon align="inline-end">
                            <InputGroupButton
                                size="icon-xs"
                                onClick={() => setSearchInput('')}
                                aria-label="Clear search"
                            >
                                <X />
                            </InputGroupButton>
                        </InputGroupAddon>
                    )}
                </InputGroup>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        hasActiveFilters
                            ? 'border-white/[0.12] bg-white/[0.06] text-white'
                            : 'border-white/[0.06] text-neutral-400 hover:bg-[#161618]'
                    }`}
                >
                    <Filter className="size-4" />
                    {hasActiveFilters && (
                        <span className="size-1.5 rounded-full bg-white" />
                    )}
                </button>
                <div className="relative group">
                    <button
                        onClick={() =>
                            AI_ENABLED && setShowScanner(!showScanner)
                        }
                        disabled={!AI_ENABLED}
                        className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                            !AI_ENABLED
                                ? 'border-white/[0.06] bg-[#111113] text-neutral-500 cursor-not-allowed'
                                : showScanner
                                  ? 'border-white/[0.12] bg-white/[0.06] text-white'
                                  : 'border-white/[0.06] text-neutral-400 hover:bg-[#161618]'
                        }`}
                    >
                        <Camera className="size-4" />
                        <span className="hidden sm:inline">
                            {t('diseases.scanPlant')}
                        </span>
                    </button>
                    {!AI_ENABLED && (
                        <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-52 px-3 py-2 text-xs text-white bg-neutral-800 rounded-lg shadow-lg z-10 text-center">
                            {t('settings.aiDisabledMessage')}
                            <div className="absolute left-1/2 -translate-x-1/2 top-full size-0 border-x-4 border-x-transparent border-t-4 border-t-neutral-800" />
                        </div>
                    )}
                </div>
            </div>

            {/* Filter dropdowns */}
            {showFilters && (
                <div className="flex flex-wrap items-end gap-3 mb-6 p-3 bg-[#111113] rounded-xl border border-white/[0.06] animate-fade-in">
                    <Field className="w-auto">
                        <FieldLabel htmlFor="severity-filter" className="text-xs">
                            {t('diseases.filterBySeverity')}
                        </FieldLabel>
                        <CustomDropdown
                            options={[
                                { value: 'all', label: t('common.all') },
                                ...SEVERITY_OPTIONS.map((s) => ({
                                    value: s,
                                    label: t(`diseases.${s}`),
                                })),
                            ]}
                            value={severityFilter ?? 'all'}
                            onChange={(val) => {
                                setSeverityFilter(val === 'all' ? undefined : val)
                                setPage(1)
                            }}
                            ariaLabel={t('diseases.filterBySeverity')}
                            variant="form"
                        />
                    </Field>
                    {hasActiveFilters && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSeverityFilter(undefined)
                                setPage(1)
                            }}
                            className="text-destructive hover:text-destructive"
                        >
                            {t('common.cancel')}
                        </Button>
                    )}
                </div>
            )}

            {/* Inline Scanner Panel */}
            {showScanner && (
                <div className="flex flex-col mb-6 border border-white/[0.08] bg-white/[0.04] rounded-xl p-4 gap-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold flex items-center gap-2">
                            <Camera className="size-5 text-neutral-400" />
                            {t('scanner.title')}
                        </h2>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={closeScanner}
                            aria-label={t('common.back')}
                        >
                            <X />
                        </Button>
                    </div>

                    {/* Upload area */}
                    <div
                        className="border-2 border-dashed border-white/[0.06] rounded-xl p-6 text-center cursor-pointer hover:border-white/[0.12] transition-colors duration-200 bg-[#161618]"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        {scanPreview ? (
                            <img
                                src={scanPreview}
                                alt="Upload preview"
                                className="max-h-48 mx-auto rounded-lg object-contain"
                            />
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Upload className="size-10 mx-auto text-neutral-500" />
                                <p className="font-medium text-sm">
                                    {t('scanner.uploadPrompt')}
                                </p>
                                <p className="text-xs text-neutral-500"></p>
                            </div>
                        )}
                    </div>

                    {/* Scan another button */}
                    {scanPreview && !scanning && (
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full gap-2"
                        >
                            <Camera className="size-4" />
                            {t('scanner.scanAnother')}
                        </Button>
                    )}

                    {/* Scanning indicator */}
                    {scanning && (
                        <div className="flex flex-col items-center gap-2 py-6">
                            <Loader2 className="size-7 animate-spin text-neutral-400" />
                            <p className="font-medium text-sm">
                                {t('scanner.analyzing')}
                            </p>
                            <p className="text-xs text-neutral-400">
                                {t('scanner.wait')}
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {scanError && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex gap-3">
                            <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-destructive text-sm">
                                    {t('scanner.errorTitle')}
                                </p>
                                <p className="text-xs text-destructive">
                                    {scanError}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Scan Results */}
                    {scanResult && !scanning && (
                        <div className="flex flex-col gap-3">
                            {!scanResult.isPlant ? (
                                <div className="bg-[#D4A72C]/10 border border-[#D4A72C]/20 rounded-xl p-3 flex gap-3">
                                    <AlertTriangle className="size-5 text-[#D4A72C] shrink-0 mt-0.5" />
                                    <p className="text-sm text-[#D4A72C]">
                                        {t('scanner.notPlant')}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Summary card */}
                                    <div
                                        className={`${sev!.bg} border ${sev!.border} rounded-xl p-4 flex flex-col gap-2`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                {scanResult.cropName && (
                                                    <p className="text-xs text-neutral-400">
                                                        {t('scanner.crop')}:{' '}
                                                        <span className="font-medium text-white">
                                                            {
                                                                scanResult.cropName
                                                            }
                                                        </span>
                                                    </p>
                                                )}
                                                {scanResult.diseaseDetected ? (
                                                    <h3
                                                        className={`text-base font-bold ${sev!.color}`}
                                                    >
                                                        <ShieldAlert className="inline size-4 mr-1" />
                                                        {scanResult.diseaseName}
                                                    </h3>
                                                ) : (
                                                    <h3 className="text-base font-bold text-[#4DA34D]">
                                                        <CheckCircle className="inline size-4 mr-1" />
                                                        {t('scanner.healthy')}
                                                    </h3>
                                                )}
                                            </div>
                                            {scanResult.diseaseDetected && (
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${sev!.color} ${sev!.bg} border ${sev!.border}`}
                                                >
                                                    {t(
                                                        `scanner.severity.${scanResult.severity}`,
                                                    )}{' '}
                                                    • {scanResult.confidence}%
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm">
                                            {currentLanguage === 'te'
                                                ? scanResult.summaryTe
                                                : scanResult.summary}
                                        </p>
                                    </div>

                                    {/* Symptoms */}
                                    {scanResult.symptoms.length > 0 && (
                                        <Card className="p-3">
                                            <h4 className="font-semibold text-sm mb-1.5">
                                                {t('scanner.symptoms')}
                                            </h4>
                                            <ul className="flex flex-col gap-1">
                                                {scanResult.symptoms.map(
                                                    (s, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex gap-2 text-sm"
                                                        >
                                                            <span className="text-red-500 shrink-0">
                                                                •
                                                            </span>
                                                            {s}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </Card>
                                    )}

                                    {/* Causes */}
                                    {scanResult.causes.length > 0 && (
                                        <Card className="p-3">
                                            <h4 className="font-semibold text-sm mb-1.5">
                                                {t('scanner.causes')}
                                            </h4>
                                            <ul className="flex flex-col gap-1">
                                                {scanResult.causes.map(
                                                    (c, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex gap-2 text-sm"
                                                        >
                                                            <span className="text-amber-500 shrink-0">
                                                                •
                                                            </span>
                                                            {c}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </Card>
                                    )}

                                    {/* Remedies */}
                                    {scanResult.remedies.length > 0 && (
                                        <Card className="p-3">
                                            <button
                                                onClick={() =>
                                                    setShowRemedies(
                                                        !showRemedies,
                                                    )
                                                }
                                                className="flex items-center justify-between w-full"
                                            >
                                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                                    <Leaf className="size-3.5 text-[#4DA34D]" />
                                                    {t('scanner.remedies')} (
                                                    {scanResult.remedies.length}
                                                    )
                                                </h4>
                                                {showRemedies ? (
                                                    <ChevronUp className="size-4" />
                                                ) : (
                                                    <ChevronDown className="size-4" />
                                                )}
                                            </button>
                                            {showRemedies && (
                                                <div className="flex flex-col mt-2 gap-1.5">
                                                    {scanResult.remedies.map(
                                                        (r, i) => (
                                                            <div
                                                                key={i}
                                                                className="flex gap-2 text-sm"
                                                            >
                                                                <span
                                                                    className={`shrink-0 px-1.5 py-0.5 rounded text-xs font-medium ${
                                                                        r.type ===
                                                                        'organic'
                                                                            ? 'bg-[#4DA34D]/10 text-[#4DA34D]'
                                                                            : r.type ===
                                                                                'biological'
                                                                              ? 'bg-blue-500/15 text-blue-400'
                                                                              : 'bg-purple-500/15 text-purple-400'
                                                                    }`}
                                                                >
                                                                    {t(
                                                                        `scanner.remedyType.${r.type}`,
                                                                    )}
                                                                </span>
                                                                <span>
                                                                    {
                                                                        r.description
                                                                    }
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </Card>
                                    )}

                                    {/* Preventions */}
                                    {scanResult.preventions.length > 0 && (
                                        <Card className="p-3">
                                            <h4 className="font-semibold text-sm mb-1.5">
                                                {t('scanner.preventions')}
                                            </h4>
                                            <ul className="flex flex-col gap-1">
                                                {scanResult.preventions.map(
                                                    (p, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex gap-2 text-sm"
                                                        >
                                                            <span className="text-green-500 shrink-0">
                                                                ✓
                                                            </span>
                                                            {p}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </Card>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* History toggle (logged-in users only) */}
                    {user && (
                        <div className="border-t border-white/[0.06] pt-3">
                            <Button
                                type="button"
                                variant="link"
                                size="sm"
                                onClick={() => setShowHistory(!showHistory)}
                                className="px-0 text-primary"
                            >
                                <History data-icon="inline-start" />
                                {showHistory
                                    ? t('scanner.hideHistory')
                                    : t('scanner.showHistory')}
                            </Button>

                            {showHistory && (
                                <div className="flex flex-col mt-2 gap-1.5">
                                    {historyLoading ? (
                                        <LoadingSpinner />
                                    ) : history.length === 0 ? (
                                        <p className="text-xs text-neutral-400">
                                            {t('scanner.noHistory')}
                                        </p>
                                    ) : (
                                        history.map((row) => (
                                            <div
                                                key={row.id}
                                                className={`flex items-center justify-between bg-[#161618] border border-white/[0.06] rounded-lg p-2.5 cursor-pointer hover:bg-[#161618]`}
                                                onClick={() =>
                                                    loadHistoryResult(row)
                                                }
                                            >
                                                <div>
                                                    <p className="font-medium text-xs">
                                                        {row.disease_name ||
                                                            t(
                                                                'scanner.healthy',
                                                            )}
                                                    </p>
                                                    <p className="text-xs text-neutral-400">
                                                        {row.crop_name ??
                                                            t(
                                                                'scanner.unknownCrop',
                                                            )}{' '}
                                                        •{' '}
                                                        {new Date(
                                                            row.created_at,
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon-xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDeleteHistory(
                                                            row.id,
                                                        )
                                                    }}
                                                    className="text-destructive hover:text-destructive"
                                                    aria-label={t(
                                                        'common.delete',
                                                    )}
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Disease Grid */}
            <DiseaseGrid
                diseases={diseases}
                loading={isLoading}
                language={currentLanguage}
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeft data-icon="inline-start" />
                        {t('common.previous')}
                    </Button>
                    <span className="text-sm font-medium text-muted-foreground">
                        {page} / {totalPages}
                    </span>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                    >
                        {t('common.next')}
                        <ChevronRight data-icon="inline-end" />
                    </Button>
                </div>
            )}
        </div>
    )
}
