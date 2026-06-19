import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
    Camera,
    Upload,
    Loader2,
    AlertTriangle,
    CheckCircle,
    Leaf,
    ShieldAlert,
    ChevronDown,
    ChevronUp,
    History,
    Trash2,
    Database,
    ExternalLink,
    FlaskConical,
    BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import imageCompression from 'browser-image-compression'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { usePageTitle } from '@/hooks/usePageTitle'
import {
    scanImage,
    saveScanResult,
    getScanHistory,
    deleteScanResult,
} from '@/services/aiService'
import type { ScanResult, ScanHistoryRow } from '@/services/aiService'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const severityConfig: Record<
    string,
    { color: string; bg: string; border: string }
> = {
    low: {
        color: 'text-green-400',
        bg: 'bg-green-950/50',
        border: 'border-green-800/40',
    },
    moderate: {
        color: 'text-amber-400',
        bg: 'bg-amber-950/50',
        border: 'border-amber-800/40',
    },
    high: {
        color: 'text-orange-400',
        bg: 'bg-orange-950/50',
        border: 'border-orange-800/40',
    },
    critical: {
        color: 'text-red-400',
        bg: 'bg-red-950/50',
        border: 'border-red-800/40',
    },
    none: {
        color: 'text-green-400',
        bg: 'bg-green-950/50',
        border: 'border-green-800/40',
    },
}

export function ScannerPage() {
    const { t } = useTranslation()
    const { currentLanguage } = useLanguage()
    const { user } = useAuth()
    usePageTitle('Disease Scanner — AI Crop Analysis')
    const queryClient = useQueryClient()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [scanning, setScanning] = useState(false)
    const [result, setResult] = useState<ScanResult | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [showHistory, setShowHistory] = useState(false)
    const [showRemedies, setShowRemedies] = useState(true)
    const [showDbRemedies, setShowDbRemedies] = useState(true)

    // Scan history for logged-in users
    const { data: historyResult, isLoading: historyLoading } = useQuery({
        queryKey: ['scan-history', user?.id],
        queryFn: () => getScanHistory(user!.id),
        enabled: !!user && showHistory,
    })
    const history: ScanHistoryRow[] =
        (historyResult?.data as ScanHistoryRow[] | null) ?? []

    async function handleImageSelect(file: File) {
        setError(null)
        setResult(null)

        // Preview
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target?.result as string)
        reader.readAsDataURL(file)

        setScanning(true)
        try {
            // Compress before sending
            const compressed = await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
            })

            const scanResult = await scanImage(compressed)
            setResult(scanResult)

            // Save to history if logged in
            if (user && scanResult.isPlant) {
                await saveScanResult(user.id, scanResult)
                queryClient.invalidateQueries({ queryKey: ['scan-history'] })
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : t('scanner.error'))
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
        setResult(row.result)
        setPreview(row.image_url)
        setShowHistory(false)
    }

    const sev = result
        ? (severityConfig[result.severity] ?? severityConfig.none)
        : null

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Header Banner */}
            <div className="page-header-banner rounded-2xl">
                <div className="relative text-center space-y-2">
                    <div className="page-header-icon">
                        <Camera className="h-6 w-6 text-primary-400" />
                    </div>
                    <h1 className="page-title">{t('scanner.title')}</h1>
                    <p className="page-subtitle">{t('scanner.subtitle')}</p>
                </div>
            </div>

            {/* Upload area */}
            <div
                className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-500/10 transition-all duration-200 group"
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
                {preview ? (
                    <img
                        src={preview}
                        alt="Upload preview"
                        className="max-h-64 mx-auto rounded-lg object-contain"
                    />
                ) : (
                    <div className="space-y-3">
                        <div className="w-16 h-16 rounded-xl bg-white/[0.06] flex items-center justify-center mx-auto group-hover:scale-105 transition-transform duration-200">
                            <Upload className="h-8 w-8 text-neutral-500" />
                        </div>
                        <p className="font-medium">
                            {t('scanner.uploadPrompt')}
                        </p>
                        <p className="text-sm text-neutral-400">
                            {t('scanner.uploadHint')}
                        </p>
                    </div>
                )}
            </div>

            {/* Scan button */}
            {preview && !scanning && (
                <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full gap-2"
                >
                    <Camera className="h-5 w-5" />
                    {t('scanner.scanAnother')}
                </Button>
            )}

            {/* Scanning indicator */}
            {scanning && (
                <div className="flex flex-col items-center gap-3 py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
                    <p className="font-medium">{t('scanner.analyzing')}</p>
                    <p className="text-sm text-neutral-400">
                        {t('scanner.wait')}
                    </p>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-red-950/50 border border-red-800/40 rounded-xl p-4 flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-red-300">
                            {t('scanner.errorTitle')}
                        </p>
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                </div>
            )}

            {/* Results */}
            {result && !scanning && (
                <div className="space-y-4">
                    {!result.isPlant ? (
                        <div className="bg-amber-950/50 border border-amber-800/40 rounded-xl p-4 flex gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-amber-300">
                                {t('scanner.notPlant')}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Summary card */}
                            <div
                                className={`${sev!.bg} border ${sev!.border} rounded-xl p-4 space-y-3`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        {result.cropName && (
                                            <p className="text-sm text-neutral-400">
                                                {t('scanner.crop')}:{' '}
                                                <span className="font-medium text-white">
                                                    {result.cropName}
                                                </span>
                                            </p>
                                        )}
                                        {result.diseaseDetected ? (
                                            <h2
                                                className={`text-lg font-bold ${sev!.color}`}
                                            >
                                                <ShieldAlert className="inline h-5 w-5 mr-1" />
                                                {result.diseaseName}
                                            </h2>
                                        ) : (
                                            <h2 className="text-lg font-bold text-green-400">
                                                <CheckCircle className="inline h-5 w-5 mr-1" />
                                                {t('scanner.healthy')}
                                            </h2>
                                        )}
                                    </div>
                                    {result.diseaseDetected && (
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${sev!.color} ${sev!.bg} border ${sev!.border}`}
                                        >
                                            {t(
                                                `scanner.severity.${result.severity}`,
                                            )}{' '}
                                            • {result.confidence}%
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm">
                                    {currentLanguage === 'te'
                                        ? result.summaryTe
                                        : result.summary}
                                </p>
                            </div>

                            {/* Symptoms */}
                            {result.symptoms.length > 0 && (
                                <div className="bg-white/[0.06] border border-white/10 rounded-xl p-4">
                                    <h3 className="font-semibold mb-2 text-white">
                                        {t('scanner.symptoms')}
                                    </h3>
                                    <ul className="space-y-1">
                                        {result.symptoms.map((s, i) => (
                                            <li
                                                key={i}
                                                className="flex gap-2 text-sm"
                                            >
                                                <span className="text-red-500 shrink-0">
                                                    •
                                                </span>
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Causes */}
                            {result.causes.length > 0 && (
                                <div className="bg-white/[0.06] border border-white/10 rounded-xl p-4">
                                    <h3 className="font-semibold mb-2 text-white">
                                        {t('scanner.causes')}
                                    </h3>
                                    <ul className="space-y-1">
                                        {result.causes.map((c, i) => (
                                            <li
                                                key={i}
                                                className="flex gap-2 text-sm"
                                            >
                                                <span className="text-amber-500 shrink-0">
                                                    •
                                                </span>
                                                {c}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Remedies */}
                            {result.remedies.length > 0 && (
                                <div className="bg-white/[0.06] border border-white/10 rounded-xl p-4">
                                    <button
                                        onClick={() =>
                                            setShowRemedies(!showRemedies)
                                        }
                                        className="flex items-center justify-between w-full"
                                    >
                                        <h3 className="font-semibold flex items-center gap-2 text-white">
                                            <Leaf className="h-4 w-4 text-green-400" />
                                            {t('scanner.remedies')} (
                                            {result.remedies.length})
                                        </h3>
                                        {showRemedies ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </button>
                                    {showRemedies && (
                                        <div className="mt-3 space-y-2">
                                            {result.remedies.map((r, i) => (
                                                <div
                                                    key={i}
                                                    className="flex gap-2 text-sm"
                                                >
                                                    <span
                                                        className={`shrink-0 px-1.5 py-0.5 rounded text-xs font-medium ${
                                                            r.type === 'organic'
                                                                ? 'bg-green-500/15 text-green-400'
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
                                                    <span>{r.description}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Preventions */}
                            {result.preventions.length > 0 && (
                                <div className="bg-white/[0.06] border border-white/10 rounded-xl p-4">
                                    <h3 className="font-semibold mb-2 text-white">
                                        {t('scanner.preventions')}
                                    </h3>
                                    <ul className="space-y-1">
                                        {result.preventions.map((p, i) => (
                                            <li
                                                key={i}
                                                className="flex gap-2 text-sm"
                                            >
                                                <span className="text-green-500 shrink-0">
                                                    ✓
                                                </span>
                                                {p}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* ── DB Match Section ── */}
                            {result.dbMatch && (
                                <div className="space-y-4">
                                    {/* DB Match Header Card */}
                                    <div className="bg-indigo-950/50 border border-indigo-800/40 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <Database className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-indigo-300 flex items-center gap-2">
                                                    {t('scanner.dbMatch.title')}
                                                </h3>
                                                <p className="text-sm text-indigo-400 mt-1">
                                                    {t(
                                                        'scanner.dbMatch.description',
                                                    )}
                                                </p>
                                                <div className="mt-3 flex items-center gap-3">
                                                    <span className="text-sm font-medium text-indigo-300">
                                                        {currentLanguage ===
                                                        'te'
                                                            ? result.dbMatch
                                                                  .name.te
                                                            : result.dbMatch
                                                                  .name.en}
                                                    </span>
                                                    {result.dbMatch.type && (
                                                        <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-500/15 text-indigo-400 border border-indigo-800/40">
                                                            {currentLanguage ===
                                                            'te'
                                                                ? result.dbMatch
                                                                      .type.te
                                                                : result.dbMatch
                                                                      .type.en}
                                                        </span>
                                                    )}
                                                </div>
                                                <Link
                                                    to={`/diseases/${result.dbMatch.id}`}
                                                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                                                >
                                                    <BookOpen className="h-4 w-4" />
                                                    {t(
                                                        'scanner.dbMatch.viewDetails',
                                                    )}
                                                    <ExternalLink className="h-3 w-3" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* DB Remedies */}
                                    {result.dbMatch.remedies.length > 0 && (
                                        <div className="bg-white/[0.06] border border-indigo-800/40 rounded-xl p-4">
                                            <button
                                                onClick={() =>
                                                    setShowDbRemedies(
                                                        !showDbRemedies,
                                                    )
                                                }
                                                className="flex items-center justify-between w-full"
                                            >
                                                <h3 className="font-semibold flex items-center gap-2 text-indigo-300">
                                                    <FlaskConical className="h-4 w-4 text-indigo-400" />
                                                    {t(
                                                        'scanner.dbMatch.remedies',
                                                    )}{' '}
                                                    (
                                                    {
                                                        result.dbMatch.remedies
                                                            .length
                                                    }
                                                    )
                                                </h3>
                                                {showDbRemedies ? (
                                                    <ChevronUp className="h-4 w-4 text-indigo-400" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4 text-indigo-400" />
                                                )}
                                            </button>
                                            {showDbRemedies && (
                                                <div className="mt-3 space-y-3">
                                                    {result.dbMatch.remedies.map(
                                                        (remedy) => (
                                                            <div
                                                                key={remedy.id}
                                                                className="border border-indigo-800/30 rounded-lg p-3 space-y-2"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium text-sm">
                                                                        {currentLanguage ===
                                                                        'te'
                                                                            ? remedy
                                                                                  .name
                                                                                  .te
                                                                            : remedy
                                                                                  .name
                                                                                  .en}
                                                                    </span>
                                                                    {remedy.type && (
                                                                        <span className="px-1.5 py-0.5 rounded text-xs bg-indigo-950/50 text-indigo-400">
                                                                            {currentLanguage ===
                                                                            'te'
                                                                                ? remedy
                                                                                      .type
                                                                                      .te
                                                                                : remedy
                                                                                      .type
                                                                                      .en}
                                                                        </span>
                                                                    )}
                                                                    {remedy.effectiveness && (
                                                                        <span
                                                                            className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                                                                remedy.effectiveness ===
                                                                                'High'
                                                                                    ? 'bg-green-500/15 text-green-400'
                                                                                    : remedy.effectiveness ===
                                                                                        'Moderate'
                                                                                      ? 'bg-amber-500/15 text-amber-400'
                                                                                      : 'bg-white/[0.06] text-neutral-400'
                                                                            }`}
                                                                        >
                                                                            {t(
                                                                                `scanner.dbMatch.effectiveness.${remedy.effectiveness.toLowerCase()}`,
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {remedy.how_it_works && (
                                                                    <p className="text-xs text-neutral-400">
                                                                        {currentLanguage ===
                                                                        'te'
                                                                            ? remedy
                                                                                  .how_it_works
                                                                                  .te
                                                                            : remedy
                                                                                  .how_it_works
                                                                                  .en}
                                                                    </p>
                                                                )}
                                                                {remedy.ingredients &&
                                                                    remedy
                                                                        .ingredients
                                                                        .length >
                                                                        0 && (
                                                                        <div className="text-xs">
                                                                            <span className="font-medium text-neutral-400">
                                                                                {t(
                                                                                    'scanner.dbMatch.ingredients',
                                                                                )}

                                                                                :
                                                                            </span>{' '}
                                                                            {remedy.ingredients
                                                                                .map(
                                                                                    (
                                                                                        ing,
                                                                                    ) =>
                                                                                        currentLanguage ===
                                                                                        'te'
                                                                                            ? ing.te
                                                                                            : ing.en,
                                                                                )
                                                                                .join(
                                                                                    ', ',
                                                                                )}
                                                                        </div>
                                                                    )}
                                                                {remedy.usage_instructions &&
                                                                    remedy
                                                                        .usage_instructions
                                                                        .length >
                                                                        0 && (
                                                                        <div className="text-xs">
                                                                            <span className="font-medium text-neutral-400">
                                                                                {t(
                                                                                    'scanner.dbMatch.usage',
                                                                                )}

                                                                                :
                                                                            </span>
                                                                            <ul className="mt-1 space-y-0.5 ml-3">
                                                                                {remedy.usage_instructions.map(
                                                                                    (
                                                                                        inst,
                                                                                        idx,
                                                                                    ) => (
                                                                                        <li
                                                                                            key={
                                                                                                idx
                                                                                            }
                                                                                            className="list-disc"
                                                                                        >
                                                                                            {currentLanguage ===
                                                                                            'te'
                                                                                                ? inst.te
                                                                                                : inst.en}
                                                                                        </li>
                                                                                    ),
                                                                                )}
                                                                            </ul>
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* DB Treatments */}
                                    {result.dbMatch.treatments.length > 0 && (
                                        <div className="bg-white/[0.06] border border-indigo-800/40 rounded-xl p-4">
                                            <h3 className="font-semibold mb-2 flex items-center gap-2 text-indigo-300">
                                                <Leaf className="h-4 w-4 text-indigo-400" />
                                                {t(
                                                    'scanner.dbMatch.treatments',
                                                )}
                                            </h3>
                                            <ul className="space-y-1">
                                                {result.dbMatch.treatments.map(
                                                    (treatment, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex gap-2 text-sm"
                                                        >
                                                            <span className="text-indigo-500 shrink-0">
                                                                •
                                                            </span>
                                                            {currentLanguage ===
                                                            'te'
                                                                ? treatment.te
                                                                : treatment.en}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* History toggle (logged-in users only) */}
            {user && (
                <div className="border-t border-white/10 pt-4">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="flex items-center gap-2 text-sm font-medium text-primary-400 hover:underline"
                    >
                        <History className="h-4 w-4" />
                        {showHistory
                            ? t('scanner.hideHistory')
                            : t('scanner.showHistory')}
                    </button>

                    {showHistory && (
                        <div className="mt-3 space-y-2">
                            {historyLoading ? (
                                <LoadingSpinner />
                            ) : history.length === 0 ? (
                                <p className="text-sm text-neutral-400">
                                    {t('scanner.noHistory')}
                                </p>
                            ) : (
                                history.map((row) => (
                                    <div
                                        key={row.id}
                                        className="flex items-center justify-between bg-white/[0.06] border border-white/10 rounded-xl p-3 cursor-pointer hover:bg-white/[0.06] transition-all duration-200"
                                        onClick={() => loadHistoryResult(row)}
                                    >
                                        <div>
                                            <p className="font-medium text-sm">
                                                {row.disease_name ||
                                                    t('scanner.healthy')}
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
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteHistory(row.id)
                                            }}
                                            className="p-1 text-red-400 hover:text-red-400"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
