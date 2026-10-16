import { VEHICLE_STATUS } from '../../domain/fleet/vehicleStatus.js'
export function FleetStats({ rows, openCount }) {
    const counts = rows.reduce(
        (acc, row) => {
            acc[row.status] = (acc[row.status] ?? 0) + 1
            return acc
        },
        {},
    )
    const stats = [
        { label: 'Vehicles', value: rows.length },
        { label: 'Moving', value: counts[VEHICLE_STATUS.MOVING] ?? 0 },
        { label: 'Open attention', value: openCount },
        { label: 'Offline', value: counts[VEHICLE_STATUS.OFFLINE] ?? 0 },
        { label: 'Critical', value: counts[VEHICLE_STATUS.CRITICAL] ?? 0 },
    ]
    return (
        <div className="kpis">
            {stats.map((stat) => (
                <div key={stat.label} className="card kpi">
                    <div className="kpi-title">{stat.label}</div><div className="kpi-value">{stat.value}</div>
                    <div className="kpi-icon">▣</div>
                </div>
            ))}
        </div>
    )
}