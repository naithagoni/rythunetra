import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Decorative 3D network-globe canvas for the hero backdrop.
 *
 * Points are distributed on a unit sphere (Fibonacci lattice) and connected by
 * a fixed mesh of short great-circle edges (precomputed once — the sphere is a
 * rigid body, so neighbours never change). Each frame the sphere rotates slowly
 * around the Y axis (with a gentle fixed tilt); points/edges are perspective-
 * projected to 2D and depth-shaded so the back of the globe fades away.
 *
 * No 3D library — plain canvas + requestAnimationFrame. Colours are read from
 * the design tokens (sage-leaf / sage-gray) so it tracks the palette. Honours
 * prefers-reduced-motion (renders a single static frame). Purely decorative;
 * pointer-events are disabled by the parent.
 */
export function NetworkGlobe() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const reduce = useReducedMotion()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // ── Resolve colours from CSS tokens (soft on-theme sage tones) ──
        const css = getComputedStyle(document.documentElement)
        const nodeColor =
            css.getPropertyValue('--sage-mist').trim() || '#a5ac9f'
        const lineColor =
            css.getPropertyValue('--eucalyptus').trim() || '#c9d5c5'

        // ── Build sphere points (Fibonacci lattice) ──
        const N = 150
        const pts: { x: number; y: number; z: number }[] = []
        const golden = Math.PI * (3 - Math.sqrt(5))
        for (let i = 0; i < N; i++) {
            const y = 1 - (i / (N - 1)) * 2 // 1 → -1
            const r = Math.sqrt(1 - y * y)
            const theta = golden * i
            pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r })
        }

        // ── Precompute edges: connect points within an angular threshold ──
        // (dot product > cos(threshold)). Keeps a sparse, even mesh.
        const edges: [number, number][] = []
        const cosThreshold = Math.cos(0.5) // ~28.6°
        for (let i = 0; i < N; i++) {
            for (let j = i + 1; j < N; j++) {
                const d =
                    pts[i].x * pts[j].x +
                    pts[i].y * pts[j].y +
                    pts[i].z * pts[j].z
                if (d > cosThreshold) edges.push([i, j])
            }
        }

        // Fixed tilt so the globe reads as 3D (not a flat disc).
        const tiltX = -0.42
        const sinT = Math.sin(tiltX)
        const cosT = Math.cos(tiltX)

        // Screen-plane ROLL — tilts the spin axis so the equator travels along
        // a diagonal instead of horizontally. 0° = left↔right; 45° lays the
        // equator along the 11 o'clock → 4 o'clock diagonal (60° would be the
        // steeper 11→5 diameter). Flip the sign to mirror the diagonal
        // (1↔8 o'clock); reverse `angle` in loop() to swap travel direction.
        const roll = (15 * Math.PI) / 180
        const cosR = Math.cos(roll)
        const sinR = Math.sin(roll)

        let raf = 0
        let angle = 0
        let w = 0
        let h = 0
        let dpr = 1
        let cx = 0
        let cy = 0
        let radius = 0 // current (eased) radius
        let targetRadius = 0 // where radius is heading after a resize

        // Fluid size fraction: the globe takes a LARGER share of the smaller
        // dimension on phones (so it stays prominent) and eases down to a
        // calmer share on desktop. Interpolated by width — no breakpoint jump.
        const radiusFraction = (width: number) => {
            const t = Math.max(0, Math.min(1, (width - 360) / (1280 - 360)))
            return 0.78 + (0.56 - 0.78) * t // 0.78 @360px → 0.56 @1280px
        }

        const resize = () => {
            const rect = canvas.getBoundingClientRect()
            w = rect.width
            h = rect.height
            dpr = Math.min(window.devicePixelRatio || 1, 2)
            canvas.width = Math.round(w * dpr)
            canvas.height = Math.round(h * dpr)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            cx = w / 2
            cy = h * 0.34 // sit where the old rings were
            targetRadius = Math.min(w, h) * radiusFraction(w)
            // First measure (or reduced-motion) snaps; later resizes ease.
            if (radius === 0) radius = targetRadius
        }

        const project = (p: { x: number; y: number; z: number }) => {
            // Rotate around Y, then apply the fixed X tilt.
            const cosA = Math.cos(angle)
            const sinA = Math.sin(angle)
            const rx = p.x * cosA - p.z * sinA
            const rz = p.x * sinA + p.z * cosA
            const ry = p.y * cosT - rz * sinT
            const rzz = p.y * sinT + rz * cosT // depth: +front, -back
            // Perspective — nearer points spread slightly wider.
            const persp = 1 / (1.9 - rzz * 0.5)
            // Roll the projected point in the screen plane so the spin reads as
            // a diagonal (11→5 o'clock). Depth (rzz) is unaffected by a 2D roll.
            const px = rx * persp
            const py = ry * persp
            return {
                sx: cx + (px * cosR - py * sinR) * radius,
                sy: cy + (px * sinR + py * cosR) * radius,
                depth: rzz, // -1 (far) → 1 (near)
            }
        }

        const draw = () => {
            ctx.clearRect(0, 0, w, h)
            const proj = pts.map(project)

            // Edges — depth-shaded lines.
            for (const [a, b] of edges) {
                const pa = proj[a]
                const pb = proj[b]
                const avg = (pa.depth + pb.depth) / 2 // -1..1
                // Fade the back hemisphere; keep the front crisp-ish but soft.
                const alpha = Math.max(0, (avg + 1) / 2) * 0.28 + 0.02
                ctx.strokeStyle = hexA(lineColor, alpha)
                ctx.lineWidth = 1
                ctx.beginPath()
                ctx.moveTo(pa.sx, pa.sy)
                ctx.lineTo(pb.sx, pb.sy)
                ctx.stroke()
            }

            // Nodes — depth-shaded dots.
            for (const p of proj) {
                const t = (p.depth + 1) / 2 // 0 far → 1 near
                const alpha = t * 0.7 + 0.12
                const rr = 0.7 + t * 1.6
                ctx.fillStyle = hexA(nodeColor, alpha)
                ctx.beginPath()
                ctx.arc(p.sx, p.sy, rr, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        const loop = () => {
            angle -= 0.0016
            // Ease the radius toward its target so a viewport/orientation
            // change grows/shrinks the globe smoothly instead of snapping.
            radius += (targetRadius - radius) * 0.06
            draw()
            raf = requestAnimationFrame(loop)
        }

        resize()
        window.addEventListener('resize', resize)

        if (reduce) {
            angle = 0.6 // a pleasant static pose
            draw()
        } else {
            raf = requestAnimationFrame(loop)
        }

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('resize', resize)
        }
    }, [reduce])

    return (
        <canvas
            ref={canvasRef}
            aria-hidden
            className="absolute inset-0 size-full"
            style={{
                maskImage:
                    'radial-gradient(circle at 50% 34%, black 52%, transparent 85%)',
                WebkitMaskImage:
                    'radial-gradient(circle at 50% 34%, black 52%, transparent 85%)',
            }}
        />
    )
}

/** Apply an alpha to a hex or oklch color string. */
function hexA(color: string, alpha: number): string {
    const a = Math.max(0, Math.min(1, alpha))
    if (color.startsWith('#')) {
        let hex = color.slice(1)
        if (hex.length === 3)
            hex = hex
                .split('')
                .map((c) => c + c)
                .join('')
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)
        return `rgba(${r}, ${g}, ${b}, ${a})`
    }
    // oklch(...) or any other CSS color → wrap with color-mix for alpha.
    return `color-mix(in oklab, ${color} ${Math.round(a * 100)}%, transparent)`
}
