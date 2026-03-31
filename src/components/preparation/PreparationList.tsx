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
                icon={<ClipboardList className="h-12 w-12" />}
                title={t('preparations.noPreparations')}
            />
        )
    }

    const gridClass =
        preparations.length === 1
            ? 'grid gap-4 grid-cols-1'
            : 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

    return (
        <div className={gridClass}>
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
