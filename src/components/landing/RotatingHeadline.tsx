import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

type Effect = 'selection' | 'stroke' | 'glass'
const EFFECTS: Effect[] = ['selection', 'stroke', 'glass']
const INTERVAL = 2800

interface RotatingHeadlineProps {
    /** Static lead text, e.g. "Grow smarter with". */
    lead: string
    /** Words to cycle through. */
    words: string[]
    className?: string
}

/**
 * Vercel-style cycling headline. A fixed lead phrase is followed by a rotating
 * word that swaps every ~2.8s, each swap using one of three signature effects:
 *  - selection : Figma-style selection box (corner dots + W×H dimension label)
 *  - stroke    : dashed outline that draws itself on, then the fill fades in
 *  - glass     : a glass/magnifier lens that sweeps across the word
 * The word slot animates its width so trailing layout doesn't jump. Honors
 * prefers-reduced-motion (shows the first word, no cycling).
 */
export function RotatingHeadline({
    lead,
    words,
    className,
}: RotatingHeadlineProps) {
    const reduce = useReducedMotion()
    const [index, setIndex] = useState(0)
    const [dims, setDims] = useState({ w: 0, h: 0 })
    const measureRef = useRef<HTMLSpanElement>(null)

    const word = words[index] ?? ''
    const effect: Effect = reduce ? 'selection' : EFFECTS[index % EFFECTS.length]

    // Cycle
    useEffect(() => {
        if (reduce || words.length <= 1) return
        const id = setInterval(
            () => setIndex((i) => (i + 1) % words.length),
            INTERVAL,
        )
        return () => clearInterval(id)
    }, [reduce, words.length])

    // Measure the current word to size the animated slot + dimension label
    useLayoutEffect(() => {
        if (measureRef.current) {
            const r = measureRef.current.getBoundingClientRect()
            setDims({ w: Math.round(r.width), h: Math.round(r.height) })
        }
    }, [word])

    return (
        <h1 className={className}>
            {/* Lead sits on its own line(s); the rotating word gets a dedicated
                centered line below. This keeps the headline height CONSTANT as
                words of different widths cycle — otherwise a longer word wraps
                differently and shifts everything below (buttons "float"). */}
            <span className="block">{lead}</span>
            <span className="relative mt-1 inline-block align-top">
                {/* Hidden sizer — always the current word, drives width/height */}
                <span
                    ref={measureRef}
                    aria-hidden
                    className="pointer-events-none invisible whitespace-nowrap"
                >
                    {word}
                </span>

                {/* Animated slot */}
                <motion.span
                    className="absolute left-0 top-0"
                    animate={{ width: dims.w || 'auto' }}
                    transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.1] }}
                    style={{ display: 'inline-block' }}
                >
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                            key={index}
                            className="relative inline-block whitespace-nowrap text-tertiary-link"
                            initial={{ opacity: 0, filter: 'blur(6px)', y: 8 }}
                            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                            exit={{ opacity: 0, filter: 'blur(6px)', y: -8 }}
                            transition={{ duration: 0.4 }}
                        >
                            {effect === 'stroke' ? (
                                <StrokeWord word={word} reduce={!!reduce} />
                            ) : (
                                word
                            )}

                            {effect === 'selection' && (
                                <SelectionBox dims={dims} />
                            )}
                            {effect === 'glass' && !reduce && <GlassLens />}
                        </motion.span>
                    </AnimatePresence>
                </motion.span>
            </span>
        </h1>
    )
}

/** Figma-style selection box: border, four corner dots, W×H label. */
function SelectionBox({ dims }: { dims: { w: number; h: number } }) {
    return (
        <motion.span
            aria-hidden
            className="pointer-events-none absolute -inset-x-1.5 -inset-y-1 rounded-[3px] border border-tertiary-link"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.175, 0.885, 0.32, 1.1] }}
        >
            {[
                'left-0 top-0 -translate-x-1/2 -translate-y-1/2',
                'right-0 top-0 translate-x-1/2 -translate-y-1/2',
                'left-0 bottom-0 -translate-x-1/2 translate-y-1/2',
                'right-0 bottom-0 translate-x-1/2 translate-y-1/2',
            ].map((pos) => (
                <span
                    key={pos}
                    className={`absolute size-1.5 rounded-[2px] border border-tertiary-link bg-background ${pos}`}
                />
            ))}
            <span className="absolute -top-6 right-0 rounded bg-tertiary-link px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none text-white">
                {dims.w} × {dims.h}
            </span>
        </motion.span>
    )
}

/**
 * Outlined word (text-stroke, transparent fill) that "fills in" via a
 * left→right clip-path wipe. Scales with the real font size.
 */
function StrokeWord({ word, reduce }: { word: string; reduce: boolean }) {
    return (
        <span className="relative inline-block">
            {/* Outline layer */}
            <span
                aria-hidden
                className="text-transparent"
                style={{
                    WebkitTextStroke: '1px var(--color-tertiary-link)',
                }}
            >
                {word}
            </span>
            {/* Filled layer, wiped in */}
            <motion.span
                aria-hidden
                className="absolute inset-0 text-tertiary-link"
                initial={
                    reduce
                        ? { clipPath: 'inset(0 0% 0 0)' }
                        : { clipPath: 'inset(0 100% 0 0)' }
                }
                animate={{ clipPath: 'inset(0 0% 0 0)' }}
                transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.15 }}
            >
                {word}
            </motion.span>
            {/* Real text (transparent) for a11y + text selection */}
            <span className="absolute inset-0 text-transparent">{word}</span>
        </span>
    )
}

/** Glass lens sweeping left→right across the word. */
function GlassLens() {
    return (
        <motion.span
            aria-hidden
            className="pointer-events-none absolute top-1/2 size-[1.4em] -translate-y-1/2 rounded-full border border-white/40 bg-white/10 backdrop-blur-[2px]"
            style={{
                boxShadow:
                    'inset 0 1px 2px rgba(255,255,255,0.5), 0 2px 8px rgba(0,0,0,0.12)',
            }}
            initial={{ left: '-10%', opacity: 0 }}
            animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
        />
    )
}
