import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
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
import { ThemeToggle } from './ThemeToggle'
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
        ...(user
            ? [
                  {
                      to: '/my-preparations',
                      label: t('common.myPreparations'),
                      icon: FlaskConical,
                  },
              ]
            : []),
    ]

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    return (
        <header className="sticky top-0 z-50 hidden md:block bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Row 1 — brand + account */}
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-3 group">
                        <LogoMark size="md" />
                        <span className="text-lg brand-wordmark">
                            <span className="text-foreground">Rythu</span>
                            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                                Netra
                            </span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-1.5">
                        <ThemeToggle />
                        <LanguageToggle />
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full"
                                    >
                                        <Avatar size="sm">
                                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                                <User className="size-3.5" />
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-52">
                                    <DropdownMenuLabel>
                                        <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
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
                                                onClick={() => navigate('/admin')}
                                                className="text-amber-900 focus:text-amber-900"
                                            >
                                                <Shield className="size-4" />
                                                {t('common.admin')}
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem
                                            onClick={() => navigate('/settings')}
                                        >
                                            <Settings className="size-4" />
                                            {t('common.settings')}
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        variant="destructive"
                                        onClick={handleSignOut}
                                    >
                                        <LogOut className="size-4" />
                                        {t('common.logout')}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button asChild size="sm" className="ml-1">
                                <Link to="/login">
                                    <LogIn data-icon="inline-start" />
                                    {t('common.login')}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Row 2 — underline tab nav */}
                <nav className="flex items-center gap-1 -mb-px">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className="group/nav relative"
                        >
                            {({ isActive }) => (
                                <>
                                    <span
                                        className={cn(
                                            'inline-flex items-center gap-1.5 px-3 py-3 text-sm font-medium transition-colors',
                                            isActive
                                                ? 'text-foreground'
                                                : 'text-muted-foreground group-hover/nav:text-foreground',
                                        )}
                                    >
                                        <link.icon className="size-4" />
                                        {link.label}
                                    </span>
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-underline"
                                            className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground"
                                            transition={{
                                                type: 'spring',
                                                stiffness: 500,
                                                damping: 40,
                                            }}
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    )
}
