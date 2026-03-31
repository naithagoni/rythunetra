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

const SEVERITY_OPTIONS = ['low', 'moderate', 'high', 'critical'] as const

const severityConfig: Record<
    string,
    { color: string; bg: string; border: string }
> = {
    low: {
        color: 'text-green-700',
        bg: 'bg-green-50',
        border: 'border-green-200',
    },
    moderate: {
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
    },
    high: {
        color: 'text-orange-700',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
    },
    critical: {
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
    },
    none: {
        color: 'text-green-700',
        bg: 'bg-green-50',
        border: 'border-green-200',
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
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder={t('common.search')}
                        className="input pl-10 pr-10"
                    />
                    {searchInput && (
                        <button
                            onClick={() => setSearchInput('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        hasActiveFilters
                            ? 'border-primary-300 bg-primary-50 text-primary-600'
                            : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50'
                    }`}
                >
                    <Filter className="h-4 w-4" />
                    {hasActiveFilters && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
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
                                ? 'border-neutral-200 bg-neutral-50 text-neutral-300 cursor-not-allowed'
                                : showScanner
                                  ? 'border-primary-300 bg-primary-50 text-primary-600'
                                  : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50'
                        }`}
                    >
                        <Camera className="h-4 w-4" />
                        <span className="hidden sm:inline">
                            {t('diseases.scanPlant')}
                        </span>
                    </button>
                    {!AI_ENABLED && (
                        <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-52 px-3 py-2 text-xs text-white bg-neutral-800 rounded-lg shadow-lg z-10 text-center">
                            {t('settings.aiDisabledMessage')}
                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-neutral-800" />
                        </div>
                    )}
                </div>
            </div>

            {/* Filter dropdowns */}
            {showFilters && (
                <div className="flex flex-wrap items-center gap-3 mb-6 p-3 bg-neutral-50 rounded-xl border border-neutral-200 animate-fade-in">
                    <div>
                        <label className="text-xs font-semibold text-neutral-600 mb-1 block">
                            {t('diseases.filterBySeverity')}
                        </label>
                        <select
                            value={severityFilter ?? ''}
                            onChange={(e) => {
                                setSeverityFilter(e.target.value || undefined)
                                setPage(1)
                            }}
                            className="input text-sm py-1.5"
                        >
                            <option value="">{t('common.all')}</option>
                            {SEVERITY_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                    {t(`diseases.${s}`)}
                                </option>
                            ))}
                        </select>
                    </div>
                    {hasActiveFilters && (
                        <button
                            onClick={() => {
                                setSeverityFilter(undefined)
                                setPage(1)
                            }}
                            className="text-xs text-red-600 hover:text-red-700 font-medium mt-4"
                        >
                            {t('common.cancel')}
                        </button>
                    )}
                </div>
            )}

            {/* Inline Scanner Panel */}
            {showScanner && (
                <div className="mb-6 border border-primary-200 bg-primary-50/30 rounded-xl p-4 space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold flex items-center gap-2">
                            <Camera className="h-5 w-5 text-primary-600" />
                            {t('scanner.title')}
                        </h2>
                        <button
                            onClick={closeScanner}
                            className="p-1 rounded-lg hover:bg-neutral-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Upload area */}
                    <div
                        className="border-2 border-dashed border-neutral-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary-400 transition-colors duration-200 bg-white"
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
                            <div className="space-y-2">
                                <Upload className="h-10 w-10 mx-auto text-neutral-400" />
                                <p className="font-medium text-sm">
                                    {t('scanner.uploadPrompt')}
                                </p>
                                <p className="text-xs text-neutral-400"></p>
                            </div>
                        )}
                    </div>

                    {/* Scan another button */}
                    {scanPreview && !scanning && (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full btn-primary flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm"
                        >
                            <Camera className="h-4 w-4" />
                            {t('scanner.scanAnother')}
                        </button>
                    )}

                    {/* Scanning indicator */}
                    {scanning && (
                        <div className="flex flex-col items-center gap-2 py-6">
                            <Loader2 className="h-7 w-7 animate-spin text-primary-600" />
                            <p className="font-medium text-sm">
                                {t('scanner.analyzing')}
                            </p>
                            <p className="text-xs text-neutral-500">
                                {t('scanner.wait')}
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {scanError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-red-800 text-sm">
                                    {t('scanner.errorTitle')}
                                </p>
                                <p className="text-xs text-red-600">
                                    {scanError}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Scan Results */}
                    {scanResult && !scanning && (
                        <div className="space-y-3">
                            {!scanResult.isPlant ? (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-3">
                                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                    <p className="text-sm text-amber-800">
                                        {t('scanner.notPlant')}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Summary card */}
                                    <div
                                        className={`${sev!.bg} border ${sev!.border} rounded-xl p-4 space-y-2`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                {scanResult.cropName && (
                                                    <p className="text-xs text-neutral-500">
                                                        {t('scanner.crop')}:{' '}
                                                        <span className="font-medium text-neutral-900">
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
                                                        <ShieldAlert className="inline h-4 w-4 mr-1" />
                                                        {scanResult.diseaseName}
                                                    </h3>
                                                ) : (
                                                    <h3 className="text-base font-bold text-green-700">
                                                        <CheckCircle className="inline h-4 w-4 mr-1" />
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
                                        <div className="bg-white border border-neutral-200 rounded-xl p-3">
                                            <h4 className="font-semibold text-sm mb-1.5">
                                                {t('scanner.symptoms')}
                                            </h4>
                                            <ul className="space-y-1">
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
                                        </div>
                                    )}

                                    {/* Causes */}
                                    {scanResult.causes.length > 0 && (
                                        <div className="bg-white border border-neutral-200 rounded-xl p-3">
                                            <h4 className="font-semibold text-sm mb-1.5">
                                                {t('scanner.causes')}
                                            </h4>
                                            <ul className="space-y-1">
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
                                        </div>
                                    )}

                                    {/* Remedies */}
                                    {scanResult.remedies.length > 0 && (
                                        <div className="bg-white border border-neutral-200 rounded-xl p-3">
                                            <button
                                                onClick={() =>
                                                    setShowRemedies(
                                                        !showRemedies,
                                                    )
                                                }
                                                className="flex items-center justify-between w-full"
                                            >
                                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                                    <Leaf className="h-3.5 w-3.5 text-green-600" />
                                                    {t('scanner.remedies')} (
                                                    {scanResult.remedies.length}
                                                    )
                                                </h4>
                                                {showRemedies ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                )}
                                            </button>
                                            {showRemedies && (
                                                <div className="mt-2 space-y-1.5">
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
                                                                            ? 'bg-green-100 text-green-700'
                                                                            : r.type ===
                                                                                'biological'
                                                                              ? 'bg-blue-100 text-blue-700'
                                                                              : 'bg-purple-100 text-purple-700'
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
                                        </div>
                                    )}

                                    {/* Preventions */}
                                    {scanResult.preventions.length > 0 && (
                                        <div className="bg-white border border-neutral-200 rounded-xl p-3">
                                            <h4 className="font-semibold text-sm mb-1.5">
                                                {t('scanner.preventions')}
                                            </h4>
                                            <ul className="space-y-1">
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
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* History toggle (logged-in users only) */}
                    {user && (
                        <div className="border-t border-neutral-200 pt-3">
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className="flex items-center gap-2 text-xs font-medium text-primary-600 hover:underline"
                            >
                                <History className="h-3.5 w-3.5" />
                                {showHistory
                                    ? t('scanner.hideHistory')
                                    : t('scanner.showHistory')}
                            </button>

                            {showHistory && (
                                <div className="mt-2 space-y-1.5">
                                    {historyLoading ? (
                                        <LoadingSpinner />
                                    ) : history.length === 0 ? (
                                        <p className="text-xs text-neutral-500">
                                            {t('scanner.noHistory')}
                                        </p>
                                    ) : (
                                        history.map((row) => (
                                            <div
                                                key={row.id}
                                                className={`flex items-center justify-between bg-white border border-neutral-200 rounded-lg p-2.5 cursor-pointer hover:bg-neutral-50`}
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
                                                    <p className="text-xs text-neutral-500">
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
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDeleteHistory(
                                                            row.id,
                                                        )
                                                    }}
                                                    className="p-1 text-red-400 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
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
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-5 py-2.5 rounded-lg bg-neutral-100 font-medium text-sm disabled:opacity-30 transition-colors duration-200 inline-flex items-center gap-1 hover:bg-neutral-200"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        {t('common.previous')}
                    </button>
                    <span className="text-sm font-medium text-neutral-500">
                        {page} / {totalPages}
                    </span>
                    <button
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                        className="px-5 py-2.5 rounded-lg bg-neutral-100 font-medium text-sm disabled:opacity-30 transition-colors duration-200 inline-flex items-center gap-1 hover:bg-neutral-200"
                    >
                        {t('common.next')}
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    )
}
