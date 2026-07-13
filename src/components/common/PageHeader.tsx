import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface PageHeaderProps {
    /** Page title — rendered at display-md. */
    title: string
    /** Optional supporting description below the title. */
    description?: string
    /** Optional primary action(s), right-aligned on the title row. */
    action?: ReactNode
    /** Optional breadcrumb / back link rendered above the title. */
    backTo?: string
    /** Label for the back link (defaults to "Back"). */
    backLabel?: string
    className?: string
}

/**
 * Geist interior-page header: left-aligned title + description with an
 * optional right-aligned action, sitting on a thin bottom border. Replaces
 * the old centered `.page-header-banner` band. Use at the top of every
 * interior/tool/admin page inside a page container.
 */
export function PageHeader({
    title,
    description,
    action,
    backTo,
    backLabel = 'Back',
    className,
}: PageHeaderProps) {
    return (
        <div className={cn('border-b border-border pb-5 mb-8', className)}>
            {backTo && (
                <Link
                    to={backTo}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
                >
                    <ChevronLeft className="size-4" />
                    {backLabel}
                </Link>
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-display-md text-foreground">{title}</h1>
                    {description && (
                        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
                            {description}
                        </p>
                    )}
                </div>
                {action && (
                    <div className="flex shrink-0 items-center gap-2">
                        {action}
                    </div>
                )}
            </div>
        </div>
    )
}
