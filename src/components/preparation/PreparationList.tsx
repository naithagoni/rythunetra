import { useTranslation } from 'react-i18next'
import { PreparationCard } from './PreparationCard'
import { EmptyState } from '@/components/common/EmptyState'
import { ClipboardList } from 'lucide-react'
import type { Preparation } from '@/types/preparation'

interface PreparationListProps {
    preparations: Preparation[]
    onDelete?: (id: string) => void
    onEdit?: (preparation: Preparation) => void
}

export function PreparationList({
    preparations,
    onDelete,
    onEdit,
}: PreparationListProps) {
    const { t } = useTranslation()

    if (preparations.length === 0) {
        return (
            <EmptyState
                icon={<ClipboardList className="size-12" />}
                title={t('preparations.noPreparations')}
            />
        )
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {preparations.map((prep) => (
                <PreparationCard
                    key={prep.id}
                    preparation={prep}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    )
}
