import { useEffect, useRef } from 'react'
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
    Wheat,
    Globe,
} from 'lucide-react'
import { SectionLabel } from '@/components/landing/SectionLabel'
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
    const { user } = useAuth()
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
        <main className="flex flex-col bg-background">
            {/* ── HERO ── */}
            <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden border-b border-border px-6 sm:px-8">
                <HeroBackdrop />
                <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center pb-20 pt-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: swift }}
                        className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 font-mono text-xs font-medium text-muted-foreground backdrop-blur-sm"
                    >
                        <span className="relative flex size-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-700 opacity-75" />
                            <span className="relative inline-flex size-2 rounded-full bg-blue-700" />
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
                            className="text-display-lg font-semibold tracking-[-0.04em] text-foreground sm:text-display-xl"
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
                            variant="outline"
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

            {/* ── 1.0 EXPLORE ── */}
            <section className="px-6 py-28 sm:px-8 sm:py-36">
                <div className="mx-auto max-w-6xl">
                    <Reveal>
                        <SectionLabel
                            number={t('landing.features.sectionNumber')}
                            title={t('landing.features.sectionTitle')}
                            subtitle={t('landing.features.sectionSubtitle')}
                        />
                    </Reveal>

                    <div
                        className={`grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-border sm:grid-cols-2 ${features.length > 3 ? 'lg:grid-cols-3' : ''}`}
                    >
                        {features.map((f, i) => (
                            <Reveal
                                key={`${f.to}-${i}`}
                                delay={i * 0.05}
                                y={12}
                            >
                                <Link
                                    to={f.to}
                                    className="group block h-full bg-background p-8 transition-colors duration-200 hover:bg-secondary"
                                >
                                    <f.icon className="mb-4 size-6 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5" />
                                    <h3 className="mb-1.5 text-[15px] font-semibold tracking-[-0.02em] text-foreground">
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

            {/* ── 2.0 HOW IT WORKS ── */}
            <section className="px-6 py-28 sm:px-8 sm:py-36">
                <div className="mx-auto max-w-6xl">
                    <Reveal>
                        <SectionLabel
                            number={t('landing.process.sectionNumber')}
                            title={t('landing.process.sectionTitle')}
                            subtitle={t('landing.process.sectionSubtitle')}
                        />
                    </Reveal>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {steps.map((step, i) => (
                            <Reveal key={step.num} delay={i * 0.08}>
                                <div className="h-full rounded-xl border border-border bg-card p-6">
                                    <span className="font-mono text-[13px] font-semibold tracking-[0.08em] text-muted-foreground">
                                        {step.num}
                                    </span>
                                    <h3 className="mt-3 text-display-sm tracking-[-0.02em] text-foreground">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {step.desc}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 3.0 BUILT FOR TELANGANA ── */}
            <section className="px-6 py-28 sm:px-8 sm:py-36">
                <div className="mx-auto max-w-6xl">
                    <Reveal>
                        <SectionLabel
                            number={t('landing.telangana.sectionNumber')}
                            title={t('landing.telangana.sectionTitle')}
                            subtitle={t('landing.telangana.sectionSubtitle')}
                        />
                    </Reveal>

                    <Reveal className="mb-6 rounded-xl border border-border bg-card p-8 sm:p-10">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                            {t('landing.telangana.figLabel')}
                        </span>
                        <h3 className="mt-4 max-w-lg text-display-md font-semibold tracking-[-0.03em] text-foreground sm:text-display-lg">
                            {t('landing.telangana.highlightTitle')}
                        </h3>
                        <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
                            {t('landing.telangana.highlightDesc')}
                        </p>
                    </Reveal>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {metrics.map((m, i) => (
                            <Reveal key={m.num} delay={i * 0.08}>
                                <div className="h-full rounded-xl border border-border bg-card p-6">
                                    <span className="font-mono text-xs font-medium tracking-[0.08em] text-muted-foreground">
                                        {m.num}
                                    </span>
                                    <m.icon className="mb-4 mt-3 size-5 text-muted-foreground" />
                                    <h3 className="text-base font-semibold tracking-[-0.02em] text-foreground">
                                        {m.title}
                                    </h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                        {m.desc}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="border-t border-border px-6 py-28 sm:px-8 sm:py-36">
                <Reveal className="mx-auto max-w-md text-center">
                    <h2 className="text-display-lg font-semibold tracking-[-0.03em] text-foreground sm:text-display-xl">
                        {t('landing.cta.title')}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                        {t('landing.cta.subtitle')}
                    </p>
                    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        {!user && (
                            <Button
                                asChild
                                size="pill-lg"
                                className="group w-full sm:w-auto"
                            >
                                <Link to="/register">
                                    {t('landing.cta.register')}
                                    <ArrowRight
                                        data-icon="inline-end"
                                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                                    />
                                </Link>
                            </Button>
                        )}
                        <Button
                            asChild
                            variant={user ? 'default' : 'outline'}
                            size="pill-lg"
                            className="w-full sm:w-auto"
                        >
                            <Link to="/crops">{t('landing.cta.explore')}</Link>
                        </Button>
                    </div>
                </Reveal>
            </section>
        </main>
    )
}
