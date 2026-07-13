import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
    Menu,
    Home,
    Sprout as CropsIcon,
    Bug,
    Sprout,
    FlaskConical,
    ScanLine,
    MessageSquare,
    Settings,
    Shield,
    LogIn,
    LogOut,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAdmin } from '@/hooks/useAdmin'
import { AI_ENABLED } from '@/config/env'
import { LanguageToggle } from './LanguageToggle'
import { ThemeToggle } from './ThemeToggle'
import { LogoMark } from './LogoMark'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'

interface NavItem {
    to: string
    label: string
    icon: LucideIcon
    end?: boolean
    aiOnly?: boolean
}

export function MobileHeader() {
    const { t } = useTranslation()
    const { user, signOut } = useAuth()
    const { isAdmin } = useAdmin()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)

    const primary: NavItem[] = [
        { to: '/', label: t('nav.home'), icon: Home, end: true },
        { to: '/crops', label: t('nav.crops'), icon: CropsIcon },
        { to: '/diseases', label: t('common.diseases'), icon: Bug },
        { to: '/recommend', label: t('nav.recommend'), icon: Sprout, aiOnly: true },
        { to: '/scanner', label: t('nav.scanner', 'Scanner'), icon: ScanLine, aiOnly: true },
        { to: '/chat', label: t('nav.advisor', 'Advisor'), icon: MessageSquare, aiOnly: true },
    ]

    const account: NavItem[] = user
        ? [
              {
                  to: '/my-preparations',
                  label: t('common.myPreparations'),
                  icon: FlaskConical,
              },
              { to: '/settings', label: t('common.settings'), icon: Settings },
          ]
        : []

    const handleSignOut = async () => {
        setOpen(false)
        await signOut()
        navigate('/')
    }

    // Static string (not a function) so it survives Radix Slot's className
    // merge inside <SheetClose asChild>. Active state via aria-current.
    const linkClass =
        'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:text-foreground [&>svg]:size-4 [&>svg]:shrink-0'

    return (
        <header className="sticky top-0 z-50 md:hidden bg-background/80 backdrop-blur-md border-b border-border">
            <div className="flex items-center justify-between gap-2 px-4 h-14">
                <Link
                    to="/"
                    className="group flex min-w-0 items-center gap-2.5"
                >
                    <LogoMark size="sm" className="shrink-0" />
                    <span className="truncate text-base brand-wordmark">
                        <span className="text-foreground">Rythu</span>
                        <span className="text-muted-foreground">Netra</span>
                    </span>
                </Link>
                <div className="flex shrink-0 items-center gap-1">
                    <ThemeToggle />
                    <LanguageToggle />
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label={t('common.menu', 'Menu')}
                            >
                                <Menu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72 gap-0 p-0">
                            <SheetHeader className="border-b border-border">
                                <SheetTitle className="flex items-center gap-2.5">
                                    <LogoMark size="sm" />
                                    <span className="brand-wordmark text-base">
                                        <span className="text-foreground">
                                            Rythu
                                        </span>
                                        <span className="text-muted-foreground">
                                            Netra
                                        </span>
                                    </span>
                                </SheetTitle>
                            </SheetHeader>

                            <nav className="flex flex-col gap-1 p-3 overflow-y-auto">
                                {primary
                                    .filter((i) => !i.aiOnly || AI_ENABLED)
                                    .map((item) => (
                                        <SheetClose asChild key={item.to}>
                                            <NavLink
                                                to={item.to}
                                                end={item.end}
                                                className={linkClass}
                                            >
                                                <item.icon className="size-4" />
                                                {item.label}
                                            </NavLink>
                                        </SheetClose>
                                    ))}

                                {account.length > 0 && (
                                    <div className="my-2 h-px bg-border" />
                                )}
                                {account.map((item) => (
                                    <SheetClose asChild key={item.to}>
                                        <NavLink
                                            to={item.to}
                                            className={linkClass}
                                        >
                                            <item.icon className="size-4" />
                                            {item.label}
                                        </NavLink>
                                    </SheetClose>
                                ))}

                                {isAdmin && (
                                    <SheetClose asChild>
                                        <NavLink
                                            to="/admin"
                                            className={linkClass}
                                        >
                                            <Shield className="size-4" />
                                            {t('common.admin')}
                                        </NavLink>
                                    </SheetClose>
                                )}
                            </nav>

                            <div className="mt-auto border-t border-border p-3">
                                {user ? (
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleSignOut}
                                    >
                                        <LogOut data-icon="inline-start" />
                                        {t('common.logout')}
                                    </Button>
                                ) : (
                                    <SheetClose asChild>
                                        <Button asChild className="w-full">
                                            <Link to="/login">
                                                <LogIn data-icon="inline-start" />
                                                {t('common.login')}
                                            </Link>
                                        </Button>
                                    </SheetClose>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
