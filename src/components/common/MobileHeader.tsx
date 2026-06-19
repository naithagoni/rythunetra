import { Link } from 'react-router-dom'
import { LanguageToggle } from './LanguageToggle'
import { LogoMark } from './LogoMark'

export function MobileHeader() {
    return (
        <header className="sticky top-0 z-50 md:hidden">
            <div className="backdrop-blur-xl bg-[#030b07]/80 transition-all duration-300 relative">
                <div className="absolute bottom-0 inset-x-0 h-px bg-linear-to-r from-transparent via-primary-400/40 to-transparent" />
                <div className="flex items-center justify-between px-4 h-14">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <LogoMark size="sm" className="shadow-btn-primary" />
                        <span className="text-base font-bold font-heading tracking-tight select-none">
                            <span className="text-white group-hover:text-neutral-200 transition-colors">
                                Rythu
                            </span>
                            <span className="text-primary-300 group-hover:text-primary-200 transition-colors">
                                Netra
                            </span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <LanguageToggle />
                    </div>
                </div>
            </div>
        </header>
    )
}
