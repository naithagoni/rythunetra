import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'
import { cn } from '@/utils/cn'

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
    const [focusedIndex, setFocusedIndex] = useState(-1)
    const [search, setSearch] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLUListElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const filteredOptions = search
        ? options.filter((o) =>
              o.label.toLowerCase().includes(search.toLowerCase()),
          )
        : options

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false)
                setSearch('')
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

    // Focus input when dropdown opens
    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus()
        }
    }, [open])

    const toggleValue = useCallback(
        (val: string) => {
            if (values.includes(val)) {
                onChange(values.filter((v) => v !== val))
            } else {
                onChange([...values, val])
            }
        },
        [values, onChange],
    )

    const removeValue = useCallback(
        (val: string) => {
            onChange(values.filter((v) => v !== val))
        },
        [values, onChange],
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
                            prev < filteredOptions.length - 1 ? prev + 1 : 0,
                        )
                    }
                    break
                case 'ArrowUp':
                    e.preventDefault()
                    if (open) {
                        setFocusedIndex((prev) =>
                            prev > 0 ? prev - 1 : filteredOptions.length - 1,
                        )
                    }
                    break
                case 'Enter':
                    e.preventDefault()
                    if (
                        open &&
                        focusedIndex >= 0 &&
                        focusedIndex < filteredOptions.length
                    ) {
                        toggleValue(filteredOptions[focusedIndex].value)
                    } else if (!open) {
                        setOpen(true)
                        setFocusedIndex(0)
                    }
                    break
                case 'Escape':
                    setOpen(false)
                    setSearch('')
                    break
                case 'Backspace':
                    if (!search && values.length > 0) {
                        removeValue(values[values.length - 1])
                    }
                    break
            }
        },
        [
            open,
            focusedIndex,
            filteredOptions,
            toggleValue,
            removeValue,
            search,
            values,
        ],
    )

    const getLabel = (val: string) =>
        options.find((o) => o.value === val)?.label ?? val

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            {/* Trigger / selected chips */}
            <div
                onClick={() => {
                    setOpen(true)
                    setFocusedIndex(-1)
                }}
                className="flex flex-wrap items-center gap-1.5 min-h-10.5 px-3 py-2 border border-neutral-200 rounded-xl bg-white shadow-input hover:border-primary-400 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200 cursor-text transition-all duration-200"
            >
                {values.map((val) => (
                    <span
                        key={val}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary-100 text-primary-700 text-sm font-medium"
                    >
                        {getLabel(val)}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                removeValue(val)
                            }}
                            className="hover:text-primary-900 transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        setFocusedIndex(0)
                        if (!open) setOpen(true)
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={values.length === 0 ? placeholder : ''}
                    aria-label={ariaLabel}
                    className="flex-1 min-w-20 text-sm outline-none bg-transparent placeholder:text-neutral-400"
                />
                <ChevronDown
                    className={cn(
                        'h-4 w-4 text-neutral-400 shrink-0 transition-transform duration-200',
                        open && 'rotate-180',
                    )}
                />
            </div>

            {/* Dropdown list */}
            {open && (
                <ul
                    ref={listRef}
                    role="listbox"
                    aria-multiselectable="true"
                    aria-activedescendant={
                        focusedIndex >= 0
                            ? `multi-option-${focusedIndex}`
                            : undefined
                    }
                    className="absolute left-0 right-0 mt-2 max-h-60 overflow-auto bg-white rounded-xl shadow-dropdown border border-neutral-200 p-1.5 z-50 animate-scale-in"
                >
                    {filteredOptions.length === 0 && (
                        <li className="px-3 py-2.5 text-sm text-neutral-400 italic">
                            No matching options
                        </li>
                    )}
                    {filteredOptions.map((option, idx) => {
                        const isSelected = values.includes(option.value)
                        return (
                            <li
                                key={option.value}
                                id={`multi-option-${idx}`}
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => toggleValue(option.value)}
                                onMouseEnter={() => setFocusedIndex(idx)}
                                className={cn(
                                    'flex items-center gap-2.5 px-3 py-2.5 text-sm cursor-pointer transition-all duration-150 rounded-lg',
                                    isSelected
                                        ? 'text-primary-700 bg-primary-50'
                                        : idx % 2 === 0
                                          ? 'text-neutral-700 bg-white'
                                          : 'text-neutral-700 bg-neutral-50',
                                    focusedIndex === idx &&
                                        !isSelected &&
                                        'bg-neutral-100!',
                                    focusedIndex === idx &&
                                        isSelected &&
                                        'bg-primary-100!',
                                )}
                            >
                                <span
                                    className={cn(
                                        'flex items-center justify-center h-4.5 w-4.5 rounded-md border-2 shrink-0 transition-all duration-150',
                                        isSelected
                                            ? 'bg-primary-600 border-primary-600 shadow-sm'
                                            : 'border-neutral-300 bg-white',
                                    )}
                                >
                                    {isSelected && (
                                        <Check className="h-3 w-3 text-white" />
                                    )}
                                </span>
                                <span className="truncate">{option.label}</span>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
