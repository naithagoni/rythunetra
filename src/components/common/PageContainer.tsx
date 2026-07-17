import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface PageContainerProps {
    children: ReactNode
    /** Max width of the content column. Defaults to Geist's roomy default. */
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}

const widths: Record<NonNullable<PageContainerProps['size']>, string> = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-7xl',
}

/**
 * Standard Geist page column: centered, responsive side padding, vertical
 * rhythm. Wrap interior pages so they share one width + padding scale.
 */
export function PageContainer({
    children,
    size = 'lg',
    className,
}: PageContainerProps) {
    return (
        <div
            className={cn(
                'mx-auto px-4 sm:px-6 lg:px-8 py-8',
                widths[size],
                className,
            )}
        >
            {children}
        </div>
    )
}
