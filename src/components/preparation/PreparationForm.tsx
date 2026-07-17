import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, ImagePlus, Video, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { uploadPreparationFile } from '@/services/preparationService'
import type { Preparation } from '@/types/preparation'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field'

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

    const [imageUrls, setImageUrls] = useState<string[]>(
        editingPreparation?.image_urls ?? [],
    )
    const [videoUrl, setVideoUrl] = useState<string | null>(
        editingPreparation?.video_url ?? null,
    )

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

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files || !user) return

        const remaining = MAX_IMAGES - imageUrls.length
        const filesToUpload = Array.from(files).slice(0, remaining)

        for (const file of filesToUpload) {
            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                toast.error(t('preparations.media.invalidImageType'))
                return
            }
            if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
                toast.error(
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
            toast.error(t('preparations.media.uploadFailed'))
        } finally {
            setUploading(false)
            if (imageInputRef.current) imageInputRef.current.value = ''
        }
    }

    function removeImage(index: number) {
        setImageUrls((prev) => prev.filter((_, i) => i !== index))
    }

    async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file || !user) return

        if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
            toast.error(t('preparations.media.invalidVideoType'))
            return
        }
        if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
            toast.error(
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
            toast.error(t('preparations.media.uploadFailed'))
        } finally {
            setUploading(false)
            if (videoInputRef.current) videoInputRef.current.value = ''
        }
    }

    function removeVideo() {
        setVideoUrl(null)
    }

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
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? t('common.edit')
                            : t('preparations.addNew')}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <FieldGroup>
                        {/* Remedy Name */}
                        <Field data-invalid={!!errors.remedy_name || undefined}>
                            <FieldLabel htmlFor="remedy_name">
                                {t('preparations.remedyName')}
                            </FieldLabel>
                            <Input
                                id="remedy_name"
                                {...register('remedy_name')}
                                aria-invalid={!!errors.remedy_name || undefined}
                                placeholder={t(
                                    'preparations.remedyNamePlaceholder',
                                )}
                            />
                            {errors.remedy_name && (
                                <FieldError>
                                    {errors.remedy_name.message}
                                </FieldError>
                            )}
                        </Field>

                        {/* Quantity */}
                        <Field>
                            <FieldLabel htmlFor="quantity">
                                {t('preparations.quantity')}
                            </FieldLabel>
                            <Input
                                id="quantity"
                                {...register('quantity')}
                                placeholder={t(
                                    'preparations.quantityPlaceholder',
                                )}
                            />
                        </Field>

                        {/* Notes */}
                        <Field>
                            <FieldLabel htmlFor="preparation_notes">
                                {t('preparations.notes')}
                            </FieldLabel>
                            <Textarea
                                id="preparation_notes"
                                {...register('preparation_notes')}
                                rows={3}
                                placeholder={t('preparations.notesPlaceholder')}
                            />
                        </Field>

                        {/* Images */}
                        <Field>
                            <FieldLabel>
                                {t('preparations.media.images')}{' '}
                                <span className="text-muted-foreground font-normal">
                                    ({imageUrls.length}/{MAX_IMAGES})
                                </span>
                            </FieldLabel>

                            {imageUrls.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {imageUrls.map((url, i) => (
                                        <div
                                            key={i}
                                            className="relative size-20 rounded-lg overflow-hidden border border-border group"
                                        >
                                            <img
                                                src={url}
                                                alt={`Image ${i + 1}`}
                                                className="size-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="absolute top-0.5 right-0.5 p-0.5 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

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
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            imageInputRef.current?.click()
                                        }
                                        disabled={uploading}
                                        className="w-fit border-dashed"
                                    >
                                        {uploading ? (
                                            <Spinner data-icon="inline-start" />
                                        ) : (
                                            <ImagePlus data-icon="inline-start" />
                                        )}
                                        {t('preparations.media.addImages')}
                                    </Button>
                                </>
                            )}
                            <FieldDescription>
                                {t('preparations.media.imageHint', {
                                    max: MAX_IMAGE_SIZE_MB,
                                })}
                            </FieldDescription>
                        </Field>

                        {/* Video */}
                        <Field>
                            <FieldLabel>
                                {t('preparations.media.video')}
                            </FieldLabel>

                            {videoUrl ? (
                                <div className="relative rounded-lg overflow-hidden border border-border">
                                    <video
                                        src={videoUrl}
                                        className="w-full max-h-48 object-contain bg-black"
                                        controls
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon-xs"
                                        onClick={removeVideo}
                                        className="absolute top-2 right-2"
                                    >
                                        <Trash2 />
                                    </Button>
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
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            videoInputRef.current?.click()
                                        }
                                        disabled={uploading}
                                        className="w-fit border-dashed"
                                    >
                                        {uploading ? (
                                            <Spinner data-icon="inline-start" />
                                        ) : (
                                            <Video data-icon="inline-start" />
                                        )}
                                        {t('preparations.media.addVideo')}
                                    </Button>
                                </>
                            )}
                            <FieldDescription>
                                {t('preparations.media.videoHint', {
                                    max: MAX_VIDEO_SIZE_MB,
                                })}
                            </FieldDescription>
                        </Field>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={onClose}
                                className="flex-1"
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitting || uploading}
                                className="flex-1"
                            >
                                {submitting
                                    ? t('common.loading')
                                    : t('common.save')}
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    )
}
