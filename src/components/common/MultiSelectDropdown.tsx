import { useState } from 'react'
import { X, Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'

export interface MultiSelectOption {
    value: string
    label: string
}

interface MultiSelectDropdownProps {
    options: MultiSelectOption[]
    values: string[]
    onChange: (values: string[]) => void
    placeholder?: string
    className?: string
    ariaLabel?: string
}

export function MultiSelectDropdown({
    options,
    values,
    onChange,
    placeholder = 'Select...',
    className,
    ariaLabel,
}: MultiSelectDropdownProps) {
    const [open, setOpen] = useState(false)

    const toggleValue = (val: string) => {
        if (values.includes(val)) {
            onChange(values.filter((v) => v !== val))
        } else {
            onChange([...values, val])
        }
    }

    const removeValue = (val: string, e: React.MouseEvent) => {
        e.stopPropagation()
        onChange(values.filter((v) => v !== val))
    }

    const getLabel = (val: string) =>
        options.find((o) => o.value === val)?.label ?? val

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label={ariaLabel}
                    className={cn(
                        'w-full justify-between h-auto min-h-9 py-1.5 px-3 font-normal',
                        className,
                    )}
                >
                    <div className="flex flex-wrap gap-1 flex-1">
                        {values.length === 0 ? (
                            <span className="text-muted-foreground">
                                {placeholder}
                            </span>
                        ) : (
                            values.map((val) => (
                                <Badge
                                    key={val}
                                    variant="secondary"
                                    className="gap-1 pr-1"
                                >
                                    <span className="truncate max-w-32">
                                        {getLabel(val)}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={(e) => removeValue(val, e)}
                                        className="rounded-full hover:bg-muted-foreground/20 p-0.5"
                                    >
                                        <X className="size-3" />
                                    </button>
                                </Badge>
                            ))
                        )}
                    </div>
                    <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command>
                    <CommandInput placeholder={`Search...`} />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = values.includes(option.value)
                                return (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        onSelect={() =>
                                            toggleValue(option.value)
                                        }
                                        data-checked={isSelected || undefined}
                                    >
                                        <div
                                            className={cn(
                                                'mr-2 flex size-4 items-center justify-center rounded-sm border border-primary',
                                                isSelected
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'opacity-50',
                                            )}
                                        >
                                            {isSelected && (
                                                <Check className="size-3" />
                                            )}
                                        </div>
                                        <span className="truncate">
                                            {option.label}
                                        </span>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
