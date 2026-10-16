import { database } from '../database.js'
export const attentionRepository = {
    list() {
        return database.getAll('attention')
    },
    listOpen() {
        return database
            .getAll('attention')
            .filter((item) => item.status === 'open' || item.status === 'acked')
    },
    get(id) {
        return database.getById('attention', id)
    },
    replaceAll(items) {
        database.replaceTable('attention', items)
    },
}
