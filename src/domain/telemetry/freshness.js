export const FRESHNESS = {
    LIVE: 'live',
    AGING: 'aging',
    STALE: 'stale',
    LOST: 'lost',
}
export const FRESHNESS_THRESHOLDS_MS = {
    live: 10_000,
    aging: 30_000,
    stale: 120_000,
}
export function freshnessFromAgeMs(ageMs) {
    if (!Number.isFinite(ageMs) || ageMs < 0) return FRESHNESS.LOST
    if (ageMs < FRESHNESS_THRESHOLDS_MS.live) return FRESHNESS.LIVE
    if (ageMs < FRESHNESS_THRESHOLDS_MS.aging) return FRESHNESS.AGING
    if (ageMs < FRESHNESS_THRESHOLDS_MS.stale) return FRESHNESS.STALE
    return FRESHNESS.LOST
}
export function evaluateFreshness(lastSeenAt, now = Date.now()) {
    if (lastSeenAt == null) {
        return { level: FRESHNESS.LOST, ageMs: Number.POSITIVE_INFINITY }
    }
    const ageMs = now - lastSeenAt
    return { level: freshnessFromAgeMs(ageMs), ageMs }
}
export function formatAge(ageMs) {
    if (!Number.isFinite(ageMs)) return 'never'
    if (ageMs < 1_000) return 'just now'
    const seconds = Math.floor(ageMs / 1_000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
}