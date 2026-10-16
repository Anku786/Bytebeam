import { database } from '../database.js'
export const vehicleRepository = {
    list() {
        return database.getAll('vehicles').sort((a, b) => a.name.localeCompare(b.name))
    },
    get(id) {
        return database.getById('vehicles', id)
    },
    saveMany(vehicles) {
        for (const vehicle of vehicles) database.upsert('vehicles', vehicle)
    },
}