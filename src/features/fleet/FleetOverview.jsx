import { useNavigate } from 'react-router-dom'
import { DataTable } from '../../components/DataTable/index.js'
import { FreshnessBadge } from '../../components/FreshnessBadge/index.js'
import { StatusBadge } from '../../components/StatusBadge/index.js'
import { useFleetData } from '../../app/providers/FleetDataProvider.jsx'
import { useSimulator } from '../../app/providers/SimulatorProvider.jsx'
import { FleetStats } from './FleetStats.jsx'
import { FleetChart } from './FleetChart.jsx'
export function FleetOverview() {
    const navigate = useNavigate()
    const { rows, openAttention } = useFleetData()
    const { assignments, scenarios, setScenario } = useSimulator()
    const columns = [
        { key: 'name', header: 'Vehicle' },
        { key: 'region', header: 'Region' },
        {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.status} />,
        },
        {
            key: 'freshness',
            header: 'Freshness',
            render: (row) => <FreshnessBadge freshness={row.freshness} />,
        },
        {
            key: 'speed',
            header: 'Speed',
            render: (row) => (row.latest ? `${Math.round(row.latest.speedKph)} km/h` : '—'),
        },
        {
            key: 'fuel',
            header: 'Fuel',
            render: (row) => (row.latest ? `${Math.round(row.latest.fuelPct)}%` : '—'),
        },
        {
            key: 'alerts',
            header: 'Alerts',
            render: (row) => row.openAlerts.length,
        },
        {
            key: 'scenario',
            header: 'Scenario',
            render: (row) => (
                <select
                    value={assignments[row.id] ?? ''}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => setScenario(row.id, event.target.value)}
                >
                    {Object.values(scenarios).map((scenario) => (
                        <option key={scenario.id} value={scenario.id}>
                            {scenario.label}
                        </option>
                    ))}
                </select>
            ),
        },
    ]
    return (
        <section className="content">
            <div className="page-head">
                <div className="page-title-wrap">
                    <div className="page-icon">▣</div>
                    <div><h1>Fleet Overview</h1><div className="page-sub">Real-time summary of your fleet operations</div></div>
                </div>
                <div className="head-actions">
                    <button className="date">▣ &nbsp; Oct 10 – Oct 16, 2026 &nbsp;⌄</button>
                    <button className="download">↓</button><button className="icon-btn">⚙</button>
                </div>
            </div>
            <FleetStats rows={rows} openCount={openAttention.filter((item) => item.status === 'open').length} />
            <FleetChart />
            <DataTable columns={columns} rows={rows} onRowClick={(row) => navigate(`/vehicles/${row.id}`)} />
        </section>
    )
}