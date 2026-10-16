export const SCHEMA_VERSION = 1
export const STORAGE_KEY = 'fleetconsole.db'
export const TABLES = {
    vehicles: {
        name: 'vehicles',
        key: 'id',
        indexes: ['vin', 'region'],
    },
    packets: {
        name: 'packets',
        key: 'id',
        indexes: ['vehicleId', 'recordedAt', 'receivedAt'],
    },
    attention: {
        name: 'attention',
        key: 'id',
        indexes: ['vehicleId', 'status', 'ruleId'],
    },
}
export const PACKET_RETENTION = 250