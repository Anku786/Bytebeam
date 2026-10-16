import { generateTick } from './generator.js'
export function createIngestionLoop({ runtime, onPackets, intervalMs = 1000 }) {
    let timer = null
    let running = false
    function tick() {
        const packets = generateTick(runtime, Date.now())
        if (packets.length > 0) onPackets(packets)
    }
    return {
        get running() {
            return running
        },
        start() {
            if (running) return
            running = true
            tick()
            timer = setInterval(tick, intervalMs)
        },
        stop() {
            running = false
            if (timer) clearInterval(timer)
            timer = null
        },
        tick,
    }
}