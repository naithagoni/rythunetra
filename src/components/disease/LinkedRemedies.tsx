import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Leaf, Droplets } from 'lucide-react'
import { getRemediesByIds } from '@/services/diseaseService'
import type { RemedyRow } from '@/types/remedy'
import { toRemedy } from '@/types/remedy'
import { localize } from '@/types/i18n'
import type { LanguageCode } from '@/types/i18n'
import { Badge } from '@/components/ui/badge'
import { InfoCallout } from '@/components/common/InfoCallout'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { effectivenessColor } from '@/utils/statusColors'

interface LinkedRemediesProps {
    remedyIds: string[]
    language: string
}

export function LinkedRemedies({ remedyIds, language }: LinkedRemediesProps) {
    const { t } = useTranslation()
    const lang = language as LanguageCode

    const { data: remedies = [] } = useQuery({
        queryKey: ['linked-remedies', remedyIds],
        queryFn: async () => {
            const { data, error } = await getRemediesByIds(remedyIds)
            if (error) throw error
            return (data as RemedyRow[]).map(toRemedy)
        },
        enabled: remedyIds.length > 0,
    })

    if (!remedyIds || remedyIds.length === 0) {
        return (
            <p className="text-center text-muted-foreground py-8">
                {t('diseases.noRemediesLinked')}
            </p>
        )
    }

    return (
        <Accordion type="single" collapsible className="flex flex-col gap-3">
            {remedies.map((remedy) => {
                const name = localize(remedy.name, lang)
                const howItWorks = localize(remedy.howItWorks, lang)

                return (
                    <AccordionItem
                        key={remedy.id}
                        value={remedy.id}
                        className="border border-border rounded-xl overflow-hidden bg-card"
                    >
                        <AccordionTrigger className="px-4 py-4 hover:no-underline">
                            <div className="flex items-center gap-3 text-left">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                                    <Leaf className="size-5" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-semibold text-foreground text-base">
                                        {name}
                                    </h4>
                                    <Badge
                                        variant="secondary"
                                        className={
                                            effectivenessColor(
                                                remedy.effectiveness,
                                            ).chip
                                        }
                                    >
                                        {remedy.effectiveness}{' '}
                                        {t('diseases.effectiveness')}
                                    </Badge>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col px-4 pb-4 pt-0 gap-4">
                            {howItWorks && (
                                <InfoCallout
                                    tone="blue"
                                    icon={<Droplets className="size-4" />}
                                    title={t('remedies.howItWorks')}
                                >
                                    {howItWorks}
                                </InfoCallout>
                            )}

                            {remedy.ingredients.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                                        {t(
                                            'remedies.ingredients',
                                            'Ingredients',
                                        )}
                                    </p>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
                                        {remedy.ingredients.map((ing, i) => (
                                            <li key={i}>
                                                {localize(ing, lang)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {remedy.usageInstructions.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                                        {t(
                                            'remedies.usageInstructions',
                                            'Usage Instructions',
                                        )}
                                    </p>
                                    <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-0.5">
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
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
    )
}
