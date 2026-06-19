import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { usePageTitle } from '@/hooks/usePageTitle'
import { AI_ENABLED } from '@/config/env'
import { motion, type Variants } from 'motion/react'
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
} from 'lucide-react'
import { GlowyWavesHero } from '@/components/landing/GlowyWavesHero'
import { TiltCard } from '@/components/landing/TiltCard'
import { Button } from '@/components/ui/button'

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, staggerChildren: 0.12 },
    },
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
}

const statsVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.08 },
    },
}

const ease = [0.16, 1, 0.3, 1] as const

const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
}

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-block mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-400 bg-primary-500/10 px-3 py-1 rounded-full">
            {children}
        </span>
    )
}

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

    const highlightPills = [
        t('landing.hero.badge'),
        'AI Powered',
        'Bilingual',
    ] as const

    return (
        <main className="flex flex-col">
            <GlowyWavesHero>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full"
                >
                    <motion.div
                        variants={itemVariants}
                        className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(212,165,116,0.25)] bg-white/6 backdrop-blur-md px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#f5e6c8] shadow-[0_0_20px_rgba(212,165,116,0.12)]"
                    >
                        <Sparkles
                            className="h-4 w-4 text-[#d4a574]"
                            aria-hidden="true"
                        />
                        {t('landing.hero.badge')}
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="mb-6 text-4xl font-semibold tracking-tight text-white md:text-6xl lg:text-7xl"
                    >
                        {t('landing.hero.title')}{' '}
                        <span
                            className="bg-clip-text text-transparent bg-size-[200%_100%]"
                            style={{
                                backgroundImage:
                                    'linear-gradient(90deg, #f5e6c8, #d4a574, #c9956b, #d4a574, #f5e6c8)',
                                animation:
                                    'headline-shimmer 4s ease-in-out infinite',
                            }}
                        >
                            {t('landing.hero.titleHighlight')}
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="mx-auto mb-10 max-w-3xl text-lg text-[rgba(200,195,185,0.7)] md:text-2xl"
                    >
                        {t('landing.hero.subtitle')}
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
                    >
                        <Button
                            asChild
                            size="lg"
                            className="group gap-2 rounded-full px-8 text-base uppercase tracking-[0.2em] bg-[#d4a574] text-[#0f0e17] hover:bg-[#e0b88a] shadow-[0_0_30px_rgba(212,165,116,0.35),0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(212,165,116,0.5)] hover:-translate-y-0.5 transition-all"
                        >
                            <Link to="/crops">
                                {t('landing.hero.cta')}
                                <ArrowRight
                                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                    aria-hidden="true"
                                />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="rounded-full border-[rgba(212,165,116,0.2)] bg-white/5 backdrop-blur-sm px-8 text-base text-[rgba(245,230,200,0.8)] hover:bg-white/10 hover:border-[rgba(212,165,116,0.35)] hover:-translate-y-0.5 transition-all"
                        >
                            <Link to="/diseases">
                                {t('landing.hero.secondary')}
                            </Link>
                        </Button>
                    </motion.div>

                    <motion.ul
                        variants={itemVariants}
                        className="mb-12 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] text-[rgba(200,195,185,0.7)]"
                    >
                        {highlightPills.map((pill) => (
                            <li
                                key={pill}
                                className="rounded-full border border-[rgba(212,165,116,0.15)] bg-white/5 px-4 py-2 backdrop-blur"
                            >
                                {pill}
                            </li>
                        ))}
                    </motion.ul>

                    <motion.div
                        variants={statsVariants}
                        className="grid gap-4 rounded-2xl border border-[rgba(212,165,116,0.12)] bg-white/[0.03] backdrop-blur-sm p-6 shadow-[0_4px_32px_rgba(0,0,0,0.3)] sm:grid-cols-4"
                    >
                        {stats.map((s) => (
                            <motion.div
                                key={s.label}
                                variants={itemVariants}
                                className="space-y-1"
                            >
                                <div className="text-xs uppercase tracking-[0.3em] text-[rgba(200,195,185,0.5)]">
                                    {s.label}
                                </div>
                                <div className="text-3xl font-semibold text-[#f5e6c8]">
                                    {s.value}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </GlowyWavesHero>

            {/* Features with 3D Tilt Cards */}
            <section
                aria-label="Features"
                className="relative py-20 sm:py-28 px-4 sm:px-6 bg-[#030b07] overflow-hidden"
            >
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-0 left-1/2 h-80 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/8 blur-[100px]" />
                    <div className="absolute bottom-0 right-1/4 h-60 w-100 rounded-full bg-emerald-500/5 blur-[80px]" />
                </div>

                <div className="relative mx-auto max-w-5xl">
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
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            {t('landing.features.title')}
                        </h2>
                        <p className="mt-2.5 text-neutral-400 text-sm sm:text-base max-w-md mx-auto">
                            {t('landing.features.subtitle')}
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-40px' }}
                    >
                        {features.map((f, i) => (
                            <motion.div
                                key={`${f.to}-${i}`}
                                variants={fadeUp}
                                transition={{ duration: 0.5, ease }}
                            >
                                <TiltCard
                                    title={f.title}
                                    description={f.desc}
                                    icon={f.icon}
                                    href={f.to}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Highlights */}
            <section
                aria-label="Highlights"
                className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden"
            >
                <div className="mx-auto max-w-5xl">
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
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
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
                                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-7 transition-all duration-300 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/10 backdrop-blur-sm"
                            >
                                <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20">
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

            {/* CTA */}
            <section
                aria-label="Call to action"
                className="pt-10 sm:pt-14 pb-10 sm:pb-14 px-4 sm:px-6"
            >
                <motion.div
                    className="mx-auto max-w-xl text-center"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, ease }}
                >
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {t('landing.cta.title')}
                    </h2>
                    <p className="mt-3 text-neutral-400 text-sm sm:text-base max-w-sm mx-auto">
                        {t('landing.cta.subtitle')}
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                        {!user && (
                            <Button
                                asChild
                                size="lg"
                                className="rounded-full w-full sm:w-auto"
                            >
                                <Link to="/register" className="gap-2">
                                    {t('landing.cta.register')}
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </Button>
                        )}
                        <Button
                            asChild
                            variant={user ? 'default' : 'outline'}
                            size="lg"
                            className="rounded-full w-full sm:w-auto"
                        >
                            <Link to="/crops">{t('landing.cta.explore')}</Link>
                        </Button>
                    </div>
                </motion.div>
            </section>
        </main>
    )
}
