import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFleetData } from '../../app/providers/FleetDataProvider.jsx'
import { Timeline } from '../../components/Timeline/index.js'
import { formatAge } from '../../domain/telemetry/freshness.js'
import { VehicleHeader } from './VehicleHeader.jsx'
function formatTime(ts) {
    return new Date(ts).toLocaleTimeString()
}
export function VehicleDetail() {
    const { vehicleId } = useParams()
    const { rows, packets, attention } = useFleetData()
    const vehicle = rows.find((row) => row.id === vehicleId)
    const history = useMemo(
        () =>
            packets
                .filter((packet) => packet.vehicleId === vehicleId)
                .sort((a, b) => b.recordedAt - a.recordedAt)
                .slice(0, 12),
        [packets, vehicleId],
    )
    const events = useMemo(
        () =>
            attention
                .filter((item) => item.vehicleId === vehicleId)
                .slice(0, 12)
                .map((item) => ({
                    id: `${item.id}-${item.lastSeenAt}`,
                    title: item.ruleId.replaceAll('_', ' '),
                    detail: `${item.message} · ${item.status}`,
                    severity: item.severity,
                    timeLabel: formatTime(item.lastSeenAt),
                })),
        [attention, vehicleId],
    )
    if (!vehicle) {
        return (
            <div className="page">
                <p>Vehicle not found.</p>
                <Link to="/">Back to fleet</Link>
            </div>
        )
    }
    const latest = vehicle.latest
    return (
        <div className="page">
            <p>
                <Link to="/">← Fleet</Link>
            </p>
            <VehicleHeader vehicle={vehicle} />
            <section className="metric-grid">
                <article>
                    <p>Speed</p>
                    <strong>{latest ? `${Math.round(latest.speedKph)} km/h` : '—'}</strong>
                </article>
                <article>
                    <p>Fuel</p>
                    <strong>{latest ? `${Math.round(latest.fuelPct)}%` : '—'}</strong>
                </article>
                <article>
                    <p>Ignition</p>
                    <strong>{latest ? (latest.ignition ? 'On' : 'Off') : '—'}</strong>
                </article>
                <article>
                    <p>GPS</p>
                    <strong>
                        {latest?.lat != null ? `${latest.lat.toFixed(4)}, ${latest.lng.toFixed(4)}` : '—'}
                    </strong>
                </article>
                <article>
                    <p>Odometer</p>
                    <strong>{latest ? `${Math.round(latest.odometerKm)} km` : '—'}</strong>
                </article>
                <article>
                    <p>Last packet</p>
                    <strong>{latest ? formatAge(vehicle.freshness.ageMs) : 'never'}</strong>
                </article>
            </section>
            <div className="split">
                <section>
                    <h2>Attention</h2>
                    <Timeline events={events} empty="No alert history for this vehicle." />
                </section>
                <section>
                    <h2>Recent packets</h2>
                    <ul className="packet-list">
                        {history.map((packet) => (
                            <li key={packet.id}>
                                <span>#{packet.seq}</span>
                                <span>{Math.round(packet.speedKph)} km/h</span>
                                <span>{Math.round(packet.fuelPct)}%</span>
                                <time>{formatTime(packet.receivedAt)}</time>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    )
}