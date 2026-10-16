import { describe, expect, it } from 'vitest'
import { evaluateAlerts } from '../domain/alerts/alertEngine.js'
import { applyAlertHits, acknowledgeAttention } from '../domain/alerts/attentionState.js'
import { FRESHNESS } from '../domain/telemetry/freshness.js'
describe('alertEngine', () => {
    it('flags overspeed and low fuel', () => {
        const hits = evaluateAlerts({
            vehicleId: 'v1',
            speedKph: 110,
            fuelPct: 8,
            ignition: true,
            gpsFix: true,
        }, { freshness: { level: FRESHNESS.LIVE } })
        expect(hits.map((hit) => hit.ruleId).sort()).toEqual(['low_fuel', 'overspeed'])
    })
    it('opens, updates, and resolves attention items', () => {
        const first = applyAlertHits([], [
            { vehicleId: 'v1', ruleId: 'overspeed', severity: 'warning', message: 'fast' },
        ], 1)
        expect(first[0].status).toBe('open')
        const acked = acknowledgeAttention(first, first[0].id, 2)
        expect(acked[0].status).toBe('acked')
        const resolved = applyAlertHits(acked, [], 3)
        expect(resolved[0].status).toBe('resolved')
    })
})