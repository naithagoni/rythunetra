import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
    adminGetCrop,
    adminCreateCrop,
    adminUpdateCrop,
    adminDeleteCrop,
    adminUploadFile,
    getSafeExtension,
    checkDuplicateCrop,
} from '@/services/adminService'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { PageContainer } from '@/components/common/PageContainer'
import { CustomDropdown } from '@/components/common/CustomDropdown'
import { MultiSelectDropdown } from '@/components/common/MultiSelectDropdown'
import { Save, Trash2, Languages, X, ImageIcon, Plus, List } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field'
import { translateText } from '@/services/translateService'
import type { LocalizedText, LocalizedTextArray } from '@/types/i18n'
import { CROP_TYPE_KEYS } from '@/config/cropTypes'
import {
    ALL_SOIL_ENTRIES,
    soilEntryKey,
    parseSoilEntryKey,
} from '@/config/soilTypes'
import type { SoilTypeEntry } from '@/types/crop'

const CROP_IMAGES_BUCKET = 'crop-images'

export function AdminCropFormPage() {
    const { id } = useParams<{ id: string }>()
    const isNew = !id
    const navigate = useNavigate()
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    // Core fields
    const [imageUrl, setImageUrl] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [uploadingImage, setUploadingImage] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Crop type (key from CROP_TYPE_KEYS)
    const [cropTypeKey, setCropTypeKey] = useState('')

    // Soil type selections as key strings (e.g. ['red::clayey', 'black::deep'])
    const [selectedSoilKeys, setSelectedSoilKeys] = useState<string[]>([])

    // Aliases (JSONB LocalizedTextArray)
    const [aliasesEn, setAliasesEn] = useState<string[]>([])
    const [aliasesTe, setAliasesTe] = useState<string[]>([])

    // Name translations (JSONB LocalizedText)
    const [enName, setEnName] = useState('')
    const [teName, setTeName] = useState('')

    const [saving, setSaving] = useState(false)
    const [translating, setTranslating] = useState(false)

    // Validation
    const enNameMissing = !enName.trim()
    const teNameMissing = !teName.trim()
    const imageMissing = !imagePreview
    const cropTypeMissing = !cropTypeKey
    const soilTypesMissing = selectedSoilKeys.length === 0
    const saveDisabled =
        saving ||
        enNameMissing ||
        teNameMissing ||
        imageMissing ||
        cropTypeMissing ||
        soilTypesMissing

    const { data: cropResult, isLoading } = useQuery({
        queryKey: ['admin-crop', id],
        queryFn: () => adminGetCrop(id!),
        enabled: !isNew && !!id,
    })

    useEffect(() => {
        if (cropResult?.data) {
            const c = cropResult.data as Record<string, unknown>
            setImageUrl((c.image_url as string) ?? '')

            const name = c.name as LocalizedText | undefined
            setEnName(name?.en ?? '')
            setTeName(name?.te ?? '')

            const ct = c.crop_type as LocalizedText | null
            // Reverse-lookup key from the EN label
            const matchedKey = CROP_TYPE_KEYS.find(
                (k) =>
                    t(`cropTypes.${k}`, { lng: 'en' }).toLowerCase() ===
                    (ct?.en ?? '').toLowerCase(),
            )
            setCropTypeKey(matchedKey ?? '')

            // Suitable soil types (stored as JSONB [{type, subType}])
            const soilEntries = c.suitable_soil_types as SoilTypeEntry[] | null
            setSelectedSoilKeys((soilEntries ?? []).map((e) => soilEntryKey(e)))

            // Aliases (LocalizedTextArray)
            const aliases = c.aliases as LocalizedTextArray | null
            setAliasesEn(aliases?.en ?? [])
            setAliasesTe(aliases?.te ?? [])
        }
    }, [cropResult?.data, t])

    // When editing, seed the preview from the existing image_url
    useEffect(() => {
        if (imageUrl && !imageFile) {
            setImagePreview(imageUrl)
        }
    }, [imageUrl, imageFile])

    const handleImageSelect = (file: File) => {
        if (!file.type.startsWith('image/')) return
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const handleRemoveImage = () => {
        setImageFile(null)
        setImagePreview(null)
        setImageUrl('')
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleTranslate = async () => {
        if (!enName.trim()) return
        setTranslating(true)
        try {
            const translated = await translateText(enName, 'en', 'te')
            setTeName(translated)
        } catch {
            toast.error(t('admin.translateFailed'))
        } finally {
            setTranslating(false)
        }
    }

    const handleSave = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            // Duplicate check
            const isDuplicate = await checkDuplicateCrop(enName, id)
            if (isDuplicate) {
                toast.error(t('errors.duplicateCrop'))
                setSaving(false)
                return
            }

            // Upload image if a new file was selected
            let finalImageUrl = imageUrl.trim() || null
            if (imageFile) {
                setUploadingImage(true)
                const ext = getSafeExtension(imageFile.name)
                const path = `crops/${Date.now()}.${ext}`
                try {
                    finalImageUrl = await adminUploadFile(
                        CROP_IMAGES_BUCKET,
                        path,
                        imageFile,
                    )
                } finally {
                    setUploadingImage(false)
                }
            }

            const aliases: LocalizedTextArray | undefined =
                aliasesEn.filter(Boolean).length ||
                aliasesTe.filter(Boolean).length
                    ? {
                          en: aliasesEn.filter(Boolean),
                          te: aliasesTe.filter(Boolean),
                      }
                    : undefined

            const payload = {
                name: { en: enName.trim(), te: teName.trim() },
                crop_type: cropTypeKey
                    ? {
                          en: t(`cropTypes.${cropTypeKey}`, { lng: 'en' }),
                          te: t(`cropTypes.${cropTypeKey}`, { lng: 'te' }),
                      }
                    : null,
                image_url: finalImageUrl,
                aliases,
                suitable_soil_types: selectedSoilKeys
                    .map(parseSoilEntryKey)
                    .filter(Boolean) as SoilTypeEntry[],
            }

            if (isNew) {
                const { error } = await adminCreateCrop(payload)
                if (error) throw error
            } else {
                const { error } = await adminUpdateCrop(id!, payload)
                if (error) throw error
            }

            queryClient.invalidateQueries({ queryKey: ['admin-crops'] })
            queryClient.invalidateQueries({ queryKey: ['admin-crop'] })
            queryClient.invalidateQueries({ queryKey: ['crops'] })
            toast.success(t('admin.saved'))

            if (isNew) {
                navigate('/admin/crops', { replace: true })
            }
        } catch {
            toast.error(t('errors.generic'))
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm(t('admin.deleteConfirm'))) return
        const { error } = await adminDeleteCrop(id!)
        if (error) {
            toast.error(t('errors.generic'))
            return
        }
        queryClient.invalidateQueries({ queryKey: ['admin-crops'] })
        queryClient.invalidateQueries({ queryKey: ['crops'] })
        navigate('/admin/crops')
    }

    if (!isNew && isLoading) return <LoadingSpinner />

    return (
        <PageContainer size="sm">
            <PageHeader
                backTo="/admin/crops"
                backLabel={t('admin.crops')}
                title={isNew ? t('admin.addCrop') : t('admin.editCrop')}
                action={
                    !isNew && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={handleDelete}
                            aria-label={t('common.delete')}
                        >
                            <Trash2 />
                        </Button>
                    )
                }
            />

            <form onSubmit={handleSave} className="flex flex-col gap-6">
                {/* Core Fields */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {t('admin.coreFields')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            {/* Image Upload */}
                            <Field>
                                <FieldLabel>
                                    {t('admin.cropImage')}{' '}
                                    <span className="text-destructive">*</span>
                                </FieldLabel>
                                <FieldDescription>
                                    {t('admin.cropImageHint')}
                                </FieldDescription>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) handleImageSelect(file)
                                    }}
                                />

                                {imagePreview ? (
                                    <div className="relative inline-block">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-32 w-48 object-cover rounded-lg border"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon-xs"
                                            onClick={handleRemoveImage}
                                            className="absolute -top-2 -right-2 rounded-full"
                                            aria-label={t('admin.removeImage')}
                                        >
                                            <X />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        disabled={uploadingImage}
                                        className="w-fit border-dashed"
                                    >
                                        {uploadingImage ? (
                                            <Spinner data-icon="inline-start" />
                                        ) : (
                                            <ImageIcon data-icon="inline-start" />
                                        )}
                                        {uploadingImage
                                            ? t('admin.uploadingImage')
                                            : t('admin.uploadImage')}
                                    </Button>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel>
                                    {t('admin.suitableSoilTypes')}{' '}
                                    <span className="text-destructive">*</span>
                                </FieldLabel>
                                <FieldDescription>
                                    {t('admin.suitableSoilTypesHint')}
                                </FieldDescription>

                                <MultiSelectDropdown
                                    options={ALL_SOIL_ENTRIES.map((entry) => ({
                                        value: soilEntryKey(entry),
                                        label: `${t(`soilTypes.${entry.type}`)} – ${t(`soilSubTypes.${entry.type}.${entry.subType}`)}`,
                                    }))}
                                    values={selectedSoilKeys}
                                    onChange={setSelectedSoilKeys}
                                    placeholder={t('admin.selectSoilType')}
                                    ariaLabel={t('admin.suitableSoilTypes')}
                                />
                            </Field>

                            {/* Crop Type */}
                            <Field>
                                <FieldLabel>
                                    {t('admin.cropType')}{' '}
                                    <span className="text-destructive">*</span>
                                </FieldLabel>
                                <CustomDropdown
                                    options={CROP_TYPE_KEYS.map((key) => ({
                                        value: key,
                                        label: t(`cropTypes.${key}`),
                                    }))}
                                    value={cropTypeKey}
                                    onChange={setCropTypeKey}
                                    placeholder={t('admin.cropTypePlaceholder')}
                                    ariaLabel={t('admin.cropType')}
                                    variant="form"
                                />
                            </Field>
                        </FieldGroup>
                    </CardContent>
                </Card>

                {/* English */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">English</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="crop-en-name">
                                    {t('admin.name')}{' '}
                                    <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                    id="crop-en-name"
                                    type="text"
                                    value={enName}
                                    onChange={(e) => setEnName(e.target.value)}
                                    placeholder="e.g., Rice"
                                    required
                                />
                            </Field>

                            {/* Aliases (English) */}
                            <Field>
                                <FieldLabel>{t('admin.aliases')}</FieldLabel>
                                {aliasesEn.map((a, i) => (
                                    <div key={i} className="flex gap-2">
                                        <Input
                                            type="text"
                                            value={a}
                                            onChange={(e) => {
                                                const updated = [...aliasesEn]
                                                updated[i] = e.target.value
                                                setAliasesEn(updated)
                                            }}
                                            className="flex-1"
                                            placeholder={`Alias ${i + 1}`}
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => {
                                                setAliasesEn((prev) =>
                                                    prev.filter(
                                                        (_, j) => j !== i,
                                                    ),
                                                )
                                                setAliasesTe((prev) =>
                                                    prev.filter(
                                                        (_, j) => j !== i,
                                                    ),
                                                )
                                            }}
                                            aria-label={t('common.delete')}
                                        >
                                            <X />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="link"
                                    size="sm"
                                    onClick={() => {
                                        setAliasesEn((prev) => [...prev, ''])
                                        setAliasesTe((prev) => [...prev, ''])
                                    }}
                                    className="w-fit px-0"
                                >
                                    <Plus data-icon="inline-start" />
                                    {t('admin.addAlias')}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </CardContent>
                </Card>

                {/* Telugu */}
                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle className="text-lg">
                            తెలుగు (Telugu)
                        </CardTitle>
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleTranslate}
                            disabled={translating || !enName.trim()}
                            className="bg-amber-100 text-amber-900 hover:bg-amber-200"
                        >
                            <Languages data-icon="inline-start" />
                            {translating
                                ? t('admin.translating')
                                : t('admin.translateFromEnglish')}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="crop-te-name">
                                    {t('admin.name')}{' '}
                                    <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                    id="crop-te-name"
                                    type="text"
                                    value={teName}
                                    onChange={(e) => setTeName(e.target.value)}
                                    placeholder="e.g., వరి"
                                    required
                                />
                            </Field>

                            {/* Aliases (Telugu) */}
                            <Field>
                                <FieldLabel>{t('admin.aliases')}</FieldLabel>
                                {aliasesTe.map((a, i) => (
                                    <div key={i} className="flex gap-2">
                                        <Input
                                            type="text"
                                            value={a}
                                            onChange={(e) => {
                                                const updated = [...aliasesTe]
                                                updated[i] = e.target.value
                                                setAliasesTe(updated)
                                            }}
                                            className="flex-1"
                                            placeholder={`మారుపేరు ${i + 1}`}
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => {
                                                setAliasesEn((prev) =>
                                                    prev.filter(
                                                        (_, j) => j !== i,
                                                    ),
                                                )
                                                setAliasesTe((prev) =>
                                                    prev.filter(
                                                        (_, j) => j !== i,
                                                    ),
                                                )
                                            }}
                                            aria-label={t('common.delete')}
                                        >
                                            <X />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="link"
                                    size="sm"
                                    onClick={() => {
                                        setAliasesEn((prev) => [...prev, ''])
                                        setAliasesTe((prev) => [...prev, ''])
                                    }}
                                    className="w-fit px-0"
                                >
                                    <Plus data-icon="inline-start" />
                                    {t('admin.addAlias')}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </CardContent>
                </Card>

                {/* Save-bar */}
                <div className="sticky bottom-0 -mx-4 sm:-mx-6 lg:-mx-8 flex items-center justify-between gap-2 border-t border-border bg-background/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3">
                    {!isNew ? (
                        <Button asChild variant="ghost" type="button">
                            <Link to={`/admin/crops/${id}/varieties`}>
                                <List data-icon="inline-start" />
                                {t('admin.manageVarieties')}
                            </Link>
                        </Button>
                    ) : (
                        <span />
                    )}
                    <div className="flex items-center gap-2">
                        <Button asChild variant="secondary" type="button">
                            <Link to="/admin/crops">{t('common.cancel')}</Link>
                        </Button>
                        <Button type="submit" disabled={saveDisabled}>
                            <Save data-icon="inline-start" />
                            {saving ? t('common.saving') : t('common.save')}
                        </Button>
                    </div>
                </div>
            </form>
        </PageContainer>
    )
}
