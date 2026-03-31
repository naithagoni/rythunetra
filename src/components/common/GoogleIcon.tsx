interface GoogleIconProps {
    className?: string
}

export function GoogleIcon({ className = 'h-5 w-5' }: GoogleIconProps) {
    return <img src="/icons/google.svg" alt="Google" className={className} />
}
