import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
    adminGetRemedy,
    adminCreateRemedy,
    adminUpdateRemedy,
    adminDeleteRemedy,
    checkDuplicateRemedy,
} from '@/services/adminService'
import { CustomDropdown } from '@/components/common/CustomDropdown'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Save, Plus, X, Languages, Trash2 } from 'lucide-react'
import { translateText, translateBatch } from '@/services/translateService'
import { REMEDY_TYPE_KEYS } from '@/config/remedyTypes'
import type { LocalizedText, LocalizedTextArray } from '@/types/i18n'

export function AdminRemedyFormPage() {
    const { id } = useParams<{ id: string }>()
    const isNew = !id
    const { t } = useTranslation()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    // Name (LocalizedText)
    const [enName, setEnName] = useState('')
    const [teName, setTeName] = useState('')

    // Type (config key)
    const [remedyTypeKey, setRemedyTypeKey] = useState('')

    // How it works (LocalizedText)
    const [enHowItWorks, setEnHowItWorks] = useState('')
    const [teHowItWorks, setTeHowItWorks] = useState('')

    // Usage Instructions (LocalizedText[])
    const [enUsageSteps, setEnUsageSteps] = useState<string[]>([''])
    const [teUsageSteps, setTeUsageSteps] = useState<string[]>([''])

    // Preparation Instructions (LocalizedText[])
    const [enPrepSteps, setEnPrepSteps] = useState<string[]>([''])
    const [tePrepSteps, setTePrepSteps] = useState<string[]>([''])

    // Ingredients (LocalizedText[])
    const [enIngredients, setEnIngredients] = useState<string[]>([])
    const [teIngredients, setTeIngredients] = useState<string[]>([])
    const [newEnIngredient, setNewEnIngredient] = useState('')
    const [newTeIngredient, setNewTeIngredient] = useState('')

    // Aliases (LocalizedTextArray)
    const [enAliases, setEnAliases] = useState<string[]>([])
    const [teAliases, setTeAliases] = useState<string[]>([])
    const [newEnAlias, setNewEnAlias] = useState('')
    const [newTeAlias, setNewTeAlias] = useState('')

    // Core fields
    const [effectiveness, setEffectiveness] = useState('Moderate')

    const [saving, setSaving] = useState(false)
    const [translating, setTranslating] = useState(false)
    const [message, setMessage] = useState('')

    // Validation
    const enNameMissing = !enName.trim()
    const teNameMissing = !teName.trim()
    const saveDisabled = saving || enNameMissing || teNameMissing

    const { data: result, isLoading } = useQuery({
        queryKey: ['admin-remedy', id],
        queryFn: () => adminGetRemedy(id!),
        enabled: !isNew && !!id,
    })

    useEffect(() => {
        if (result?.data) {
            const r = result.data as Record<string, unknown>

            const name = r.name as LocalizedText | undefined
            setEnName(name?.en ?? '')
            setTeName(name?.te ?? '')

            const rtype = r.type as LocalizedText | null
            const matchedKey = REMEDY_TYPE_KEYS.find(
                (k) =>
                    t(`remedyTypes.${k}`, { lng: 'en' }).toLowerCase() ===
                    (rtype?.en ?? '').toLowerCase(),
            )
            setRemedyTypeKey(matchedKey ?? '')

            const hiw = r.how_it_works as LocalizedText | null
            setEnHowItWorks(hiw?.en ?? '')
            setTeHowItWorks(hiw?.te ?? '')

            setEffectiveness((r.effectiveness as string) ?? 'Moderate')

            // LocalizedText[] arrays
            const usage = r.usage_instructions as LocalizedText[] | null
            setEnUsageSteps(usage?.map((u) => u.en) ?? [''])
            setTeUsageSteps(usage?.map((u) => u.te) ?? [''])

            const prep = r.preparation_instructions as LocalizedText[] | null
            setEnPrepSteps(prep?.map((p) => p.en) ?? [''])
            setTePrepSteps(prep?.map((p) => p.te) ?? [''])

            const ings = r.ingredients as LocalizedText[] | null
            setEnIngredients(ings?.map((ig) => ig.en) ?? [])
            setTeIngredients(ings?.map((ig) => ig.te) ?? [])

            const aliases = r.aliases as LocalizedTextArray | null
            setEnAliases(aliases?.en ?? [])
            setTeAliases(aliases?.te ?? [])
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

    const handleTranslateToTelugu = async () => {
        setTranslating(true)
        try {
            const [name, howItWorks, usage, prep, ings, aliases] =
                await Promise.all([
                    translateText(enName),
                    enHowItWorks
                        ? translateText(enHowItWorks)
                        : Promise.resolve(''),
                    translateBatch(enUsageSteps.filter(Boolean)),
                    translateBatch(enPrepSteps.filter(Boolean)),
                    translateBatch(enIngredients),
                    translateBatch(enAliases),
                ])
            setTeName(name)
            setTeHowItWorks(howItWorks)
            setTeUsageSteps(usage.length ? usage : [''])
            setTePrepSteps(prep.length ? prep : [''])
            setTeIngredients(ings.filter(Boolean))
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
            const isDuplicate = await checkDuplicateRemedy(enName, id)
            if (isDuplicate) {
                setMessage(t('errors.duplicateRemedy'))
                setSaving(false)
                return
            }

            const payload = {
                name: { en: enName.trim(), te: teName.trim() },
                type: remedyTypeKey
                    ? {
                          en: t(`remedyTypes.${remedyTypeKey}`, { lng: 'en' }),
                          te: t(`remedyTypes.${remedyTypeKey}`, { lng: 'te' }),
                      }
                    : null,
                how_it_works:
                    enHowItWorks.trim() || teHowItWorks.trim()
                        ? { en: enHowItWorks.trim(), te: teHowItWorks.trim() }
                        : null,
                effectiveness: effectiveness || 'Moderate',
                usage_instructions: zipToLocalizedArray(
                    enUsageSteps,
                    teUsageSteps,
                ),
                preparation_instructions: zipToLocalizedArray(
                    enPrepSteps,
                    tePrepSteps,
                ),
                ingredients: zipToLocalizedArray(enIngredients, teIngredients),
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
                const { error } = await adminCreateRemedy(payload)
                if (error) throw error
            } else {
                const { error } = await adminUpdateRemedy(id!, payload)
                if (error) throw error
            }

            queryClient.invalidateQueries({ queryKey: ['admin-remedy'] })
            queryClient.invalidateQueries({ queryKey: ['admin-remedies'] })
            queryClient.invalidateQueries({ queryKey: ['diseases'] })
            setMessage(t('admin.saved'))

            if (isNew) {
                navigate('/admin/remedies', { replace: true })
            }
        } catch {
            setMessage(t('errors.generic'))
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!id) return
        if (!window.confirm(t('admin.confirmDelete'))) return
        setSaving(true)
        try {
            const { error } = await adminDeleteRemedy(id)
            if (error) throw error
            queryClient.invalidateQueries({ queryKey: ['admin-remedies'] })
            navigate('/admin/remedies', { replace: true })
        } catch {
            setMessage(t('errors.generic'))
        } finally {
            setSaving(false)
        }
    }

    // Dynamic step list helpers
    const updateListItem = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        index: number,
        value: string,
    ) => setter((prev) => prev.map((item, i) => (i === index ? value : item)))

    const addListItem = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
    ) => setter((prev) => [...prev, ''])

    const removeListItem = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        index: number,
    ) => setter((prev) => prev.filter((_, i) => i !== index))

    const renderListEditor = (
        label: string,
        items: string[],
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        placeholder: string,
    ) => (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div className="space-y-2">
                {items.map((item, i) => (
                    <div key={i} className="flex gap-2">
                        <span className="text-sm text-neutral-400 pt-2 w-6 text-right shrink-0">
                            {i + 1}.
                        </span>
                        <input
                            type="text"
                            value={item}
                            onChange={(e) =>
                                updateListItem(setter, i, e.target.value)
                            }
                            className="input flex-1"
                            placeholder={placeholder}
                        />
                        {items.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeListItem(setter, i)}
                                className="text-red-400 hover:text-red-600 pt-2"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <button
                type="button"
                onClick={() => addListItem(setter)}
                className="text-sm text-primary-600 hover:underline mt-1 inline-flex items-center gap-1"
            >
                <Plus className="h-3 w-3" /> Add step
            </button>
        </div>
    )

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
                            onClick={() =>
                                setter((prev) => prev.filter((_, j) => j !== i))
                            }
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
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault()
                            if (inputVal.trim()) {
                                setter((prev) => [...prev, inputVal.trim()])
                                inputSetter('')
                            }
                        }
                    }}
                    className="input flex-1"
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={() => {
                        if (inputVal.trim()) {
                            setter((prev) => [...prev, inputVal.trim()])
                            inputSetter('')
                        }
                    }}
                    className="btn-primary px-3"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>
        </div>
    )

    if (!isNew && isLoading) return <LoadingSpinner />

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
                to="/admin/remedies"
                className="text-sm text-primary-600 hover:underline mb-2 inline-block"
            >
                ← {t('admin.remedies')}
            </Link>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">
                    {isNew ? t('admin.addRemedy') : t('admin.editRemedy')}
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
                <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                    <h2 className="text-lg font-bold">
                        {t('admin.coreFields')}
                    </h2>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t('diseases.effectiveness')}
                        </label>
                        <CustomDropdown
                            options={[
                                { value: 'High', label: 'High' },
                                { value: 'Moderate', label: 'Moderate' },
                                { value: 'Low', label: 'Low' },
                            ]}
                            value={effectiveness}
                            onChange={setEffectiveness}
                            placeholder={t('diseases.effectiveness')}
                            ariaLabel={t('diseases.effectiveness')}
                            variant="form"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t('admin.remedyType')}
                        </label>
                        <CustomDropdown
                            options={REMEDY_TYPE_KEYS.map((k) => ({
                                value: k,
                                label: t(`remedyTypes.${k}`),
                            }))}
                            value={remedyTypeKey}
                            onChange={setRemedyTypeKey}
                            placeholder={t('admin.remedyTypePlaceholder')}
                            ariaLabel={t('admin.remedyType')}
                            variant="form"
                        />
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
                            {t('remedies.howItWorks')}
                        </label>
                        <textarea
                            value={enHowItWorks}
                            onChange={(e) => setEnHowItWorks(e.target.value)}
                            className="input min-h-20"
                        />
                    </div>

                    {renderListEditor(
                        t('remedies.preparationInstructions'),
                        enPrepSteps,
                        setEnPrepSteps,
                        'Step description',
                    )}
                    {renderListEditor(
                        t('remedies.usage'),
                        enUsageSteps,
                        setEnUsageSteps,
                        'Usage step',
                    )}
                    {renderChipEditor(
                        t('remedies.ingredients'),
                        enIngredients,
                        setEnIngredients,
                        newEnIngredient,
                        setNewEnIngredient,
                        'Add ingredient',
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
                            {t('remedies.howItWorks')}
                        </label>
                        <textarea
                            value={teHowItWorks}
                            onChange={(e) => setTeHowItWorks(e.target.value)}
                            className="input min-h-20"
                        />
                    </div>

                    {renderListEditor(
                        t('remedies.preparationInstructions'),
                        tePrepSteps,
                        setTePrepSteps,
                        'దశ వివరణ',
                    )}
                    {renderListEditor(
                        t('remedies.usage'),
                        teUsageSteps,
                        setTeUsageSteps,
                        'వాడకం దశ',
                    )}
                    {renderChipEditor(
                        t('remedies.ingredients'),
                        teIngredients,
                        setTeIngredients,
                        newTeIngredient,
                        setNewTeIngredient,
                        'పదార్థం జోడించండి',
                    )}
                    {renderChipEditor(
                        t('diseases.aliases'),
                        teAliases,
                        setTeAliases,
                        newTeAlias,
                        setNewTeAlias,
                        'మారు పేరు',
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
