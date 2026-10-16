export function attentionId(vehicleId, ruleId) {
    return `${vehicleId}:${ruleId}`
}
export function applyAlertHits(existing, hits, now = Date.now()) {
    const byId = new Map(existing.map((item) => [item.id, { ...item }]))
    const activeKeys = new Set()
    for (const hit of hits) {
        const id = attentionId(hit.vehicleId, hit.ruleId)
        activeKeys.add(id)
        const current = byId.get(id)
        if (!current || current.status === 'resolved') {
            byId.set(id, {
                id,
                vehicleId: hit.vehicleId,
                ruleId: hit.ruleId,
                severity: hit.severity,
                message: hit.message,
                status: 'open',
                openedAt: current?.openedAt ?? now,
                lastSeenAt: now,
                resolvedAt: null,
                occurrences: (current?.occurrences ?? 0) + 1,
            })
            continue
        }
        byId.set(id, {
            ...current,
            severity: hit.severity,
            message: hit.message,
            lastSeenAt: now,
            occurrences: current.occurrences + 1,
            status: current.status === 'acked' ? 'acked' : 'open',
        })
    }
    for (const item of byId.values()) {
        if (item.status === 'resolved') continue
        if (!activeKeys.has(item.id)) {
            item.status = 'resolved'
            item.resolvedAt = now
        }
    }
    return [...byId.values()].sort((a, b) => b.lastSeenAt - a.lastSeenAt)
}
export function acknowledgeAttention(items, id, now = Date.now()) {
    return items.map((item) => {
        if (item.id !== id || item.status !== 'open') return item
        return { ...item, status: 'acked', ackedAt: now }
    })
}
export function openAttention(items) {
    return items.filter((item) => item.status === 'open' || item.status === 'acked')
}