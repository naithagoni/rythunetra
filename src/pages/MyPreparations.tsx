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
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/common/PageHeader'
import { PageContainer } from '@/components/common/PageContainer'

export function MyPreparationsPage() {
    const { t } = useTranslation()
    const { user } = useAuth()
    usePageTitle('My Preparations')
    const queryClient = useQueryClient()

    const [showForm, setShowForm] = useState(false)
    const [editingPreparation, setEditingPreparation] =
        useState<Preparation | null>(null)

    const { data: prepsResult, isLoading: prepsLoading } = useQuery({
        queryKey: ['preparations', user?.id],
        queryFn: () => getPreparations(user!.id),
        enabled: !!user,
    })

    const preparations: Preparation[] =
        (prepsResult?.data as Preparation[] | null) ?? []

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
        <PageContainer size="md">
            <PageHeader
                title={t('preparations.title')}
                description={`${preparations.length} ${t('common.total')}`}
                action={
                    <Button onClick={() => setShowForm(true)}>
                        <Plus data-icon="inline-start" />
                        {t('preparations.addNew')}
                    </Button>
                }
            />

            <PreparationList
                preparations={preparations}
                onDelete={(id) => deleteMutation.mutate(id)}
                onEdit={handleEdit}
            />

            {showForm && (
                <PreparationForm
                    onSubmit={editingPreparation ? handleEditSubmit : handleAdd}
                    onClose={handleCloseForm}
                    editingPreparation={editingPreparation}
                />
            )}
        </PageContainer>
    )
}
