export const PACKET_FIELDS = [
    'id',
    'vehicleId',
    'seq',
    'recordedAt',
    'receivedAt',
    'lat',
    'lng',
    'speedKph',
    'heading',
    'fuelPct',
    'ignition',
    'odometerKm',
    'gpsFix',
    'charging',
]
export function createPacket(input) {
    const now = Date.now()
    return {
        id: input.id,
        vehicleId: input.vehicleId,
        seq: input.seq ?? 0,
        recordedAt: input.recordedAt ?? now,
        receivedAt: input.receivedAt ?? now,
        lat: input.lat ?? null,
        lng: input.lng ?? null,
        speedKph: input.speedKph ?? 0,
        heading: input.heading ?? 0,
        fuelPct: input.fuelPct ?? 100,
        ignition: Boolean(input.ignition),
        odometerKm: input.odometerKm ?? 0,
        gpsFix: input.gpsFix !== false,
        charging: Boolean(input.charging),
    }
}
export function createVehicle(input) {
    return {
        id: input.id,
        name: input.name,
        vin: input.vin,
        make: input.make,
        model: input.model,
        region: input.region ?? 'Unknown',
        city: input.city ?? input.region ?? 'Unknown',
    }
}