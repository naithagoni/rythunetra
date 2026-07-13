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
import { PageHeader } from '@/components/common/PageHeader'
import { PageContainer } from '@/components/common/PageContainer'
import { Save, Plus, X, Languages, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Field,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field'
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
            toast.error(t('admin.translateFailed'))
        } finally {
            setTranslating(false)
        }
    }

    const handleSave = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const isDuplicate = await checkDuplicateRemedy(enName, id)
            if (isDuplicate) {
                toast.error(t('errors.duplicateRemedy'))
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
            toast.success(t('admin.saved'))

            if (isNew) {
                navigate('/admin/remedies', { replace: true })
            }
        } catch {
            toast.error(t('errors.generic'))
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
            toast.error(t('errors.generic'))
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
        <Field>
            <FieldLabel>{label}</FieldLabel>
            {items.map((item, i) => (
                <div key={i} className="flex gap-2">
                    <span className="text-sm text-muted-foreground pt-2 w-6 text-right shrink-0">
                        {i + 1}.
                    </span>
                    <Input
                        type="text"
                        value={item}
                        onChange={(e) =>
                            updateListItem(setter, i, e.target.value)
                        }
                        className="flex-1"
                        placeholder={placeholder}
                    />
                    {items.length > 1 && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeListItem(setter, i)}
                            aria-label={t('common.delete')}
                        >
                            <X />
                        </Button>
                    )}
                </div>
            ))}
            <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => addListItem(setter)}
                className="w-fit px-0"
            >
                <Plus data-icon="inline-start" /> Add step
            </Button>
        </Field>
    )

    /** Reusable chip-list editor */
    const renderChipEditor = (
        label: string,
        items: string[],
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        inputVal: string,
        inputSetter: React.Dispatch<React.SetStateAction<string>>,
        placeholder: string,
        inputId: string,
    ) => (
        <Field>
            <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
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
                            onClick={() =>
                                setter((prev) => prev.filter((_, j) => j !== i))
                            }
                            aria-label={t('common.delete')}
                        >
                            <X />
                        </Button>
                    </span>
                ))}
            </div>
            <div className="flex gap-2">
                <Input
                    id={inputId}
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
                    className="flex-1"
                    placeholder={placeholder}
                />
                <Button
                    type="button"
                    size="icon"
                    onClick={() => {
                        if (inputVal.trim()) {
                            setter((prev) => [...prev, inputVal.trim()])
                            inputSetter('')
                        }
                    }}
                    aria-label={placeholder}
                >
                    <Plus />
                </Button>
            </div>
        </Field>
    )

    if (!isNew && isLoading) return <LoadingSpinner />

    return (
        <PageContainer size="md">
            <PageHeader
                backTo="/admin/remedies"
                backLabel={t('admin.remedies')}
                title={isNew ? t('admin.addRemedy') : t('admin.editRemedy')}
                action={
                    !isNew && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={handleDelete}
                            disabled={saving}
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
                            <Field>
                                <FieldLabel>
                                    {t('diseases.effectiveness')}
                                </FieldLabel>
                                <CustomDropdown
                                    options={[
                                        { value: 'High', label: 'High' },
                                        {
                                            value: 'Moderate',
                                            label: 'Moderate',
                                        },
                                        { value: 'Low', label: 'Low' },
                                    ]}
                                    value={effectiveness}
                                    onChange={setEffectiveness}
                                    placeholder={t('diseases.effectiveness')}
                                    ariaLabel={t('diseases.effectiveness')}
                                    variant="form"
                                />
                            </Field>

                            <Field>
                                <FieldLabel>
                                    {t('admin.remedyType')}
                                </FieldLabel>
                                <CustomDropdown
                                    options={REMEDY_TYPE_KEYS.map((k) => ({
                                        value: k,
                                        label: t(`remedyTypes.${k}`),
                                    }))}
                                    value={remedyTypeKey}
                                    onChange={setRemedyTypeKey}
                                    placeholder={t(
                                        'admin.remedyTypePlaceholder',
                                    )}
                                    ariaLabel={t('admin.remedyType')}
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
                                <FieldLabel htmlFor="remedy-en-name">
                                    {t('admin.name')}{' '}
                                    <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                    id="remedy-en-name"
                                    type="text"
                                    value={enName}
                                    onChange={(e) => setEnName(e.target.value)}
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="remedy-en-howitworks">
                                    {t('remedies.howItWorks')}
                                </FieldLabel>
                                <Textarea
                                    id="remedy-en-howitworks"
                                    value={enHowItWorks}
                                    onChange={(e) =>
                                        setEnHowItWorks(e.target.value)
                                    }
                                    className="min-h-20"
                                />
                            </Field>

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
                                'remedy-en-ingredient',
                            )}
                            {renderChipEditor(
                                t('diseases.aliases'),
                                enAliases,
                                setEnAliases,
                                newEnAlias,
                                setNewEnAlias,
                                'Add alias',
                                'remedy-en-alias',
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
                                <FieldLabel htmlFor="remedy-te-name">
                                    {t('admin.name')}{' '}
                                    <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                    id="remedy-te-name"
                                    type="text"
                                    value={teName}
                                    onChange={(e) => setTeName(e.target.value)}
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="remedy-te-howitworks">
                                    {t('remedies.howItWorks')}
                                </FieldLabel>
                                <Textarea
                                    id="remedy-te-howitworks"
                                    value={teHowItWorks}
                                    onChange={(e) =>
                                        setTeHowItWorks(e.target.value)
                                    }
                                    className="min-h-20"
                                />
                            </Field>

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
                                'remedy-te-ingredient',
                            )}
                            {renderChipEditor(
                                t('diseases.aliases'),
                                teAliases,
                                setTeAliases,
                                newTeAlias,
                                setNewTeAlias,
                                'మారు పేరు',
                                'remedy-te-alias',
                            )}
                        </FieldGroup>
                    </CardContent>
                </Card>

                {/* Save-bar */}
                <div className="sticky bottom-0 -mx-4 sm:-mx-6 lg:-mx-8 flex items-center justify-end gap-2 border-t border-border bg-background/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3">
                    <Button asChild variant="secondary" type="button">
                        <Link to="/admin/remedies">{t('common.cancel')}</Link>
                    </Button>
                    <Button type="submit" disabled={saveDisabled}>
                        <Save data-icon="inline-start" />
                        {saving
                            ? t('common.loading')
                            : isNew
                              ? t('common.save')
                              : t('common.update')}
                    </Button>
                </div>
            </form>
        </PageContainer>
    )
}
