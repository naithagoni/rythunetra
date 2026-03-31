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
            className={cn('bg-neutral-900 text-neutral-400 mt-auto', className)}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div>
                        <Link
                            to="/"
                            className="flex items-center gap-2.5 mb-4 group"
                        >
                            <LogoMark size="md" variant="light" />
                            <span className="text-lg font-bold tracking-tight select-none">
                                <span className="text-white">Rythu</span>
                                <span className="text-primary-400">Netra</span>
                            </span>
                        </Link>
                        <p className="text-sm text-neutral-400 leading-relaxed">
                            {t('common.tagline')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-sm text-white mb-4 uppercase tracking-wider">
                            Quick Links
                        </h3>
                        <div className="flex flex-col gap-2.5">
                            <Link
                                to="/crops"
                                className="text-sm text-neutral-400 hover:text-white transition-colors"
                            >
                                {t('nav.crops')}
                            </Link>
                            <Link
                                to="/diseases"
                                className="text-sm text-neutral-400 hover:text-white transition-colors"
                            >
                                {t('common.diseases')}
                            </Link>
                            <Link
                                to="/recommend"
                                className="text-sm text-neutral-400 hover:text-white transition-colors"
                            >
                                {t('nav.recommend')}
                            </Link>
                        </div>
                    </div>

                    {/* Info */}
                    <div>
                        <h3 className="font-semibold text-sm text-white mb-4 uppercase tracking-wider">
                            About
                        </h3>
                        <p className="text-sm text-neutral-400 leading-relaxed">
                            A platform to help farmers identify crop diseases
                            and discover organic remedies.
                        </p>
                    </div>
                </div>

                <div className="border-t border-neutral-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs text-neutral-500">
                        &copy; {currentYear} {t('common.appName')}. All rights
                        reserved.
                    </p>
                    <p className="text-xs text-neutral-500 inline-flex items-center gap-1">
                        Made with <Heart className="h-3 w-3 text-red-400" /> for
                        farmers
                    </p>
                </div>
            </div>
        </footer>
    )
}
