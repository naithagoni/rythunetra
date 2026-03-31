import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
    User,
    LogOut,
    Settings,
    Shield,
    ChevronDown,
    Sprout as CropsIcon,
    Bug,
    Sprout,
    FlaskConical,
    LogIn,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAdmin } from '@/hooks/useAdmin'
import { LanguageToggle } from './LanguageToggle'
import { LogoMark } from './LogoMark'
import { cn } from '@/utils/cn'

export function Header() {
    const { t } = useTranslation()
    const { user, signOut } = useAuth()
    const { isAdmin } = useAdmin()
    const navigate = useNavigate()
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const location = useLocation()
    const isLanding = location.pathname === '/'

    const navLinks = [
        { to: '/crops', label: t('nav.crops'), icon: CropsIcon },
        { to: '/diseases', label: t('common.diseases'), icon: Bug },
        { to: '/recommend', label: t('nav.recommend'), icon: Sprout },
    ]

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
        setUserMenuOpen(false)
    }

    useEffect(() => {
        if (!userMenuOpen) return
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node))
                setUserMenuOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [userMenuOpen])

    return (
        <header className="sticky top-0 z-50 hidden md:block">
            <div
                className={cn(
                    'backdrop-blur-xl transition-all duration-300 relative',
                    isLanding ? 'bg-[#030b07]' : 'bg-transparent',
                )}
            >
                {isLanding && (
                    <div className="absolute bottom-0 inset-x-0 h-px bg-linear-to-r from-transparent via-primary-400/40 to-transparent" />
                )}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <LogoMark
                                size="md"
                                className="shadow-btn-primary"
                            />
                            <span className="text-lg font-bold font-heading tracking-tight select-none">
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

                        {/* Desktop Navigation — pill container */}
                        <nav
                            className={cn(
                                'flex items-center rounded-full p-1 gap-0.5',
                                isLanding
                                    ? 'bg-white/8 border border-white/8'
                                    : 'bg-neutral-100/80',
                            )}
                        >
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) =>
                                        cn(
                                            'px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 inline-flex items-center gap-1.5 whitespace-nowrap',
                                            isLanding
                                                ? isActive
                                                    ? 'text-white bg-white/14 shadow-sm'
                                                    : 'text-neutral-400 hover:text-white hover:bg-white/8'
                                                : isActive
                                                  ? 'text-primary-700 bg-white shadow-sm'
                                                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-white/50',
                                        )
                                    }
                                >
                                    <link.icon className="h-4 w-4" />
                                    {link.label}
                                </NavLink>
                            ))}
                            {user && (
                                <NavLink
                                    to="/my-preparations"
                                    className={({ isActive }) =>
                                        cn(
                                            'px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 inline-flex items-center gap-1.5 whitespace-nowrap',
                                            isLanding
                                                ? isActive
                                                    ? 'text-white bg-white/14 shadow-sm'
                                                    : 'text-neutral-400 hover:text-white hover:bg-white/8'
                                                : isActive
                                                  ? 'text-primary-700 bg-white shadow-sm'
                                                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-white/50',
                                        )
                                    }
                                >
                                    <FlaskConical className="h-4 w-4" />
                                    {t('common.myPreparations')}
                                </NavLink>
                            )}
                        </nav>

                        {/* Right side */}
                        <div className="flex items-center gap-2.5">
                            <LanguageToggle
                                variant={isLanding ? 'dark' : 'light'}
                            />

                            {user ? (
                                <div className="relative" ref={menuRef}>
                                    <button
                                        onClick={() =>
                                            setUserMenuOpen(!userMenuOpen)
                                        }
                                        className={cn(
                                            'flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border',
                                            isLanding
                                                ? userMenuOpen
                                                    ? 'bg-white/14 border-white/20 shadow-sm'
                                                    : 'bg-white/8 border-white/12 hover:bg-white/14 hover:border-white/20'
                                                : userMenuOpen
                                                  ? 'bg-white border-neutral-300 shadow-sm'
                                                  : 'bg-white/60 border-neutral-200/80 hover:bg-white hover:border-neutral-300 hover:shadow-sm',
                                        )}
                                    >
                                        <div className="w-7 h-7 rounded-full bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
                                            <User className="h-3.5 w-3.5 text-white" />
                                        </div>
                                        <ChevronDown
                                            className={cn(
                                                'h-3.5 w-3.5 transition-transform duration-200',
                                                isLanding
                                                    ? 'text-neutral-400'
                                                    : 'text-neutral-400',
                                                userMenuOpen && 'rotate-180',
                                            )}
                                        />
                                    </button>

                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-dropdown border border-neutral-200 p-1.5 z-50 animate-scale-in">
                                            {/* User info */}
                                            <div className="px-3 py-2.5 mb-1">
                                                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                                    Account
                                                </p>
                                                <p className="text-sm text-neutral-700 font-medium truncate mt-0.5">
                                                    {user.user_metadata?.name ||
                                                        user.email}
                                                </p>
                                            </div>
                                            <div className="mx-1 border-t border-neutral-100" />
                                            {isAdmin && (
                                                <Link
                                                    to="/admin"
                                                    onClick={() =>
                                                        setUserMenuOpen(false)
                                                    }
                                                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-amber-700 hover:bg-amber-50 transition-all duration-150 rounded-xl mt-1"
                                                >
                                                    <Shield className="h-4 w-4" />
                                                    {t('common.admin')}
                                                </Link>
                                            )}
                                            <Link
                                                to="/settings"
                                                onClick={() =>
                                                    setUserMenuOpen(false)
                                                }
                                                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100 transition-all duration-150 rounded-xl"
                                            >
                                                <Settings className="h-4 w-4" />
                                                {t('common.settings')}
                                            </Link>
                                            <div className="mx-1 my-1 border-t border-neutral-100" />
                                            <button
                                                onClick={handleSignOut}
                                                className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-150 rounded-xl"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                {t('common.logout')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="btn-primary text-sm inline-flex items-center gap-2 rounded-full px-5"
                                >
                                    <LogIn className="h-4 w-4" />
                                    {t('common.login')}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
