import { database } from '../database.js'
export const packetRepository = {
    list() {
        return database.getAll('packets')
    },
    listByVehicle(vehicleId) {
        return database
            .findBy('packets', 'vehicleId', vehicleId)
            .sort((a, b) => b.recordedAt - a.recordedAt)
    },
    get(id) {
        return database.getById('packets', id)
    },
    saveMany(packets) {
        for (const packet of packets) database.upsert('packets', packet)
    },
}