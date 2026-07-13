import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

export interface LinkGroupItem {
    to: string
    label: string
}

interface LinkGroupProps {
    /** Mono uppercase column heading. */
    heading: string
    items: LinkGroupItem[]
    className?: string
}

/**
 * Footer-style link column: a mono uppercase heading over a vertical list of
 * muted links that brighten on hover. Standardizes footer / link lists.
 */
export function LinkGroup({ heading, items, className }: LinkGroupProps) {
    return (
        <div className={cn('flex flex-col', className)}>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {heading}
            </h3>
            <div className="flex flex-col gap-2.5">
                {items.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
        </div>
    )
}
