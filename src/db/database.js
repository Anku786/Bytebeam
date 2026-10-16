import { PACKET_RETENTION, SCHEMA_VERSION, STORAGE_KEY, TABLES } from './schema.js'
function emptyStores() {
    return {
        vehicles: [],
        packets: [],
        attention: [],
    }
}
export class FleetDatabase {
    constructor() {
        this.version = SCHEMA_VERSION
        this.stores = emptyStores()
        this.listeners = new Set()
    }
    load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (!raw) return this
            const parsed = JSON.parse(raw)
            if (parsed.version !== SCHEMA_VERSION) return this
            this.stores = {
                vehicles: parsed.stores?.vehicles ?? [],
                packets: parsed.stores?.packets ?? [],
                attention: parsed.stores?.attention ?? [],
            }
        } catch {
            this.stores = emptyStores()
        }
        return this
    }
    persist() {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ version: this.version, stores: this.stores }),
        )
        this.emit()
    }
    subscribe(listener) {
        this.listeners.add(listener)
        return () => this.listeners.delete(listener)
    }
    emit() {
        for (const listener of this.listeners) listener(this.snapshot())
    }
    snapshot() {
        return {
            vehicles: [...this.stores.vehicles],
            packets: [...this.stores.packets],
            attention: [...this.stores.attention],
        }
    }
    getAll(table) {
        return [...(this.stores[table] ?? [])]
    }
    getById(table, id) {
        const key = TABLES[table].key
        return this.stores[table].find((row) => row[key] === id) ?? null
    }
    upsert(table, row) {
        const key = TABLES[table].key
        const rows = this.stores[table]
        const index = rows.findIndex((item) => item[key] === row[key])
        if (index >= 0) rows[index] = row
        else rows.push(row)
        if (table === 'packets') this.trimPackets(row.vehicleId)
    }
    replaceTable(table, rows) {
        this.stores[table] = [...rows]
        if (table === 'packets') {
            const ids = new Set(rows.map((row) => row.vehicleId))
            for (const id of ids) this.trimPackets(id)
        }
    }
    trimPackets(vehicleId) {
        const packets = this.stores.packets
            .filter((packet) => packet.vehicleId === vehicleId)
            .sort((a, b) => b.recordedAt - a.recordedAt)
        if (packets.length <= PACKET_RETENTION) return
        const keep = new Set(packets.slice(0, PACKET_RETENTION).map((packet) => packet.id))
        this.stores.packets = this.stores.packets.filter(
            (packet) => packet.vehicleId !== vehicleId || keep.has(packet.id),
        )
    }
    findBy(table, field, value) {
        return this.stores[table].filter((row) => row[field] === value)
    }
    reset() {
        this.stores = emptyStores()
        this.persist()
    }
}
export const database = new FleetDatabase()
if (typeof localStorage !== 'undefined') database.load()