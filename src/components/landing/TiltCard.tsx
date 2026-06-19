import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

interface TiltCardProps {
    title: string
    description: string
    icon: LucideIcon
    href: string
    className?: string
}

const springConfig = { stiffness: 150, damping: 20 }

export function TiltCard({ title, description, icon: Icon, href, className }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null)

    const x = useMotionValue(0.5)
    const y = useMotionValue(0.5)

    const rotateX = useSpring(useTransform(y, [0, 1], [10.5, -10.5]), springConfig)
    const rotateY = useSpring(useTransform(x, [0, 1], [-10.5, 10.5]), springConfig)

    const sheenX = useTransform(x, [0, 1], ['-100%', '200%'])
    const sheenOpacity = useTransform(y, [0, 0.5, 1], [0.15, 0.05, 0.15])

    function handleMouse(e: React.MouseEvent) {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        x.set((e.clientX - rect.left) / rect.width)
        y.set((e.clientY - rect.top) / rect.height)
    }

    function handleLeave() {
        x.set(0.5)
        y.set(0.5)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={handleLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                perspective: '1000px',
            }}
            className={cn('group relative', className)}
        >
            <Link
                to={href}
                className="relative block rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-7 overflow-hidden transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.07]"
                style={{ transformStyle: 'preserve-3d' }}
            >
                <motion.div
                    className="pointer-events-none absolute inset-0 rounded-2xl"
                    style={{
                        background: `linear-gradient(105deg, transparent, rgba(110,231,183,0.08), transparent)`,
                        backgroundPositionX: sheenX,
                        opacity: sheenOpacity,
                    }}
                />

                <div
                    className="mb-4 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary-500/10 border border-primary-500/15"
                    style={{ transform: 'translateZ(40px)' }}
                >
                    <Icon className="h-5 w-5 text-primary-400" />
                </div>

                <h3
                    className="text-[15px] font-semibold text-white mb-1.5 group-hover:text-primary-300 transition-colors"
                    style={{ transform: 'translateZ(50px)' }}
                >
                    {title}
                </h3>

                <p
                    className="text-sm text-neutral-400 leading-relaxed"
                    style={{ transform: 'translateZ(30px)' }}
                >
                    {description}
                </p>

                <div
                    className="mt-5 inline-flex items-center gap-1 text-[13px] font-medium text-primary-400 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-0.5 transition-all duration-300"
                    style={{ transform: 'translateZ(60px)' }}
                >
                    Learn more
                    <ArrowRight className="h-3 w-3" />
                </div>
            </Link>
        </motion.div>
    )
}
