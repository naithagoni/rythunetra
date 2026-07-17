import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface GridFrameProps {
    children: ReactNode
    className?: string
}

/**
 * Wraps content with faint crossing hairlines that bleed past the edges and
 * fade out — the Vercel "resources meta" framing. Purely decorative.
 */
export function GridFrame({ children, className }: GridFrameProps) {
    return (
        <div className={cn('relative', className)}>
            {/* Horizontal hairline */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-[-100vw] top-0 h-px bg-border"
                style={{
                    maskImage:
                        'linear-gradient(to right, transparent, black 30%, black 70%, transparent)',
                    WebkitMaskImage:
                        'linear-gradient(to right, transparent, black 30%, black 70%, transparent)',
                }}
            />
            {/* Vertical hairlines at the content edges */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-y-[-100vh] left-0 w-px bg-border"
                style={{
                    maskImage:
                        'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)',
                    WebkitMaskImage:
                        'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)',
                }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-y-[-100vh] right-0 w-px bg-border"
                style={{
                    maskImage:
                        'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)',
                    WebkitMaskImage:
                        'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)',
                }}
            />
            {children}
        </div>
    )
}
