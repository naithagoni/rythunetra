import { DiseaseCard } from './DiseaseCard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import type { DiseaseListItem } from '@/types/disease'
import { useTranslation } from 'react-i18next'

interface DiseaseGridProps {
    diseases: DiseaseListItem[] | null | undefined
    loading: boolean
    language: string
}

export function DiseaseGrid({ diseases, loading, language }: DiseaseGridProps) {
    const { t } = useTranslation()

    if (loading) {
        return <LoadingSpinner />
    }

    if (!diseases || diseases.length === 0) {
        return <EmptyState description={t('diseases.noMatchingCriteria')} />
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {diseases.map((disease) => (
                <DiseaseCard
                    key={disease.id}
                    disease={disease}
                    language={language}
                />
            ))}
        </div>
    )
}
