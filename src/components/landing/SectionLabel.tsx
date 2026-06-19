interface SectionLabelProps {
    number: string
    title: string
    subtitle?: string
}

export function SectionLabel({ number, title, subtitle }: SectionLabelProps) {
    return (
        <div className="mb-16">
            <span className="font-mono text-xs font-medium text-[#636467] tracking-[0.12em] uppercase">
                {number}
            </span>
            <h2 className="mt-3 text-3xl sm:text-[42px] font-bold text-[#e4e5e9] tracking-[-0.03em] leading-[1.1]">
                {title}
            </h2>
            {subtitle && (
                <p className="mt-4 text-[#9c9da1] text-base sm:text-lg max-w-xl leading-relaxed">
                    {subtitle}
                </p>
            )}
        </div>
    )
}
