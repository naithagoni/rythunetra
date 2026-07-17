import { cn } from '@/utils/cn'

interface LogoMarkProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
    /**
     * `default` — Forest Ink strokes for the Linen canvas.
     * `light`   — Linen strokes for dark bands (footer, scrims).
     */
    variant?: 'default' | 'light'
}

/**
 * RythuNetra brand mark — the custom "A | N" specimen logo per DESIGN.md
 * §"Custom Logo creation":
 *   • a clean outer circle frame housing everything
 *   • a single central pipe dividing the field into  A | N
 *   • the "A" whose outer/left leg curves to follow the circle's left inner
 *     boundary, and the "N" whose rightmost leg mirrors it on the right
 *   • rendered on a transparent background (no fill plate) so it drops onto
 *     any surface.
 *
 * Purely stroked (1px-weight family, Sage-Gray-adjacent), matching the flat,
 * hairline specimen aesthetic. Color follows the currentColor of `variant`.
 */
export function LogoMark({
    size = 'md',
    className,
    variant = 'default',
}: LogoMarkProps) {
    const box = {
        sm: 'size-8',
        md: 'size-9',
        lg: 'size-11',
    }[size]

    // Forest Ink on light surfaces; Linen on dark bands.
    const color = variant === 'light' ? '#f8f9f5' : '#0a1d08'

    return (
        <svg
            viewBox="0 0 48 48"
            className={cn(box, 'shrink-0', className)}
            role="img"
            aria-label="RythuNetra"
            fill="none"
        >
            {/* Outer circle frame */}
            <circle
                cx="24"
                cy="24"
                r="22"
                stroke={color}
                strokeWidth="2"
            />

            {/* Central pipe divider — A | N */}
            <line
                x1="24"
                y1="12.5"
                x2="24"
                y2="35.5"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
            />

            <g
                stroke={color}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {/* "A" — both legs meet at a shared apex; the inner (right) leg
                    runs straight toward the pipe, the outer (left) leg curves
                    out to follow the circle's left inner boundary; crossbar
                    joins the two. */}
                <path d="M18.5 13 Q9.5 23 11.5 35" />
                <path d="M18.5 13 L21 35" />
                <path d="M13.6 26 L20.3 26" />

                {/* "N" — left vertical + diagonal, and the rightmost leg curving
                    to mirror the circle's right inner boundary. */}
                <path d="M27.5 35 L27.5 13" />
                <path d="M27.5 13 L36.5 35" />
                <path d="M36.5 13 Q45 24 36.5 35" />
            </g>
        </svg>
    )
}
