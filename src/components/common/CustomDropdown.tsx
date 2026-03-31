import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown, Check } from 'lucide-react'
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
    const [open, setOpen] = useState(false)
    const [focusedIndex, setFocusedIndex] = useState(-1)
    const containerRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLUListElement>(null)

    const selectedLabel =
        options.find((o) => o.value === value)?.label ?? placeholder ?? ''

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Scroll focused option into view
    useEffect(() => {
        if (open && focusedIndex >= 0 && listRef.current) {
            const item = listRef.current.children[focusedIndex] as HTMLElement
            item?.scrollIntoView({ block: 'nearest' })
        }
    }, [focusedIndex, open])

    const handleSelect = useCallback(
        (val: string) => {
            onChange(val)
            setOpen(false)
        },
        [onChange],
    )

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault()
                    if (!open) {
                        setOpen(true)
                        setFocusedIndex(0)
                    } else {
                        setFocusedIndex((prev) =>
                            prev < options.length - 1 ? prev + 1 : 0,
                        )
                    }
                    break
                case 'ArrowUp':
                    e.preventDefault()
                    if (open) {
                        setFocusedIndex((prev) =>
                            prev > 0 ? prev - 1 : options.length - 1,
                        )
                    }
                    break
                case 'Enter':
                case ' ':
                    e.preventDefault()
                    if (open && focusedIndex >= 0) {
                        handleSelect(options[focusedIndex].value)
                    } else {
                        setOpen(true)
                        setFocusedIndex(0)
                    }
                    break
                case 'Escape':
                    setOpen(false)
                    break
            }
        },
        [open, focusedIndex, options, handleSelect],
    )

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            <button
                type="button"
                onClick={() => {
                    setOpen((prev) => !prev)
                    if (!open) setFocusedIndex(-1)
                }}
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={ariaLabel}
                className={cn(
                    variant === 'form'
                        ? 'flex items-center justify-between w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl bg-white shadow-input hover:border-primary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 focus:outline-none cursor-pointer transition-all duration-200'
                        : 'flex items-center gap-1.5 text-sm text-neutral-600 hover:text-primary-600 focus:text-primary-600 focus:outline-none cursor-pointer transition-colors',
                )}
            >
                <span className="flex items-center gap-1.5">
                    {icon}
                    <span
                        className={cn(
                            variant === 'form'
                                ? 'truncate'
                                : 'w-30 truncate text-left',
                            !value && 'text-neutral-400',
                        )}
                    >
                        {selectedLabel}
                    </span>
                </span>
                <ChevronDown
                    className={cn(
                        'h-3.5 w-3.5 transition-transform duration-300',
                        open && 'rotate-180',
                    )}
                />
            </button>

            {open && (
                <ul
                    ref={listRef}
                    role="listbox"
                    aria-activedescendant={
                        focusedIndex >= 0
                            ? `dropdown-option-${focusedIndex}`
                            : undefined
                    }
                    className="absolute left-0 right-0 mt-2 min-w-45 max-h-60 overflow-auto bg-white rounded-xl border border-neutral-200 p-1.5 z-50 animate-scale-in shadow-dropdown"
                >
                    {options.map((option, idx) => (
                        <li
                            key={option.value}
                            id={`dropdown-option-${idx}`}
                            role="option"
                            aria-selected={option.value === value}
                            onClick={() => handleSelect(option.value)}
                            onMouseEnter={() => setFocusedIndex(idx)}
                            className={cn(
                                'flex items-center justify-between px-3 py-2.5 text-sm cursor-pointer transition-all duration-150 rounded-lg',
                                option.value === value
                                    ? 'text-primary-700 bg-primary-50 font-medium'
                                    : idx % 2 === 0
                                      ? 'text-neutral-700 bg-white'
                                      : 'text-neutral-700 bg-neutral-50',
                                focusedIndex === idx &&
                                    option.value !== value &&
                                    'bg-neutral-100!',
                            )}
                        >
                            <span className="truncate">{option.label}</span>
                            {option.value === value && (
                                <Check className="h-4 w-4 shrink-0 ml-2" />
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
