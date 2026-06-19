import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
    User,
    LogOut,
    Settings,
    Shield,
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
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function Header() {
    const { t } = useTranslation()
    const { user, signOut } = useAuth()
    const { isAdmin } = useAdmin()
    const navigate = useNavigate()
    const navLinks = [
        { to: '/crops', label: t('nav.crops'), icon: CropsIcon },
        { to: '/diseases', label: t('common.diseases'), icon: Bug },
        { to: '/recommend', label: t('nav.recommend'), icon: Sprout },
    ]

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    return (
        <header className="sticky top-0 z-50 hidden md:block">
            <div className="bg-[#09090B]/95 backdrop-blur-sm border-b border-white/[0.06] transition-all duration-150 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <LogoMark size="md" />
                            <span className="text-lg font-bold font-heading tracking-tight select-none">
                                    <span className="text-white group-hover:text-neutral-200 transition-colors">
                                    Rythu
                                </span>
                                <span className="text-neutral-400 group-hover:text-neutral-300 transition-colors">
                                    Netra
                                </span>
                            </span>
                        </Link>

                        {/* Desktop Navigation — pill container */}
                        <nav className="flex items-center rounded-full p-1 gap-0.5 bg-white/[0.04] border border-white/[0.06]">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) =>
                                        cn(
                                            'px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 inline-flex items-center gap-1.5 whitespace-nowrap',
                                            isActive
                                                ? 'text-white bg-white/[0.08]'
                                                : 'text-[#8B8B8D] hover:text-white hover:bg-white/[0.04]',
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
                                            isActive
                                                ? 'text-white bg-white/[0.08]'
                                                : 'text-[#8B8B8D] hover:text-white hover:bg-white/[0.04]',
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
                            <LanguageToggle />

                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full border bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] text-white"
                                        >
                                            <Avatar size="sm">
                                                <AvatarFallback className="bg-linear-to-br from-[#3F3F46] to-[#27272A] text-white text-xs">
                                                    <User className="h-3.5 w-3.5" />
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-52"
                                    >
                                        <DropdownMenuLabel>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                                Account
                                            </p>
                                            <p className="text-sm font-medium truncate mt-0.5">
                                                {user.name || user.email}
                                            </p>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            {isAdmin && (
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        navigate('/admin')
                                                    }
                                                    className="text-[#D4A72C] focus:text-[#D4A72C]"
                                                >
                                                    <Shield className="h-4 w-4" />
                                                    {t('common.admin')}
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    navigate('/settings')
                                                }
                                            >
                                                <Settings className="h-4 w-4" />
                                                {t('common.settings')}
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onClick={handleSignOut}
                                        >
                                            <LogOut className="h-4 w-4" />
                                            {t('common.logout')}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button asChild className="rounded-full px-5">
                                    <Link to="/login">
                                        <LogIn className="h-4 w-4" />
                                        {t('common.login')}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
