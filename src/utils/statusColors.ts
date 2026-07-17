/**
 * Semantic status → Specimen Journal aux-accent mapping.
 *
 * Drives the severity/effectiveness/remedy-type chips across DiseaseList,
 * Scanner, DiseaseCard, DiseaseDetail, LinkedRemedies, and SoilRecommender.
 * Colors come from the aux-accent families in index.css / tailwind-v4.css:
 * each family has a solid tone (`aux-accent-N`), a soft `-container` fill,
 * and an `-outline` border, so a `bg-{fam}-container text-{fam}` pair reads
 * as a soft, legible chip on the Linen/surface canvas.
 *
 * Family → semantic role:
 *   green  = aux-accent-6 (good / high / organic) — kept distinct from
 *            `primary` (sage) so "good status" never reads as an action
 *   amber  = aux-accent-4 (moderate / warning)
 *   red    = aux-accent-2 (critical / danger) — a true red, distinct from
 *            the crimson error/link role
 *   blue   = aux-accent-8 (informational / biological)
 *   purple = aux-accent-9 (chemical / tertiary)
 *   gray   = neutral surface (low / disabled)
 *
 * NOTE: class strings MUST be written as complete literals — Tailwind v4's
 * JIT scanner does not detect `bg-${fam}-container` template concatenations.
 */

/** Tint chip: soft container background + readable text + outline border. */
export interface StatusChip {
    /** Combined bg + text classes for a soft chip. */
    chip: string
    /** Text/icon color only. */
    text: string
    /** Soft background only. */
    bg: string
    /** Border color. */
    border: string
}

const GREEN: StatusChip = {
    chip: 'bg-aux-accent-6-container text-aux-accent-6',
    text: 'text-aux-accent-6',
    bg: 'bg-aux-accent-6-container',
    border: 'border-aux-accent-6-outline',
}
const AMBER: StatusChip = {
    chip: 'bg-aux-accent-4-container text-aux-accent-4',
    text: 'text-aux-accent-4',
    bg: 'bg-aux-accent-4-container',
    border: 'border-aux-accent-4-outline',
}
const BLUE: StatusChip = {
    chip: 'bg-aux-accent-8-container text-aux-accent-8',
    text: 'text-aux-accent-8',
    bg: 'bg-aux-accent-8-container',
    border: 'border-aux-accent-8-outline',
}
const PURPLE: StatusChip = {
    chip: 'bg-aux-accent-9-container text-aux-accent-9',
    text: 'text-aux-accent-9',
    bg: 'bg-aux-accent-9-container',
    border: 'border-aux-accent-9-outline',
}
const RED: StatusChip = {
    chip: 'bg-aux-accent-2-container text-aux-accent-2',
    text: 'text-aux-accent-2',
    bg: 'bg-aux-accent-2-container',
    border: 'border-aux-accent-2-outline',
}
const GRAY: StatusChip = {
    chip: 'bg-muted text-muted-foreground',
    text: 'text-muted-foreground',
    bg: 'bg-muted',
    border: 'border-border',
}

/** Disease severity. low/none=green, moderate/high=amber, critical=red. */
export function severityColor(severity: string | null | undefined): StatusChip {
    switch (severity) {
        case 'low':
        case 'none':
            return GREEN
        case 'moderate':
        case 'high':
            return AMBER
        case 'critical':
            return RED
        default:
            return AMBER
    }
}

/** Remedy effectiveness. High=green, Moderate/Medium=amber, Low=gray. Accepts EN label. */
export function effectivenessColor(
    effectiveness: string | null | undefined,
): StatusChip {
    switch ((effectiveness ?? '').toLowerCase()) {
        case 'high':
            return GREEN
        case 'moderate':
        case 'medium':
            return AMBER
        case 'low':
            return GRAY
        default:
            return GRAY
    }
}

/** Remedy type. organic=green, biological=blue, chemical=purple. */
export function remedyTypeColor(type: string | null | undefined): StatusChip {
    switch (type) {
        case 'organic':
            return GREEN
        case 'biological':
            return BLUE
        case 'chemical':
            return PURPLE
        default:
            return BLUE
    }
}

/** Crop demand. high=green, medium=amber, low=gray. */
export function demandColor(demand: string | null | undefined): StatusChip {
    switch ((demand ?? '').toLowerCase()) {
        case 'high':
            return GREEN
        case 'medium':
        case 'moderate':
            return AMBER
        case 'low':
            return GRAY
        default:
            return BLUE
    }
}

/** Numeric recommendation score (0–100) → chip. */
export function scoreColor(score: number): StatusChip {
    if (score >= 75) return GREEN
    if (score >= 50) return AMBER
    if (score >= 25) return BLUE
    return GRAY
}
