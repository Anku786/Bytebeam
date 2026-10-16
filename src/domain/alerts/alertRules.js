import { FRESHNESS } from '../telemetry/freshness.js'
export const ALERT_RULES = [
    {
        id: 'overspeed',
        severity: 'warning',
        evaluate(state) {
            const limit = 90
            if ((state.speedKph ?? 0) <= limit) return null
            return {
                message: `Speed ${Math.round(state.speedKph)} km/h exceeds ${limit} km/h`,
            }
        },
    },
    {
        id: 'low_fuel',
        severity: 'warning',
        evaluate(state) {
            if ((state.fuelPct ?? 100) >= 15) return null
            return {
                message: `Fuel at ${Math.round(state.fuelPct)}%`,
            }
        },
    },
    {
        id: 'stale_telemetry',
        severity: 'critical',
        evaluate(state, { freshness }) {
            if (freshness?.level !== FRESHNESS.LOST) return null
            return {
                message: 'No telemetry received for more than 2 minutes',
            }
        },
    },
    {
        id: 'gps_fix_lost',
        severity: 'warning',
        evaluate(state) {
            if (state.gpsFix !== false) return null
            return { message: 'GPS fix lost' }
        },
    },
    {
        id: 'ignition_motion_mismatch',
        severity: 'warning',
        evaluate(state) {
            if (state.ignition || (state.speedKph ?? 0) < 8) return null
            return {
                message: `Motion at ${Math.round(state.speedKph)} km/h with ignition off`,
            }
        },
    },
]
export function getRuleById(ruleId) {
    return ALERT_RULES.find((rule) => rule.id === ruleId) ?? null
}