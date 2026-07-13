import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

type Tone = 'neutral' | 'blue' | 'green' | 'amber' | 'red'

interface InfoCalloutProps {
    /** Status tone — drives only a small icon/accent, never a full fill. */
    tone?: Tone
    /** Leading icon (lucide element). */
    icon?: ReactNode
    /** Bold title line. */
    title?: ReactNode
    /** Body content. */
    children?: ReactNode
    /** Optional trailing element (e.g. a badge or link), right-aligned. */
    action?: ReactNode
    className?: string
}

/** Icon/accent color per tone (text only — surface stays neutral). */
const toneIcon: Record<Tone, string> = {
    neutral: 'text-muted-foreground',
    blue: 'text-blue-900',
    green: 'text-green-900',
    amber: 'text-amber-900',
    red: 'text-red-900',
}

/**
 * Vercel-restrained callout: a neutral bordered surface (`bg-muted/40`) with a
 * small colored status icon — replaces the old saturated `bg-*-100 border-*-400`
 * full-fill panels. Color signals state via the icon, not the whole block.
 */
export function InfoCallout({
    tone = 'neutral',
    icon,
    title,
    children,
    action,
    className,
}: InfoCalloutProps) {
    return (
        <div
            className={cn(
                'flex gap-3 rounded-lg border border-border bg-muted/40 p-4',
                className,
            )}
        >
            {icon && (
                <span className={cn('mt-0.5 shrink-0', toneIcon[tone])}>
                    {icon}
                </span>
            )}
            <div className="min-w-0 flex-1">
                {title && (
                    <p className="text-sm font-medium text-foreground">
                        {title}
                    </p>
                )}
                {children && (
                    <div
                        className={cn(
                            'text-sm text-muted-foreground',
                            title && 'mt-1',
                        )}
                    >
                        {children}
                    </div>
                )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    )
}
