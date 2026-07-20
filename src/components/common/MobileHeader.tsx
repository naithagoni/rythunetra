import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import {
    Home,
    Sprout as CropsIcon,
    Bug,
    Sprout,
    FlaskConical,
    Settings,
    Shield,
    LogIn,
    LogOut,
    MoreHorizontal,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAdmin } from '@/hooks/useAdmin'
import { AI_ENABLED } from '@/config/env'
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

interface TabItem {
    to: string
    label: string
    icon: LucideIcon
    end?: boolean
    aiOnly?: boolean
}

interface MoreItem {
    to: string
    label: string
    icon: LucideIcon
    aiOnly?: boolean
    accent?: boolean
}

export function MobileHeader() {
    const { t } = useTranslation()
    const { user, signOut } = useAuth()
    const { isAdmin } = useAdmin()
    const navigate = useNavigate()
    const location = useLocation()
    const [moreOpen, setMoreOpen] = useState(false)

    // Thumb-priority destinations live directly on the bar; account/admin/auth
    // are one tap away under "More". (Advisor/chat stays reachable via the
    // floating chat FAB; the disease Scanner is opened from its own pages.)
    const tabs: TabItem[] = [
        { to: '/', label: t('nav.home'), icon: Home, end: true },
        { to: '/crops', label: t('nav.crops'), icon: CropsIcon },
        { to: '/diseases', label: t('common.diseases'), icon: Bug },
    ]

    const moreItems: MoreItem[] = [
        {
            to: '/recommend',
            label: t('nav.recommend'),
            icon: Sprout,
            aiOnly: true,
        },
        ...(user
            ? [
                  {
                      to: '/my-preparations',
                      label: t('common.myPreparations'),
                      icon: FlaskConical,
                  },
                  {
                      to: '/settings',
                      label: t('common.settings'),
                      icon: Settings,
                  },
              ]
            : []),
        ...(isAdmin
            ? [
                  {
                      to: '/admin',
                      label: t('common.admin'),
                      icon: Shield,
                      accent: true,
                  },
              ]
            : []),
    ].filter((i) => !i.aiOnly || AI_ENABLED)

    // "More" counts as active when the current route is one of its entries so
    // the bar always reflects where the user is.
    const moreActive = moreItems.some(
        (i) =>
            location.pathname === i.to ||
            location.pathname.startsWith(i.to + '/'),
    )

    const handleSignOut = async () => {
        setMoreOpen(false)
        await signOut()
        navigate('/')
    }

    return (
        <>
            {/* Top strip — brand + language + (signed-out) login. Kept minimal;
                primary navigation lives in the floating bottom bar. */}
            <header className="sticky top-0 z-40 pt-2 md:hidden backdrop-blur-md">
                <div className="flex h-14 items-center justify-between gap-2 px-6">
                    <Link
                        to="/"
                        aria-label={t('common.appName')}
                        className="group flex min-w-0 items-center"
                    >
                        <LogoMark size="md" className="shrink-0" />
                    </Link>
                    <div className="flex shrink-0 items-center gap-1.5">
                        <LanguageToggle />
                        {!user && (
                            <Button asChild size="sm" className="rounded-full">
                                <Link to="/login">
                                    <LogIn data-icon="inline-start" />
                                    {t('common.login')}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Floating bottom tab bar */}
            <nav
                aria-label={t('common.menu', 'Menu')}
                className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] md:hidden"
            >
                <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-border bg-popover/90 p-1.5 shadow-elevated backdrop-blur-xl">
                    {tabs.map((tab) => (
                        <NavLink key={tab.to} to={tab.to} end={tab.end}>
                            {({ isActive }) => (
                                <TabButton
                                    icon={tab.icon}
                                    label={tab.label}
                                    active={isActive}
                                />
                            )}
                        </NavLink>
                    ))}

                    {/* More — opens the SAME account panel as the desktop header
                        (ui/dropdown-menu.tsx). Using the real primitives means
                        the styling matches by construction, not by copying. */}
                    <DropdownMenu open={moreOpen} onOpenChange={setMoreOpen}>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                aria-label={t('nav.more', 'More')}
                                className="appearance-none border-0 bg-transparent p-0"
                            >
                                <TabButton
                                    icon={MoreHorizontal}
                                    label={t('nav.more', 'More')}
                                    active={moreActive}
                                    open={moreOpen}
                                />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            side="top"
                            sideOffset={12}
                            className="w-56"
                        >
                            {user && (
                                <>
                                    <DropdownMenuLabel>
                                        <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                                            {t('nav.account', 'Account')}
                                        </p>
                                        <p className="mt-0.5 truncate text-sm font-medium">
                                            {user.name || user.email}
                                        </p>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                </>
                            )}
                            <DropdownMenuGroup>
                                {moreItems.map((item) => (
                                    <DropdownMenuItem
                                        key={item.to}
                                        onClick={() => navigate(item.to)}
                                        className={cn(
                                            item.accent &&
                                                'text-tertiary-link focus:text-tertiary-link',
                                        )}
                                    >
                                        <item.icon className="size-4" />
                                        {item.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                            {user && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        variant="destructive"
                                        onClick={handleSignOut}
                                    >
                                        <LogOut className="size-4" />
                                        {t('common.logout')}
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
        </>
    )
}

/**
 * Expanding-pill tab. Inactive = icon only; active = icon + label inside a
 * sage pill. The pill is a single shared `layoutId` element so it physically
 * slides from the old tab to the new one on navigation (spring), instead of
 * cross-fading. Honors prefers-reduced-motion via motion/react's respectMotion.
 *
 * `active` drives the shared route pill — ONLY ONE tab may be active at a time,
 * else the single layoutId pill teleports and strips the real tab's background,
 * leaving its light text unreadable. `open` is a separate, non-pill highlight
 * for the More trigger while its menu is open (a muted wash + readable text),
 * so opening the menu never steals the pill from the current route.
 */
function TabButton({
    icon: Icon,
    label,
    active,
    open = false,
}: {
    icon: LucideIcon
    label: string
    active: boolean
    open?: boolean
}) {
    return (
        <span
            className={cn(
                'relative flex h-10 items-center rounded-full px-3.5 transition-colors',
                active
                    ? 'text-primary-foreground'
                    : open
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
            )}
        >
            {active && (
                <motion.span
                    layoutId="mobile-tab-pill"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 480, damping: 38 }}
                />
            )}
            <Icon className="relative z-10 size-5 shrink-0" />
            {active && (
                <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="relative z-10 ml-1.5 overflow-hidden whitespace-nowrap text-sm font-medium"
                >
                    {label}
                </motion.span>
            )}
        </span>
    )
}
