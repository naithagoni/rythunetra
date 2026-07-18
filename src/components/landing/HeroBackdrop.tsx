import { useEffect } from 'react'
import {
    motion,
    useMotionValue,
    useSpring,
    useReducedMotion,
    useMotionTemplate,
} from 'motion/react'
import { NetworkGlobe } from './NetworkGlobe'

/**
 * Layered hero backdrop: a faint grid + an animated 3D network-globe sphere
 * (rotating point mesh, depth-shaded), a two-layer spotlight (neutral cursor
 * glow + faint green ambient wash) that follows the pointer, and a soft
 * cursor-tracking glow dot. All masked to fade at the edges. Falls back to a
 * static globe pose + centered glow on reduced-motion. Decorative.
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

            {/* Animated 3D network-globe sphere (replaces the concentric rings) */}
            <NetworkGlobe />

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
