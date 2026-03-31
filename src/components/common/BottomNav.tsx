import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'
import { AI_ENABLED } from '@/config/env'
import { Home, Wheat, Bug, FlaskConical, User, Lock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useMemo } from 'react'

interface TabConfig {
    to: string
    label: string
    icon: LucideIcon
    end?: boolean
    aiOnly?: boolean
}

export function BottomNav() {
    const { t } = useTranslation()
    const { user } = useAuth()
    const location = useLocation()

    const tabs: TabConfig[] = [
        { to: '/', label: t('nav.home'), icon: Home, end: true },
        { to: '/crops', label: t('nav.crops'), icon: Wheat },
        { to: '/diseases', label: t('nav.diseases'), icon: Bug },
        {
            to: '/recommend',
            label: t('nav.recommend_short', 'Recommend'),
            icon: FlaskConical,
            aiOnly: true,
        },
        {
            to: user ? '/settings' : '/login',
            label: user ? t('common.settings') : t('common.login'),
            icon: User,
        },
    ]

    const activeIndex = useMemo(() => {
        const idx = tabs.findIndex((tab) => {
            if (tab.end) return location.pathname === tab.to
            return location.pathname.startsWith(tab.to)
        })
        return idx >= 0 ? idx : 0
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, user])

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom md:hidden">
            <div className="mnav">
                {/* SVG cutout mask — the notch follows the active tab */}
                <svg
                    className="mnav-cutout"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    style={{ borderRadius: '24px 24px 0 0' }}
                >
                    <defs>
                        <mask id="mnav-mask">
                            {/* White = visible, black = hidden */}
                            <rect width="100%" height="100%" fill="white" />
                            {/* The notch: a circle cut out at the active tab center */}
                            <circle
                                cx={`${(activeIndex + 0.5) * (100 / tabs.length)}%`}
                                cy="6"
                                r="30"
                                fill="black"
                                style={{
                                    transition:
                                        'cx 1s cubic-bezier(0.25, 1, 0.5, 1)',
                                }}
                            />
                        </mask>
                    </defs>
                    <rect
                        width="100%"
                        height="100%"
                        fill="#030b07"
                        mask="url(#mnav-mask)"
                    />
                </svg>

                {/* Floating green pill behind the active icon */}
                <div
                    className="mnav-pill"
                    style={{
                        left: `calc(${(activeIndex + 0.5) * (100 / tabs.length)}% - 24px)`,
                    }}
                />

                {/* Tab items */}
                <ul className="mnav-tabs">
                    {tabs.map((tab, i) => {
                        const isActive = i === activeIndex
                        const disabled = tab.aiOnly && !AI_ENABLED

                        if (disabled) {
                            return (
                                <li key={tab.to} className="mnav-tab">
                                    <div className="mnav-tab-inner mnav-tab-inner--disabled">
                                        <span className="mnav-tab-icon">
                                            <Lock className="h-6 w-6" />
                                        </span>
                                    </div>
                                </li>
                            )
                        }

                        return (
                            <li
                                key={tab.to}
                                className={cn(
                                    'mnav-tab',
                                    isActive && 'is-active',
                                )}
                            >
                                <NavLink
                                    to={tab.to}
                                    end={tab.end}
                                    className="mnav-tab-inner"
                                >
                                    <span className="mnav-tab-icon">
                                        <tab.icon
                                            className="h-6 w-6"
                                            strokeWidth={isActive ? 2.4 : 1.7}
                                        />
                                    </span>
                                    <span className="mnav-tab-label">
                                        {tab.label}
                                    </span>
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </nav>
    )
}
