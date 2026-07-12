import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { usePageTitle } from '@/hooks/usePageTitle'
import { AI_ENABLED } from '@/config/env'
import {
    motion,
    useMotionValue,
    useTransform,
    animate,
    type Variants,
} from 'motion/react'
import { useEffect, useRef } from 'react'
import {
    Bug,
    Sprout,
    FlaskConical,
    ScanLine,
    MessageSquare,
    MapPin,
    ArrowRight,
    Wheat,
    Globe,
} from 'lucide-react'
import { SectionLabel } from '@/components/landing/SectionLabel'
import { Button } from '@/components/ui/button'

const ease = [0.16, 1, 0.3, 1] as const

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
}

const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
}

function AnimatedCounter({
    target,
    suffix = '',
}: {
    target: number
    suffix?: string
}) {
    const count = useMotionValue(0)
    const rounded = useTransform(count, (v) => Math.round(v))
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const unsubscribe = rounded.on('change', (v) => {
            if (ref.current) ref.current.textContent = `${v}${suffix}`
        })
        const controls = animate(count, target, {
            duration: 1.8,
            ease: [0.16, 1, 0.3, 1],
        })
        return () => {
            controls.stop()
            unsubscribe()
        }
    }, [count, rounded, target, suffix])

    return <span ref={ref}>0{suffix}</span>
}

export function LandingPage() {
    const { t } = useTranslation()
    const { user } = useAuth()
    usePageTitle('Organic Farming Platform for Telangana')

    const stats = [
        { value: 30, suffix: '+', label: t('landing.stats.crops') },
        { value: 100, suffix: '+', label: t('landing.stats.diseases') },
        { value: 200, suffix: '+', label: t('landing.stats.remedies') },
        { value: 33, suffix: '', label: t('landing.stats.districts') },
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

    const steps = [
        {
            num: t('landing.process.step1Number'),
            title: t('landing.process.step1Title'),
            desc: t('landing.process.step1Desc'),
        },
        {
            num: t('landing.process.step2Number'),
            title: t('landing.process.step2Title'),
            desc: t('landing.process.step2Desc'),
        },
        {
            num: t('landing.process.step3Number'),
            title: t('landing.process.step3Title'),
            desc: t('landing.process.step3Desc'),
        },
    ]

    const metrics = [
        {
            icon: MapPin,
            num: '01',
            title: t('landing.telangana.districts'),
            desc: t('landing.telangana.districtsDesc'),
        },
        {
            icon: Globe,
            num: '02',
            title: t('landing.telangana.telugu'),
            desc: t('landing.telangana.teluguDesc'),
        },
        {
            icon: Wheat,
            num: '03',
            title: t('landing.telangana.crops'),
            desc: t('landing.telangana.cropsDesc'),
        },
    ]

    return (
        <main className="flex flex-col bg-[#19191b]">
            {/* ── HERO ── */}
            <section className="relative flex min-h-[100svh] items-center justify-center px-6 sm:px-8 border-b border-[#323439]">
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center pt-24 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease }}
                        className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#37393e] bg-[#ffffff0d] px-4 py-2 text-xs font-medium text-[#9c9da1]"
                    >
                        <span className="relative flex size-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                            <span className="relative inline-flex size-2 rounded-full bg-white" />
                        </span>
                        {t('landing.hero.badge')}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15, ease }}
                        className="text-[40px] md:text-7xl lg:text-[72px] font-bold text-[#e4e5e9] tracking-[-0.04em] leading-[1.05]"
                    >
                        {t('landing.hero.title')}{' '}
                        <span className="bg-gradient-to-r from-white to-[#9c9da1] bg-clip-text text-transparent">
                            {t('landing.hero.titleHighlight')}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.35, ease }}
                        className="mt-6 max-w-xl text-lg text-[#9c9da1] leading-relaxed"
                    >
                        {t('landing.hero.subtitle')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5, ease }}
                        className="mt-10"
                    >
                        <Button
                            asChild
                            size="lg"
                            className="gap-2 rounded-lg px-6 py-3 text-base font-semibold bg-primary text-white hover:bg-[#5361C7] transition-colors duration-200"
                        >
                            <Link to="/crops">
                                {t('landing.hero.cta')}
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7, ease }}
                        className="mt-16 flex w-full max-w-lg"
                    >
                        {stats.map((s, i) => (
                            <div
                                key={s.label}
                                className={`flex-1 text-center ${i < stats.length - 1 ? 'border-r border-[#323439]' : ''}`}
                            >
                                <div className="text-3xl sm:text-4xl font-bold text-[#e4e5e9] tracking-[-0.02em]">
                                    <AnimatedCounter
                                        target={s.value}
                                        suffix={s.suffix}
                                    />
                                </div>
                                <div className="mt-1.5 text-[11px] text-[#636467] uppercase tracking-[0.12em] font-medium">
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── 1.0 EXPLORE ── */}
            <section className="py-28 sm:py-36 px-6 sm:px-8">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6, ease }}
                    >
                        <SectionLabel
                            number={t('landing.features.sectionNumber')}
                            title={t('landing.features.sectionTitle')}
                            subtitle={t('landing.features.sectionSubtitle')}
                        />
                    </motion.div>

                    <motion.div
                        className={`grid grid-cols-1 sm:grid-cols-2 ${features.length > 3 ? 'lg:grid-cols-3' : ''} gap-px rounded-xl overflow-hidden bg-[#323439]`}
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        {features.map((f, i) => (
                            <motion.div
                                key={`${f.to}-${i}`}
                                variants={fadeUp}
                                transition={{ duration: 0.5, ease }}
                            >
                                <Link
                                    to={f.to}
                                    className="group block bg-[#19191b] p-8 hover:bg-[#1e2022] transition-colors duration-200"
                                >
                                    <f.icon className="size-6 text-[#9c9da1] mb-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                                    <h3 className="text-[15px] font-semibold text-[#e4e5e9] mb-1.5 tracking-[-0.02em]">
                                        {f.title}
                                    </h3>
                                    <p className="text-sm text-[#9c9da1] leading-relaxed">
                                        {f.desc}
                                    </p>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── 2.0 HOW IT WORKS ── */}
            <section className="py-28 sm:py-36 px-6 sm:px-8">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6, ease }}
                    >
                        <SectionLabel
                            number={t('landing.process.sectionNumber')}
                            title={t('landing.process.sectionTitle')}
                            subtitle={t('landing.process.sectionSubtitle')}
                        />
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.num}
                                variants={fadeUp}
                                transition={{ duration: 0.5, ease }}
                                className="relative"
                            >
                                {i < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 border-t border-dashed border-[#37393e]" />
                                )}
                                <div className="border border-[#323439] bg-[#1e2022] rounded-xl p-6">
                                    <span className="font-mono text-[13px] font-semibold text-[#636467] tracking-[0.08em]">
                                        {step.num}
                                    </span>
                                    <h3 className="mt-3 text-lg font-semibold text-[#e4e5e9] tracking-[-0.02em]">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-[#9c9da1] leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── 3.0 BUILT FOR TELANGANA ── */}
            <section className="py-28 sm:py-36 px-6 sm:px-8">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6, ease }}
                    >
                        <SectionLabel
                            number={t('landing.telangana.sectionNumber')}
                            title={t('landing.telangana.sectionTitle')}
                            subtitle={t('landing.telangana.sectionSubtitle')}
                        />
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6, ease }}
                        className="border border-[#323439] bg-[#1e2022] rounded-xl p-8 sm:p-10 mb-6"
                    >
                        <span className="font-mono text-[10px] text-[#636467] uppercase tracking-widest">
                            {t('landing.telangana.figLabel')}
                        </span>
                        <h3 className="mt-4 text-2xl sm:text-3xl font-bold text-[#e4e5e9] tracking-[-0.03em] max-w-lg">
                            {t('landing.telangana.highlightTitle')}
                        </h3>
                        <p className="mt-3 text-[#9c9da1] text-base leading-relaxed max-w-lg">
                            {t('landing.telangana.highlightDesc')}
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                    >
                        {metrics.map((m) => (
                            <motion.div
                                key={m.num}
                                variants={fadeUp}
                                transition={{ duration: 0.5, ease }}
                                className="relative border border-[#323439] bg-[#1e2022] rounded-xl p-6 overflow-hidden"
                            >
                                <span className="absolute -right-2 -top-4 font-mono text-[80px] font-black text-[#ffffff05] leading-none select-none pointer-events-none">
                                    {m.num}
                                </span>
                                <m.icon className="size-5 text-[#9c9da1] mb-4" />
                                <h3 className="text-base font-semibold text-[#e4e5e9] tracking-[-0.02em]">
                                    {m.title}
                                </h3>
                                <p className="mt-1.5 text-sm text-[#9c9da1] leading-relaxed">
                                    {m.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-28 sm:py-36 px-6 sm:px-8 border-t border-[#323439]">
                <motion.div
                    className="mx-auto max-w-md text-center"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, ease }}
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#e4e5e9] tracking-[-0.03em]">
                        {t('landing.cta.title')}
                    </h2>
                    <p className="mt-4 text-[#9c9da1] text-base leading-relaxed">
                        {t('landing.cta.subtitle')}
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                        {!user && (
                            <Button
                                asChild
                                size="lg"
                                className="group rounded-lg w-full sm:w-auto px-6 font-semibold bg-primary text-white hover:bg-[#5361C7] transition-colors duration-200"
                            >
                                <Link to="/register" className="gap-2">
                                    {t('landing.cta.register')}
                                    <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                                </Link>
                            </Button>
                        )}
                        <Button
                            asChild
                            variant={user ? 'default' : 'outline'}
                            size="lg"
                            className={`rounded-lg w-full sm:w-auto px-6 ${
                                user
                                    ? 'bg-primary text-white hover:bg-[#5361C7]'
                                    : 'border-[#37393e] text-[#e4e5e9] hover:bg-[#1e2022] hover:border-[#424449]'
                            } transition-colors duration-200`}
                        >
                            <Link to="/crops">{t('landing.cta.explore')}</Link>
                        </Button>
                    </div>
                </motion.div>
            </section>
        </main>
    )
}
