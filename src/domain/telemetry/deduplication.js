export function createDeduper(maxIds = 8_000) {
    const seen = new Set()
    const order = []
    function remember(id) {
        if (seen.has(id)) return
        seen.add(id)
        order.push(id)
        while (order.length > maxIds) {
            const oldest = order.shift()
            seen.delete(oldest)
        }
    }
    return {
        seen,
        isDuplicate(id) {
            return Boolean(id) && seen.has(id)
        },
        accept(packet) {
            if (!packet?.id || seen.has(packet.id)) return false
            remember(packet.id)
            return true
        },
    }
}
export function dedupePackets(packets) {
    const seen = new Set()
    const unique = []
    for (const packet of packets) {
        if (!packet?.id || seen.has(packet.id)) continue
        seen.add(packet.id)
        unique.push(packet)
    }
    return unique
}