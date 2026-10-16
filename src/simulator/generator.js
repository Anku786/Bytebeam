import { createPacket, createVehicle } from '../domain/telemetry/types.js'
import { FLEET_SEED, SCENARIOS } from './scenarios.js'
function rand(min, max) {
    return min + Math.random() * (max - min)
}
function jitter(value, amount) {
    return value + rand(-amount, amount)
}
export function createSimulatorState() {
    const vehicles = FLEET_SEED.map((seed) => createVehicle(seed))
    const runtime = new Map()
    for (const seed of FLEET_SEED) {
        runtime.set(seed.id, {
            seq: 0,
            lat: seed.lat,
            lng: seed.lng,
            heading: rand(0, 359),
            fuelPct: seed.scenario === 'fuel_critical' ? 8 : rand(35, 92),
            odometerKm: rand(12_000, 84_000),
            scenario: seed.scenario,
            mutedFor: seed.scenario === 'radio_silence' ? Number.POSITIVE_INFINITY : 0,
        })
    }
    return { vehicles, runtime }
}
export function assignScenario(runtime, vehicleId, scenarioId) {
    const state = runtime.get(vehicleId)
    if (!state || !SCENARIOS[scenarioId]) return
    state.scenario = scenarioId
    state.mutedFor = scenarioId === 'radio_silence' ? Number.POSITIVE_INFINITY : 0
}
export function generateTick(runtime, now = Date.now()) {
    const packets = []
    for (const [vehicleId, state] of runtime) {
        const scenario = SCENARIOS[state.scenario] ?? SCENARIOS.city_commute
        if (scenario.mute || state.mutedFor > 0) {
            if (Number.isFinite(state.mutedFor)) {
                state.mutedFor = Math.max(0, state.mutedFor - 1)
            }
            continue
        }
        const [minSpeed, maxSpeed] = scenario.speed
        const speedKph = rand(minSpeed, maxSpeed)
        const heading = (state.heading + rand(-12, 12) + 360) % 360
        const distanceKm = speedKph / 3600
        const rad = (heading * Math.PI) / 180
        state.lat = jitter(state.lat + Math.cos(rad) * distanceKm * 0.009, 0.0002)
        state.lng = jitter(state.lng + Math.sin(rad) * distanceKm * 0.009, 0.0002)
        state.heading = heading
        state.odometerKm += distanceKm
        state.fuelPct = Math.max(
            scenario.fuelFloor ?? 4,
            Math.min(100, state.fuelPct + scenario.fuelDrift),
        )
        state.seq += 1
        packets.push(
            createPacket({
                id: `${vehicleId}-${state.seq}-${now}`,
                vehicleId,
                seq: state.seq,
                recordedAt: now - Math.round(rand(20, 180)),
                receivedAt: now,
                lat: scenario.gpsFix === false ? state.lat : state.lat,
                lng: scenario.gpsFix === false ? state.lng : state.lng,
                speedKph,
                heading,
                fuelPct: state.fuelPct,
                ignition: scenario.ignition,
                odometerKm: state.odometerKm,
                gpsFix: scenario.gpsFix,
                charging: Boolean(scenario.charging),
            }),
        )
    }
    return packets
}