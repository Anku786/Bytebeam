import { describe, expect, it } from 'vitest'
import { applyPacketToState, foldLatestState } from '../domain/telemetry/latestState.js'
describe('latestState', () => {
    it('keeps the highest sequence per vehicle', () => {
        const map = foldLatestState([
            { id: '1', vehicleId: 'v1', seq: 1, recordedAt: 10, speedKph: 10 },
            { id: '2', vehicleId: 'v1', seq: 3, recordedAt: 30, speedKph: 40 },
            { id: '3', vehicleId: 'v1', seq: 2, recordedAt: 20, speedKph: 20 },
        ])
        expect(map.get('v1').speedKph).toBe(40)
        expect(map.get('v1').packetId).toBe('2')
    })
    it('ignores older packets after a newer one is applied', () => {
        const map = new Map()
        applyPacketToState(map, { id: 'n', vehicleId: 'v1', seq: 5, recordedAt: 50, speedKph: 70 })
        applyPacketToState(map, { id: 'o', vehicleId: 'v1', seq: 4, recordedAt: 80, speedKph: 10 })
        expect(map.get('v1').speedKph).toBe(70)
    })
})