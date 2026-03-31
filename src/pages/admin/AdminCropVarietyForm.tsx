import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
    adminGetCropVariety,
    adminCreateCropVariety,
    adminUpdateCropVariety,
    adminDeleteCropVariety,
    adminReplaceCropVarietyDiseases,
    adminGetAllDiseases,
    adminUploadFile,
    getSafeExtension,
    adminGetCrop,
} from '@/services/adminService'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { MultiSelectDropdown } from '@/components/common/MultiSelectDropdown'
import { Save, Trash2, Languages, X, ImageIcon, Plus } from 'lucide-react'
import { translateText } from '@/services/translateService'
import { DISTRICT_KEYS } from '@/config/districts'
import type { LocalizedText, LocalizedTextArray } from '@/types/i18n'
import type { RecommendedSeason, CropVarietyRow } from '@/types/crop'

const VARIETY_IMAGES_BUCKET = 'crop-images'

// ─── Months constant (for season month multi-select) ──────

const MONTH_KEYS = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
] as const

// ─── Season Row State ─────────────────────────────────────

interface SeasonState {
    nameEn: string
    nameTe: string
    durationMin: string
    durationMax: string
    monthsEn: string[]
    monthsTe: string[]
}

function emptySeasonState(): SeasonState {
    return {
        nameEn: '',
        nameTe: '',
        durationMin: '',
        durationMax: '',
        monthsEn: [],
        monthsTe: [],
    }
}

function seasonToState(s: RecommendedSeason): SeasonState {
    return {
        nameEn: s.name.en,
        nameTe: s.name.te,
        durationMin: s.durationInDays[0]?.toString() ?? '',
        durationMax: s.durationInDays[1]?.toString() ?? '',
        monthsEn: s.months.en ?? [],
        monthsTe: s.months.te ?? [],
    }
}

function stateToSeason(s: SeasonState): RecommendedSeason {
    const days: number[] = []
    if (s.durationMin) days.push(Number(s.durationMin))
    if (s.durationMax) days.push(Number(s.durationMax))
    return {
        name: { en: s.nameEn.trim(), te: s.nameTe.trim() },
        durationInDays: days,
        months: {
            en: s.monthsEn,
            te: s.monthsTe,
        },
    }
}

// ─── Component ────────────────────────────────────────────

export function AdminCropVarietyFormPage() {
    const { cropId, id } = useParams<{ cropId: string; id: string }>()
    const isNew = !id
    const navigate = useNavigate()
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    // Name
    const [enName, setEnName] = useState('')
    const [teName, setTeName] = useState('')

    // Image
    const [imageUrl, setImageUrl] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [uploadingImage, setUploadingImage] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Seasons
    const [seasons, setSeasons] = useState<SeasonState[]>([])

    // Districts
    const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])

    // Grain Character
    const [grainCharEn, setGrainCharEn] = useState<string[]>([])
    const [grainCharTe, setGrainCharTe] = useState<string[]>([])

    // Special Characteristics
    const [specialChars, setSpecialChars] = useState<
        { en: string; te: string }[]
    >([])

    // Diseases
    const [selectedDiseases, setSelectedDiseases] = useState<string[]>([])

    // UI state
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [translating, setTranslating] = useState(false)

    // Validation
    const enNameMissing = !enName.trim()
    const teNameMissing = !teName.trim()
    const saveDisabled = saving || enNameMissing || teNameMissing

    // ─── Queries ──────────────────────────────────────────

    const { data: cropResult } = useQuery({
        queryKey: ['admin-crop', cropId],
        queryFn: () => adminGetCrop(cropId!),
        enabled: !!cropId,
    })

    const cropName =
        (cropResult?.data as { name?: LocalizedText } | null)?.name?.en ??
        cropId?.slice(0, 8)

    const { data: varietyResult, isLoading } = useQuery({
        queryKey: ['admin-crop-variety', id],
        queryFn: () => adminGetCropVariety(id!),
        enabled: !isNew && !!id,
    })

    const { data: diseasesResult } = useQuery({
        queryKey: ['admin-all-diseases'],
        queryFn: adminGetAllDiseases,
    })

    const allDiseases = (diseasesResult?.data ?? []) as {
        id: string
        name: LocalizedText
    }[]

    // ─── Populate form on edit ────────────────────────────

    useEffect(() => {
        if (varietyResult?.data) {
            const v = varietyResult.data as CropVarietyRow

            setEnName(v.name?.en ?? '')
            setTeName(v.name?.te ?? '')
            setImageUrl(v.image_url ?? '')
            setSelectedDistricts(v.districts ?? [])

            // Seasons
            const rs = v.recommended_seasons ?? []
            setSeasons(rs.map(seasonToState))

            // Grain character
            const gc = v.grain_character
            setGrainCharEn(gc?.en ?? [])
            setGrainCharTe(gc?.te ?? [])

            // Special characteristics
            const sc = v.special_characteristics ?? []
            setSpecialChars(
                sc.map((c: LocalizedText) => ({
                    en: c.en ?? '',
                    te: c.te ?? '',
                })),
            )

            // Diseases
            const diseaseIds =
                v.crop_variety_diseases?.map(
                    (d: { disease_id: string }) => d.disease_id,
                ) ?? []
            setSelectedDiseases(diseaseIds)
        }
    }, [varietyResult?.data])

    // Seed image preview
    useEffect(() => {
        if (imageUrl && !imageFile) setImagePreview(imageUrl)
    }, [imageUrl, imageFile])

    // ─── Handlers ─────────────────────────────────────────

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

    // Season helpers
    const updateSeason = (idx: number, patch: Partial<SeasonState>) => {
        setSeasons((prev) =>
            prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)),
        )
    }
    const removeSeason = (idx: number) => {
        setSeasons((prev) => prev.filter((_, i) => i !== idx))
    }

    // When months are selected via multi-select, auto-populate both EN and TE
    const handleSeasonMonthsChange = (idx: number, keys: string[]) => {
        updateSeason(idx, {
            monthsEn: keys.map((k) => t(`months.${k}`, { lng: 'en' })),
            monthsTe: keys.map((k) => t(`months.${k}`, { lng: 'te' })),
        })
    }

    // Reverse lookup: from translated month string back to key
    const monthEnToKey = (monthEn: string): string | undefined =>
        MONTH_KEYS.find(
            (k) =>
                t(`months.${k}`, { lng: 'en' }).toLowerCase() ===
                monthEn.toLowerCase(),
        )

    const getSeasonMonthKeys = (season: SeasonState): string[] =>
        season.monthsEn.map(monthEnToKey).filter((k): k is string => !!k)

    // ─── Save ─────────────────────────────────────────────

    const handleSave = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage('')

        try {
            // Upload image if new file
            let finalImageUrl = imageUrl.trim() || null
            if (imageFile) {
                setUploadingImage(true)
                const ext = getSafeExtension(imageFile.name)
                const path = `varieties/${Date.now()}.${ext}`
                try {
                    finalImageUrl = await adminUploadFile(
                        VARIETY_IMAGES_BUCKET,
                        path,
                        imageFile,
                    )
                } finally {
                    setUploadingImage(false)
                }
            }

            const grainCharacter: LocalizedTextArray | null =
                grainCharEn.filter(Boolean).length ||
                grainCharTe.filter(Boolean).length
                    ? {
                          en: grainCharEn.filter(Boolean),
                          te: grainCharTe.filter(Boolean),
                      }
                    : null

            const payload = {
                name: { en: enName.trim(), te: teName.trim() },
                major_crop: cropId!,
                image_url: finalImageUrl,
                recommended_seasons: seasons
                    .filter((s) => s.nameEn.trim())
                    .map(stateToSeason),
                districts: selectedDistricts,
                grain_character: grainCharacter,
                special_characteristics: specialChars
                    .filter((c) => c.en.trim() || c.te.trim())
                    .map((c) => ({ en: c.en.trim(), te: c.te.trim() })),
            }

            let varietyId = id
            if (isNew) {
                const { data, error } = await adminCreateCropVariety(payload)
                if (error) throw error
                varietyId = data?.id
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { major_crop: _mc, ...updatePayload } = payload
                const { error } = await adminUpdateCropVariety(
                    id!,
                    updatePayload,
                )
                if (error) throw error
            }

            // Save disease junction
            if (varietyId) {
                await adminReplaceCropVarietyDiseases(
                    varietyId,
                    selectedDiseases,
                )
            }

            queryClient.invalidateQueries({
                queryKey: ['admin-crop-varieties'],
            })
            queryClient.invalidateQueries({
                queryKey: ['admin-crop-variety'],
            })
            setMessage(t('admin.saved'))

            if (isNew) {
                navigate(`/admin/crops/${cropId}/varieties`, { replace: true })
            }
        } catch {
            setMessage(t('errors.generic'))
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm(t('admin.deleteConfirm'))) return
        const { error } = await adminDeleteCropVariety(id!)
        if (error) {
            setMessage(t('errors.generic'))
            return
        }
        queryClient.invalidateQueries({
            queryKey: ['admin-crop-varieties'],
        })
        navigate(`/admin/crops/${cropId}/varieties`)
    }

    if (!isNew && isLoading) return <LoadingSpinner />

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
                to={`/admin/crops/${cropId}/varieties`}
                className="text-sm text-primary-600 hover:underline mb-1 inline-block"
            >
                ← {cropName} – {t('admin.varieties')}
            </Link>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">
                    {isNew ? t('admin.addVariety') : t('admin.editVariety')}
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
                {/* ── Core Fields ────────────────────────── */}
                <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
                    <h2 className="font-semibold text-lg">
                        {t('admin.coreFields')}
                    </h2>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t('admin.varietyImage')}
                        </label>
                        <p className="text-xs text-neutral-400 mb-2">
                            {t('admin.varietyImageHint')}
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

                    {/* Name EN */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t('admin.varietyName')} (EN){' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={enName}
                            onChange={(e) => setEnName(e.target.value)}
                            className="input"
                            placeholder="e.g., BPT 5204 (Samba Mahsuri)"
                            required
                        />
                    </div>

                    {/* Name TE */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium">
                                {t('admin.varietyName')} (TE){' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={handleTranslate}
                                disabled={translating || !enName.trim()}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Languages className="h-3.5 w-3.5" />
                                {translating
                                    ? t('admin.translating')
                                    : t('admin.translateFromEnglish')}
                            </button>
                        </div>
                        <input
                            type="text"
                            value={teName}
                            onChange={(e) => setTeName(e.target.value)}
                            className="input"
                            placeholder="ఉదా., బీపీటీ 5204 (సాంబ మహసూరి)"
                            required
                        />
                    </div>
                </div>

                {/* ── Districts ───────────────────────────── */}
                <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
                    <h2 className="font-semibold text-lg">
                        {t('admin.districts')}
                    </h2>
                    <MultiSelectDropdown
                        options={DISTRICT_KEYS.map((key) => ({
                            value: key,
                            label: t(`districts.${key}`),
                        }))}
                        values={selectedDistricts}
                        onChange={setSelectedDistricts}
                        placeholder={t('admin.selectDistricts')}
                        ariaLabel={t('admin.districts')}
                    />
                </div>

                {/* ── Recommended Seasons ─────────────────── */}
                <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-lg">
                                {t('admin.recommendedSeasons')}
                            </h2>
                            <p className="text-xs text-neutral-400">
                                {t('admin.recommendedSeasonsHint')}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() =>
                                setSeasons((p) => [...p, emptySeasonState()])
                            }
                            className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                        >
                            <Plus className="h-4 w-4" />
                            {t('admin.addSeason')}
                        </button>
                    </div>

                    {seasons.map((season, idx) => (
                        <div
                            key={idx}
                            className="border border-neutral-200 rounded-lg p-4 space-y-3 bg-neutral-50"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    {t('admin.seasonName')} #{idx + 1}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeSeason(idx)}
                                    className="text-red-500 hover:text-red-600 text-xs inline-flex items-center gap-1"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    {t('admin.removeSeason')}
                                </button>
                            </div>

                            {/* Season name EN / TE */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium mb-1">
                                        {t('admin.seasonName')} (EN)
                                    </label>
                                    <input
                                        type="text"
                                        value={season.nameEn}
                                        onChange={(e) =>
                                            updateSeason(idx, {
                                                nameEn: e.target.value,
                                            })
                                        }
                                        className="input text-sm"
                                        placeholder="e.g., Kharif"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1">
                                        {t('admin.seasonName')} (TE)
                                    </label>
                                    <input
                                        type="text"
                                        value={season.nameTe}
                                        onChange={(e) =>
                                            updateSeason(idx, {
                                                nameTe: e.target.value,
                                            })
                                        }
                                        className="input text-sm"
                                        placeholder="ఉదా., ఖరీఫ్"
                                    />
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium mb-1">
                                        {t('admin.durationMin')}
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={season.durationMin}
                                        onChange={(e) =>
                                            updateSeason(idx, {
                                                durationMin: e.target.value,
                                            })
                                        }
                                        className="input text-sm"
                                        placeholder="e.g., 120"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1">
                                        {t('admin.durationMax')}
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={season.durationMax}
                                        onChange={(e) =>
                                            updateSeason(idx, {
                                                durationMax: e.target.value,
                                            })
                                        }
                                        className="input text-sm"
                                        placeholder="e.g., 150"
                                    />
                                </div>
                            </div>

                            {/* Months multi-select */}
                            <div>
                                <label className="block text-xs font-medium mb-1">
                                    {t('admin.monthsEn')}
                                </label>
                                <MultiSelectDropdown
                                    options={MONTH_KEYS.map((k) => ({
                                        value: k,
                                        label: t(`months.${k}`, {
                                            lng: 'en',
                                        }),
                                    }))}
                                    values={getSeasonMonthKeys(season)}
                                    onChange={(keys) =>
                                        handleSeasonMonthsChange(idx, keys)
                                    }
                                    placeholder="Select months..."
                                    ariaLabel="Months"
                                />
                            </div>
                        </div>
                    ))}

                    {seasons.length === 0 && (
                        <p className="text-sm text-neutral-400 text-center py-4">
                            {t('admin.recommendedSeasonsHint')}
                        </p>
                    )}
                </div>

                {/* ── Grain Character ─────────────────────── */}
                <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
                    <div>
                        <h2 className="font-semibold text-lg">
                            {t('admin.grainCharacter')}
                        </h2>
                        <p className="text-xs text-neutral-400">
                            {t('admin.grainCharacterHint')}
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium mb-1">
                            English
                        </label>
                        {grainCharEn.map((v, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={v}
                                    onChange={(e) => {
                                        const u = [...grainCharEn]
                                        u[i] = e.target.value
                                        setGrainCharEn(u)
                                    }}
                                    className="input flex-1 text-sm"
                                    placeholder={`Grain character ${i + 1}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setGrainCharEn((p) =>
                                            p.filter((_, j) => j !== i),
                                        )
                                        setGrainCharTe((p) =>
                                            p.filter((_, j) => j !== i),
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
                                setGrainCharEn((p) => [...p, ''])
                                setGrainCharTe((p) => [...p, ''])
                            }}
                            className="text-xs text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                        >
                            <Plus className="h-3.5 w-3.5" /> Add
                        </button>
                    </div>

                    <div>
                        <label className="block text-xs font-medium mb-1">
                            తెలుగు (Telugu)
                        </label>
                        {grainCharTe.map((v, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={v}
                                    onChange={(e) => {
                                        const u = [...grainCharTe]
                                        u[i] = e.target.value
                                        setGrainCharTe(u)
                                    }}
                                    className="input flex-1 text-sm"
                                    placeholder={`గింజ లక్షణం ${i + 1}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setGrainCharEn((p) =>
                                            p.filter((_, j) => j !== i),
                                        )
                                        setGrainCharTe((p) =>
                                            p.filter((_, j) => j !== i),
                                        )
                                    }}
                                    className="text-red-500 hover:text-red-600 p-1"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Special Characteristics ────────────── */}
                <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-lg">
                                {t('admin.specialCharacteristics')}
                            </h2>
                            <p className="text-xs text-neutral-400">
                                {t('admin.specialCharacteristicsHint')}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() =>
                                setSpecialChars((p) => [
                                    ...p,
                                    { en: '', te: '' },
                                ])
                            }
                            className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                        >
                            <Plus className="h-4 w-4" />
                            {t('admin.addCharacteristic')}
                        </button>
                    </div>

                    {specialChars.map((c, i) => (
                        <div
                            key={i}
                            className="border border-neutral-200 rounded-lg p-3 space-y-2 bg-neutral-50"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">
                                    #{i + 1}
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSpecialChars((p) =>
                                            p.filter((_, j) => j !== i),
                                        )
                                    }
                                    className="text-red-500 hover:text-red-600 p-1"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                            <input
                                type="text"
                                value={c.en}
                                onChange={(e) => {
                                    const u = [...specialChars]
                                    u[i] = { ...u[i], en: e.target.value }
                                    setSpecialChars(u)
                                }}
                                className="input text-sm"
                                placeholder="English description"
                            />
                            <input
                                type="text"
                                value={c.te}
                                onChange={(e) => {
                                    const u = [...specialChars]
                                    u[i] = { ...u[i], te: e.target.value }
                                    setSpecialChars(u)
                                }}
                                className="input text-sm"
                                placeholder="తెలుగు వివరణ"
                            />
                        </div>
                    ))}

                    {specialChars.length === 0 && (
                        <p className="text-sm text-neutral-400 text-center py-2">
                            {t('admin.specialCharacteristicsHint')}
                        </p>
                    )}
                </div>

                {/* ── Linked Diseases ─────────────────────── */}
                <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
                    <h2 className="font-semibold text-lg">
                        {t('admin.linkedDiseases')}
                    </h2>
                    <MultiSelectDropdown
                        options={allDiseases.map((d) => ({
                            value: d.id,
                            label: `${d.name.en}${d.name.te ? ` (${d.name.te})` : ''}`,
                        }))}
                        values={selectedDiseases}
                        onChange={setSelectedDiseases}
                        placeholder={t('admin.selectDisease')}
                        ariaLabel={t('admin.linkedDiseases')}
                    />
                </div>

                {/* ── Actions ─────────────────────────────── */}
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
            </form>
        </div>
    )
}
