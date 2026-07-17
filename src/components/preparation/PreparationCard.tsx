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
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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
            <Card className="min-w-0 transition-shadow duration-150 hover:shadow-card-hover">
                <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-foreground truncate">
                                {preparation.remedy_name ||
                                    t('preparations.untitled')}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {formatDate(preparation.created_at)}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            {onEdit && (
                                <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => onEdit(preparation)}
                                    title={t('common.edit')}
                                >
                                    <Pencil className="size-4" />
                                </Button>
                            )}
                            {onDelete && (
                                <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={handleDelete}
                                    title={t('common.delete')}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {preparation.quantity && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                            <Beaker className="size-4 shrink-0" />
                            <span>{preparation.quantity}</span>
                        </div>
                    )}

                    {preparation.preparation_notes && (
                        <div className="flex items-start gap-1.5 text-sm text-muted-foreground mb-3">
                            <FileText className="size-4 shrink-0 mt-0.5" />
                            <span>{preparation.preparation_notes}</span>
                        </div>
                    )}

                    {hasImages && (
                        <div className="flex gap-1.5 mb-2 overflow-x-auto">
                            {preparation.image_urls.map((url, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setLightboxIndex(i)}
                                    className="shrink-0 size-16 rounded-lg overflow-hidden border border-border hover:ring-2 hover:ring-ring transition-all"
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

                    {hasVideo && (
                        <Button
                            variant="link"
                            size="xs"
                            onClick={() => setShowVideo(true)}
                            className="gap-1 p-0 h-auto mb-1"
                        >
                            <Play className="size-3.5" />
                            {t('preparations.media.watchVideo')}
                        </Button>
                    )}

                    {(hasImages || hasVideo) && (
                        <div className="flex items-center gap-2 mt-1">
                            {hasImages && (
                                <Badge variant="secondary" className="gap-1 text-xs">
                                    <ImageIcon className="size-3" />
                                    {preparation.image_urls.length}
                                </Badge>
                            )}
                            {hasVideo && (
                                <Badge variant="secondary" className="gap-1 text-xs">
                                    <Play className="size-3" />1
                                </Badge>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Image Lightbox */}
            {lightboxIndex !== null && hasImages && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setLightboxIndex(null)}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10"
                        onClick={() => setLightboxIndex(null)}
                    >
                        <X className="size-6" />
                    </Button>

                    {preparation.image_urls.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 text-white/80 hover:text-white hover:bg-white/10"
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
                                <ChevronLeft className="size-8" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 text-white/80 hover:text-white hover:bg-white/10"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setLightboxIndex(
                                        (lightboxIndex + 1) %
                                            preparation.image_urls.length,
                                    )
                                }}
                            >
                                <ChevronRight className="size-8" />
                            </Button>
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

            {/* Video Modal */}
            {showVideo && preparation.video_url && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowVideo(false)}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10"
                        onClick={() => setShowVideo(false)}
                    >
                        <X className="size-6" />
                    </Button>
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
