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
                strokeWidth="2.4"
            />

            {/* Central pipe divider — A | N (taller, with generous breathing
                room on each side so the letters sit well clear of it) */}
            <line
                x1="24"
                y1="9"
                x2="24"
                y2="39"
                stroke={color}
                strokeWidth="2.6"
                strokeLinecap="round"
            />

            <g
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {/* "A" — apex at top; inner (right) leg straight down toward the
                    pipe, outer (left) leg curves out to echo the ring but stays
                    inset from it (~5px); crossbar joins the two. */}
                <path d="M16 13 L19.5 35" />
                <path d="M16 13 Q7.5 24 10.5 35" />
                <path d="M11.5 26.5 L18 26.5" />

                {/* "N" — inner (left) vertical near the pipe, diagonal, and the
                    outer (right) vertical leg bowed out to mirror the "A" while
                    staying inset from the ring (no longer touching it). */}
                <path d="M28.5 35 L28.5 13" />
                <path d="M28.5 13 L37.5 35" />
                <path d="M37.5 13 Q40.5 24 37.5 35" />
            </g>
        </svg>
    )
}
