import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, ImagePlus, Video, Trash2, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { uploadPreparationFile } from '@/services/preparationService'
import type { Preparation } from '@/types/preparation'

const MAX_IMAGES = 5
const MAX_IMAGE_SIZE_MB = 5
const MAX_VIDEO_SIZE_MB = 50
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']

const preparationSchema = z.object({
    remedy_name: z.string().min(1, 'Please enter a remedy name'),
    quantity: z.string().optional(),
    preparation_notes: z.string().optional(),
})

type PreparationFormData = z.infer<typeof preparationSchema>

interface PreparationFormProps {
    onSubmit: (
        data: PreparationFormData & {
            image_urls?: string[]
            video_url?: string
        },
    ) => Promise<void>
    onClose: () => void
    editingPreparation?: Preparation | null
}

export function PreparationForm({
    onSubmit,
    onClose,
    editingPreparation,
}: PreparationFormProps) {
    const { t } = useTranslation()
    const { user } = useAuth()
    const [submitting, setSubmitting] = useState(false)
    const [uploading, setUploading] = useState(false)
    const isEditing = !!editingPreparation

    // Media state
    const [imageUrls, setImageUrls] = useState<string[]>(
        editingPreparation?.image_urls ?? [],
    )
    const [videoUrl, setVideoUrl] = useState<string | null>(
        editingPreparation?.video_url ?? null,
    )
    const [mediaError, setMediaError] = useState<string | null>(null)

    const imageInputRef = useRef<HTMLInputElement>(null)
    const videoInputRef = useRef<HTMLInputElement>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PreparationFormData>({
        resolver: zodResolver(preparationSchema),
        defaultValues: {
            remedy_name: editingPreparation?.remedy_name ?? '',
            quantity: editingPreparation?.quantity ?? '',
            preparation_notes: editingPreparation?.preparation_notes ?? '',
        },
    })

    // ─── Image upload ─────────────────────────────────

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files || !user) return
        setMediaError(null)

        const remaining = MAX_IMAGES - imageUrls.length
        const filesToUpload = Array.from(files).slice(0, remaining)

        for (const file of filesToUpload) {
            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                setMediaError(t('preparations.media.invalidImageType'))
                return
            }
            if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
                setMediaError(
                    t('preparations.media.imageTooLarge', {
                        max: MAX_IMAGE_SIZE_MB,
                    }),
                )
                return
            }
        }

        setUploading(true)
        try {
            const urls: string[] = []
            for (const file of filesToUpload) {
                const url = await uploadPreparationFile(user.id, file, 'images')
                urls.push(url)
            }
            setImageUrls((prev) => [...prev, ...urls])
        } catch {
            setMediaError(t('preparations.media.uploadFailed'))
        } finally {
            setUploading(false)
            // Reset input so same file can be re-selected
            if (imageInputRef.current) imageInputRef.current.value = ''
        }
    }

    function removeImage(index: number) {
        setImageUrls((prev) => prev.filter((_, i) => i !== index))
    }

    // ─── Video upload ─────────────────────────────────

    async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file || !user) return
        setMediaError(null)

        if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
            setMediaError(t('preparations.media.invalidVideoType'))
            return
        }
        if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
            setMediaError(
                t('preparations.media.videoTooLarge', {
                    max: MAX_VIDEO_SIZE_MB,
                }),
            )
            return
        }

        setUploading(true)
        try {
            const url = await uploadPreparationFile(user.id, file, 'videos')
            setVideoUrl(url)
        } catch {
            setMediaError(t('preparations.media.uploadFailed'))
        } finally {
            setUploading(false)
            if (videoInputRef.current) videoInputRef.current.value = ''
        }
    }

    function removeVideo() {
        setVideoUrl(null)
    }

    // ─── Submit ───────────────────────────────────────

    const handleFormSubmit = async (data: PreparationFormData) => {
        setSubmitting(true)
        try {
            await onSubmit({
                ...data,
                image_urls: imageUrls,
                video_url: videoUrl ?? undefined,
            })
            onClose()
        } catch {
            // Error handled by parent
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl border border-neutral-200 shadow-lg w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-neutral-200 sticky top-0 bg-white z-10">
                    <h2 className="text-h4">
                        {isEditing
                            ? t('common.edit')
                            : t('preparations.addNew')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md hover:bg-neutral-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="p-4 space-y-4"
                >
                    {/* Remedy Name */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            {t('preparations.remedyName')}
                        </label>
                        <input
                            type="text"
                            {...register('remedy_name')}
                            className="input"
                            placeholder={t(
                                'preparations.remedyNamePlaceholder',
                            )}
                        />
                        {errors.remedy_name && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.remedy_name.message}
                            </p>
                        )}
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            {t('preparations.quantity')}
                        </label>
                        <input
                            type="text"
                            {...register('quantity')}
                            className="input"
                            placeholder={t('preparations.quantityPlaceholder')}
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            {t('preparations.notes')}
                        </label>
                        <textarea
                            {...register('preparation_notes')}
                            className="input"
                            rows={3}
                            placeholder={t('preparations.notesPlaceholder')}
                        />
                    </div>

                    {/* ─── Images ─────────────────────────── */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            {t('preparations.media.images')}{' '}
                            <span className="text-neutral-400 font-normal">
                                ({imageUrls.length}/{MAX_IMAGES})
                            </span>
                        </label>

                        {/* Image previews */}
                        {imageUrls.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {imageUrls.map((url, i) => (
                                    <div
                                        key={i}
                                        className="relative w-20 h-20 rounded-lg overflow-hidden border border-neutral-200 group"
                                    >
                                        <img
                                            src={url}
                                            alt={`Image ${i + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add image button */}
                        {imageUrls.length < MAX_IMAGES && (
                            <>
                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                    multiple
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        imageInputRef.current?.click()
                                    }
                                    disabled={uploading}
                                    className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 border border-dashed border-primary-300 rounded-lg px-3 py-2 hover:bg-primary-50 transition-colors disabled:opacity-50"
                                >
                                    {uploading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <ImagePlus className="h-4 w-4" />
                                    )}
                                    {t('preparations.media.addImages')}
                                </button>
                            </>
                        )}
                        <p className="text-xs text-neutral-400 mt-1">
                            {t('preparations.media.imageHint', {
                                max: MAX_IMAGE_SIZE_MB,
                            })}
                        </p>
                    </div>

                    {/* ─── Video ──────────────────────────── */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            {t('preparations.media.video')}
                        </label>

                        {videoUrl ? (
                            <div className="relative rounded-lg overflow-hidden border border-neutral-200">
                                <video
                                    src={videoUrl}
                                    className="w-full max-h-48 object-contain bg-black"
                                    controls
                                />
                                <button
                                    type="button"
                                    onClick={removeVideo}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <input
                                    ref={videoInputRef}
                                    type="file"
                                    accept={ACCEPTED_VIDEO_TYPES.join(',')}
                                    className="hidden"
                                    onChange={handleVideoUpload}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        videoInputRef.current?.click()
                                    }
                                    disabled={uploading}
                                    className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 border border-dashed border-primary-300 rounded-lg px-3 py-2 hover:bg-primary-50 transition-colors disabled:opacity-50"
                                >
                                    {uploading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Video className="h-4 w-4" />
                                    )}
                                    {t('preparations.media.addVideo')}
                                </button>
                            </>
                        )}
                        <p className="text-xs text-neutral-400 mt-1">
                            {t('preparations.media.videoHint', {
                                max: MAX_VIDEO_SIZE_MB,
                            })}
                        </p>
                    </div>

                    {/* Media error */}
                    {mediaError && (
                        <p className="text-sm text-red-500">{mediaError}</p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary flex-1"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || uploading}
                            className="btn-primary flex-1"
                        >
                            {submitting
                                ? t('common.loading')
                                : t('common.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
