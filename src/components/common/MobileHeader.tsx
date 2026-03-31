import { Link, useLocation } from 'react-router-dom'
import { LanguageToggle } from './LanguageToggle'
import { LogoMark } from './LogoMark'
import { cn } from '@/utils/cn'

export function MobileHeader() {
    const location = useLocation()
    const isLanding = location.pathname === '/'

    return (
        <header className="sticky top-0 z-50 md:hidden">
            <div
                className={cn(
                    'backdrop-blur-xl transition-all duration-300 relative',
                    isLanding ? 'bg-[#030b07]' : 'bg-transparent',
                )}
            >
                {isLanding && (
                    <div className="absolute bottom-0 inset-x-0 h-px bg-linear-to-r from-transparent via-primary-400/40 to-transparent" />
                )}
                <div className="flex items-center justify-between px-4 h-14">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <LogoMark size="sm" className="shadow-btn-primary" />
                        <span className="text-base font-bold font-heading tracking-tight select-none">
                            <span
                                className={cn(
                                    'transition-colors',
                                    isLanding
                                        ? 'text-white group-hover:text-neutral-200'
                                        : 'text-neutral-900 group-hover:text-neutral-700',
                                )}
                            >
                                Rythu
                            </span>
                            <span
                                className={cn(
                                    'transition-colors',
                                    isLanding
                                        ? 'text-primary-300 group-hover:text-primary-200'
                                        : 'text-primary-600 group-hover:text-primary-500',
                                )}
                            >
                                Netra
                            </span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <LanguageToggle
                            variant={isLanding ? 'dark' : 'light'}
                        />
                    </div>
                </div>
            </div>
        </header>
    )
}
