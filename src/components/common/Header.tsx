import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import {
    User,
    LogOut,
    Settings,
    Shield,
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
        { to: '/crops', label: t('nav.crops') },
        { to: '/diseases', label: t('common.diseases') },
        { to: '/recommend', label: t('nav.recommend') },
    ]

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    return (
        <header className="sticky top-0 z-50 hidden px-4 pt-3 md:block">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 rounded-xl border border-border bg-background/80 pr-2.5 pl-5 backdrop-blur-xl">
                {/* Brand */}
                <Link
                    to="/"
                    aria-label={t('common.appName')}
                    className="group flex shrink-0 items-center"
                >
                    <LogoMark
                        size="md"
                        className="transition-transform duration-200 group-hover:scale-105"
                    />
                </Link>

                {/* Center nav — inline links, sliding green pill on active */}
                <nav className="flex items-center gap-1">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                cn(
                                    'group/nav relative rounded-full px-4 py-2 transition-colors',
                                    !isActive && 'hover:bg-muted',
                                )
                            }
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
                                            'relative z-10 inline-flex items-center text-sm font-medium transition-colors',
                                            isActive
                                                ? 'text-primary-foreground'
                                                : 'text-muted-foreground group-hover/nav:text-foreground',
                                        )}
                                    >
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
                                    className="rounded-full ring-1 ring-border hover:bg-transparent"
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
                        <Button asChild size="sm" className="ml-1 rounded-full">
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
