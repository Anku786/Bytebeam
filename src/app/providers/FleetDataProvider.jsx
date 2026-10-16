import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { attentionRepository } from '../../db/repositories/attentionRepository.js'
import { packetRepository } from '../../db/repositories/packetRepository.js'
import { vehicleRepository } from '../../db/repositories/vehicleRepository.js'
import { database } from '../../db/database.js'
import { openAttention } from '../../domain/alerts/attentionState.js'
import { deriveVehicleStatus } from '../../domain/fleet/vehicleStatus.js'
import { evaluateFreshness } from '../../domain/telemetry/freshness.js'
const FleetDataContext = createContext(null)
function buildRows(vehicles, latest, attention, freshness, now) {
    const latestById = new Map(latest.map((item) => [item.vehicleId, item]))
    return vehicles.map((vehicle) => {
        const state = latestById.get(vehicle.id) ?? null
        const fresh = freshness[vehicle.id] ?? evaluateFreshness(state?.receivedAt, now)
        const openAlerts = attention.filter(
            (item) => item.vehicleId === vehicle.id && (item.status === 'open' || item.status === 'acked'),
        )
        return {
            ...vehicle,
            latest: state,
            freshness: fresh,
            openAlerts,
            status: deriveVehicleStatus({ latest: state, freshness: fresh, openAlerts }),
        }
    })
}
export function FleetDataProvider({ children }) {
    const workerRef = useRef(null)
    const [vehicles, setVehicles] = useState(() => vehicleRepository.list())
    const [packets, setPackets] = useState(() => packetRepository.list())
    const [attention, setAttention] = useState(() => attentionRepository.list())
    const [latest, setLatest] = useState([])
    const [freshness, setFreshness] = useState({})
    const [now, setNow] = useState(Date.now())
    const [workerReady, setWorkerReady] = useState(false)
    useEffect(() => {
        const worker = new Worker(new URL('../../workers/telemetry.worker.js', import.meta.url), {
            type: 'module',
        })
        workerRef.current = worker
        worker.onmessage = (event) => {
            const snapshot = event.data
            if (snapshot.type !== 'snapshot') return
            setNow(snapshot.now)
            setLatest(snapshot.latest)
            setFreshness(snapshot.freshness)
            setAttention(snapshot.attention)
            attentionRepository.replaceAll(snapshot.attention)
            if (snapshot.accepted?.length) {
                packetRepository.saveMany(snapshot.accepted)
                setPackets(packetRepository.list())
                database.persist()
            } else {
                database.persist()
            }
            setWorkerReady(true)
        }
        worker.postMessage({
            type: 'hydrate',
            vehicleIds: vehicleRepository.list().map((vehicle) => vehicle.id),
            packets: packetRepository.list(),
            attention: attentionRepository.list(),
            now: Date.now(),
        })
        const tick = setInterval(() => {
            worker.postMessage({ type: 'tick', now: Date.now() })
        }, 2000)
        return () => {
            clearInterval(tick)
            worker.terminate()
        }
    }, [])
    const ingest = useCallback((incoming) => {
        workerRef.current?.postMessage({ type: 'ingest', packets: incoming, now: Date.now() })
    }, [])
    const registerVehicles = useCallback((ids) => {
        workerRef.current?.postMessage({ type: 'register', vehicleIds: ids, now: Date.now() })
    }, [])
    const acknowledge = useCallback((id) => {
        workerRef.current?.postMessage({ type: 'ack', id, now: Date.now() })
    }, [])
    const refreshLocal = useCallback(() => {
        setVehicles(vehicleRepository.list())
        setPackets(packetRepository.list())
        setAttention(attentionRepository.list())
    }, [])
    const rows = useMemo(
        () => buildRows(vehicles, latest, attention, freshness, now),
        [vehicles, latest, attention, freshness, now],
    )
    const value = useMemo(
        () => ({
            vehicles,
            packets,
            attention,
            latest,
            freshness,
            rows,
            openAttention: openAttention(attention),
            workerReady,
            ingest,
            registerVehicles,
            acknowledge,
            refreshLocal,
        }),
        [vehicles, packets, attention, latest, freshness, rows, workerReady, ingest, registerVehicles, acknowledge, refreshLocal],
    )
    return <FleetDataContext.Provider value={value}>{children}</FleetDataContext.Provider>
}
export function useFleetData() {
    const value = useContext(FleetDataContext)
    if (!value) throw new Error('useFleetData must be used within FleetDataProvider')
    return value
}