import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
    text?: string
}

export function LoadingSpinner({
    size = 'md',
    className,
    text,
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    }

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-3 py-16',
                className,
            )}
        >
            <div className="relative">
                <Loader2
                    className={cn(
                        'animate-spin text-primary-500',
                        sizeClasses[size],
                    )}
                />
            </div>
            {text && (
                <p className="text-sm font-medium text-neutral-500">{text}</p>
            )}
        </div>
    )
}
