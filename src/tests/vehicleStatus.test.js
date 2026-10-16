import { describe, expect, it } from 'vitest'
import { deriveVehicleStatus, VEHICLE_STATUS } from '../domain/fleet/vehicleStatus.js'
import { FRESHNESS } from '../domain/telemetry/freshness.js'
describe('vehicleStatus', () => {
    it('marks critical alerts above movement', () => {
        const status = deriveVehicleStatus({
            latest: { ignition: true, speedKph: 40 },
            freshness: { level: FRESHNESS.LIVE },
            openAlerts: [{ severity: 'critical' }],
        })
        expect(status).toBe(VEHICLE_STATUS.CRITICAL)
    })
    it('marks moving vehicles when telemetry is live', () => {
        const status = deriveVehicleStatus({
            latest: { ignition: true, speedKph: 24 },
            freshness: { level: FRESHNESS.LIVE },
            openAlerts: [],
        })
        expect(status).toBe(VEHICLE_STATUS.MOVING)
    })
})