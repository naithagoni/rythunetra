import { useTranslation } from 'react-i18next'
import { usePageTitle } from '@/hooks/usePageTitle'
import { PageHeader } from '@/components/common/PageHeader'
import { PageContainer } from '@/components/common/PageContainer'
import { ScanFlow } from '@/components/scan/ScanFlow'

export function ScannerPage() {
    const { t } = useTranslation()
    usePageTitle('Disease Scanner — AI Crop Analysis')

    return (
        <PageContainer size="sm">
            <PageHeader
                title={t('scanner.title')}
                description={t('scanner.subtitle')}
            />
            <ScanFlow />
        </PageContainer>
    )
}
