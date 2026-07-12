import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
    adminGetDisease,
    adminCreateDisease,
    adminUpdateDisease,
    adminDeleteDisease,
    adminReplaceDiseaseCropVarieties,
    adminReplaceDiseaseRemedies,
    adminGetAllRemedies,
    adminGetAllCropVarieties,
    adminUploadFile,
    getSafeExtension,
    checkDuplicateDisease,
} from '@/services/adminService'
import { CustomDropdown } from '@/components/common/CustomDropdown'
import { MultiSelectDropdown } from '@/components/common/MultiSelectDropdown'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import {
    Save,
    Plus,
    X,
    Languages,
    Trash2,
    ImageIcon,
    AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'
import { translateText, translateBatch } from '@/services/translateService'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { DISEASE_TYPE_KEYS } from '@/config/diseaseTypes'
import type { LocalizedText, LocalizedTextArray } from '@/types/i18n'

const DISEASE_IMAGES_BUCKET = 'disease-images'

export function AdminDiseaseFormPage() {
    const { id } = useParams<{ id: string }>()
    const isNew = !id
    const { t } = useTranslation()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    // Name (LocalizedText)
    const [enName, setEnName] = useState('')
    const [teName, setTeName] = useState('')

    // Type (disease type key from config)
    const [diseaseTypeKey, setDiseaseTypeKey] = useState('')

    // Primary Cause (LocalizedText)
    const [enPrimaryCause, setEnPrimaryCause] = useState('')
    const [tePrimaryCause, setTePrimaryCause] = useState('')

    // Symptoms (LocalizedText[])
    const [enSymptoms, setEnSymptoms] = useState<string[]>([])
    const [teSymptoms, setTeSymptoms] = useState<string[]>([])
    const [newEnSymptom, setNewEnSymptom] = useState('')
    const [newTeSymptom, setNewTeSymptom] = useState('')

    // Favorable Conditions (LocalizedText[])
    const [enConditions, setEnConditions] = useState<string[]>([])
    const [teConditions, setTeConditions] = useState<string[]>([])
    const [newEnCondition, setNewEnCondition] = useState('')
    const [newTeCondition, setNewTeCondition] = useState('')

    // Preventions (LocalizedText[])
    const [enPreventions, setEnPreventions] = useState<string[]>([])
    const [tePreventions, setTePreventions] = useState<string[]>([])
    const [newEnPrevention, setNewEnPrevention] = useState('')
    const [newTePrevention, setNewTePrevention] = useState('')

    // Treatments (LocalizedText[])
    const [enTreatments, setEnTreatments] = useState<string[]>([])
    const [teTreatments, setTeTreatments] = useState<string[]>([])
    const [newEnTreatment, setNewEnTreatment] = useState('')
    const [newTeTreatment, setNewTeTreatment] = useState('')

    // Aliases (LocalizedTextArray)
    const [enAliases, setEnAliases] = useState<string[]>([])
    const [teAliases, setTeAliases] = useState<string[]>([])
    const [newEnAlias, setNewEnAlias] = useState('')
    const [newTeAlias, setNewTeAlias] = useState('')

    // Core fields
    const [severity, setSeverity] = useState('moderate')
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [pendingFiles, setPendingFiles] = useState<File[]>([])
    const [pendingPreviews, setPendingPreviews] = useState<string[]>([])
    const [uploadingImages, setUploadingImages] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Junction IDs
    const [selectedVarietyIds, setSelectedVarietyIds] = useState<string[]>([])
    const [selectedRemedyIds, setSelectedRemedyIds] = useState<string[]>([])

    const [saving, setSaving] = useState(false)
    const [translating, setTranslating] = useState(false)

    // Validation
    const enNameMissing = !enName.trim()
    const teNameMissing = !teName.trim()
    const saveDisabled = saving || enNameMissing || teNameMissing

    // Load existing disease
    const { data: result, isLoading } = useQuery({
        queryKey: ['admin-disease', id],
        queryFn: () => adminGetDisease(id!),
        enabled: !isNew && !!id,
    })

    // Lookups for junction selects
    const { data: remediesResult } = useQuery({
        queryKey: ['admin-all-remedies'],
        queryFn: () => adminGetAllRemedies(),
    })
    const { data: varietiesResult } = useQuery({
        queryKey: ['admin-all-crop-varieties'],
        queryFn: () => adminGetAllCropVarieties(),
    })

    const remedyOptions = (remediesResult?.data ?? []).map(
        (r: { id: string; name: LocalizedText }) => ({
            value: r.id,
            label: (r.name as LocalizedText)?.en ?? r.id,
        }),
    )
    const varietyOptions = (varietiesResult?.data ?? []).map(
        (v: { id: string; name: LocalizedText }) => ({
            value: v.id,
            label: (v.name as LocalizedText)?.en ?? v.id,
        }),
    )

    useEffect(() => {
        if (result?.data) {
            const d = result.data as Record<string, unknown>

            const name = d.name as LocalizedText | undefined
            setEnName(name?.en ?? '')
            setTeName(name?.te ?? '')

            const dtype = d.type as LocalizedText | null
            // Reverse-lookup key from the EN label
            const matchedKey = DISEASE_TYPE_KEYS.find(
                (k) =>
                    t(`diseaseTypes.${k}`, { lng: 'en' }).toLowerCase() ===
                    (dtype?.en ?? '').toLowerCase(),
            )
            setDiseaseTypeKey(matchedKey ?? '')

            const pc = d.primary_cause as LocalizedText | null
            setEnPrimaryCause(pc?.en ?? '')
            setTePrimaryCause(pc?.te ?? '')

            setSeverity((d.severity as string) ?? 'moderate')
            setImageUrls((d.image_urls as string[]) ?? [])

            // LocalizedText[] arrays
            const symptoms = d.symptoms as LocalizedText[] | null
            setEnSymptoms(symptoms?.map((s) => s.en) ?? [])
            setTeSymptoms(symptoms?.map((s) => s.te) ?? [])

            const conds = d.favorable_conditions as LocalizedText[] | null
            setEnConditions(conds?.map((c) => c.en) ?? [])
            setTeConditions(conds?.map((c) => c.te) ?? [])

            const prevs = d.preventions as LocalizedText[] | null
            setEnPreventions(prevs?.map((p) => p.en) ?? [])
            setTePreventions(prevs?.map((p) => p.te) ?? [])

            const treats = d.treatments as LocalizedText[] | null
            setEnTreatments(treats?.map((tt) => tt.en) ?? [])
            setTeTreatments(treats?.map((tt) => tt.te) ?? [])

            const aliases = d.aliases as LocalizedTextArray | null
            setEnAliases(aliases?.en ?? [])
            setTeAliases(aliases?.te ?? [])

            // Junctions
            const varLinks = d.crop_variety_diseases as
                | Array<{ crop_variety_id: string }>
                | undefined
            setSelectedVarietyIds(
                varLinks?.map((vl) => vl.crop_variety_id) ?? [],
            )

            const remLinks = d.disease_remedies as
                | Array<{ remedy_id: string }>
                | undefined
            setSelectedRemedyIds(remLinks?.map((rl) => rl.remedy_id) ?? [])
        }
    }, [result?.data, t])

    /** Zip parallel en/te arrays into LocalizedText[] */
    const zipToLocalizedArray = (
        enArr: string[],
        teArr: string[],
    ): LocalizedText[] => {
        const maxLen = Math.max(enArr.length, teArr.length)
        const zipped: LocalizedText[] = []
        for (let i = 0; i < maxLen; i++) {
            const en = enArr[i]?.trim() ?? ''
            const te = teArr[i]?.trim() ?? ''
            if (en || te) zipped.push({ en, te })
        }
        return zipped
    }

    const addArrayItem = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        inputSetter: React.Dispatch<React.SetStateAction<string>>,
        value: string,
    ) => {
        if (value.trim()) {
            setter((prev) => [...prev, value.trim()])
            inputSetter('')
        }
    }

    const removeArrayItem = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        index: number,
    ) => {
        setter((prev) => prev.filter((_, i) => i !== index))
    }

    const handleTranslateToTelugu = async () => {
        setTranslating(true)
        try {
            const [
                name,
                primaryCause,
                symptoms,
                conds,
                preventions,
                treatments,
                aliases,
            ] = await Promise.all([
                translateText(enName),
                enPrimaryCause
                    ? translateText(enPrimaryCause)
                    : Promise.resolve(''),
                translateBatch(enSymptoms),
                translateBatch(enConditions),
                translateBatch(enPreventions),
                translateBatch(enTreatments),
                translateBatch(enAliases),
            ])
            setTeName(name)
            setTePrimaryCause(primaryCause)
            setTeSymptoms(symptoms.filter(Boolean))
            setTeConditions(conds.filter(Boolean))
            setTePreventions(preventions.filter(Boolean))
            setTeTreatments(treatments.filter(Boolean))
            setTeAliases(aliases.filter(Boolean))
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
            let diseaseId = id

            const isDuplicate = await checkDuplicateDisease(enName, id)
            if (isDuplicate) {
                toast.error(t('errors.duplicateDisease'))
                setSaving(false)
                return
            }

            // Upload any pending image files
            let uploadedUrls: string[] = []
            if (pendingFiles.length > 0) {
                setUploadingImages(true)
                try {
                    uploadedUrls = await Promise.all(
                        pendingFiles.map(async (file) => {
                            const ext = getSafeExtension(file.name)
                            const path = `diseases/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
                            return adminUploadFile(
                                DISEASE_IMAGES_BUCKET,
                                path,
                                file,
                            )
                        }),
                    )
                } finally {
                    setUploadingImages(false)
                }
            }

            const allImageUrls = [...imageUrls, ...uploadedUrls].filter(Boolean)

            const payload = {
                name: { en: enName.trim(), te: teName.trim() },
                type: diseaseTypeKey
                    ? {
                          en: t(`diseaseTypes.${diseaseTypeKey}`, {
                              lng: 'en',
                          }),
                          te: t(`diseaseTypes.${diseaseTypeKey}`, {
                              lng: 'te',
                          }),
                      }
                    : null,
                severity,
                image_urls: allImageUrls,
                primary_cause:
                    enPrimaryCause.trim() || tePrimaryCause.trim()
                        ? {
                              en: enPrimaryCause.trim(),
                              te: tePrimaryCause.trim(),
                          }
                        : null,
                symptoms: zipToLocalizedArray(enSymptoms, teSymptoms),
                favorable_conditions: zipToLocalizedArray(
                    enConditions,
                    teConditions,
                ),
                preventions: zipToLocalizedArray(enPreventions, tePreventions),
                treatments: zipToLocalizedArray(enTreatments, teTreatments),
                aliases:
                    enAliases.filter(Boolean).length ||
                    teAliases.filter(Boolean).length
                        ? ({
                              en: enAliases.filter(Boolean),
                              te: teAliases.filter(Boolean),
                          } as LocalizedTextArray)
                        : undefined,
            }

            if (isNew) {
                const { data, error } = await adminCreateDisease(payload)
                if (error) throw error
                diseaseId = data.id
            } else {
                const { error } = await adminUpdateDisease(id!, payload)
                if (error) throw error
            }

            // Junctions
            await adminReplaceDiseaseCropVarieties(
                diseaseId!,
                selectedVarietyIds,
            )
            await adminReplaceDiseaseRemedies(diseaseId!, selectedRemedyIds)

            queryClient.invalidateQueries({ queryKey: ['admin-disease'] })
            queryClient.invalidateQueries({ queryKey: ['admin-diseases'] })
            queryClient.invalidateQueries({ queryKey: ['diseases'] })

            // Update local state with uploaded URLs
            if (uploadedUrls.length > 0) {
                setImageUrls(allImageUrls)
                setPendingFiles([])
                setPendingPreviews([])
            }

            toast.success(t('admin.saved'))

            if (isNew) {
                navigate('/admin/diseases', { replace: true })
            }
        } catch {
            toast.error(t('errors.generic'))
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!id) return
        if (!window.confirm(t('admin.deleteConfirm'))) return
        setSaving(true)
        try {
            const { error } = await adminDeleteDisease(id)
            if (error) throw error
            queryClient.invalidateQueries({ queryKey: ['admin-diseases'] })
            navigate('/admin/diseases', { replace: true })
        } catch {
            toast.error(t('errors.generic'))
        } finally {
            setSaving(false)
        }
    }

    if (!isNew && isLoading) return <LoadingSpinner />

    /** Reusable chip-list editor */
    const renderChipEditor = (
        id: string,
        label: string,
        items: string[],
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        inputVal: string,
        inputSetter: React.Dispatch<React.SetStateAction<string>>,
        placeholder: string,
    ) => (
        <Field>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            {items.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {items.map((s, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-sm"
                        >
                            {s}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => removeArrayItem(setter, i)}
                                aria-label={t('common.delete')}
                            >
                                <X />
                            </Button>
                        </span>
                    ))}
                </div>
            )}
            <div className="flex gap-2">
                <Input
                    id={id}
                    type="text"
                    value={inputVal}
                    onChange={(e) => inputSetter(e.target.value)}
                    onKeyDown={(e) =>
                        e.key === 'Enter' &&
                        (e.preventDefault(),
                        addArrayItem(setter, inputSetter, inputVal))
                    }
                    className="flex-1"
                    placeholder={placeholder}
                />
                <Button
                    type="button"
                    size="icon"
                    onClick={() => addArrayItem(setter, inputSetter, inputVal)}
                    aria-label={placeholder}
                >
                    <Plus />
                </Button>
            </div>
        </Field>
    )

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
                to="/admin/diseases"
                className="text-sm text-primary hover:underline mb-2 inline-block"
            >
                ← {t('admin.diseases')}
            </Link>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-foreground">
                    {isNew ? t('admin.addDisease') : t('admin.editDisease')}
                </h1>
                {!isNew && (
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={saving}
                    >
                        <Trash2 data-icon="inline-start" />
                        {t('common.delete')}
                    </Button>
                )}
            </div>

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
                            {/* Severity */}
                            <Field>
                                <FieldLabel>{t('diseases.severity')}</FieldLabel>
                                <CustomDropdown
                                    options={(
                                        [
                                            'low',
                                            'moderate',
                                            'high',
                                            'critical',
                                        ] as const
                                    ).map((s) => ({
                                        value: s,
                                        label: t(`diseases.${s}`),
                                    }))}
                                    value={severity}
                                    onChange={setSeverity}
                                    placeholder={t('diseases.severity')}
                                    ariaLabel={t('diseases.severity')}
                                    variant="form"
                                />
                            </Field>

                            {/* Disease Type */}
                            <Field>
                                <FieldLabel>
                                    {t('diseases.diseaseType')}
                                </FieldLabel>
                                <CustomDropdown
                                    options={DISEASE_TYPE_KEYS.map((key) => ({
                                        value: key,
                                        label: t(`diseaseTypes.${key}`),
                                    }))}
                                    value={diseaseTypeKey}
                                    onChange={setDiseaseTypeKey}
                                    placeholder={t(
                                        'admin.diseaseTypePlaceholder',
                                    )}
                                    ariaLabel={t('diseases.diseaseType')}
                                    variant="form"
                                />
                            </Field>

                            {/* Disease Images (multi-upload) */}
                            <Field>
                                <FieldLabel>
                                    {t('admin.diseaseImages')}
                                </FieldLabel>
                                <FieldDescription>
                                    {t('admin.diseaseImagesHint')}
                                </FieldDescription>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => {
                                        const files = Array.from(
                                            e.target.files ?? [],
                                        ).filter((f) =>
                                            f.type.startsWith('image/'),
                                        )
                                        if (files.length) {
                                            setPendingFiles((prev) => [
                                                ...prev,
                                                ...files,
                                            ])
                                            setPendingPreviews((prev) => [
                                                ...prev,
                                                ...files.map((f) =>
                                                    URL.createObjectURL(f),
                                                ),
                                            ])
                                        }
                                        if (fileInputRef.current)
                                            fileInputRef.current.value = ''
                                    }}
                                />

                                {/* Existing uploaded images */}
                                {imageUrls.length > 0 && (
                                    <div className="flex flex-wrap gap-3">
                                        {imageUrls.map((url, i) => (
                                            <div
                                                key={`existing-${i}`}
                                                className="relative"
                                            >
                                                <img
                                                    src={url}
                                                    alt={`Disease ${i + 1}`}
                                                    className="h-24 w-32 object-cover rounded-lg border"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon-xs"
                                                    onClick={() =>
                                                        setImageUrls((prev) =>
                                                            prev.filter(
                                                                (_, j) =>
                                                                    j !== i,
                                                            ),
                                                        )
                                                    }
                                                    className="absolute -top-2 -right-2 rounded-full"
                                                    aria-label={t(
                                                        'admin.removeImage',
                                                    )}
                                                >
                                                    <X />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Pending (not yet uploaded) previews */}
                                {pendingPreviews.length > 0 && (
                                    <div className="flex flex-wrap gap-3">
                                        {pendingPreviews.map((url, i) => (
                                            <div
                                                key={`pending-${i}`}
                                                className="relative"
                                            >
                                                <img
                                                    src={url}
                                                    alt={`New ${i + 1}`}
                                                    className="h-24 w-32 object-cover rounded-lg border border-amber-300"
                                                />
                                                <span className="absolute top-1 left-1 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                                                    new
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon-xs"
                                                    onClick={() => {
                                                        setPendingFiles((prev) =>
                                                            prev.filter(
                                                                (_, j) =>
                                                                    j !== i,
                                                            ),
                                                        )
                                                        setPendingPreviews(
                                                            (prev) =>
                                                                prev.filter(
                                                                    (_, j) =>
                                                                        j !== i,
                                                                ),
                                                        )
                                                    }}
                                                    className="absolute -top-2 -right-2 rounded-full"
                                                    aria-label={t(
                                                        'admin.removeImage',
                                                    )}
                                                >
                                                    <X />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingImages}
                                    className="w-fit border-dashed"
                                >
                                    {uploadingImages ? (
                                        <Spinner data-icon="inline-start" />
                                    ) : (
                                        <ImageIcon data-icon="inline-start" />
                                    )}
                                    {uploadingImages
                                        ? t('admin.uploadingImage')
                                        : t('admin.addImage')}
                                </Button>
                            </Field>

                            {/* Associated Crop Varieties */}
                            <Field>
                                <FieldLabel>
                                    {t('admin.linkedVarieties')}
                                </FieldLabel>
                                {varietyOptions.length === 0 ? (
                                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#D4A72C]/10 border border-[#D4A72C]/20 text-[#D4A72C] text-sm">
                                        <AlertTriangle className="size-4 shrink-0" />
                                        <span>
                                            {t('admin.noVarietiesYet')}{' '}
                                            <Link
                                                to="/admin/varieties"
                                                className="font-medium underline hover:text-[#D4A72C]/80"
                                            >
                                                {t('admin.addVariety')}
                                            </Link>
                                        </span>
                                    </div>
                                ) : (
                                    <MultiSelectDropdown
                                        options={varietyOptions}
                                        values={selectedVarietyIds}
                                        onChange={setSelectedVarietyIds}
                                        placeholder={t('admin.linkedVarieties')}
                                        ariaLabel={t('admin.linkedVarieties')}
                                    />
                                )}
                            </Field>

                            {/* Associated Remedies */}
                            <Field>
                                <FieldLabel>
                                    {t('admin.linkedRemedies')}
                                </FieldLabel>
                                {remedyOptions.length === 0 ? (
                                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#D4A72C]/10 border border-[#D4A72C]/20 text-[#D4A72C] text-sm">
                                        <AlertTriangle className="size-4 shrink-0" />
                                        <span>
                                            {t('admin.noRemediesYet')}{' '}
                                            <Link
                                                to="/admin/remedies/add"
                                                className="font-medium underline hover:text-[#D4A72C]/80"
                                            >
                                                {t('admin.addRemedy')}
                                            </Link>
                                        </span>
                                    </div>
                                ) : (
                                    <MultiSelectDropdown
                                        options={remedyOptions}
                                        values={selectedRemedyIds}
                                        onChange={setSelectedRemedyIds}
                                        placeholder={t('admin.linkedRemedies')}
                                        ariaLabel={t('admin.linkedRemedies')}
                                    />
                                )}
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
                                <FieldLabel htmlFor="disease-en-name">
                                    {t('admin.name')}{' '}
                                    <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                    id="disease-en-name"
                                    type="text"
                                    value={enName}
                                    onChange={(e) => setEnName(e.target.value)}
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="disease-en-primary-cause">
                                    {t('diseases.primaryCause')}
                                </FieldLabel>
                                <Textarea
                                    id="disease-en-primary-cause"
                                    value={enPrimaryCause}
                                    onChange={(e) =>
                                        setEnPrimaryCause(e.target.value)
                                    }
                                    className="min-h-16"
                                />
                            </Field>

                            {renderChipEditor(
                                'en-symptoms',
                                t('diseases.symptoms'),
                                enSymptoms,
                                setEnSymptoms,
                                newEnSymptom,
                                setNewEnSymptom,
                                'Add symptom',
                            )}
                            {renderChipEditor(
                                'en-conditions',
                                t('diseases.favorableConditions'),
                                enConditions,
                                setEnConditions,
                                newEnCondition,
                                setNewEnCondition,
                                'Add condition',
                            )}
                            {renderChipEditor(
                                'en-preventions',
                                t('diseases.preventions'),
                                enPreventions,
                                setEnPreventions,
                                newEnPrevention,
                                setNewEnPrevention,
                                'Add prevention',
                            )}
                            {renderChipEditor(
                                'en-treatments',
                                t('diseases.treatments'),
                                enTreatments,
                                setEnTreatments,
                                newEnTreatment,
                                setNewEnTreatment,
                                'Add treatment',
                            )}
                            {renderChipEditor(
                                'en-aliases',
                                t('diseases.aliases'),
                                enAliases,
                                setEnAliases,
                                newEnAlias,
                                setNewEnAlias,
                                'Add alias',
                            )}
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
                            onClick={handleTranslateToTelugu}
                            disabled={translating || !enName}
                            className="bg-[#D4A72C]/10 text-[#D4A72C] hover:bg-[#D4A72C]/15"
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
                                <FieldLabel htmlFor="disease-te-name">
                                    {t('admin.name')}{' '}
                                    <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                    id="disease-te-name"
                                    type="text"
                                    value={teName}
                                    onChange={(e) => setTeName(e.target.value)}
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="disease-te-primary-cause">
                                    {t('diseases.primaryCause')}
                                </FieldLabel>
                                <Textarea
                                    id="disease-te-primary-cause"
                                    value={tePrimaryCause}
                                    onChange={(e) =>
                                        setTePrimaryCause(e.target.value)
                                    }
                                    className="min-h-16"
                                />
                            </Field>

                            {renderChipEditor(
                                'te-symptoms',
                                t('diseases.symptoms'),
                                teSymptoms,
                                setTeSymptoms,
                                newTeSymptom,
                                setNewTeSymptom,
                                'లక్షణం జోడించండి',
                            )}
                            {renderChipEditor(
                                'te-conditions',
                                t('diseases.favorableConditions'),
                                teConditions,
                                setTeConditions,
                                newTeCondition,
                                setNewTeCondition,
                                'పరిస్థితి జోడించండి',
                            )}
                            {renderChipEditor(
                                'te-preventions',
                                t('diseases.preventions'),
                                tePreventions,
                                setTePreventions,
                                newTePrevention,
                                setNewTePrevention,
                                'నివారణ జోడించండి',
                            )}
                            {renderChipEditor(
                                'te-treatments',
                                t('diseases.treatments'),
                                teTreatments,
                                setTeTreatments,
                                newTeTreatment,
                                setNewTeTreatment,
                                'చికిత్స జోడించండి',
                            )}
                            {renderChipEditor(
                                'te-aliases',
                                t('diseases.aliases'),
                                teAliases,
                                setTeAliases,
                                newTeAlias,
                                setNewTeAlias,
                                'మారుపేరు జోడించండి',
                            )}
                        </FieldGroup>
                    </CardContent>
                </Card>

                {/* Actions */}
                <Button type="submit" disabled={saveDisabled} className="w-fit">
                    <Save data-icon="inline-start" />
                    {saving
                        ? t('common.loading')
                        : isNew
                          ? t('common.save')
                          : t('common.update')}
                </Button>
            </form>
        </div>
    )
}
