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
    Database,
    ExternalLink,
    BookOpen,
    History,
    Trash2,
} from 'lucide-react'
import imageCompression from 'browser-image-compression'
import { Button } from '@/components/ui/button'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { InfoCallout } from '@/components/common/InfoCallout'
import { Section } from '@/components/common/Section'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import {
    scanImage,
    saveScanResult,
    getScanHistory,
    deleteScanResult,
} from '@/services/aiService'
import type { ScanResult, ScanHistoryRow } from '@/services/aiService'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { severityColor, remedyTypeColor } from '@/utils/statusColors'

/** Bulleted list rendered inside a Section. */
function BulletList({ items }: { items: string[] }) {
    return (
        <ul className="flex flex-col gap-1.5">
            {items.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-foreground">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground" />
                    {s}
                </li>
            ))}
        </ul>
    )
}

/**
 * The complete disease-scan flow: upload dropzone → analyze → structured
 * results (neutral callouts + titled sections) → optional history. Shared by
 * the Scanner page and the DiseaseList scan Dialog (single source of truth).
 */
export function ScanFlow({ showHistory = true }: { showHistory?: boolean }) {
    const { t } = useTranslation()
    const { currentLanguage } = useLanguage()
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [scanning, setScanning] = useState(false)
    const [result, setResult] = useState<ScanResult | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [historyOpen, setHistoryOpen] = useState(false)

    const { data: historyResult, isLoading: historyLoading } = useQuery({
        queryKey: ['scan-history', user?.id],
        queryFn: () => getScanHistory(user!.id),
        enabled: !!user && historyOpen,
    })
    const history: ScanHistoryRow[] =
        (historyResult?.data as ScanHistoryRow[] | null) ?? []

    async function handleImageSelect(file: File) {
        setError(null)
        setResult(null)
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target?.result as string)
        reader.readAsDataURL(file)

        setScanning(true)
        try {
            const compressed = await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
            })
            const scanResult = await scanImage(compressed)
            setResult(scanResult)
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

    const sev = result ? severityColor(result.severity) : null
    const isTe = currentLanguage === 'te'

    return (
        <div className="flex flex-col gap-5">
            {/* Upload dropzone */}
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-8 text-center transition-colors hover:border-muted-foreground/40 hover:bg-muted/40"
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
                        alt=""
                        className="max-h-56 rounded-lg object-contain"
                    />
                ) : (
                    <>
                        <span className="flex size-12 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-transform group-hover:scale-105">
                            <Upload className="size-5" />
                        </span>
                        <span className="text-sm font-medium text-foreground">
                            {t('scanner.uploadPrompt')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {t('scanner.uploadHint')}
                        </span>
                    </>
                )}
            </button>

            {preview && !scanning && (
                <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Camera data-icon="inline-start" />
                    {t('scanner.scanAnother')}
                </Button>
            )}

            {scanning && (
                <div className="flex flex-col items-center gap-3 py-8">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    <p className="text-sm font-medium">
                        {t('scanner.analyzing')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {t('scanner.wait')}
                    </p>
                </div>
            )}

            {error && (
                <InfoCallout
                    tone="red"
                    icon={<AlertTriangle className="size-5" />}
                    title={t('scanner.errorTitle')}
                >
                    {error}
                </InfoCallout>
            )}

            {/* Results */}
            {result && !scanning && (
                <div className="flex flex-col gap-4">
                    {!result.isPlant ? (
                        <InfoCallout
                            tone="amber"
                            icon={<AlertTriangle className="size-5" />}
                        >
                            {t('scanner.notPlant')}
                        </InfoCallout>
                    ) : (
                        <>
                            {/* Summary */}
                            <InfoCallout
                                tone={
                                    result.diseaseDetected ? 'amber' : 'green'
                                }
                                icon={
                                    result.diseaseDetected ? (
                                        <ShieldAlert className="size-5" />
                                    ) : (
                                        <CheckCircle className="size-5" />
                                    )
                                }
                                title={
                                    result.diseaseDetected
                                        ? result.diseaseName
                                        : t('scanner.healthy')
                                }
                                action={
                                    result.diseaseDetected && sev ? (
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${sev.chip}`}
                                        >
                                            {t(
                                                `scanner.severity.${result.severity}`,
                                            )}{' '}
                                            · {result.confidence}%
                                        </span>
                                    ) : undefined
                                }
                            >
                                {result.cropName && (
                                    <p className="mb-1">
                                        {t('scanner.crop')}:{' '}
                                        <span className="font-medium text-foreground">
                                            {result.cropName}
                                        </span>
                                    </p>
                                )}
                                {isTe ? result.summaryTe : result.summary}
                            </InfoCallout>

                            {result.symptoms.length > 0 && (
                                <Section title={t('scanner.symptoms')}>
                                    <BulletList items={result.symptoms} />
                                </Section>
                            )}
                            {result.causes.length > 0 && (
                                <Section title={t('scanner.causes')}>
                                    <BulletList items={result.causes} />
                                </Section>
                            )}
                            {result.remedies.length > 0 && (
                                <Section
                                    title={`${t('scanner.remedies')} (${result.remedies.length})`}
                                >
                                    <div className="flex flex-col gap-2">
                                        {result.remedies.map((r, i) => (
                                            <div
                                                key={i}
                                                className="flex gap-2 text-sm"
                                            >
                                                <span
                                                    className={`h-fit shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${remedyTypeColor(r.type).chip}`}
                                                >
                                                    {t(
                                                        `scanner.remedyType.${r.type}`,
                                                    )}
                                                </span>
                                                <span className="text-foreground">
                                                    {r.description}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </Section>
                            )}
                            {result.preventions.length > 0 && (
                                <Section title={t('scanner.preventions')}>
                                    <BulletList items={result.preventions} />
                                </Section>
                            )}

                            {/* DB match */}
                            {result.dbMatch && (
                                <Section
                                    title={t('scanner.dbMatch.title')}
                                    description={t(
                                        'scanner.dbMatch.description',
                                    )}
                                    headerAction={
                                        <Database className="size-4 text-aux-accent-8" />
                                    }
                                >
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-foreground">
                                                {isTe
                                                    ? result.dbMatch.name.te
                                                    : result.dbMatch.name.en}
                                            </span>
                                            <Link
                                                to={`/diseases/${result.dbMatch.id}`}
                                                className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-link hover:underline"
                                            >
                                                <BookOpen className="size-4" />
                                                {t('scanner.dbMatch.viewDetails')}
                                                <ExternalLink className="size-3" />
                                            </Link>
                                        </div>
                                        {result.dbMatch.remedies.length > 0 && (
                                            <Accordion
                                                type="single"
                                                collapsible
                                            >
                                                <AccordionItem
                                                    value="db-remedies"
                                                    className="border-b-0"
                                                >
                                                    <AccordionTrigger className="py-2 text-sm">
                                                        <span className="flex items-center gap-2">
                                                            <Leaf className="size-4 text-aux-accent-6" />
                                                            {t(
                                                                'scanner.dbMatch.remedies',
                                                            )}{' '}
                                                            (
                                                            {
                                                                result.dbMatch
                                                                    .remedies
                                                                    .length
                                                            }
                                                            )
                                                        </span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="flex flex-col gap-2">
                                                        {result.dbMatch.remedies.map(
                                                            (remedy) => (
                                                                <div
                                                                    key={
                                                                        remedy.id
                                                                    }
                                                                    className="rounded-lg border border-border p-3"
                                                                >
                                                                    <span className="text-sm font-medium text-foreground">
                                                                        {isTe
                                                                            ? remedy
                                                                                  .name
                                                                                  .te
                                                                            : remedy
                                                                                  .name
                                                                                  .en}
                                                                    </span>
                                                                    {remedy.how_it_works && (
                                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                                            {isTe
                                                                                ? remedy
                                                                                      .how_it_works
                                                                                      .te
                                                                                : remedy
                                                                                      .how_it_works
                                                                                      .en}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ),
                                                        )}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        )}
                                    </div>
                                </Section>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* History */}
            {showHistory && user && (
                <div className="border-t border-border pt-4">
                    <Button
                        variant="link"
                        onClick={() => setHistoryOpen((v) => !v)}
                        className="px-0"
                    >
                        <History data-icon="inline-start" />
                        {historyOpen
                            ? t('scanner.hideHistory')
                            : t('scanner.showHistory')}
                    </Button>
                    {historyOpen && (
                        <div className="mt-2 divide-y divide-border rounded-lg border border-border">
                            {historyLoading ? (
                                <div className="p-4">
                                    <LoadingSpinner />
                                </div>
                            ) : history.length === 0 ? (
                                <p className="p-4 text-sm text-muted-foreground">
                                    {t('scanner.noHistory')}
                                </p>
                            ) : (
                                history.map((row) => (
                                    <div
                                        key={row.id}
                                        className="flex items-center justify-between gap-2 px-4 py-3"
                                    >
                                        <button
                                            type="button"
                                            className="min-w-0 flex-1 text-left"
                                            onClick={() => {
                                                setResult(row.result)
                                                setPreview(row.image_url)
                                                setHistoryOpen(false)
                                            }}
                                        >
                                            <p className="truncate text-sm font-medium text-foreground">
                                                {row.disease_name ||
                                                    t('scanner.healthy')}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {row.crop_name ??
                                                    t('scanner.unknownCrop')}{' '}
                                                ·{' '}
                                                {new Date(
                                                    row.created_at,
                                                ).toLocaleDateString()}
                                            </p>
                                        </button>
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() =>
                                                handleDeleteHistory(row.id)
                                            }
                                            aria-label={t('common.delete')}
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
    )
}
