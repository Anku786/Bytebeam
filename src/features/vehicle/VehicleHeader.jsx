import { FreshnessBadge } from '../../components/FreshnessBadge/index.js'
import { StatusBadge } from '../../components/StatusBadge/index.js'
export function VehicleHeader({ vehicle }) {
    return (
        <header className="page-header">
            <div>
                <p className="eyebrow">{vehicle.vin}</p>
                <h1>{vehicle.name}</h1>
                <p className="muted">
                    {vehicle.make} {vehicle.model} · {vehicle.region}
                </p>
            </div>
            <div className="header-badges">
                <StatusBadge status={vehicle.status} />
                <FreshnessBadge freshness={vehicle.freshness} />
            </div>
        </header>
    )
}
