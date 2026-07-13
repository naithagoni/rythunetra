import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface ToolbarProps {
    /** Left cluster — typically a search input (grows to fill). */
    start?: ReactNode
    /** Right cluster — typically action buttons / filters. */
    end?: ReactNode
    className?: string
}

/**
 * Collection toolbar: search/primary control on the left (grows), actions on
 * the right. Standard Vercel pattern above a grid or table.
 */
export function Toolbar({ start, end, className }: ToolbarProps) {
    return (
        <div className={cn('mb-6 flex items-center gap-2', className)}>
            {start && <div className="min-w-0 flex-1">{start}</div>}
            {end && <div className="flex shrink-0 items-center gap-2">{end}</div>}
        </div>
    )
}
