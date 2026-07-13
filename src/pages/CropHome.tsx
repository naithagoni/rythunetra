import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Search, X, Leaf } from 'lucide-react'
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
                                <Card className="group gap-0 overflow-hidden py-0 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-card-hover">
                                    <div className="aspect-4/3 overflow-hidden bg-muted">
                                        <img
                                            src={getCropImage(crop.imageUrl)}
                                            alt={cropName}
                                            loading="lazy"
                                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <p className="truncate text-sm font-medium text-foreground">
                                            {cropName}
                                        </p>
                                        {cropType && (
                                            <p className="truncate text-xs text-muted-foreground">
                                                {cropType}
                                            </p>
                                        )}
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
