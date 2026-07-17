import { Suspense, lazy } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useAuth } from '@/hooks/useAuth'
import { Header } from './Header'
import { MobileHeader } from './MobileHeader'
import { Footer } from './Footer'

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
            <main className="flex-1">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer />
            {user && (
                <Suspense>
                    <ChatWidget />
                </Suspense>
            )}
        </div>
    )
}
