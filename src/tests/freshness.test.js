import { describe, expect, it } from 'vitest'
import { evaluateFreshness, FRESHNESS, freshnessFromAgeMs } from '../domain/telemetry/freshness.js'
describe('freshness', () => {
    it('classifies age buckets', () => {
        expect(freshnessFromAgeMs(2_000)).toBe(FRESHNESS.LIVE)
        expect(freshnessFromAgeMs(20_000)).toBe(FRESHNESS.AGING)
        expect(freshnessFromAgeMs(90_000)).toBe(FRESHNESS.STALE)
        expect(freshnessFromAgeMs(200_000)).toBe(FRESHNESS.LOST)
    })
    it('treats missing timestamps as lost', () => {
        expect(evaluateFreshness(null).level).toBe(FRESHNESS.LOST)
    })
})