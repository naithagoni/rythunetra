import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { cn } from '@/utils/cn'

export interface DropdownOption {
    value: string
    label: string
}

interface CustomDropdownProps {
    options: DropdownOption[]
    value: string
    onChange: (value: string) => void
    icon?: React.ReactNode
    placeholder?: string
    className?: string
    ariaLabel?: string
    variant?: 'compact' | 'form'
}

export function CustomDropdown({
    options,
    value,
    onChange,
    icon,
    placeholder,
    className,
    ariaLabel,
    variant = 'compact',
}: CustomDropdownProps) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger
                className={cn(
                    variant === 'form' ? 'w-full' : 'w-fit',
                    className,
                )}
                aria-label={ariaLabel}
            >
                <span className="flex items-center gap-1.5">
                    {icon}
                    <SelectValue placeholder={placeholder} />
                </span>
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
