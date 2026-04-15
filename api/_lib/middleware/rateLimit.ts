/**
 * Simple in-memory rate limiter for Vercel serverless functions.
 * Uses a sliding window approach with per-IP tracking.
 *
 * Note: In a multi-instance deployment, each instance has its own map.
 * For stricter enforcement, replace with Upstash Redis rate limiting.
 */

interface RateLimitEntry {
    count: number
    resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Periodically clean expired entries to prevent memory leaks
const CLEANUP_INTERVAL = 60_000 // 1 minute
let lastCleanup = Date.now()

function cleanup() {
    const now = Date.now()
    if (now - lastCleanup < CLEANUP_INTERVAL) return
    lastCleanup = now
    for (const [key, entry] of store) {
        if (now > entry.resetAt) {
            store.delete(key)
        }
    }
}

export interface RateLimitConfig {
    /** Maximum requests allowed in the window */
    maxRequests: number
    /** Window duration in milliseconds */
    windowMs: number
}

const DEFAULT_CONFIG: RateLimitConfig = {
    maxRequests: 100,
    windowMs: 60_000, // 1 minute
}

/** AI endpoints get a stricter limit */
const AI_CONFIG: RateLimitConfig = {
    maxRequests: 20,
    windowMs: 60_000, // 1 minute
}

function getClientIP(req: Request): string {
    // Vercel sets x-forwarded-for; fall back to x-real-ip
    const forwarded = req.headers.get('x-forwarded-for')
    if (forwarded) return forwarded.split(',')[0].trim()
    return req.headers.get('x-real-ip') || 'unknown'
}

/**
 * Check rate limit for a request.
 * Returns null if allowed, or a Response (429) if rate-limited.
 */
export function checkRateLimit(
    req: Request,
    config: RateLimitConfig = DEFAULT_CONFIG,
): Response | null {
    cleanup()

    const ip = getClientIP(req)
    const key = `${ip}`
    const now = Date.now()

    let entry = store.get(key)
    if (!entry || now > entry.resetAt) {
        entry = { count: 0, resetAt: now + config.windowMs }
        store.set(key, entry)
    }

    entry.count++

    if (entry.count > config.maxRequests) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
        return new Response(
            JSON.stringify({
                error: 'Too many requests. Please try again later.',
                retryAfter,
            }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': String(retryAfter),
                },
            },
        )
    }

    return null
}

/** Rate limiter preset for AI endpoints (stricter) */
export function checkAIRateLimit(req: Request): Response | null {
    return checkRateLimit(req, AI_CONFIG)
}
