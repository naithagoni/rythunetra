import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, ArrowRight } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/button'
import { LogoMark } from './LogoMark'

export function Footer({ className }: { className?: string }) {
    const { t } = useTranslation()
    const currentYear = new Date().getFullYear()

    return (
        <footer
            className={cn('bg-ink-slate text-linen/70 mt-auto', className)}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ── Conversion band — large headline + Primary Pill CTA ── */}
                <div className="flex flex-col gap-8 border-b border-linen/15 py-16 sm:flex-row sm:items-end sm:justify-between sm:py-20">
                    <div className="max-w-xl">
                        <h2 className="font-serif text-4xl font-light leading-[1.05] tracking-[-0.02em] text-linen sm:text-5xl">
                            {t('footer.ctaTitle')}
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-linen/70">
                            {t('footer.ctaSubtitle')}
                        </p>
                    </div>
                    <Button
                        asChild
                        size="pill-lg"
                        className="group shrink-0 bg-linen text-ink-slate hover:bg-linen/90"
                    >
                        <Link to="/crops">
                            {t('footer.ctaButton')}
                            <ArrowRight
                                data-icon="inline-end"
                                className="transition-transform duration-200 group-hover:translate-x-0.5"
                            />
                        </Link>
                    </Button>
                </div>

                {/* ── Link cluster ── */}
                <div className="grid grid-cols-1 gap-10 py-14 md:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <Link
                            to="/"
                            aria-label={t('common.appName')}
                            className="flex w-fit items-center mb-4 group"
                        >
                            <LogoMark size="lg" variant="light" />
                        </Link>
                        <p className="text-sm text-linen/70 leading-relaxed">
                            {t('common.tagline')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-mono text-xs text-sage-mist mb-4 uppercase tracking-wider">
                            {t('footer.quickLinks')}
                        </h3>
                        <div className="flex flex-col gap-2.5">
                            <Link
                                to="/crops"
                                className="text-sm text-linen/70 hover:text-linen transition-colors"
                            >
                                {t('nav.crops')}
                            </Link>
                            <Link
                                to="/diseases"
                                className="text-sm text-linen/70 hover:text-linen transition-colors"
                            >
                                {t('common.diseases')}
                            </Link>
                            <Link
                                to="/recommend"
                                className="text-sm text-linen/70 hover:text-linen transition-colors"
                            >
                                {t('nav.recommend')}
                            </Link>
                        </div>
                    </div>

                    {/* Info */}
                    <div>
                        <h3 className="font-mono text-xs text-sage-mist mb-4 uppercase tracking-wider">
                            {t('footer.about')}
                        </h3>
                        <p className="text-sm text-linen/70 leading-relaxed">
                            {t('footer.aboutText')}
                        </p>
                    </div>
                </div>

                <div className="border-t border-linen/15 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs text-sage-mist">
                        &copy; {currentYear} {t('common.appName')}.{' '}
                        {t('footer.rights')}
                    </p>
                    <p className="text-xs text-sage-mist inline-flex items-center gap-1">
                        {t('footer.madeWith')}{' '}
                        <Heart className="size-3 text-rose-clay" /> for farmers
                    </p>
                </div>
            </div>
        </footer>
    )
}
