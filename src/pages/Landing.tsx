import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { usePageTitle } from '@/hooks/usePageTitle'
import { AI_ENABLED } from '@/config/env'
import { motion } from 'motion/react'
import {
    Bug,
    Sprout,
    FlaskConical,
    ScanLine,
    MessageSquare,
    MapPin,
    ArrowRight,
    ShieldCheck,
    Sparkles,
    Wheat,
    Cloud,
    type LucideIcon,
} from 'lucide-react'

/* ── Motion helpers ─────────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1] as const

const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
}

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
}

/* Word-by-word reveal for hero headline */
const headlineContainer = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
}
const wordReveal = {
    hidden: { opacity: 0, y: 40, filter: 'blur(12px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        },
    },
}
const highlightReveal = {
    hidden: { opacity: 0, y: 50, scale: 0.9, filter: 'blur(16px)' },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        },
    },
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-primary-600/90 mb-4">
            <span className="h-px w-4 bg-primary-400/50" />
            {children}
        </span>
    )
}

function BentoCard({
    icon: Icon,
    title,
    desc,
    to,
    span = false,
}: {
    icon: LucideIcon
    title: string
    desc: string
    to: string
    span?: boolean
}) {
    return (
        <motion.div variants={fadeUp} transition={{ duration: 0.5, ease }}>
            <Link
                to={to}
                className={`group relative flex flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-7 transition-all duration-300 hover:border-primary-300/60 hover:shadow-[0_8px_30px_-8px_rgba(26,127,84,0.12)] h-full ${span ? 'sm:col-span-2' : ''}`}
            >
                <div>
                    <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50 border border-primary-100/60">
                        <Icon className="h-4.5 w-4.5 text-primary-600" />
                    </div>
                    <h3 className="text-[15px] font-semibold text-neutral-900 mb-1.5 group-hover:text-primary-700 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                        {desc}
                    </p>
                </div>
                <div className="mt-5 inline-flex items-center gap-1 text-[13px] font-medium text-primary-600 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-0.5 transition-all duration-300">
                    Learn more
                    <ArrowRight className="h-3 w-3" />
                </div>
            </Link>
        </motion.div>
    )
}

/* ═══════════════════════════════════════════════════════════ */

export function LandingPage() {
    const { t } = useTranslation()
    const { user } = useAuth()
    usePageTitle('Organic Farming Platform for Telangana')

    const stats = [
        { value: '30+', label: t('landing.stats.crops') },
        { value: '100+', label: t('landing.stats.diseases') },
        { value: '200+', label: t('landing.stats.remedies') },
        { value: '33', label: t('landing.stats.districts') },
    ]

    const features = [
        {
            icon: Wheat,
            title: t('landing.features.crops'),
            desc: t('landing.features.cropsDesc'),
            to: '/crops',
        },
        {
            icon: Bug,
            title: t('landing.features.diseases'),
            desc: t('landing.features.diseasesDesc'),
            to: '/diseases',
        },
        {
            icon: FlaskConical,
            title: t('landing.features.remedies'),
            desc: t('landing.features.remediesDesc'),
            to: '/diseases',
        },
        ...(AI_ENABLED
            ? [
                  {
                      icon: Sprout,
                      title: t('landing.features.recommend'),
                      desc: t('landing.features.recommendDesc'),
                      to: '/recommend',
                  },
                  {
                      icon: ScanLine,
                      title: t('landing.features.scanner'),
                      desc: t('landing.features.scannerDesc'),
                      to: '/scanner',
                  },
                  {
                      icon: MessageSquare,
                      title: t('landing.features.advisor'),
                      desc: t('landing.features.advisorDesc'),
                      to: '/chat',
                  },
              ]
            : []),
    ]

    const highlights = [
        {
            icon: ShieldCheck,
            title: t('landing.highlights.organic'),
            desc: t('landing.highlights.organicDesc'),
        },
        {
            icon: Cloud,
            title: t('landing.highlights.weather'),
            desc: t('landing.highlights.weatherDesc'),
        },
        {
            icon: Sparkles,
            title: t('landing.highlights.ai'),
            desc: t('landing.highlights.aiDesc'),
        },
        {
            icon: MapPin,
            title: t('landing.highlights.community'),
            desc: t('landing.highlights.communityDesc'),
        },
    ]

    return (
        <main className="flex flex-col">
            {/* ─── Hero ───────────────────────────────────── */}
            <section aria-label="Hero" className="relative isolate pt-20 pb-16 sm:pt-28 sm:pb-20 overflow-hidden min-h-[88vh] flex items-center">
                {/* ── BG Layer 1: Rich gradient base ── */}
                <div className="pointer-events-none absolute inset-0 bg-[#030b07]" />
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(ellipse 90% 70% at 50% 35%, rgba(26,127,84,0.18) 0%, rgba(16,185,129,0.06) 40%, transparent 70%)',
                    }}
                />
                {/* subtle warm accent top-right */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(ellipse 50% 40% at 80% 15%, rgba(52,211,153,0.07) 0%, transparent 60%)',
                    }}
                />

                {/* ── BG Layer 2: Subtle dot grid ── */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle, rgba(52,211,153,0.8) 1px, transparent 1px)',
                            backgroundSize: '24px 24px',
                        }}
                    />
                </div>

                {/* ── BG Layer 3: Large animated rings with dashed + solid combos ── */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {/* Ring 1 — huge outer, dashed */}
                    <motion.div
                        className="absolute top-[-18%] left-[-12%] w-187.5 h-187.5 rounded-full"
                        style={{ border: '1px dashed rgba(26,127,84,0.1)' }}
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 100,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                    {/* Ring 1 inner — solid, slightly smaller */}
                    <motion.div
                        className="absolute top-[-18%] left-[-12%] w-182.5 h-182.5 rounded-full border border-primary-500/4"
                        style={{ marginTop: '10px', marginLeft: '10px' }}
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 100,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />

                    {/* Ring 2 — bottom right, opposite rotation */}
                    <motion.div
                        className="absolute bottom-[-12%] right-[-10%] w-150 h-150 rounded-full"
                        style={{ border: '1px dashed rgba(52,211,153,0.08)' }}
                        animate={{ rotate: -360 }}
                        transition={{
                            duration: 80,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                    <motion.div
                        className="absolute bottom-[-12%] right-[-10%] w-145 h-145 rounded-full border border-emerald-400/4"
                        style={{ marginBottom: '10px', marginRight: '10px' }}
                        animate={{ rotate: -360 }}
                        transition={{
                            duration: 80,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />

                    {/* Ring 3 — center, very large, gentle pulse */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-225 h-225 rounded-full border border-primary-400/4"
                        animate={{ rotate: 360, scale: [1, 1.03, 1] }}
                        transition={{
                            duration: 130,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />

                    {/* Small accent ring — top right with orbiting dot */}
                    <motion.div
                        className="absolute top-[12%] right-[18%] w-55 h-55 rounded-full border border-emerald-300/8"
                        animate={{ rotate: -360 }}
                        transition={{
                            duration: 35,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    >
                        {/* Orbiting dot on this ring */}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary-400/60 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                    </motion.div>

                    {/* Small accent ring — bottom left with orbiting dot */}
                    <motion.div
                        className="absolute bottom-[18%] left-[10%] w-45 h-45 rounded-full border border-primary-300/7"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 45,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    >
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-300/50 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                    </motion.div>
                </div>

                {/* ── BG Layer 4: Twinkling stars (mixed sizes + glows) ── */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {[
                        {
                            top: '6%',
                            left: '4%',
                            size: 2,
                            glow: false,
                            delay: 0,
                            dur: 3.5,
                        },
                        {
                            top: '12%',
                            left: '82%',
                            size: 3,
                            glow: true,
                            delay: 0.4,
                            dur: 4.5,
                        },
                        {
                            top: '22%',
                            left: '14%',
                            size: 2,
                            glow: false,
                            delay: 1.2,
                            dur: 5,
                        },
                        {
                            top: '8%',
                            left: '52%',
                            size: 3,
                            glow: true,
                            delay: 0.8,
                            dur: 3,
                        },
                        {
                            top: '18%',
                            left: '68%',
                            size: 2,
                            glow: false,
                            delay: 1.6,
                            dur: 4,
                        },
                        {
                            top: '38%',
                            left: '88%',
                            size: 2,
                            glow: true,
                            delay: 0.2,
                            dur: 5.5,
                        },
                        {
                            top: '52%',
                            left: '6%',
                            size: 3,
                            glow: false,
                            delay: 1.8,
                            dur: 4,
                        },
                        {
                            top: '62%',
                            left: '78%',
                            size: 2,
                            glow: true,
                            delay: 0.6,
                            dur: 3.5,
                        },
                        {
                            top: '72%',
                            left: '22%',
                            size: 3,
                            glow: false,
                            delay: 1,
                            dur: 5,
                        },
                        {
                            top: '78%',
                            left: '58%',
                            size: 2,
                            glow: true,
                            delay: 0.3,
                            dur: 4.5,
                        },
                        {
                            top: '48%',
                            left: '48%',
                            size: 2,
                            glow: false,
                            delay: 2,
                            dur: 3,
                        },
                        {
                            top: '32%',
                            left: '72%',
                            size: 3,
                            glow: true,
                            delay: 1.4,
                            dur: 4,
                        },
                        {
                            top: '84%',
                            left: '42%',
                            size: 2,
                            glow: false,
                            delay: 0.5,
                            dur: 5.5,
                        },
                        {
                            top: '42%',
                            left: '18%',
                            size: 3,
                            glow: true,
                            delay: 0.9,
                            dur: 3.5,
                        },
                        {
                            top: '58%',
                            left: '34%',
                            size: 2,
                            glow: false,
                            delay: 1.7,
                            dur: 4,
                        },
                        {
                            top: '28%',
                            left: '94%',
                            size: 2,
                            glow: true,
                            delay: 0.1,
                            dur: 5,
                        },
                        {
                            top: '90%',
                            left: '15%',
                            size: 2,
                            glow: false,
                            delay: 2.2,
                            dur: 3,
                        },
                        {
                            top: '5%',
                            left: '35%',
                            size: 3,
                            glow: true,
                            delay: 1.1,
                            dur: 4.5,
                        },
                        {
                            top: '68%',
                            left: '92%',
                            size: 2,
                            glow: false,
                            delay: 0.7,
                            dur: 5,
                        },
                        {
                            top: '15%',
                            left: '45%',
                            size: 2,
                            glow: true,
                            delay: 1.3,
                            dur: 3.5,
                        },
                    ].map((star, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                top: star.top,
                                left: star.left,
                                width: star.size,
                                height: star.size,
                                backgroundColor: star.glow
                                    ? 'rgba(52,211,153,0.8)'
                                    : 'rgba(167,220,190,0.5)',
                                boxShadow: star.glow
                                    ? `0 0 ${star.size * 4}px rgba(52,211,153,0.5), 0 0 ${star.size * 8}px rgba(52,211,153,0.2)`
                                    : 'none',
                            }}
                            animate={{
                                opacity: star.glow
                                    ? [0.2, 1, 0.2]
                                    : [0.1, 0.5, 0.1],
                                scale: star.glow
                                    ? [0.8, 1.3, 0.8]
                                    : [1, 1.4, 1],
                            }}
                            transition={{
                                duration: star.dur,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: star.delay,
                            }}
                        />
                    ))}
                </div>

                {/* ── BG Layer 5: Rising particles ── */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {[
                        { left: '12%', delay: 0, dur: 8 },
                        { left: '35%', delay: 2, dur: 10 },
                        { left: '55%', delay: 4, dur: 7 },
                        { left: '78%', delay: 1, dur: 9 },
                        { left: '90%', delay: 3, dur: 11 },
                        { left: '25%', delay: 5, dur: 8 },
                        { left: '65%', delay: 6, dur: 10 },
                        { left: '45%', delay: 7, dur: 9 },
                    ].map((p, i) => (
                        <div
                            key={`p-${i}`}
                            className="absolute w-1 h-1 rounded-full bg-primary-400/40"
                            style={{
                                left: p.left,
                                bottom: '5%',
                                animation: `hero-float-up ${p.dur}s ease-in-out ${p.delay}s infinite`,
                            }}
                        />
                    ))}
                </div>

                {/* ── BG Layer 6: Glowing orbs that drift ── */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute w-112.5 h-112.5 rounded-full"
                        style={{
                            background:
                                'radial-gradient(circle, rgba(26,127,84,0.28) 0%, rgba(26,127,84,0.08) 40%, transparent 65%)',
                            filter: 'blur(70px)',
                        }}
                        animate={{
                            x: ['-5%', '10%', '-3%'],
                            y: ['-5%', '6%', '-8%'],
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        initial={{ top: '8%', left: '12%' }}
                    />
                    <motion.div
                        className="absolute w-95 h-95 rounded-full"
                        style={{
                            background:
                                'radial-gradient(circle, rgba(52,211,153,0.22) 0%, rgba(52,211,153,0.06) 40%, transparent 65%)',
                            filter: 'blur(55px)',
                        }}
                        animate={{
                            x: ['5%', '-8%', '4%'],
                            y: ['3%', '-5%', '7%'],
                        }}
                        transition={{
                            duration: 24,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        initial={{ top: '28%', right: '8%' }}
                    />
                    <motion.div
                        className="absolute w-80 h-80 rounded-full"
                        style={{
                            background:
                                'radial-gradient(circle, rgba(16,185,129,0.20) 0%, rgba(16,185,129,0.05) 40%, transparent 65%)',
                            filter: 'blur(60px)',
                        }}
                        animate={{
                            x: ['-4%', '6%', '-5%'],
                            y: ['5%', '-7%', '4%'],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        initial={{ bottom: '5%', left: '28%' }}
                    />
                    {/* New: warm accent orb for color variety */}
                    <motion.div
                        className="absolute w-62.5 h-62.5 rounded-full"
                        style={{
                            background:
                                'radial-gradient(circle, rgba(110,231,183,0.15) 0%, transparent 60%)',
                            filter: 'blur(50px)',
                        }}
                        animate={{
                            x: ['3%', '-5%', '6%'],
                            y: ['-3%', '4%', '-6%'],
                        }}
                        transition={{
                            duration: 16,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        initial={{ top: '55%', right: '25%' }}
                    />
                </div>

                {/* ── BG Layer 8: Center ripple pulses ── */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {[0, 3, 6].map((delay) => (
                        <div
                            key={`r-${delay}`}
                            className="absolute top-1/2 left-1/2 w-150 h-150 rounded-full border border-primary-400/6"
                            style={{
                                animation: `hero-ripple 9s ease-out ${delay}s infinite`,
                            }}
                        />
                    ))}
                </div>

                {/* ── BG Layer 9: Horizontal glow beam + vertical scanner ── */}
                <motion.div
                    className="pointer-events-none absolute top-[42%] left-0 right-0 h-px"
                    style={{
                        background:
                            'linear-gradient(90deg, transparent 0%, rgba(52,211,153,0.25) 25%, rgba(26,127,84,0.5) 50%, rgba(52,211,153,0.25) 75%, transparent 100%)',
                    }}
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                {/* Vertical scanner */}
                <div
                    className="pointer-events-none absolute left-0 right-0 h-32 opacity-[0.03]"
                    style={{
                        background:
                            'linear-gradient(to bottom, transparent, rgba(52,211,153,0.8), transparent)',
                        animation: 'hero-scan 12s ease-in-out infinite',
                    }}
                />

                {/* ── BG Layer 10: Edge fades ── */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute bottom-0 inset-x-0 h-48 bg-linear-to-t from-[#030b07] to-transparent" />
                    <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-b from-[#030b07]/50 to-transparent" />
                </div>

                {/* ──────── Hero Content ──────── */}
                <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center w-full">
                    {/* Pill badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease, delay: 0.1 }}
                    >
                        <Link
                            to="/crops"
                            className="group inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-white/6 backdrop-blur-md px-4 py-2 text-[12px] font-medium text-primary-300 shadow-[0_0_20px_rgba(26,127,84,0.15)] transition-all hover:border-primary-400/30 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(26,127,84,0.25)] mb-8"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-60 animate-ping" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-400" />
                            </span>
                            {t('landing.hero.badge')}
                            <ArrowRight className="h-3 w-3 text-primary-400/60 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </motion.div>

                    {/* Headline — word-by-word stagger with blur-in */}
                    <motion.h1
                        variants={headlineContainer}
                        initial="hidden"
                        animate="visible"
                        className="text-[clamp(2.5rem,6.5vw,4.5rem)] font-extrabold leading-[1.08] tracking-[-0.04em] text-white"
                    >
                        {t('landing.hero.title')
                            .split(' ')
                            .map((word: string, i: number) => (
                                <motion.span
                                    key={i}
                                    variants={wordReveal}
                                    className="inline-block mr-[0.28em]"
                                >
                                    {word}
                                </motion.span>
                            ))}
                        <br />
                        <motion.span
                            variants={highlightReveal}
                            className="relative inline-block mt-1"
                        >
                            <span
                                className="relative bg-size-[200%_100%] bg-clip-text text-transparent"
                                style={{
                                    backgroundImage:
                                        'linear-gradient(90deg, #6ee7b7, #34d399, #1A7F54, #34d399, #6ee7b7)',
                                    animation:
                                        'headline-shimmer 4s ease-in-out infinite',
                                }}
                            >
                                {t('landing.hero.titleHighlight')}
                            </span>
                            {/* Glowing underline */}
                            <motion.span
                                className="absolute -bottom-2 left-0 h-0.75 rounded-full"
                                style={{
                                    background:
                                        'linear-gradient(90deg, transparent, #34d399, #6ee7b7, #34d399, transparent)',
                                    boxShadow:
                                        '0 0 16px rgba(52,211,153,0.5), 0 0 40px rgba(52,211,153,0.2)',
                                }}
                                initial={{ width: '0%', opacity: 0 }}
                                animate={{ width: '100%', opacity: 1 }}
                                transition={{
                                    duration: 1,
                                    ease: [0.16, 1, 0.3, 1],
                                    delay: 1.2,
                                }}
                            />
                            {/* Soft glow behind the highlight text */}
                            <span
                                className="absolute inset-0 -z-10 rounded-lg opacity-40 blur-2xl"
                                style={{
                                    background:
                                        'linear-gradient(90deg, rgba(110,231,183,0.3), rgba(52,211,153,0.4), rgba(110,231,183,0.3))',
                                }}
                            />
                        </motion.span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease, delay: 0.35 }}
                        className="mt-6 text-base sm:text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed"
                    >
                        {t('landing.hero.subtitle')}
                    </motion.p>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease, delay: 0.5 }}
                        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5"
                    >
                        <Link
                            to="/crops"
                            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary-500 text-white text-sm font-semibold shadow-[0_0_30px_rgba(26,127,84,0.4),0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-200 hover:bg-primary-400 hover:shadow-[0_0_40px_rgba(26,127,84,0.5),0_6px_24px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 active:scale-[0.97]"
                        >
                            {t('landing.hero.cta')}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            to="/diseases"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-white/12 bg-white/5 backdrop-blur-sm text-neutral-200 text-sm font-semibold transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 active:scale-[0.97]"
                        >
                            {t('landing.hero.secondary')}
                        </Link>
                    </motion.div>

                    {/* Stats strip */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease, delay: 0.7 }}
                        className="mt-16 grid grid-cols-2 sm:inline-flex sm:items-center gap-4 sm:gap-8 px-6 sm:px-8 py-4 rounded-2xl bg-white/4 backdrop-blur-lg border border-white/8 shadow-[0_4px_32px_rgba(0,0,0,0.2)]"
                    >
                        {stats.map((s, i) => (
                            <div
                                key={s.label}
                                className="flex items-center gap-4 sm:gap-8"
                            >
                                {i > 0 && (
                                    <span
                                        className="hidden sm:block h-8 w-px bg-linear-to-b from-transparent via-white/15 to-transparent"
                                        aria-hidden
                                    />
                                )}
                                <div className="text-center w-full">
                                    <p className="text-xl sm:text-3xl font-bold tracking-tight text-white">
                                        {s.value}
                                    </p>
                                    <p className="text-[10px] sm:text-[11px] text-neutral-500 font-medium mt-1 uppercase tracking-wider">
                                        {s.label}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ─── Features — Bento Grid ─────────────────── */}
            <section aria-label="Features" className="py-20 sm:py-28 px-4 sm:px-6">
                <div className="mx-auto max-w-5xl">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.6, ease }}
                        className="text-center mb-12"
                    >
                        <SectionLabel>
                            {t('landing.features.title')
                                .split(' ')
                                .slice(0, 2)
                                .join(' ')}
                        </SectionLabel>
                        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                            {t('landing.features.title')}
                        </h2>
                        <p className="mt-2.5 text-neutral-500 text-sm sm:text-base max-w-md mx-auto">
                            {t('landing.features.subtitle')}
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-40px' }}
                    >
                        {features.map((f) => (
                            <BentoCard key={f.to} {...f} />
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ─── Highlights — dark section like Linear ─── */}
            <section aria-label="Highlights" className="relative py-20 sm:py-28 px-4 sm:px-6 bg-neutral-900 overflow-hidden">
                {/* Subtle radial glow */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-0 left-1/2 h-80 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/8 blur-[100px]" />
                </div>

                <div className="relative mx-auto max-w-5xl">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.6, ease }}
                        className="text-center mb-14"
                    >
                        <SectionLabel>
                            {t('landing.highlights.title').replace('?', '')}
                        </SectionLabel>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            {t('landing.highlights.title')}
                        </h2>
                        <p className="mt-2.5 text-neutral-400 text-sm sm:text-base max-w-md mx-auto">
                            {t('landing.highlights.subtitle')}
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-40px' }}
                    >
                        {highlights.map((h, i) => (
                            <motion.div
                                key={i}
                                variants={fadeUp}
                                transition={{ duration: 0.5, ease }}
                                className="group rounded-2xl border border-white/6 bg-white/3 p-6 sm:p-7 transition-colors duration-300 hover:border-white/12 hover:bg-white/5"
                            >
                                <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/6 border border-white/8">
                                    <h.icon className="h-4.5 w-4.5 text-primary-400" />
                                </div>
                                <h3 className="text-[15px] font-semibold text-white mb-1.5">
                                    {h.title}
                                </h3>
                                <p className="text-sm text-neutral-400 leading-relaxed">
                                    {h.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ─── CTA ─────────────────────────────────────── */}
            <section aria-label="Call to action" className="pt-10 sm:pt-14 pb-10 sm:pb-14 px-4 sm:px-6">
                <motion.div
                    className="mx-auto max-w-xl text-center"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, ease }}
                >
                    <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                        {t('landing.cta.title')}
                    </h2>
                    <p className="mt-3 text-neutral-500 text-sm sm:text-base max-w-sm mx-auto">
                        {t('landing.cta.subtitle')}
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                        {!user && (
                            <Link
                                to="/register"
                                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-neutral-900 text-white text-sm font-semibold transition-all duration-200 hover:bg-neutral-800 active:scale-[0.97]"
                            >
                                {t('landing.cta.register')}
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        )}
                        <Link
                            to="/crops"
                            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-all duration-200 active:scale-[0.97] ${
                                user
                                    ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                                    : 'border border-neutral-200 bg-white/70 text-neutral-700 hover:bg-white hover:border-neutral-300'
                            }`}
                        >
                            {t('landing.cta.explore')}
                        </Link>
                    </div>
                </motion.div>
            </section>
        </main>
    )
}
