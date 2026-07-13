/**
 * Semantic status → Geist accent-scale color mapping.
 *
 * Replaces the severity/effectiveness/remedy-type hex maps that were
 * copy-pasted across DiseaseList, Scanner, DiseaseCard, DiseaseDetail,
 * LinkedRemedies, and SoilRecommender. Colors come from the Geist accent
 * scales defined in index.css (light + dark redefined under `.dark`), so a
 * `bg-{c}-100 text-{c}-900` pair reads correctly in both themes.
 *
 * NOTE: class strings MUST be written as complete literals — Tailwind v4's
 * JIT scanner does not detect `bg-${scale}-100` template concatenations.
 *
 * Convention (per design.light.md): step 100 = tint background,
 * 400 = border, 900 = text/icon.
 */

/** Tint chip: soft background + readable text + border. */
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
    chip: 'bg-green-100 text-green-900',
    text: 'text-green-900',
    bg: 'bg-green-100',
    border: 'border-green-400',
}
const AMBER: StatusChip = {
    chip: 'bg-amber-100 text-amber-900',
    text: 'text-amber-900',
    bg: 'bg-amber-100',
    border: 'border-amber-400',
}
const BLUE: StatusChip = {
    chip: 'bg-blue-100 text-blue-900',
    text: 'text-blue-900',
    bg: 'bg-blue-100',
    border: 'border-blue-400',
}
const PURPLE: StatusChip = {
    chip: 'bg-purple-100 text-purple-900',
    text: 'text-purple-900',
    bg: 'bg-purple-100',
    border: 'border-purple-400',
}
const RED: StatusChip = {
    chip: 'bg-red-100 text-red-900',
    text: 'text-red-900',
    bg: 'bg-red-100',
    border: 'border-red-400',
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

/** Remedy effectiveness. High=green, Moderate=amber, Low=gray. Accepts EN label. */
export function effectivenessColor(
    effectiveness: string | null | undefined,
): StatusChip {
    switch ((effectiveness ?? '').toLowerCase()) {
        case 'high':
            return GREEN
        case 'moderate':
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
