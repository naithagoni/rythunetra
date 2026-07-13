import { useEffect } from 'react'
import {
    motion,
    useMotionValue,
    useSpring,
    useReducedMotion,
    useMotionTemplate,
} from 'motion/react'

/**
 * Layered hero backdrop (Vercel-style): a faint concentric-rings + grid
 * pattern masked to fade at the edges, with a blue spotlight glow that
 * follows the cursor. Falls back to a centered static glow when the pointer
 * is coarse (touch) or the user prefers reduced motion. Purely decorative.
 */
export function HeroBackdrop() {
    const reduce = useReducedMotion()
    const mx = useMotionValue(50)
    const my = useMotionValue(35)
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

    const spotlight = useMotionTemplate`radial-gradient(500px circle at ${x}% ${y}%, var(--hero-glow), transparent 65%)`
    const staticSpotlight =
        'radial-gradient(500px circle at 50% 30%, var(--hero-glow), transparent 65%)'

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
                        'radial-gradient(ellipse 80% 60% at 50% 35%, black, transparent 75%)',
                    WebkitMaskImage:
                        'radial-gradient(ellipse 80% 60% at 50% 35%, black, transparent 75%)',
                }}
            />
            {/* Concentric rings */}
            <svg
                className="absolute left-1/2 top-[30%] size-[900px] -translate-x-1/2 -translate-y-1/2"
                viewBox="0 0 900 900"
                fill="none"
                style={{
                    color: 'var(--hero-ring)',
                    maskImage:
                        'radial-gradient(circle at 50% 50%, black 30%, transparent 72%)',
                    WebkitMaskImage:
                        'radial-gradient(circle at 50% 50%, black 30%, transparent 72%)',
                }}
            >
                {[120, 240, 360, 440].map((r) => (
                    <circle
                        key={r}
                        cx="450"
                        cy="450"
                        r={r}
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeDasharray="4 5"
                    />
                ))}
            </svg>
            {/* Spotlight */}
            <motion.div
                className="absolute inset-0"
                style={{ background: reduce ? staticSpotlight : spotlight }}
            />
            {/* Bottom fade into page */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
        </div>
    )
}
