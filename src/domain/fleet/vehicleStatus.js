import { FRESHNESS } from '../telemetry/freshness.js'
export const VEHICLE_STATUS = {
    MOVING: 'moving',
    CHARGING: 'charging',
    IDLE: 'idle',
    DEGRADED: 'degraded',
    ATTENTION: 'attention',
    CRITICAL: 'critical',
    OFFLINE: 'offline',
}
export function deriveVehicleStatus({ latest, freshness, openAlerts = [] }) {
    if (openAlerts.some((alert) => alert.severity === 'critical')) {
        return VEHICLE_STATUS.CRITICAL
    }
    if (!latest || freshness?.level === FRESHNESS.LOST) {
        return VEHICLE_STATUS.OFFLINE
    }
    if (openAlerts.length > 0) return VEHICLE_STATUS.ATTENTION
    if (freshness?.level === FRESHNESS.STALE || freshness?.level === FRESHNESS.AGING) {
        return VEHICLE_STATUS.DEGRADED
    }
    if (latest.charging) return VEHICLE_STATUS.CHARGING
    if (latest.ignition && (latest.speedKph ?? 0) > 3) return VEHICLE_STATUS.MOVING
    return VEHICLE_STATUS.IDLE
}