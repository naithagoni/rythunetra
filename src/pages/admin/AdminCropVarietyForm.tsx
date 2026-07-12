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
            toast.error(t('admin.translateFailed'))
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
            toast.success(t('admin.saved'))

            if (isNew) {
                navigate(`/admin/crops/${cropId}/varieties`, { replace: true })
            }
        } catch {
            toast.error(t('errors.generic'))
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm(t('admin.deleteConfirm'))) return
        const { error } = await adminDeleteCropVariety(id!)
        if (error) {
            toast.error(t('errors.generic'))
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
                className="text-sm text-primary hover:underline mb-1 inline-block"
            >
                ← {cropName} – {t('admin.varieties')}
            </Link>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-foreground">
                    {isNew ? t('admin.addVariety') : t('admin.editVariety')}
                </h1>
                {!isNew && (
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={handleDelete}
                        aria-label={t('common.delete')}
                    >
                        <Trash2 />
                    </Button>
                )}
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-6">
                {/* ── Core Fields ────────────────────────── */}
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
                                    {t('admin.varietyImage')}
                                </FieldLabel>
                                <FieldDescription>
                                    {t('admin.varietyImageHint')}
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

                            {/* Name EN */}
                            <Field>
                                <FieldLabel htmlFor="variety-en-name">
                                    {t('admin.varietyName')} (EN){' '}
                                    <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                    id="variety-en-name"
                                    type="text"
                                    value={enName}
                                    onChange={(e) => setEnName(e.target.value)}
                                    placeholder="e.g., BPT 5204 (Samba Mahsuri)"
                                    required
                                />
                            </Field>

                            {/* Name TE */}
                            <Field>
                                <div className="flex items-center justify-between">
                                    <FieldLabel htmlFor="variety-te-name">
                                        {t('admin.varietyName')} (TE){' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FieldLabel>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={handleTranslate}
                                        disabled={translating || !enName.trim()}
                                        className="bg-[#D4A72C]/10 text-[#D4A72C] hover:bg-[#D4A72C]/15"
                                    >
                                        <Languages data-icon="inline-start" />
                                        {translating
                                            ? t('admin.translating')
                                            : t('admin.translateFromEnglish')}
                                    </Button>
                                </div>
                                <Input
                                    id="variety-te-name"
                                    type="text"
                                    value={teName}
                                    onChange={(e) => setTeName(e.target.value)}
                                    placeholder="ఉదా., బీపీటీ 5204 (సాంబ మహసూరి)"
                                    required
                                />
                            </Field>
                        </FieldGroup>
                    </CardContent>
                </Card>

                {/* ── Districts ───────────────────────────── */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {t('admin.districts')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>

                {/* ── Recommended Seasons ─────────────────── */}
                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">
                                {t('admin.recommendedSeasons')}
                            </CardTitle>
                            <FieldDescription>
                                {t('admin.recommendedSeasonsHint')}
                            </FieldDescription>
                        </div>
                        <Button
                            type="button"
                            variant="link"
                            size="sm"
                            onClick={() =>
                                setSeasons((p) => [...p, emptySeasonState()])
                            }
                            className="w-fit px-0"
                        >
                            <Plus data-icon="inline-start" />
                            {t('admin.addSeason')}
                        </Button>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {seasons.map((season, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col border border-white/[0.06] rounded-lg p-4 gap-3 bg-white/[0.03]"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                        {t('admin.seasonName')} #{idx + 1}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="link"
                                        size="sm"
                                        onClick={() => removeSeason(idx)}
                                        className="w-fit px-0 text-destructive"
                                    >
                                        <X data-icon="inline-start" />
                                        {t('admin.removeSeason')}
                                    </Button>
                                </div>

                                {/* Season name EN / TE */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Field>
                                        <FieldLabel
                                            htmlFor={`season-name-en-${idx}`}
                                        >
                                            {t('admin.seasonName')} (EN)
                                        </FieldLabel>
                                        <Input
                                            id={`season-name-en-${idx}`}
                                            type="text"
                                            value={season.nameEn}
                                            onChange={(e) =>
                                                updateSeason(idx, {
                                                    nameEn: e.target.value,
                                                })
                                            }
                                            className="text-sm"
                                            placeholder="e.g., Kharif"
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel
                                            htmlFor={`season-name-te-${idx}`}
                                        >
                                            {t('admin.seasonName')} (TE)
                                        </FieldLabel>
                                        <Input
                                            id={`season-name-te-${idx}`}
                                            type="text"
                                            value={season.nameTe}
                                            onChange={(e) =>
                                                updateSeason(idx, {
                                                    nameTe: e.target.value,
                                                })
                                            }
                                            className="text-sm"
                                            placeholder="ఉదా., ఖరీఫ్"
                                        />
                                    </Field>
                                </div>

                                {/* Duration */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Field>
                                        <FieldLabel
                                            htmlFor={`season-duration-min-${idx}`}
                                        >
                                            {t('admin.durationMin')}
                                        </FieldLabel>
                                        <Input
                                            id={`season-duration-min-${idx}`}
                                            type="number"
                                            min={1}
                                            value={season.durationMin}
                                            onChange={(e) =>
                                                updateSeason(idx, {
                                                    durationMin: e.target.value,
                                                })
                                            }
                                            className="text-sm"
                                            placeholder="e.g., 120"
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel
                                            htmlFor={`season-duration-max-${idx}`}
                                        >
                                            {t('admin.durationMax')}
                                        </FieldLabel>
                                        <Input
                                            id={`season-duration-max-${idx}`}
                                            type="number"
                                            min={1}
                                            value={season.durationMax}
                                            onChange={(e) =>
                                                updateSeason(idx, {
                                                    durationMax: e.target.value,
                                                })
                                            }
                                            className="text-sm"
                                            placeholder="e.g., 150"
                                        />
                                    </Field>
                                </div>

                                {/* Months multi-select */}
                                <Field>
                                    <FieldLabel>
                                        {t('admin.monthsEn')}
                                    </FieldLabel>
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
                                </Field>
                            </div>
                        ))}

                        {seasons.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                {t('admin.recommendedSeasonsHint')}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* ── Grain Character ─────────────────────── */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {t('admin.grainCharacter')}
                        </CardTitle>
                        <FieldDescription>
                            {t('admin.grainCharacterHint')}
                        </FieldDescription>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <Field>
                                <FieldLabel>English</FieldLabel>
                                {grainCharEn.map((v, i) => (
                                    <div key={i} className="flex gap-2">
                                        <Input
                                            type="text"
                                            value={v}
                                            onChange={(e) => {
                                                const u = [...grainCharEn]
                                                u[i] = e.target.value
                                                setGrainCharEn(u)
                                            }}
                                            className="flex-1 text-sm"
                                            placeholder={`Grain character ${i + 1}`}
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => {
                                                setGrainCharEn((p) =>
                                                    p.filter((_, j) => j !== i),
                                                )
                                                setGrainCharTe((p) =>
                                                    p.filter((_, j) => j !== i),
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
                                        setGrainCharEn((p) => [...p, ''])
                                        setGrainCharTe((p) => [...p, ''])
                                    }}
                                    className="w-fit px-0"
                                >
                                    <Plus data-icon="inline-start" /> Add
                                </Button>
                            </Field>

                            <Field>
                                <FieldLabel>తెలుగు (Telugu)</FieldLabel>
                                {grainCharTe.map((v, i) => (
                                    <div key={i} className="flex gap-2">
                                        <Input
                                            type="text"
                                            value={v}
                                            onChange={(e) => {
                                                const u = [...grainCharTe]
                                                u[i] = e.target.value
                                                setGrainCharTe(u)
                                            }}
                                            className="flex-1 text-sm"
                                            placeholder={`గింజ లక్షణం ${i + 1}`}
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => {
                                                setGrainCharEn((p) =>
                                                    p.filter((_, j) => j !== i),
                                                )
                                                setGrainCharTe((p) =>
                                                    p.filter((_, j) => j !== i),
                                                )
                                            }}
                                            aria-label={t('common.delete')}
                                        >
                                            <X />
                                        </Button>
                                    </div>
                                ))}
                            </Field>
                        </FieldGroup>
                    </CardContent>
                </Card>

                {/* ── Special Characteristics ────────────── */}
                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">
                                {t('admin.specialCharacteristics')}
                            </CardTitle>
                            <FieldDescription>
                                {t('admin.specialCharacteristicsHint')}
                            </FieldDescription>
                        </div>
                        <Button
                            type="button"
                            variant="link"
                            size="sm"
                            onClick={() =>
                                setSpecialChars((p) => [
                                    ...p,
                                    { en: '', te: '' },
                                ])
                            }
                            className="w-fit px-0"
                        >
                            <Plus data-icon="inline-start" />
                            {t('admin.addCharacteristic')}
                        </Button>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {specialChars.map((c, i) => (
                            <div
                                key={i}
                                className="flex flex-col border border-white/[0.06] rounded-lg p-3 gap-2 bg-white/[0.03]"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium">
                                        #{i + 1}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon-xs"
                                        onClick={() =>
                                            setSpecialChars((p) =>
                                                p.filter((_, j) => j !== i),
                                            )
                                        }
                                        aria-label={t('common.delete')}
                                    >
                                        <X />
                                    </Button>
                                </div>
                                <Input
                                    type="text"
                                    value={c.en}
                                    onChange={(e) => {
                                        const u = [...specialChars]
                                        u[i] = { ...u[i], en: e.target.value }
                                        setSpecialChars(u)
                                    }}
                                    className="text-sm"
                                    placeholder="English description"
                                />
                                <Input
                                    type="text"
                                    value={c.te}
                                    onChange={(e) => {
                                        const u = [...specialChars]
                                        u[i] = { ...u[i], te: e.target.value }
                                        setSpecialChars(u)
                                    }}
                                    className="text-sm"
                                    placeholder="తెలుగు వివరణ"
                                />
                            </div>
                        ))}

                        {specialChars.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-2">
                                {t('admin.specialCharacteristicsHint')}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* ── Linked Diseases ─────────────────────── */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {t('admin.linkedDiseases')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>

                {/* ── Actions ─────────────────────────────── */}
                <Button
                    type="submit"
                    disabled={saveDisabled}
                    className="w-full"
                >
                    <Save data-icon="inline-start" />
                    {saving ? t('common.saving') : t('common.save')}
                </Button>
            </form>
        </div>
    )
}
