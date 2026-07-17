import { useEffect } from 'react'
import {
    motion,
    useMotionValue,
    useSpring,
    useReducedMotion,
    useMotionTemplate,
} from 'motion/react'

/**
 * Layered hero backdrop (Vercel-style): a faint grid + concentric dashed rings
 * (the innermost pair slowly counter-rotate, with green accent dots orbiting a
 * ring), a two-layer spotlight (neutral cursor glow + faint green ambient wash)
 * that follows the pointer, and a soft cursor-tracking glow dot. All masked to
 * fade at the edges. Falls back to a centered static glow with no animation on
 * touch/coarse pointers or when the user prefers reduced motion. Decorative.
 */
export function HeroBackdrop() {
    const reduce = useReducedMotion()
    const mx = useMotionValue(50)
    const my = useMotionValue(32)
    const x = useSpring(mx, { stiffness: 120, damping: 30, mass: 0.4 })
    const y = useSpring(my, { stiffness: 120, damping: 30, mass: 0.4 })

    useEffect(() => {
        if (reduce) return
        // Only track on fine pointers (mouse), not touch.
        const fine = window.matchMedia('(pointer: fine)')
        if (!fine.matches) return

        const onMove = (e: MouseEvent) => {
            mx.set((e.clientX / window.innerWidth) * 100)
            my.set((e.clientY / window.innerHeight) * 100)
        }
        window.addEventListener('mousemove', onMove)
        return () => window.removeEventListener('mousemove', onMove)
    }, [mx, my, reduce])

    // Two-layer pointer light: a tight neutral core + a wider faint green halo.
    const spotlight = useMotionTemplate`radial-gradient(420px circle at ${x}% ${y}%, var(--hero-glow), transparent 60%), radial-gradient(760px circle at ${x}% ${y}%, var(--hero-accent-soft), transparent 70%)`
    const staticSpotlight =
        'radial-gradient(420px circle at 50% 30%, var(--hero-glow), transparent 60%), radial-gradient(760px circle at 50% 30%, var(--hero-accent-soft), transparent 70%)'

    // Soft glow dot that trails the cursor.
    const glowLeft = useMotionTemplate`${x}%`
    const glowTop = useMotionTemplate`${y}%`

    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
        >
            {/* Grid */}
            <div
                className="absolute inset-0 opacity-70"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, var(--hero-ring) 1px, transparent 1px), linear-gradient(to bottom, var(--hero-ring) 1px, transparent 1px)',
                    backgroundSize: '56px 56px',
                    maskImage:
                        'radial-gradient(ellipse 80% 62% at 50% 34%, black, transparent 76%)',
                    WebkitMaskImage:
                        'radial-gradient(ellipse 80% 62% at 50% 34%, black, transparent 76%)',
                }}
            />

            {/* Concentric rings — masked to fade toward the edges */}
            <div
                className="absolute left-1/2 top-[30%] size-[920px] -translate-x-1/2 -translate-y-1/2"
                style={{
                    maskImage:
                        'radial-gradient(circle at 50% 50%, black 26%, transparent 74%)',
                    WebkitMaskImage:
                        'radial-gradient(circle at 50% 50%, black 26%, transparent 74%)',
                }}
            >
                {/* Static outer rings */}
                <svg
                    className="absolute inset-0 size-full"
                    viewBox="0 0 920 920"
                    fill="none"
                    style={{ color: 'var(--hero-ring)' }}
                >
                    {[300, 380, 452].map((r) => (
                        <circle
                            key={r}
                            cx="460"
                            cy="460"
                            r={r}
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeDasharray="4 6"
                        />
                    ))}
                </svg>

                {/* Slow-spinning dashed ring (clockwise) */}
                <motion.svg
                    className="absolute inset-0 size-full"
                    viewBox="0 0 920 920"
                    fill="none"
                    style={{ color: 'var(--hero-ring-strong)' }}
                    animate={reduce ? undefined : { rotate: 360 }}
                    transition={{
                        duration: 90,
                        ease: 'linear',
                        repeat: Infinity,
                    }}
                >
                    <circle
                        cx="460"
                        cy="460"
                        r="224"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="6 14"
                        strokeLinecap="round"
                    />
                </motion.svg>

                {/* Inner green accent ring + orbiting dots (counter-clockwise) */}
                <motion.svg
                    className="absolute inset-0 size-full"
                    viewBox="0 0 920 920"
                    fill="none"
                    animate={reduce ? undefined : { rotate: -360 }}
                    transition={{
                        duration: 55,
                        ease: 'linear',
                        repeat: Infinity,
                    }}
                >
                    <circle
                        cx="460"
                        cy="460"
                        r="150"
                        stroke="var(--hero-accent)"
                        strokeWidth="2"
                        strokeDasharray="4 14"
                        strokeLinecap="round"
                    />
                    {/* Orbiting accent dots at 0°, 120°, 240° on the r=150 ring */}
                    {[0, 120, 240].map((deg) => {
                        const rad = (deg * Math.PI) / 180
                        return (
                            <circle
                                key={deg}
                                cx={460 + 150 * Math.cos(rad)}
                                cy={460 + 150 * Math.sin(rad)}
                                r="5"
                                fill="var(--hero-accent)"
                            />
                        )
                    })}
                </motion.svg>
            </div>

            {/* Spotlight — neutral core + faint green halo, follows pointer */}
            <motion.div
                className="absolute inset-0"
                style={{ background: reduce ? staticSpotlight : spotlight }}
            />

            {/* Cursor-tracking glow dot (fine pointers only; hidden on reduce) */}
            {!reduce && (
                <motion.div
                    className="absolute hidden size-40 -translate-x-1/2 -translate-y-1/2 rounded-full [@media(pointer:fine)]:block"
                    style={{
                        left: glowLeft,
                        top: glowTop,
                        background:
                            'radial-gradient(circle, var(--hero-accent-soft), transparent 70%)',
                    }}
                />
            )}

            {/* Bottom fade into page */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
        </div>
    )
}
