import { Link } from 'react-router-dom'
import type { ComponentProps } from 'react'
import { cn } from '@/utils/cn'

const base =
    'text-link underline-offset-4 hover:underline transition-colors'

/** Inline text link (internal, react-router). Geist blue, underline on hover. */
export function InlineLink({
    className,
    ...props
}: ComponentProps<typeof Link>) {
    return <Link className={cn(base, className)} {...props} />
}

/** Inline text link for external URLs. */
export function ExternalLink({
    className,
    ...props
}: ComponentProps<'a'>) {
    return (
        <a
            className={cn(base, className)}
            target="_blank"
            rel="noreferrer noopener"
            {...props}
        />
    )
}
