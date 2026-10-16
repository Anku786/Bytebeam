import { useFleetData } from '../../app/providers/FleetDataProvider.jsx'
import { AttentionCard } from './AttentionCard.jsx'
export function AttentionQueue() {
    const { openAttention, rows, acknowledge } = useFleetData()
    const names = Object.fromEntries(rows.map((row) => [row.id, row.name]))
    const open = openAttention.filter((item) => item.status === 'open')
    const acked = openAttention.filter((item) => item.status === 'acked')
    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <p className="eyebrow">Exceptions</p>
                    <h1>Attention</h1>
                </div>
            </header>
            <h2>Open ({open.length})</h2>
            <div className="card-grid">
                {open.length === 0 ? <p className="empty-copy">No open attention items.</p> : null}
                {open.map((item) => (
                    <AttentionCard
                        key={item.id}
                        item={item}
                        vehicleName={names[item.vehicleId]}
                        onAck={acknowledge}
                    />
                ))}
            </div>
            <h2>Acknowledged ({acked.length})</h2>
            <div className="card-grid">
                {acked.map((item) => (
                    <AttentionCard
                        key={item.id}
                        item={item}
                        vehicleName={names[item.vehicleId]}
                        onAck={acknowledge}
                    />
                ))}
            </div>
        </div>
    )
}