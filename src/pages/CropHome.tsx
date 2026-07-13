import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Search, X, Leaf, ArrowUpRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useCrops } from '@/hooks/useCrops'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { PageContainer } from '@/components/common/PageContainer'
import { Toolbar } from '@/components/common/Toolbar'
import { Card } from '@/components/ui/card'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from '@/components/ui/input-group'
import { getCropImage } from '@/utils/cropImages'
import { localize } from '@/types/i18n'
import type { LanguageCode } from '@/types/i18n'

export function CropHomePage() {
    const { t, i18n } = useTranslation()
    const { user } = useAuth()
    usePageTitle('Crops — Browse 30+ Telangana Crops')
    const lang = i18n.language as LanguageCode
    const { data: crops = [], isLoading, isError } = useCrops()
    const [search, setSearch] = useState('')

    const filtered = useMemo(() => {
        if (!search.trim()) return crops
        const q = search.toLowerCase()
        return crops.filter((c) => {
            const en = localize(c.name, 'en')?.toLowerCase() ?? ''
            const te = localize(c.name, 'te')?.toLowerCase() ?? ''
            return en.includes(q) || te.includes(q)
        })
    }, [crops, search])

    return (
        <PageContainer size="xl">
            <PageHeader
                title={
                    user ? t('cropHome.greetingUser') : t('cropHome.greeting')
                }
                description={t('cropHome.subtitle')}
            />

            <Toolbar
                start={
                    <InputGroup className="max-w-lg">
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                        <InputGroupInput
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t('common.search')}
                        />
                        {search && (
                            <InputGroupAddon align="inline-end">
                                <InputGroupButton
                                    size="icon-xs"
                                    onClick={() => setSearch('')}
                                    aria-label="Clear search"
                                >
                                    <X />
                                </InputGroupButton>
                            </InputGroupAddon>
                        )}
                    </InputGroup>
                }
            />

            {isLoading ? (
                <LoadingSpinner />
            ) : isError || crops.length === 0 ? (
                <EmptyState
                    icon={<Leaf className="size-12" />}
                    title={t('cropHome.cropsUnavailable')}
                    description={t('cropHome.cropsUnavailableHint')}
                />
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={<Search className="size-12" />}
                    title={t('common.noResults')}
                />
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {filtered.map((crop) => {
                        const cropName = localize(crop.name, lang)
                        const cropType = localize(crop.cropType, lang)
                        return (
                            <Link key={crop.id} to={`/crops/${crop.id}`}>
                                <Card className="group gap-0 overflow-hidden py-0 transition-colors duration-200 hover:border-primary">
                                    <div className="relative aspect-4/3 overflow-hidden bg-muted">
                                        <img
                                            src={getCropImage(crop.imageUrl)}
                                            alt={cropName}
                                            loading="lazy"
                                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {/* Gradient scrim for legibility */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                                        {cropType && (
                                            <span className="absolute left-2 top-2 rounded-full bg-background/85 px-2 py-0.5 text-[11px] font-medium text-foreground backdrop-blur-sm">
                                                {cropType}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between gap-2 border-t border-border bg-[oklch(95%_0_0)] p-3">
                                        <p className="truncate text-sm font-semibold text-foreground">
                                            {cropName}
                                        </p>
                                        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary group-hover:opacity-100" />
                                    </div>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            )}
        </PageContainer>
    )
}
