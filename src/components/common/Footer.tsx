import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart } from 'lucide-react'
import { cn } from '@/utils/cn'
import { LogoMark } from './LogoMark'

export function Footer({ className }: { className?: string }) {
    const { t } = useTranslation()
    const currentYear = new Date().getFullYear()

    return (
        <footer
            className={cn('bg-background text-muted-foreground mt-auto border-t border-border', className)}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div>
                        <Link
                            to="/"
                            className="flex items-center gap-2.5 mb-4 group"
                        >
                            <LogoMark size="md" />
                            <span className="text-lg font-semibold tracking-[-0.02em] select-none">
                                <span className="text-foreground">Rythu</span>
                                <span className="text-muted-foreground">Netra</span>
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {t('common.tagline')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-mono text-xs text-muted-foreground mb-4 uppercase tracking-wider">
                            Quick Links
                        </h3>
                        <div className="flex flex-col gap-2.5">
                            <Link
                                to="/crops"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {t('nav.crops')}
                            </Link>
                            <Link
                                to="/diseases"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {t('common.diseases')}
                            </Link>
                            <Link
                                to="/recommend"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {t('nav.recommend')}
                            </Link>
                        </div>
                    </div>

                    {/* Info */}
                    <div>
                        <h3 className="font-mono text-xs text-muted-foreground mb-4 uppercase tracking-wider">
                            About
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            A platform to help farmers identify crop diseases
                            and discover organic remedies.
                        </p>
                    </div>
                </div>

                <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">
                        &copy; {currentYear} {t('common.appName')}. All rights
                        reserved.
                    </p>
                    <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                        Made with <Heart className="size-3 text-destructive" /> for
                        farmers
                    </p>
                </div>
            </div>
        </footer>
    )
}
