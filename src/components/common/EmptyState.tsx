import { useTranslation } from 'react-i18next'
import { SearchX } from 'lucide-react'
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
        <div
            className={cn(
                'flex flex-col items-center justify-center py-20 px-4 text-center',
                className,
            )}
        >
            <div className="mb-5 w-16 h-16 rounded-xl bg-white/[0.06] flex items-center justify-center text-neutral-500">
                {icon || <SearchX className="h-8 w-8" />}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">
                {title || t('common.noResults')}
            </h3>
            {description && (
                <p className="text-sm text-neutral-400 max-w-md mb-6 leading-relaxed">
                    {description}
                </p>
            )}
            {action}
        </div>
    )
}
