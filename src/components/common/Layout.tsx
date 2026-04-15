import { Suspense, lazy } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useAuth } from '@/hooks/useAuth'
import { Header } from './Header'
import { MobileHeader } from './MobileHeader'
import { Footer } from './Footer'
import { BottomNav } from './BottomNav'

const ChatWidget = lazy(() =>
    import('./ChatWidget').then((m) => ({ default: m.ChatWidget })),
)

export function Layout() {
    const location = useLocation()
    const { user } = useAuth()

    return (
        <div className="min-h-screen flex flex-col">
            <MobileHeader />
            <Header />
            <main className="flex-1 pb-20 md:pb-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer className="hidden md:block" />
            <BottomNav />
            {user && (
                <Suspense>
                    <ChatWidget />
                </Suspense>
            )}
        </div>
    )
}
