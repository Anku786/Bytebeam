function isNewer(packet, current) {
    if (!current) return true
    const seqA = packet.seq ?? 0
    const seqB = current.seq ?? 0
    if (seqA !== seqB) return seqA > seqB
    return (packet.recordedAt ?? 0) >= (current.recordedAt ?? 0)
}
export function applyPacketToState(stateByVehicle, packet) {
    const current = stateByVehicle.get(packet.vehicleId)
    if (!isNewer(packet, current)) return current
    const next = {
        vehicleId: packet.vehicleId,
        packetId: packet.id,
        seq: packet.seq,
        recordedAt: packet.recordedAt,
        receivedAt: packet.receivedAt,
        lat: packet.lat,
        lng: packet.lng,
        speedKph: packet.speedKph,
        heading: packet.heading,
        fuelPct: packet.fuelPct,
        ignition: packet.ignition,
        odometerKm: packet.odometerKm,
        gpsFix: packet.gpsFix,
        charging: packet.charging,
    }
    stateByVehicle.set(packet.vehicleId, next)
    return next
}
export function foldLatestState(packets) {
    const map = new Map()
    const sorted = [...packets].sort((a, b) => {
        if (a.vehicleId !== b.vehicleId) return a.vehicleId.localeCompare(b.vehicleId)
        return (a.seq ?? 0) - (b.seq ?? 0) || (a.recordedAt ?? 0) - (b.recordedAt ?? 0)
    })
    for (const packet of sorted) {
        applyPacketToState(map, packet)
    }
    return map
}