import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Leaf, Droplets } from 'lucide-react'
import { getRemediesByIds } from '@/services/diseaseService'
import type { RemedyRow } from '@/types/remedy'
import { toRemedy } from '@/types/remedy'
import { localize } from '@/types/i18n'
import type { LanguageCode } from '@/types/i18n'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'

interface LinkedRemediesProps {
    remedyIds: string[]
    language: string
}

const effectivenessColor = {
    High: 'bg-green-950/50 text-green-400 hover:bg-green-950/50',
    Moderate: 'bg-amber-950/50 text-amber-400 hover:bg-amber-950/50',
    Low: 'bg-blue-950/50 text-blue-400 hover:bg-blue-950/50',
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
        <Accordion type="single" collapsible className="space-y-3">
            {remedies.map((remedy) => {
                const name = localize(remedy.name, lang)
                const eff =
                    remedy.effectiveness as keyof typeof effectivenessColor
                const howItWorks = localize(remedy.howItWorks, lang)

                return (
                    <AccordionItem
                        key={remedy.id}
                        value={remedy.id}
                        className="border-2 border-border rounded-xl overflow-hidden bg-card"
                    >
                        <AccordionTrigger className="px-4 py-4 hover:no-underline">
                            <div className="flex items-center gap-3 text-left">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                                    <Leaf className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-foreground text-base">
                                        {name}
                                    </h4>
                                    <Badge
                                        variant="secondary"
                                        className={
                                            effectivenessColor[eff] ??
                                            'bg-blue-950/50 text-blue-400 hover:bg-blue-950/50'
                                        }
                                    >
                                        {remedy.effectiveness}{' '}
                                        {t('diseases.effectiveness')}
                                    </Badge>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-0 space-y-4">
                            {howItWorks && (
                                <Card className="bg-blue-950/30 border-blue-800/30">
                                    <CardContent className="p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Droplets className="h-4 w-4 text-blue-400" />
                                            <span className="text-sm font-semibold text-blue-300">
                                                {t('remedies.howItWorks')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-blue-300/80">
                                            {howItWorks}
                                        </p>
                                    </CardContent>
                                </Card>
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
