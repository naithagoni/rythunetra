import { Spinner } from '@/components/ui/spinner'
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
        sm: 'size-4',
        md: 'size-8',
        lg: 'size-12',
    }

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-3 py-16',
                className,
            )}
        >
            <Spinner className={cn('text-muted-foreground', sizeClasses[size])} />
            {text && (
                <p className="text-sm font-medium text-muted-foreground">
                    {text}
                </p>
            )}
        </div>
    )
}
