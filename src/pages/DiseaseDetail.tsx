import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDisease } from '@/hooks/useDiseases'
import { useLanguage } from '@/hooks/useLanguage'
import { usePageTitle } from '@/hooks/usePageTitle'
import { DiseaseDetail } from '@/components/disease/DiseaseDetail'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toDisease } from '@/types/disease'
import { localize } from '@/types/i18n'
import type { LanguageCode } from '@/types/i18n'
import type { DiseaseRow } from '@/types/disease'

export function DiseaseDetailPage() {
    const { id } = useParams<{ id: string }>()
    const { currentLanguage } = useLanguage()
    const { t } = useTranslation()
    const { data: result, isLoading, error } = useDisease(id || '')

    const disease = useMemo(
        () => (result?.data ? toDisease(result.data as DiseaseRow) : null),
        [result],
    )
    usePageTitle(disease ? localize(disease.name, currentLanguage as LanguageCode) : undefined)

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    if (error || !disease) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16">
                <EmptyState
                    icon={<AlertTriangle className="h-12 w-12" />}
                    title={t('errors.notFound')}
                />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="page-header-banner rounded-2xl mb-6">
                <div className="relative">
                    <Link
                        to="/diseases"
                        className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                        ← {t('diseases.title')}
                    </Link>
                </div>
            </div>
            <DiseaseDetail disease={disease} language={currentLanguage} />
        </div>
    )
}
