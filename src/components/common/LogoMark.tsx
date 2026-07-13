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
        sm: { box: 'size-8 rounded-lg', icon: 'size-4' },
        md: { box: 'size-9 rounded-lg', icon: 'h-[18px] w-[18px]' },
        lg: { box: 'size-11 rounded-xl', icon: 'size-5.5' },
    }

    const { box, icon } = config[size]

    return (
        <div
            className={cn(
                box,
                'relative flex items-center justify-center',
                variant === 'light'
                    ? 'bg-white/15 backdrop-blur-sm'
                    : 'bg-primary',
                className,
            )}
        >
            <Sprout
                className={cn(
                    icon,
                    'relative',
                    variant === 'light' ? 'text-white' : 'text-primary-foreground',
                )}
                strokeWidth={2.2}
            />
        </div>
    )
}
