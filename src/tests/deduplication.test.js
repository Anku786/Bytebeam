import { describe, expect, it } from 'vitest'
import { createDeduper, dedupePackets } from '../domain/telemetry/deduplication.js'
describe('deduplication', () => {
    it('drops duplicate packet ids', () => {
        const packets = [
            { id: 'a' },
            { id: 'b' },
            { id: 'a' },
        ]
        expect(dedupePackets(packets).map((packet) => packet.id)).toEqual(['a', 'b'])
    })
    it('remembers ids across batches', () => {
        const deduper = createDeduper()
        expect(deduper.accept({ id: 'p1' })).toBe(true)
        expect(deduper.accept({ id: 'p1' })).toBe(false)
        expect(deduper.accept({ id: 'p2' })).toBe(true)
    })
})