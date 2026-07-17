import { useTranslation } from 'react-i18next'
import { SearchX } from 'lucide-react'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'
import { cn } from '@/utils/cn'

interface EmptyStateProps {
    icon?: React.ReactNode
    title?: string
    description?: string
    action?: React.ReactNode
    className?: string
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    const { t } = useTranslation()

    return (
        <Empty className={cn('border-none py-20', className)}>
            <EmptyHeader>
                <EmptyMedia variant="icon" className="size-16 rounded-xl">
                    {icon || <SearchX className="size-8" />}
                </EmptyMedia>
                <EmptyTitle className="text-lg">
                    {title || t('common.noResults')}
                </EmptyTitle>
                {description && (
                    <EmptyDescription>{description}</EmptyDescription>
                )}
            </EmptyHeader>
            {action && <EmptyContent>{action}</EmptyContent>}
        </Empty>
    )
}
