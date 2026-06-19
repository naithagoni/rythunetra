import { useEffect, useRef } from 'react'

interface WaveConfig {
    offset: number
    amplitude: number
    frequency: number
    color: string
    glowColor: string
    opacity: number
    lineWidth: number
    speed: number
}

interface GlowyWavesHeroProps {
    children: React.ReactNode
    className?: string
}

const WAVE_PALETTE: WaveConfig[] = [
    {
        offset: 0,
        amplitude: 75,
        frequency: 0.003,
        color: 'rgba(245, 230, 200, 0.85)',
        glowColor: 'rgba(245, 230, 200, 0.6)',
        opacity: 0.5,
        lineWidth: 2.5,
        speed: 0.0018,
    },
    {
        offset: Math.PI / 2,
        amplitude: 95,
        frequency: 0.0024,
        color: 'rgba(212, 165, 116, 0.75)',
        glowColor: 'rgba(212, 165, 116, 0.5)',
        opacity: 0.4,
        lineWidth: 2,
        speed: 0.0015,
    },
    {
        offset: Math.PI,
        amplitude: 55,
        frequency: 0.0038,
        color: 'rgba(201, 149, 107, 0.65)',
        glowColor: 'rgba(201, 149, 107, 0.4)',
        opacity: 0.35,
        lineWidth: 1.8,
        speed: 0.0022,
    },
    {
        offset: Math.PI * 1.5,
        amplitude: 85,
        frequency: 0.002,
        color: 'rgba(184, 139, 139, 0.55)',
        glowColor: 'rgba(184, 139, 139, 0.35)',
        opacity: 0.28,
        lineWidth: 2.2,
        speed: 0.0012,
    },
    {
        offset: Math.PI * 2,
        amplitude: 50,
        frequency: 0.0045,
        color: 'rgba(168, 160, 192, 0.45)',
        glowColor: 'rgba(168, 160, 192, 0.3)',
        opacity: 0.22,
        lineWidth: 1.5,
        speed: 0.0025,
    },
    {
        offset: Math.PI * 0.7,
        amplitude: 65,
        frequency: 0.0032,
        color: 'rgba(230, 210, 180, 0.4)',
        glowColor: 'rgba(230, 210, 180, 0.25)',
        opacity: 0.18,
        lineWidth: 1.2,
        speed: 0.002,
    },
    {
        offset: Math.PI * 2.5,
        amplitude: 45,
        frequency: 0.005,
        color: 'rgba(255, 240, 220, 0.3)',
        glowColor: 'rgba(255, 240, 220, 0.2)',
        opacity: 0.15,
        lineWidth: 1,
        speed: 0.003,
    },
]

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    size: number
    opacity: number
    pulse: number
    pulseSpeed: number
}

const BG_TOP = '#08080f'
const BG_MID = '#0d0c16'
const BG_BOTTOM = '#0f0e17'

export function GlowyWavesHero({
    children,
    className = '',
}: GlowyWavesHeroProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const mouseRef = useRef({ x: 0, y: 0 })
    const targetMouseRef = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return undefined

        const ctx = canvas.getContext('2d')
        if (!ctx) return undefined

        let animationId: number
        let time = 0

        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches

        const mouseInfluence = prefersReducedMotion ? 10 : 80
        const influenceRadius = prefersReducedMotion ? 160 : 380
        const smoothing = prefersReducedMotion ? 0.04 : 0.08

        const particles: Particle[] = []
        const PARTICLE_COUNT = prefersReducedMotion ? 0 : 40

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        const recenterMouse = () => {
            const center = { x: canvas.width / 2, y: canvas.height / 2 }
            mouseRef.current = { ...center }
            targetMouseRef.current = { ...center }
        }

        const initParticles = () => {
            particles.length = 0
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.2,
                    size: Math.random() * 2 + 0.5,
                    opacity: Math.random() * 0.4 + 0.1,
                    pulse: Math.random() * Math.PI * 2,
                    pulseSpeed: Math.random() * 0.02 + 0.008,
                })
            }
        }

        const handleResize = () => {
            resizeCanvas()
            recenterMouse()
            initParticles()
        }

        const handleMouseMove = (e: MouseEvent) => {
            targetMouseRef.current = { x: e.clientX, y: e.clientY }
        }

        const handleMouseLeave = () => {
            recenterMouse()
        }

        resizeCanvas()
        recenterMouse()
        initParticles()

        window.addEventListener('resize', handleResize)
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseleave', handleMouseLeave)

        const getWaveY = (
            x: number,
            wave: WaveConfig,
            t: number,
            mx: number,
            my: number
        ) => {
            const dx = x - mx
            const dy = canvas.height / 2 - my
            const distance = Math.sqrt(dx * dx + dy * dy)
            const influence = Math.max(0, 1 - distance / influenceRadius)
            const mouseEffect =
                influence *
                mouseInfluence *
                Math.sin(t * 0.001 + x * 0.01 + wave.offset)

            return (
                canvas.height / 2 +
                Math.sin(x * wave.frequency + t * wave.speed + wave.offset) *
                    wave.amplitude +
                Math.sin(x * wave.frequency * 0.4 + t * 0.003) *
                    (wave.amplitude * 0.45) +
                Math.cos(x * wave.frequency * 0.7 + t * 0.0015 + wave.offset * 0.5) *
                    (wave.amplitude * 0.2) +
                mouseEffect
            )
        }

        const drawWave = (wave: WaveConfig) => {
            const mx = mouseRef.current.x
            const my = mouseRef.current.y

            ctx.save()
            ctx.beginPath()
            for (let x = 0; x <= canvas.width; x += 3) {
                const y = getWaveY(x, wave, time, mx, my)
                if (x === 0) ctx.moveTo(x, y)
                else ctx.lineTo(x, y)
            }
            ctx.lineWidth = wave.lineWidth + 8
            ctx.strokeStyle = wave.glowColor
            ctx.globalAlpha = wave.opacity * 0.3
            ctx.shadowBlur = 60
            ctx.shadowColor = wave.glowColor
            ctx.stroke()
            ctx.restore()

            ctx.save()
            ctx.beginPath()
            for (let x = 0; x <= canvas.width; x += 3) {
                const y = getWaveY(x, wave, time, mx, my)
                if (x === 0) ctx.moveTo(x, y)
                else ctx.lineTo(x, y)
            }
            ctx.lineWidth = wave.lineWidth
            ctx.strokeStyle = wave.color
            ctx.globalAlpha = wave.opacity
            ctx.shadowBlur = 25
            ctx.shadowColor = wave.color
            ctx.stroke()
            ctx.restore()
        }

        const drawParticles = () => {
            for (const p of particles) {
                p.x += p.vx
                p.y += p.vy
                p.pulse += p.pulseSpeed

                if (p.x < 0) p.x = canvas.width
                if (p.x > canvas.width) p.x = 0
                if (p.y < 0) p.y = canvas.height
                if (p.y > canvas.height) p.y = 0

                const pulseOpacity =
                    p.opacity * (0.5 + 0.5 * Math.sin(p.pulse))
                const pulseSize = p.size * (0.8 + 0.2 * Math.sin(p.pulse))

                ctx.save()
                ctx.beginPath()
                ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(245, 230, 200, ${pulseOpacity})`
                ctx.shadowBlur = 15
                ctx.shadowColor = `rgba(245, 230, 200, ${pulseOpacity * 0.6})`
                ctx.fill()
                ctx.restore()
            }
        }

        const drawAmbientOrbs = () => {
            const orbs = [
                {
                    x: canvas.width * 0.25,
                    y: canvas.height * 0.35,
                    r: 250,
                    color: [212, 165, 116],
                    phase: 0,
                },
                {
                    x: canvas.width * 0.75,
                    y: canvas.height * 0.55,
                    r: 200,
                    color: [184, 139, 139],
                    phase: Math.PI,
                },
                {
                    x: canvas.width * 0.5,
                    y: canvas.height * 0.7,
                    r: 280,
                    color: [168, 160, 192],
                    phase: Math.PI / 2,
                },
            ]

            for (const orb of orbs) {
                const pulse = 0.015 + 0.008 * Math.sin(time * 0.0008 + orb.phase)
                ctx.save()
                const grad = ctx.createRadialGradient(
                    orb.x,
                    orb.y,
                    0,
                    orb.x,
                    orb.y,
                    orb.r
                )
                grad.addColorStop(
                    0,
                    `rgba(${orb.color[0]}, ${orb.color[1]}, ${orb.color[2]}, ${pulse})`
                )
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
                ctx.fillStyle = grad
                ctx.fillRect(
                    orb.x - orb.r,
                    orb.y - orb.r,
                    orb.r * 2,
                    orb.r * 2
                )
                ctx.restore()
            }
        }

        const animate = () => {
            time += 1

            mouseRef.current.x +=
                (targetMouseRef.current.x - mouseRef.current.x) * smoothing
            mouseRef.current.y +=
                (targetMouseRef.current.y - mouseRef.current.y) * smoothing

            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
            gradient.addColorStop(0, BG_TOP)
            gradient.addColorStop(0.5, BG_MID)
            gradient.addColorStop(1, BG_BOTTOM)
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.globalAlpha = 1
            ctx.shadowBlur = 0

            drawAmbientOrbs()
            WAVE_PALETTE.forEach(drawWave)
            drawParticles()

            animationId = window.requestAnimationFrame(animate)
        }

        animationId = window.requestAnimationFrame(animate)

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseleave', handleMouseLeave)
            cancelAnimationFrame(animationId)
        }
    }, [])

    return (
        <section
            className={`relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#08080f] ${className}`}
            role="region"
            aria-label="Hero section"
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
            />

            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[rgba(212,165,116,0.03)] blur-[140px]" />
                <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-[rgba(184,139,139,0.025)] blur-[120px]" />
                <div className="absolute top-1/2 left-1/4 h-[400px] w-[400px] rounded-full bg-[rgba(168,160,192,0.02)] blur-[150px]" />
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-24 text-center md:px-8 lg:px-12">
                {children}
            </div>
        </section>
    )
}
