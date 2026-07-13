import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDiseases } from '@/hooks/useDiseases'
import { useLanguage } from '@/hooks/useLanguage'
import { usePageTitle } from '@/hooks/usePageTitle'
import { DiseaseGrid } from '@/components/disease/DiseaseGrid'
import { AI_ENABLED } from '@/config/env'
import {
    ChevronLeft,
    ChevronRight,
    X,
    Search,
    SlidersHorizontal,
    Camera,
    Check,
} from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from '@/components/ui/input-group'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PageHeader } from '@/components/common/PageHeader'
import { PageContainer } from '@/components/common/PageContainer'
import { Toolbar } from '@/components/common/Toolbar'
import { ScanDialog } from '@/components/scan/ScanDialog'
import { cn } from '@/utils/cn'

const SEVERITY_OPTIONS = ['low', 'moderate', 'high', 'critical'] as const

export function DiseaseListPage() {
    const { t } = useTranslation()
    const { currentLanguage } = useLanguage()
    usePageTitle('Diseases — Crop Disease Encyclopedia')
    useQueryClient()
    const [page, setPage] = useState(1)
    const [searchInput, setSearchInput] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [severityFilter, setSeverityFilter] = useState<string | undefined>()
    const [scanOpen, setScanOpen] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput)
            setPage(1)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchInput])

    const { data: result, isLoading } = useDiseases({
        language: currentLanguage,
        page,
        search: debouncedSearch || undefined,
        severity: severityFilter,
    })

    const diseases = result?.data ?? []
    const totalCount = result?.count ?? 0
    const totalPages = Math.ceil(totalCount / 12)

    return (
        <PageContainer size="xl">
            <PageHeader
                title={t('diseases.title')}
                description={t('diseases.subtitle', '')}
            />

            <Toolbar
                start={
                    <InputGroup className="max-w-lg">
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                        <InputGroupInput
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder={t('common.search')}
                        />
                        {searchInput && (
                            <InputGroupAddon align="inline-end">
                                <InputGroupButton
                                    size="icon-xs"
                                    onClick={() => setSearchInput('')}
                                    aria-label="Clear search"
                                >
                                    <X />
                                </InputGroupButton>
                            </InputGroupAddon>
                        )}
                    </InputGroup>
                }
                end={
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        severityFilter &&
                                            'border-foreground/30',
                                    )}
                                >
                                    <SlidersHorizontal data-icon="inline-start" />
                                    {severityFilter
                                        ? t(`diseases.${severityFilter}`)
                                        : t('diseases.filterBySeverity')}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuLabel>
                                    {t('diseases.filterBySeverity')}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => {
                                        setSeverityFilter(undefined)
                                        setPage(1)
                                    }}
                                >
                                    {!severityFilter && (
                                        <Check className="size-4" />
                                    )}
                                    <span
                                        className={cn(!severityFilter && 'font-medium')}
                                    >
                                        {t('common.all')}
                                    </span>
                                </DropdownMenuItem>
                                {SEVERITY_OPTIONS.map((s) => (
                                    <DropdownMenuItem
                                        key={s}
                                        onClick={() => {
                                            setSeverityFilter(s)
                                            setPage(1)
                                        }}
                                    >
                                        {severityFilter === s && (
                                            <Check className="size-4" />
                                        )}
                                        <span
                                            className={cn(
                                                severityFilter === s &&
                                                    'font-medium',
                                            )}
                                        >
                                            {t(`diseases.${s}`)}
                                        </span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {AI_ENABLED && (
                            <Button onClick={() => setScanOpen(true)}>
                                <Camera data-icon="inline-start" />
                                <span className="hidden sm:inline">
                                    {t('diseases.scanPlant')}
                                </span>
                            </Button>
                        )}
                    </>
                }
            />

            <DiseaseGrid
                diseases={diseases}
                loading={isLoading}
                language={currentLanguage}
            />

            {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeft data-icon="inline-start" />
                        {t('common.previous')}
                    </Button>
                    <span className="text-sm font-medium text-muted-foreground tabular-nums">
                        {page} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                    >
                        {t('common.next')}
                        <ChevronRight data-icon="inline-end" />
                    </Button>
                </div>
            )}

            {AI_ENABLED && (
                <ScanDialog open={scanOpen} onOpenChange={setScanOpen} />
            )}
        </PageContainer>
    )
}
