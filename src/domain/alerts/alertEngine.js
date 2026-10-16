import { ALERT_RULES } from './alertRules.js'
export function evaluateAlerts(state, context = {}) {
    const hits = []
    for (const rule of ALERT_RULES) {
        const result = rule.evaluate(state, context)
        if (!result) continue
        hits.push({
            ruleId: rule.id,
            severity: rule.severity,
            message: result.message,
            vehicleId: state.vehicleId,
            at: context.now ?? Date.now(),
        })
    }
    return hits
}
export function evaluateFleetAlerts(latestStates, freshnessByVehicle, now = Date.now()) {
    const alerts = []
    for (const [vehicleId, state] of latestStates) {
        const freshness = freshnessByVehicle.get(vehicleId)
        alerts.push(...evaluateAlerts(state, { freshness, now }))
    }
    return alerts
}
