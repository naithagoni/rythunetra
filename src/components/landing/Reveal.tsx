import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { swift } from './motion'

interface RevealProps {
    children: ReactNode
    /** Stagger delay in seconds. */
    delay?: number
    /** Vertical rise distance. */
    y?: number
    className?: string
    /** Render a specific element tag. */
    as?: 'div' | 'section' | 'li'
}

/**
 * Scroll-reveal wrapper: fades + rises into view once. Honors
 * prefers-reduced-motion (renders statically, no transform).
 */
export function Reveal({
    children,
    delay = 0,
    y = 20,
    className,
    as = 'div',
}: RevealProps) {
    const reduce = useReducedMotion()
    const MotionTag = motion[as]

    if (reduce) {
        const Tag = as
        return <Tag className={className}>{children}</Tag>
    }

    return (
        <MotionTag
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay, ease: swift }}
        >
            {children}
        </MotionTag>
    )
}
