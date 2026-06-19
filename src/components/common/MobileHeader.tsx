import { Link } from 'react-router-dom'
import { LanguageToggle } from './LanguageToggle'
import { LogoMark } from './LogoMark'

export function MobileHeader() {
    return (
        <header className="sticky top-0 z-50 md:hidden">
            <div className="bg-[#09090B]/95 backdrop-blur-sm border-b border-white/[0.06] transition-all duration-150 relative">
                <div className="flex items-center justify-between px-4 h-14">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <LogoMark size="sm" />
                        <span className="text-base font-bold font-heading tracking-tight select-none">
                            <span className="text-white group-hover:text-neutral-200 transition-colors">
                                Rythu
                            </span>
                            <span className="text-neutral-400 group-hover:text-neutral-300 transition-colors">
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
