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
import { translateText, translateBatch } from '@/services/translateService'
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
    const [message, setMessage] = useState('')

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
            let diseaseId = id

            const isDuplicate = await checkDuplicateDisease(enName, id)
            if (isDuplicate) {
                setMessage(t('errors.duplicateDisease'))
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

            setMessage(t('admin.saved'))

            if (isNew) {
                navigate('/admin/diseases', { replace: true })
            }
        } catch {
            setMessage(t('errors.generic'))
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
            setMessage(t('errors.generic'))
        } finally {
            setSaving(false)
        }
    }

    if (!isNew && isLoading) return <LoadingSpinner />

    /** Reusable chip-list editor */
    const renderChipEditor = (
        label: string,
        items: string[],
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        inputVal: string,
        inputSetter: React.Dispatch<React.SetStateAction<string>>,
        placeholder: string,
    ) => (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div className="flex flex-wrap gap-2 mb-2">
                {items.map((s, i) => (
                    <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-100 text-sm"
                    >
                        {s}
                        <button
                            type="button"
                            onClick={() => removeArrayItem(setter, i)}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => inputSetter(e.target.value)}
                    onKeyDown={(e) =>
                        e.key === 'Enter' &&
                        (e.preventDefault(),
                        addArrayItem(setter, inputSetter, inputVal))
                    }
                    className="input flex-1"
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={() => addArrayItem(setter, inputSetter, inputVal)}
                    className="btn-primary px-3"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
                to="/admin/diseases"
                className="text-sm text-primary-600 hover:underline mb-2 inline-block"
            >
                ← {t('admin.diseases')}
            </Link>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">
                    {isNew ? t('admin.addDisease') : t('admin.editDisease')}
                </h1>
                {!isNew && (
                    <button
                        onClick={handleDelete}
                        disabled={saving}
                        className="btn-danger inline-flex items-center gap-1.5 text-sm"
                    >
                        <Trash2 className="h-4 w-4" /> {t('common.delete')}
                    </button>
                )}
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* Core Fields */}
                <section className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
                    <h2 className="font-semibold text-lg">
                        {t('admin.coreFields')}
                    </h2>

                    {/* Severity */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t('diseases.severity')}
                        </label>
                        <CustomDropdown
                            options={(
                                ['low', 'moderate', 'high', 'critical'] as const
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
                    </div>

                    {/* Disease Type */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t('diseases.diseaseType')}
                        </label>
                        <CustomDropdown
                            options={DISEASE_TYPE_KEYS.map((key) => ({
                                value: key,
                                label: t(`diseaseTypes.${key}`),
                            }))}
                            value={diseaseTypeKey}
                            onChange={setDiseaseTypeKey}
                            placeholder={t('admin.diseaseTypePlaceholder')}
                            ariaLabel={t('diseases.diseaseType')}
                            variant="form"
                        />
                    </div>

                    {/* Disease Images (multi-upload) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t('admin.diseaseImages')}
                        </label>
                        <p className="text-xs text-neutral-400 mb-2">
                            {t('admin.diseaseImagesHint')}
                        </p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                                const files = Array.from(
                                    e.target.files ?? [],
                                ).filter((f) => f.type.startsWith('image/'))
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
                            <div className="flex flex-wrap gap-3 mb-3">
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
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setImageUrls((prev) =>
                                                    prev.filter(
                                                        (_, j) => j !== i,
                                                    ),
                                                )
                                            }
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pending (not yet uploaded) previews */}
                        {pendingPreviews.length > 0 && (
                            <div className="flex flex-wrap gap-3 mb-3">
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
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPendingFiles((prev) =>
                                                    prev.filter(
                                                        (_, j) => j !== i,
                                                    ),
                                                )
                                                setPendingPreviews((prev) =>
                                                    prev.filter(
                                                        (_, j) => j !== i,
                                                    ),
                                                )
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImages}
                            className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-neutral-200 rounded-lg text-sm text-neutral-400 hover:border-primary-400 hover:text-primary-600 transition-colors disabled:opacity-50"
                        >
                            {uploadingImages ? (
                                <>
                                    <LoadingSpinner />
                                    {t('admin.uploadingImage')}
                                </>
                            ) : (
                                <>
                                    <ImageIcon className="h-5 w-5" />
                                    {t('admin.addImage')}
                                </>
                            )}
                        </button>
                    </div>

                    {/* Associated Crop Varieties */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t('admin.linkedVarieties')}
                        </label>
                        {varietyOptions.length === 0 ? (
                            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                                <AlertTriangle className="h-4 w-4 shrink-0" />
                                <span>
                                    {t('admin.noVarietiesYet')}{' '}
                                    <Link
                                        to="/admin/varieties"
                                        className="font-medium underline hover:text-amber-900"
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
                    </div>

                    {/* Associated Remedies */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t('admin.linkedRemedies')}
                        </label>
                        {remedyOptions.length === 0 ? (
                            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                                <AlertTriangle className="h-4 w-4 shrink-0" />
                                <span>
                                    {t('admin.noRemediesYet')}{' '}
                                    <Link
                                        to="/admin/remedies/add"
                                        className="font-medium underline hover:text-amber-900"
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
                    </div>
                </section>

                {/* English */}
                <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                    <h2 className="text-lg font-bold">English</h2>

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
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t('diseases.primaryCause')}
                        </label>
                        <textarea
                            value={enPrimaryCause}
                            onChange={(e) => setEnPrimaryCause(e.target.value)}
                            className="input min-h-16"
                        />
                    </div>

                    {renderChipEditor(
                        t('diseases.symptoms'),
                        enSymptoms,
                        setEnSymptoms,
                        newEnSymptom,
                        setNewEnSymptom,
                        'Add symptom',
                    )}
                    {renderChipEditor(
                        t('diseases.favorableConditions'),
                        enConditions,
                        setEnConditions,
                        newEnCondition,
                        setNewEnCondition,
                        'Add condition',
                    )}
                    {renderChipEditor(
                        t('diseases.preventions'),
                        enPreventions,
                        setEnPreventions,
                        newEnPrevention,
                        setNewEnPrevention,
                        'Add prevention',
                    )}
                    {renderChipEditor(
                        t('diseases.treatments'),
                        enTreatments,
                        setEnTreatments,
                        newEnTreatment,
                        setNewEnTreatment,
                        'Add treatment',
                    )}
                    {renderChipEditor(
                        t('diseases.aliases'),
                        enAliases,
                        setEnAliases,
                        newEnAlias,
                        setNewEnAlias,
                        'Add alias',
                    )}
                </section>

                {/* Telugu */}
                <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">తెలుగు (Telugu)</h2>
                        <button
                            type="button"
                            onClick={handleTranslateToTelugu}
                            disabled={translating || !enName}
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
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t('diseases.primaryCause')}
                        </label>
                        <textarea
                            value={tePrimaryCause}
                            onChange={(e) => setTePrimaryCause(e.target.value)}
                            className="input min-h-16"
                        />
                    </div>

                    {renderChipEditor(
                        t('diseases.symptoms'),
                        teSymptoms,
                        setTeSymptoms,
                        newTeSymptom,
                        setNewTeSymptom,
                        'లక్షణం జోడించండి',
                    )}
                    {renderChipEditor(
                        t('diseases.favorableConditions'),
                        teConditions,
                        setTeConditions,
                        newTeCondition,
                        setNewTeCondition,
                        'పరిస్థితి జోడించండి',
                    )}
                    {renderChipEditor(
                        t('diseases.preventions'),
                        tePreventions,
                        setTePreventions,
                        newTePrevention,
                        setNewTePrevention,
                        'నివారణ జోడించండి',
                    )}
                    {renderChipEditor(
                        t('diseases.treatments'),
                        teTreatments,
                        setTeTreatments,
                        newTeTreatment,
                        setNewTeTreatment,
                        'చికిత్స జోడించండి',
                    )}
                    {renderChipEditor(
                        t('diseases.aliases'),
                        teAliases,
                        setTeAliases,
                        newTeAlias,
                        setNewTeAlias,
                        'మారుపేరు జోడించండి',
                    )}
                </section>

                {/* Actions */}
                {message && (
                    <p
                        className={`text-sm font-medium ${message === t('admin.saved') ? 'text-green-600' : 'text-red-600'}`}
                    >
                        {message}
                    </p>
                )}
                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={saveDisabled}
                        className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="h-4 w-4" />
                        {saving
                            ? t('common.loading')
                            : isNew
                              ? t('common.save')
                              : t('common.update')}
                    </button>
                </div>
            </form>
        </div>
    )
}
