import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { database } from '../../db/database.js'
import { vehicleRepository } from '../../db/repositories/vehicleRepository.js'
import { assignScenario, createSimulatorState } from '../../simulator/generator.js'
import { createIngestionLoop } from '../../simulator/ingestionWorker.js'
import { SCENARIOS } from '../../simulator/scenarios.js'
import { useFleetData } from './FleetDataProvider.jsx'
const SimulatorContext = createContext(null)
export function SimulatorProvider({ children }) {
    const { ingest, refreshLocal, registerVehicles } = useFleetData()
    const runtimeRef = useRef(null)
    const loopRef = useRef(null)
    const [running, setRunning] = useState(true)
    const [assignments, setAssignments] = useState({})
    useEffect(() => {
        const seeded = createSimulatorState()
        runtimeRef.current = seeded.runtime
        const existing = vehicleRepository.list()
        if (existing.length === 0) {
            vehicleRepository.saveMany(seeded.vehicles)
            database.persist()
            refreshLocal()
        }
        registerVehicles(seeded.vehicles.map((vehicle) => vehicle.id))
        setAssignments(
            Object.fromEntries([...seeded.runtime.entries()].map(([id, state]) => [id, state.scenario])),
        )
        const loop = createIngestionLoop({
            runtime: seeded.runtime,
            onPackets: ingest,
            intervalMs: 1200,
        })
        loopRef.current = loop
        loop.start()
        setRunning(true)
        return () => loop.stop()
    }, [ingest, refreshLocal, registerVehicles])
    const value = useMemo(
        () => ({
            running,
            scenarios: SCENARIOS,
            assignments,
            start() {
                loopRef.current?.start()
                setRunning(true)
            },
            stop() {
                loopRef.current?.stop()
                setRunning(false)
            },
            setScenario(vehicleId, scenarioId) {
                assignScenario(runtimeRef.current, vehicleId, scenarioId)
                setAssignments((current) => ({ ...current, [vehicleId]: scenarioId }))
            },
        }),
        [running, assignments],
    )
    return <SimulatorContext.Provider value={value}>{children}</SimulatorContext.Provider>
}
export function useSimulator() {
    const value = useContext(SimulatorContext)
    if (!value) throw new Error('useSimulator must be used within SimulatorProvider')
    return value
}