import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Leaf, ChevronDown, Droplets } from 'lucide-react'
import { cn } from '@/utils/cn'
import { supabase } from '@/services/supabase'
import type { RemedyRow } from '@/types/remedy'
import { toRemedy } from '@/types/remedy'
import { localize } from '@/types/i18n'
import type { LanguageCode } from '@/types/i18n'

interface LinkedRemediesProps {
    remedyIds: string[]
    language: string
}

export function LinkedRemedies({ remedyIds, language }: LinkedRemediesProps) {
    const { t } = useTranslation()
    const lang = language as LanguageCode
    const [expandedId, setExpandedId] = useState<string | null>(null)

    const { data: remedies = [] } = useQuery({
        queryKey: ['linked-remedies', remedyIds],
        queryFn: async () => {
            if (remedyIds.length === 0) return []
            const { data, error } = await supabase
                .from('remedies')
                .select('*')
                .in('id', remedyIds)
            if (error) throw error
            return (data as RemedyRow[]).map(toRemedy)
        },
        enabled: remedyIds.length > 0,
    })

    if (!remedyIds || remedyIds.length === 0) {
        return (
            <p className="text-center text-neutral-600 py-8">
                {t('diseases.noRemediesLinked')}
            </p>
        )
    }

    const effectivenessColor = {
        High: 'badge-success',
        Moderate: 'badge-warning',
        Low: 'badge-info',
    }

    const toggle = (id: string) =>
        setExpandedId((prev) => (prev === id ? null : id))

    return (
        <div className="space-y-3">
            {remedies.map((remedy) => {
                const name = localize(remedy.name, lang)
                const isOpen = expandedId === remedy.id
                const eff =
                    remedy.effectiveness as keyof typeof effectivenessColor
                const howItWorks = localize(remedy.howItWorks, lang)

                return (
                    <div
                        key={remedy.id}
                        className="border-2 border-neutral-100 rounded-xl overflow-hidden bg-white"
                    >
                        {/* Collapsed header */}
                        <button
                            onClick={() => toggle(remedy.id)}
                            className="w-full flex items-center gap-3 p-4 active:bg-neutral-50 transition-colors text-left"
                        >
                            <div className="p-2 rounded-xl bg-primary-50 text-primary-600 shrink-0">
                                <Leaf className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-neutral-900 text-base">
                                    {name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span
                                        className={cn(
                                            effectivenessColor[eff] ??
                                                'badge-info',
                                        )}
                                    >
                                        {remedy.effectiveness}{' '}
                                        {t('diseases.effectiveness')}
                                    </span>
                                </div>
                            </div>
                            <ChevronDown
                                className={cn(
                                    'h-5 w-5 text-neutral-400 shrink-0 transition-transform',
                                    isOpen && 'rotate-180',
                                )}
                            />
                        </button>

                        {/* Expanded content */}
                        {isOpen && (
                            <div className="border-t border-neutral-100 px-4 pb-4 pt-3 space-y-4 animate-fade-in">
                                {howItWorks && (
                                    <div className="bg-blue-50 rounded-xl p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Droplets className="h-4 w-4 text-blue-500" />
                                            <span className="text-sm font-semibold text-blue-700">
                                                {t('remedies.howItWorks')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-blue-600">
                                            {howItWorks}
                                        </p>
                                    </div>
                                )}

                                {/* Ingredients */}
                                {remedy.ingredients.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-neutral-500 mb-1">
                                            {t(
                                                'remedies.ingredients',
                                                'Ingredients',
                                            )}
                                        </p>
                                        <ul className="list-disc list-inside text-sm text-neutral-600 space-y-0.5">
                                            {remedy.ingredients.map(
                                                (ing, i) => (
                                                    <li key={i}>
                                                        {localize(ing, lang)}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {/* Usage Instructions */}
                                {remedy.usageInstructions.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-neutral-500 mb-1">
                                            {t(
                                                'remedies.usageInstructions',
                                                'Usage Instructions',
                                            )}
                                        </p>
                                        <ol className="list-decimal list-inside text-sm text-neutral-600 space-y-0.5">
                                            {remedy.usageInstructions.map(
                                                (step, i) => (
                                                    <li key={i}>
                                                        {localize(step, lang)}
                                                    </li>
                                                ),
                                            )}
                                        </ol>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
