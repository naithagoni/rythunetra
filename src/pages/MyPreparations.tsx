import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getPreparations,
    createPreparation,
    updatePreparation,
    deletePreparation,
} from '@/services/preparationService'
import { PreparationList } from '@/components/preparation/PreparationList'
import { PreparationForm } from '@/components/preparation/PreparationForm'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import type { Preparation, CreatePreparationInput } from '@/types/preparation'

export function MyPreparationsPage() {
    const { t } = useTranslation()
    const { user } = useAuth()
    usePageTitle('My Preparations')
    const queryClient = useQueryClient()

    const [showForm, setShowForm] = useState(false)
    const [editingPreparation, setEditingPreparation] =
        useState<Preparation | null>(null)

    // ─── Queries ──────────────────────────────────────

    const { data: prepsResult, isLoading: prepsLoading } = useQuery({
        queryKey: ['preparations', user?.id],
        queryFn: () => getPreparations(user!.id),
        enabled: !!user,
    })

    const preparations: Preparation[] =
        (prepsResult?.data as Preparation[] | null) ?? []

    // ─── Mutations ────────────────────────────────────

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: ['preparations', user?.id] })

    const addMutation = useMutation({
        mutationFn: (data: CreatePreparationInput) =>
            createPreparation(user!.id, data).then(({ error }) => {
                if (error) throw error
            }),
        onSuccess: invalidate,
    })

    const editMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: CreatePreparationInput
        }) =>
            updatePreparation(id, data).then(({ error }) => {
                if (error) throw error
            }),
        onSuccess: () => {
            invalidate()
            setEditingPreparation(null)
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deletePreparation,
        onSuccess: invalidate,
    })

    // ─── Handlers ─────────────────────────────────────

    const handleAdd = async (data: CreatePreparationInput) => {
        await addMutation.mutateAsync(data)
    }

    const handleEdit = (prep: Preparation) => {
        setEditingPreparation(prep)
        setShowForm(true)
    }

    const handleEditSubmit = async (data: CreatePreparationInput) => {
        if (!editingPreparation) return
        await editMutation.mutateAsync({ id: editingPreparation.id, data })
    }

    const handleCloseForm = () => {
        setShowForm(false)
        setEditingPreparation(null)
    }

    if (prepsLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header Banner */}
            <div className="page-header-banner rounded-2xl mb-6">
                <div className="relative flex items-center justify-between">
                    <div>
                        <h1 className="page-title">
                            {t('preparations.title')}
                        </h1>
                        <p className="text-sm text-neutral-500 mt-1.5">
                            {preparations.length} {t('common.total')}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        {t('preparations.addNew')}
                    </button>
                </div>
            </div>

            {/* Preparations Grid */}
            <PreparationList
                preparations={preparations}
                onDelete={(id) => deleteMutation.mutate(id)}
                onEdit={handleEdit}
            />

            {/* Add/Edit Preparation Form */}
            {showForm && (
                <PreparationForm
                    onSubmit={editingPreparation ? handleEditSubmit : handleAdd}
                    onClose={handleCloseForm}
                    editingPreparation={editingPreparation}
                />
            )}
        </div>
    )
}
