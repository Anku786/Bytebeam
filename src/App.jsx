import { NavLink } from 'react-router-dom'
import { AppRoutes } from './app/routes/index.jsx'
import { useFleetData } from './app/providers/FleetDataProvider.jsx'
import { useShell } from './app/providers/ShellProvider.jsx'
import { useSimulator } from './app/providers/SimulatorProvider.jsx'
function Shell() {
    const { openAttention } = useFleetData()
    const { running, start, stop } = useSimulator()
    const { searchQuery, setSearchQuery, collapsed, setCollapsed, issueOnly, setIssueOnly } = useShell()
    const openCount = openAttention.filter((item) => item.status === 'open').length
    return (
        <div className="app">
            <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
                <div className="brand">
                    <div className="logo">ϟ</div>
                    <div className="brand-copy">
                        <div className="brand-title">Voltrak</div>
                        <div className="brand-sub">Fleet Operations Platform</div>
                    </div>
                </div>
                <nav className="nav">
                    <NavLink to="/" className="nav-item">
                        <span className="nav-icon">▱</span>
                        Vehicles
                    </NavLink>
                    <NavLink to="/attention" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                        <span className="nav-icon">△</span>
                        Alerts
                        {openCount ? <span className="nav-badge">{openCount}</span> : null}
                    </NavLink>
                </nav>
                <div className="sidebar-bottom">
                    <button type="button" className="collapse" onClick={() => setCollapsed((value) => !value)}>
                        {collapsed ? '→' : '←'}
                        <span className="collapse-label">&nbsp; Collapse</span>
                    </button>
                </div>
            </aside>
            <main className="main">
                <header className="topbar">
                    <div className="search">
                        <span>⌕</span>
                        <input
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search vehicles, locations, drivers..."
                        />
                    </div>
                    <div className="top-actions">
                        <button type="button" className={`live${running ? '' : ' paused'}`} onClick={running ? stop : start}>
                            <i></i> {running ? 'Live' : 'Paused'}
                        </button>
                        <button className="icon-btn" title="Refresh" type="button">
                            ↻
                        </button>
                        <button className="icon-btn" title="Theme" type="button">
                            ☼
                        </button>
                        <button className="icon-btn" title="Notifications" type="button">
                            ♧
                        </button>
                        <div className="user">
                            <div className="avatar">AJ</div>
                            <div>
                                <div className="user-name">Alex Johnson</div>
                                <div className="user-role">Fleet Operations</div>
                            </div>
                            <span>⌄</span>
                        </div>
                    </div>
                </header>
                <AppRoutes />
            </main>
        </div>
    )
}
export default function App() {
    return <Shell />
}