import { evaluateFleetAlerts } from '../domain/alerts/alertEngine.js'
import { acknowledgeAttention, applyAlertHits } from '../domain/alerts/attentionState.js'
import { createDeduper } from '../domain/telemetry/deduplication.js'
import { evaluateFreshness } from '../domain/telemetry/freshness.js'
import { applyPacketToState } from '../domain/telemetry/latestState.js'
const deduper = createDeduper()
const latestByVehicle = new Map()
let attention = []
const knownVehicleIds = new Set()
function freshnessMap(now) {
    const map = new Map()
    for (const [vehicleId, state] of latestByVehicle) {
        map.set(vehicleId, evaluateFreshness(state.receivedAt, now))
    }
    for (const vehicleId of knownVehicleIds) {
        if (!map.has(vehicleId)) {
            map.set(vehicleId, evaluateFreshness(null, now))
        }
    }
    return map
}
function recompute(now) {
    const freshnessByVehicle = freshnessMap(now)
    const states = new Map(latestByVehicle)
    for (const vehicleId of knownVehicleIds) {
        if (!states.has(vehicleId)) {
            states.set(vehicleId, {
                vehicleId,
                ignition: false,
                gpsFix: true,
                speedKph: 0,
                fuelPct: 100,
            })
        }
    }
    const hits = evaluateFleetAlerts(states, freshnessByVehicle, now)
    attention = applyAlertHits(attention, hits, now)
    return {
        type: 'snapshot',
        now,
        latest: [...latestByVehicle.values()],
        attention,
        freshness: Object.fromEntries(
            [...freshnessByVehicle.entries()].map(([id, value]) => [id, value]),
        ),
    }
}
onmessage = (event) => {
    const message = event.data
    const now = message.now ?? Date.now()
    if (message.type === 'register') {
        for (const id of message.vehicleIds ?? []) knownVehicleIds.add(id)
        postMessage(recompute(now))
        return
    }
    if (message.type === 'hydrate') {
        for (const id of message.vehicleIds ?? []) knownVehicleIds.add(id)
        for (const packet of message.packets ?? []) {
            if (!deduper.accept(packet)) continue
            applyPacketToState(latestByVehicle, packet)
        }
        if (message.attention) attention = message.attention
        postMessage(recompute(now))
        return
    }
    if (message.type === 'ingest') {
        const accepted = []
        for (const packet of message.packets ?? []) {
            knownVehicleIds.add(packet.vehicleId)
            if (!deduper.accept(packet)) continue
            applyPacketToState(latestByVehicle, packet)
            accepted.push(packet)
        }
        const snapshot = recompute(now)
        snapshot.accepted = accepted
        postMessage(snapshot)
        return
    }
    if (message.type === 'tick') {
        postMessage(recompute(now))
        return
    }
    if (message.type === 'ack') {
        attention = acknowledgeAttention(attention, message.id, now)
        postMessage(recompute(now))
    }
}