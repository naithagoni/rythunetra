import { useEffect } from 'react'

const BASE_TITLE = 'RythuNetra'

/**
 * Sets `document.title` on mount and restores the base title on unmount.
 */
export function usePageTitle(title?: string) {
    useEffect(() => {
        document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE
        return () => {
            document.title = BASE_TITLE
        }
    }, [title])
}
