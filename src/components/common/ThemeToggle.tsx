import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ThemeToggleProps {
    className?: string
}

/** Light/dark theme switch backed by next-themes. */
export function ThemeToggle({ className }: ThemeToggleProps) {
    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // next-themes only knows the theme after mount; avoid hydration/icon flicker.
    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true))
        return () => cancelAnimationFrame(id)
    }, [])

    const isDark = resolvedTheme === 'dark'

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={className}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
        >
            {mounted && isDark ? <Moon /> : <Sun />}
        </Button>
    )
}
