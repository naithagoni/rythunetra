import type { ReactNode } from 'react'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card'
import { cn } from '@/utils/cn'

interface SectionProps {
    /** Section title (card header). */
    title?: string
    /** Supporting description under the title. */
    description?: string
    /** Optional element rendered top-right of the header (e.g. a small action). */
    headerAction?: ReactNode
    /** Main body content. */
    children: ReactNode
    /** Left-side footer hint text (muted). Rendered only if footer present. */
    footerHint?: ReactNode
    /** Right-side footer action (e.g. Save button). */
    footerAction?: ReactNode
    /** Remove CardContent padding (e.g. to embed a Table edge-to-edge). */
    flush?: boolean
    className?: string
    contentClassName?: string
}

/**
 * Vercel "settings card": a bordered neutral surface with a titled header,
 * a content body, and an optional muted footer action bar (border-top).
 * This is the workhorse layout unit for config forms, detail sections, and
 * any grouped content — replaces ad-hoc bordered divs and saturated panels.
 */
export function Section({
    title,
    description,
    headerAction,
    children,
    footerHint,
    footerAction,
    flush,
    className,
    contentClassName,
}: SectionProps) {
    const hasFooter = footerHint != null || footerAction != null
    return (
        <Card className={cn('gap-0 py-0', className)}>
            {(title || description || headerAction) && (
                <CardHeader className="flex flex-row items-start justify-between gap-4 border-b px-6 py-4">
                    <div className="min-w-0">
                        {title && <CardTitle>{title}</CardTitle>}
                        {description && (
                            <CardDescription className="mt-1">
                                {description}
                            </CardDescription>
                        )}
                    </div>
                    {headerAction && (
                        <div className="shrink-0">{headerAction}</div>
                    )}
                </CardHeader>
            )}
            <CardContent
                className={cn(flush ? 'p-0' : 'p-6', contentClassName)}
            >
                {children}
            </CardContent>
            {hasFooter && (
                <CardFooter className="justify-between gap-4 border-t bg-muted/50 px-6 py-3">
                    <div className="text-sm text-muted-foreground">
                        {footerHint}
                    </div>
                    {footerAction && (
                        <div className="shrink-0">{footerAction}</div>
                    )}
                </CardFooter>
            )}
        </Card>
    )
}
