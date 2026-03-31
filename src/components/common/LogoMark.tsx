import { Sprout } from 'lucide-react'
import { cn } from '@/utils/cn'

interface LogoMarkProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
    variant?: 'default' | 'light'
}

export function LogoMark({
    size = 'md',
    className,
    variant = 'default',
}: LogoMarkProps) {
    const config = {
        sm: { box: 'w-8 h-8 rounded-lg', icon: 'h-4 w-4' },
        md: { box: 'w-9 h-9 rounded-lg', icon: 'h-[18px] w-[18px]' },
        lg: { box: 'w-11 h-11 rounded-xl', icon: 'h-5.5 w-5.5' },
    }

    const { box, icon } = config[size]

    return (
        <div
            className={cn(
                box,
                'relative flex items-center justify-center',
                variant === 'light' ? 'bg-white/10' : 'bg-primary-600',
                className,
            )}
        >
            <Sprout
                className={cn(icon, 'relative text-white')}
                strokeWidth={2.2}
            />
        </div>
    )
}
