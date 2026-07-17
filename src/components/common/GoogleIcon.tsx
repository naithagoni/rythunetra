interface GoogleIconProps {
    className?: string
}

export function GoogleIcon({ className = 'size-5' }: GoogleIconProps) {
    return <img src="/icons/google.svg" alt="Google" className={className} />
}
