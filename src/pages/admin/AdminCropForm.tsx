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
import { CustomDropdown } from '@/components/common/CustomDropdown'
import { MultiSelectDropdown } from '@/components/common/MultiSelectDropdown'
import { Save, Trash2, Languages, X, ImageIcon, Plus, List } from 'lucide-react'
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
    const [message, setMessage] = useState('')
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
            setMessage(t('admin.translateFailed'))
        } finally {
            setTranslating(false)
        }
    }

    const handleSave = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage('')

        try {
            // Duplicate check
            const isDuplicate = await checkDuplicateCrop(enName, id)
            if (isDuplicate) {
                setMessage(t('errors.duplicateCrop'))
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
            setMessage(t('admin.saved'))

            if (isNew) {
                navigate('/admin/crops', { replace: true })
            }
        } catch {
            setMessage(t('errors.generic'))
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm(t('admin.deleteConfirm'))) return
        const { error } = await adminDeleteCrop(id!)
        if (error) {
            setMessage(t('errors.generic'))
            return
        }
        queryClient.invalidateQueries({ queryKey: ['admin-crops'] })
        queryClient.invalidateQueries({ queryKey: ['crops'] })
        navigate('/admin/crops')
    }

    if (!isNew && isLoading) return <LoadingSpinner />

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
                to="/admin/crops"
                className="text-sm text-primary-600 hover:underline mb-1 inline-block"
            >
                ← {t('admin.crops')}
            </Link>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">
                    {isNew ? t('admin.addCrop') : t('admin.editCrop')}
                </h1>
                {!isNew && (
                    <button
                        onClick={handleDelete}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                )}
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Core Fields */}
                <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
                    <h2 className="font-semibold text-lg">
                        {t('admin.coreFields')}
                    </h2>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t('admin.cropImage')}{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-neutral-400 mb-2">
                            {t('admin.cropImageHint')}
                        </p>

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
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow"
                                    title={t('admin.removeImage')}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingImage}
                                className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-neutral-200 rounded-lg text-sm text-neutral-400 hover:border-primary-400 hover:text-primary-600 transition-colors disabled:opacity-50"
                            >
                                {uploadingImage ? (
                                    <>
                                        <LoadingSpinner />
                                        {t('admin.uploadingImage')}
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon className="h-5 w-5" />
                                        {t('admin.uploadImage')}
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t('admin.suitableSoilTypes')}{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-neutral-400 mb-2">
                            {t('admin.suitableSoilTypesHint')}
                        </p>

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
                    </div>

                    {/* Crop Type */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t('admin.cropType')}{' '}
                            <span className="text-red-500">*</span>
                        </label>
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
                    </div>
                </div>

                {/* English */}
                <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
                    <h2 className="font-semibold text-lg">English</h2>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t('admin.name')}{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={enName}
                            onChange={(e) => setEnName(e.target.value)}
                            className="input"
                            placeholder="e.g., Rice"
                            required
                        />
                    </div>

                    {/* Aliases (English) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t('admin.aliases')}
                        </label>
                        {aliasesEn.map((a, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={a}
                                    onChange={(e) => {
                                        const updated = [...aliasesEn]
                                        updated[i] = e.target.value
                                        setAliasesEn(updated)
                                    }}
                                    className="input flex-1"
                                    placeholder={`Alias ${i + 1}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAliasesEn((prev) =>
                                            prev.filter((_, j) => j !== i),
                                        )
                                        setAliasesTe((prev) =>
                                            prev.filter((_, j) => j !== i),
                                        )
                                    }}
                                    className="text-red-500 hover:text-red-600 p-1"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => {
                                setAliasesEn((prev) => [...prev, ''])
                                setAliasesTe((prev) => [...prev, ''])
                            }}
                            className="text-xs text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                        >
                            <Plus className="h-3.5 w-3.5" />{' '}
                            {t('admin.addAlias')}
                        </button>
                    </div>
                </div>

                {/* Telugu */}
                <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-lg">
                            తెలుగు (Telugu)
                        </h2>
                        <button
                            type="button"
                            onClick={handleTranslate}
                            disabled={translating || !enName.trim()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Languages className="h-4 w-4" />
                            {translating
                                ? t('admin.translating')
                                : t('admin.translateFromEnglish')}
                        </button>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t('admin.name')}{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={teName}
                            onChange={(e) => setTeName(e.target.value)}
                            className="input"
                            placeholder="e.g., వరి"
                            required
                        />
                    </div>

                    {/* Aliases (Telugu) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t('admin.aliases')}
                        </label>
                        {aliasesTe.map((a, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={a}
                                    onChange={(e) => {
                                        const updated = [...aliasesTe]
                                        updated[i] = e.target.value
                                        setAliasesTe(updated)
                                    }}
                                    className="input flex-1"
                                    placeholder={`మారుపేరు ${i + 1}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAliasesEn((prev) =>
                                            prev.filter((_, j) => j !== i),
                                        )
                                        setAliasesTe((prev) =>
                                            prev.filter((_, j) => j !== i),
                                        )
                                    }}
                                    className="text-red-500 hover:text-red-600 p-1"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => {
                                setAliasesEn((prev) => [...prev, ''])
                                setAliasesTe((prev) => [...prev, ''])
                            }}
                            className="text-xs text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                        >
                            <Plus className="h-3.5 w-3.5" />{' '}
                            {t('admin.addAlias')}
                        </button>
                    </div>
                </div>

                {/* Actions */}
                {message && (
                    <p
                        className={`text-sm font-medium ${message === t('admin.saved') ? 'text-green-600' : 'text-red-600'}`}
                    >
                        {message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={saveDisabled}
                    className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="h-4 w-4" />
                    {saving ? t('common.saving') : t('common.save')}
                </button>

                {!isNew && (
                    <Link
                        to={`/admin/crops/${id}/varieties`}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors"
                    >
                        <List className="h-4 w-4" />
                        {t('admin.manageVarieties')}
                    </Link>
                )}
            </form>
        </div>
    )
}
