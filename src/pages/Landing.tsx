import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'
import { AI_ENABLED } from '@/config/env'
import {
    motion,
    useMotionValue,
    useTransform,
    animate,
    useReducedMotion,
} from 'motion/react'
import {
    Bug,
    Sprout,
    FlaskConical,
    ScanLine,
    MessageSquare,
    MapPin,
    ArrowRight,
    ArrowUpRight,
    Wheat,
    Globe,
    Search,
    BookOpen,
    Leaf,
} from 'lucide-react'
import { HeroBackdrop } from '@/components/landing/HeroBackdrop'
import { RotatingHeadline } from '@/components/landing/RotatingHeadline'
import { Reveal } from '@/components/landing/Reveal'
import { swift } from '@/components/landing/motion'
import { Button } from '@/components/ui/button'

function AnimatedCounter({
    target,
    suffix = '',
}: {
    target: number
    suffix?: string
}) {
    const reduce = useReducedMotion()
    const count = useMotionValue(0)
    const rounded = useTransform(count, (v) => Math.round(v))
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        if (reduce) {
            if (ref.current) ref.current.textContent = `${target}${suffix}`
            return
        }
        const unsubscribe = rounded.on('change', (v) => {
            if (ref.current) ref.current.textContent = `${v}${suffix}`
        })
        const controls = animate(count, target, { duration: 1.6, ease: swift })
        return () => {
            controls.stop()
            unsubscribe()
        }
    }, [count, rounded, target, suffix, reduce])

    return <span ref={ref}>0{suffix}</span>
}

export function LandingPage() {
    const { t } = useTranslation()
    usePageTitle('Organic Farming Platform for Telangana')

    const rotating = t('landing.hero.rotating', {
        returnObjects: true,
    }) as string[]

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
            icon: Search,
            title: t('landing.process.step1Title'),
            desc: t('landing.process.step1Desc'),
        },
        {
            icon: BookOpen,
            title: t('landing.process.step2Title'),
            desc: t('landing.process.step2Desc'),
        },
        {
            icon: Leaf,
            title: t('landing.process.step3Title'),
            desc: t('landing.process.step3Desc'),
        },
    ]

    const metrics = [
        {
            icon: MapPin,
            title: t('landing.telangana.districts'),
            desc: t('landing.telangana.districtsDesc'),
        },
        {
            icon: Globe,
            title: t('landing.telangana.telugu'),
            desc: t('landing.telangana.teluguDesc'),
        },
        {
            icon: Wheat,
            title: t('landing.telangana.crops'),
            desc: t('landing.telangana.cropsDesc'),
        },
    ]

    return (
        <main className="flex flex-col bg-background">
            {/* ── HERO ── */}
            <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden border-b border-border px-6 sm:px-8">
                <HeroBackdrop />
                <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center pb-20 pt-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: swift }}
                        className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 font-mono text-xs font-medium text-muted-foreground backdrop-blur-sm"
                    >
                        <span className="relative flex size-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-link opacity-75" />
                            <span className="relative inline-flex size-2 rounded-full bg-link" />
                        </span>
                        {t('landing.hero.badge')}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: swift }}
                    >
                        <RotatingHeadline
                            lead={t('landing.hero.lead')}
                            words={
                                Array.isArray(rotating) && rotating.length
                                    ? rotating
                                    : ['disease scans', 'organic remedies']
                            }
                            className="font-serif text-5xl font-light leading-[0.98] tracking-[-0.032em] text-foreground sm:text-7xl lg:text-[6.5rem]"
                        />
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.35, ease: swift }}
                        className="mt-6 max-w-xl text-body-lg text-muted-foreground"
                    >
                        {t('landing.hero.subtitle')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5, ease: swift }}
                        className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
                    >
                        <Button asChild size="pill-lg" className="group w-full sm:w-auto">
                            <Link to="/crops">
                                {t('landing.hero.cta')}
                                <ArrowRight
                                    data-icon="inline-end"
                                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                                />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="secondary"
                            size="pill-lg"
                            className="w-full sm:w-auto"
                        >
                            <Link to="/diseases">
                                {t('landing.hero.ctaSecondary')}
                            </Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7, ease: swift }}
                        className="mt-16 grid w-full max-w-lg grid-cols-4 divide-x divide-border rounded-xl border border-border bg-card/70 backdrop-blur-sm"
                    >
                        {stats.map((s) => (
                            <div key={s.label} className="px-2 py-4 text-center">
                                <div className="text-display-md font-semibold tracking-[-0.02em] text-foreground tabular-nums">
                                    <AnimatedCounter
                                        target={s.value}
                                        suffix={s.suffix}
                                    />
                                </div>
                                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── EXPLORE ── */}
            <section className="px-6 py-20 sm:px-8 sm:py-24">
                <div className="mx-auto max-w-6xl">
                    <Reveal className="mb-10 max-w-2xl">
                        <h2 className="text-display-lg font-medium leading-[1.1] tracking-[-0.04em] text-foreground sm:text-[42px]">
                            {t('landing.features.sectionTitle')}
                        </h2>
                        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
                            {t('landing.features.sectionSubtitle')}
                        </p>
                    </Reveal>

                    <div
                        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${features.length > 3 ? 'lg:grid-cols-3' : ''}`}
                    >
                        {features.map((f, i) => (
                            <Reveal key={`${f.to}-${i}`} delay={i * 0.05} y={12}>
                                <Link
                                    to={f.to}
                                    className="group flex h-full flex-col rounded-[10px] border border-border bg-card p-6 transition-colors duration-200 hover:border-foreground/40"
                                >
                                    <div className="mb-5 flex items-center justify-between">
                                        <span className="flex size-11 items-center justify-center rounded-xl bg-accent transition-colors duration-200 group-hover:bg-primary [&_svg]:size-5 [&_svg]:text-foreground group-hover:[&_svg]:text-primary-foreground">
                                            <f.icon />
                                        </span>
                                        <span className="flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                                            <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px" />
                                        </span>
                                    </div>
                                    <h3 className="mb-1.5 text-base font-semibold tracking-[-0.02em] text-foreground">
                                        {f.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {f.desc}
                                    </p>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="border-t border-border bg-background-200 px-6 py-20 sm:px-8 sm:py-24">
                <div className="mx-auto max-w-6xl">
                    <Reveal className="mb-10 max-w-2xl">
                        <h2 className="text-display-lg font-medium leading-[1.1] tracking-[-0.04em] text-foreground sm:text-[42px]">
                            {t('landing.process.sectionTitle')}
                        </h2>
                        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
                            {t('landing.process.sectionSubtitle')}
                        </p>
                    </Reveal>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {steps.map((step, i) => (
                            <Reveal key={step.title} delay={i * 0.08}>
                                <div className="flex items-start gap-4">
                                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground [&_svg]:size-5">
                                        <step.icon />
                                    </span>
                                    <div>
                                        <h3 className="text-base font-semibold tracking-[-0.02em] text-foreground">
                                            {step.title}
                                        </h3>
                                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── BUILT FOR TELANGANA ── */}
            <section className="border-t border-border px-6 py-20 sm:px-8 sm:py-24">
                <div className="mx-auto max-w-6xl">
                    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
                        <Reveal>
                            <h2 className="text-display-lg font-medium leading-[1.1] tracking-[-0.04em] text-foreground sm:text-[42px]">
                                {t('landing.telangana.sectionTitle')}
                            </h2>
                            <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                                {t('landing.telangana.highlightDesc')}
                            </p>
                        </Reveal>

                        <div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
                            {metrics.map((m, i) => (
                                <Reveal key={m.title} delay={i * 0.08}>
                                    <div className="group flex items-center gap-4 p-5 transition-colors duration-200 hover:bg-muted-hover">
                                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 transition-colors duration-200 group-hover:bg-primary [&_svg]:size-5 [&_svg]:text-foreground group-hover:[&_svg]:text-primary-foreground">
                                            <m.icon />
                                        </span>
                                        <div>
                                            <h3 className="text-base font-semibold tracking-[-0.02em] text-foreground">
                                                {m.title}
                                            </h3>
                                            <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                                                {m.desc}
                                            </p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
