import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDisease } from '@/hooks/useDiseases'
import { useLanguage } from '@/hooks/useLanguage'
import { usePageTitle } from '@/hooks/usePageTitle'
import { DiseaseDetail } from '@/components/disease/DiseaseDetail'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { PageContainer } from '@/components/common/PageContainer'
import { AlertTriangle, ChevronLeft } from 'lucide-react'
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
                    icon={<AlertTriangle className="size-12" />}
                    title={t('errors.notFound')}
                />
            </div>
        )
    }

    return (
        <PageContainer size="md">
            <Link
                to="/diseases"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <ChevronLeft className="size-4" />
                {t('diseases.title')}
            </Link>
            <DiseaseDetail disease={disease} language={currentLanguage} />
        </PageContainer>
    )
}
