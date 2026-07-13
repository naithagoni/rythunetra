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
        <header className="sticky top-0 z-50 hidden md:block border-b border-border bg-background/70 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                {/* Brand */}
                <Link
                    to="/"
                    className="group flex shrink-0 items-center gap-2.5"
                >
                    <LogoMark size="md" />
                    <span className="text-lg brand-wordmark">
                        <span className="text-foreground">Rythu</span>
                        <span className="text-muted-foreground transition-colors group-hover:text-foreground">
                            Netra
                        </span>
                    </span>
                </Link>

                {/* Center pill nav */}
                <nav className="flex items-center gap-0.5 rounded-full border border-border bg-muted/50 p-1">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className="group/nav relative rounded-full px-3.5 py-1.5"
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-pill"
                                            className="absolute inset-0 rounded-full bg-primary"
                                            transition={{
                                                type: 'spring',
                                                stiffness: 480,
                                                damping: 38,
                                            }}
                                        />
                                    )}
                                    <span
                                        className={cn(
                                            'relative z-10 inline-flex items-center gap-1.5 text-sm font-medium transition-colors',
                                            isActive
                                                ? 'text-primary-foreground'
                                                : 'text-muted-foreground group-hover/nav:text-foreground',
                                        )}
                                    >
                                        <link.icon className="size-4" />
                                        {link.label}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1.5">
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
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                                        Account
                                    </p>
                                    <p className="mt-0.5 truncate text-sm font-medium">
                                        {user.name || user.email}
                                    </p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    {isAdmin && (
                                        <DropdownMenuItem
                                            onClick={() => navigate('/admin')}
                                            className="text-link focus:text-link"
                                        >
                                            <Shield className="size-4" />
                                            {t('common.admin')}
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                        onClick={() =>
                                            navigate('/my-preparations')
                                        }
                                    >
                                        <FlaskConical className="size-4" />
                                        {t('common.myPreparations')}
                                    </DropdownMenuItem>
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
        </header>
    )
}
