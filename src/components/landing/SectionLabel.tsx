interface SectionLabelProps {
    number: string
    title: string
    subtitle?: string
}

export function SectionLabel({ number, title, subtitle }: SectionLabelProps) {
    return (
        <div className="mb-16">
            <span className="font-mono text-xs font-medium text-link tracking-[0.12em] uppercase">
                {number}
            </span>
            <h2 className="mt-3 text-display-lg font-medium sm:text-[42px] text-foreground leading-[1.1] tracking-[-0.04em]">
                {title}
            </h2>
            {subtitle && (
                <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-xl leading-relaxed">
                    {subtitle}
                </p>
            )}
        </div>
    )
}
