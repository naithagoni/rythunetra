import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Trash2,
    Pencil,
    Beaker,
    FileText,
    ImageIcon,
    Play,
    X,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import { formatDate } from '@/utils/dateUtils'
import type { Preparation } from '@/types/preparation'

interface PreparationCardProps {
    preparation: Preparation
    onDelete?: (id: string) => void
    onEdit?: (preparation: Preparation) => void
}

export function PreparationCard({
    preparation,
    onDelete,
    onEdit,
}: PreparationCardProps) {
    const { t } = useTranslation()
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
    const [showVideo, setShowVideo] = useState(false)

    const hasImages =
        preparation.image_urls && preparation.image_urls.length > 0
    const hasVideo = !!preparation.video_url

    const handleDelete = () => {
        if (onDelete && window.confirm(t('preparations.deleteConfirm'))) {
            onDelete(preparation.id)
        }
    }

    return (
        <>
            <div className="bg-white rounded-xl border border-neutral-200 p-5 border-l-4 border-l-primary-500 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-neutral-900 truncate">
                            {preparation.remedy_name ||
                                t('preparations.untitled')}
                        </h3>
                        <p className="text-xs text-neutral-400 mt-0.5">
                            {formatDate(preparation.created_at)}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(preparation)}
                                className="p-1 rounded hover:bg-neutral-100 text-neutral-400 hover:text-primary-600"
                                title={t('common.edit')}
                            >
                                <Pencil className="h-4 w-4" />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={handleDelete}
                                className="p-1 rounded hover:bg-red-50 text-neutral-400 hover:text-red-600"
                                title={t('common.delete')}
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {preparation.quantity && (
                    <div className="flex items-center gap-1.5 text-sm text-neutral-600 mb-2">
                        <Beaker className="h-4 w-4 shrink-0" />
                        <span>{preparation.quantity}</span>
                    </div>
                )}

                {preparation.preparation_notes && (
                    <div className="flex items-start gap-1.5 text-sm text-neutral-500 mb-3">
                        <FileText className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{preparation.preparation_notes}</span>
                    </div>
                )}

                {/* ─── Image thumbnails ───────────────── */}
                {hasImages && (
                    <div className="flex gap-1.5 mb-2 overflow-x-auto">
                        {preparation.image_urls.map((url, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setLightboxIndex(i)}
                                className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-neutral-200 hover:ring-2 hover:ring-primary-400 transition-all"
                            >
                                <img
                                    src={url}
                                    alt={`${preparation.remedy_name ?? 'Preparation'} ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}

                {/* ─── Video thumbnail ────────────────── */}
                {hasVideo && (
                    <button
                        type="button"
                        onClick={() => setShowVideo(true)}
                        className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 mb-1"
                    >
                        <Play className="h-3.5 w-3.5" />
                        {t('preparations.media.watchVideo')}
                    </button>
                )}

                {/* ─── Media count badges ─────────────── */}
                {(hasImages || hasVideo) && (
                    <div className="flex items-center gap-2 mt-1">
                        {hasImages && (
                            <span className="inline-flex items-center gap-1 text-xs text-neutral-400 bg-neutral-100 rounded-full px-2 py-0.5">
                                <ImageIcon className="h-3 w-3" />
                                {preparation.image_urls.length}
                            </span>
                        )}
                        {hasVideo && (
                            <span className="inline-flex items-center gap-1 text-xs text-neutral-400 bg-neutral-100 rounded-full px-2 py-0.5">
                                <Play className="h-3 w-3" />1
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* ─── Image Lightbox ─────────────────────── */}
            {lightboxIndex !== null && hasImages && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setLightboxIndex(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white"
                        onClick={() => setLightboxIndex(null)}
                    >
                        <X className="h-6 w-6" />
                    </button>

                    {preparation.image_urls.length > 1 && (
                        <>
                            <button
                                className="absolute left-4 p-2 text-white/80 hover:text-white"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setLightboxIndex(
                                        (lightboxIndex -
                                            1 +
                                            preparation.image_urls.length) %
                                            preparation.image_urls.length,
                                    )
                                }}
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </button>
                            <button
                                className="absolute right-4 p-2 text-white/80 hover:text-white"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setLightboxIndex(
                                        (lightboxIndex + 1) %
                                            preparation.image_urls.length,
                                    )
                                }}
                            >
                                <ChevronRight className="h-8 w-8" />
                            </button>
                        </>
                    )}

                    <img
                        src={preparation.image_urls[lightboxIndex]}
                        alt={`${preparation.remedy_name} full`}
                        className="max-w-full max-h-[85vh] object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <p className="absolute bottom-4 text-white/70 text-sm">
                        {lightboxIndex + 1} / {preparation.image_urls.length}
                    </p>
                </div>
            )}

            {/* ─── Video Modal ────────────────────────── */}
            {showVideo && preparation.video_url && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowVideo(false)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white"
                        onClick={() => setShowVideo(false)}
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <video
                        src={preparation.video_url}
                        controls
                        autoPlay
                        className="max-w-full max-h-[85vh] rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    )
}
