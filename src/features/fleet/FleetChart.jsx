export function FleetChart() {
    return (
        <div className="middle">
            <section className="panel">
                <div className="panel-title">Fleet Activity</div><div className="panel-sub">Vehicles reporting over 7 days</div>
                <div className="chart">
                    <svg viewBox="0 0 600 180" preserveAspectRatio="none">
                        <defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2874ff" stop-opacity=".24"></stop><stop offset="1" stop-color="#2874ff" stop-opacity="0"></stop></linearGradient></defs>
                        <path d="M0 133 C35 90 60 154 95 140 S135 82 170 105 S210 122 240 53 S285 21 320 66 S360 112 390 96 S430 68 462 107 S505 142 535 125 S570 93 600 68 L600 180 L0 180 Z" fill="url(#fill)"></path>
                        <path d="M0 133 C35 90 60 154 95 140 S135 82 170 105 S210 122 240 53 S285 21 320 66 S360 112 390 96 S430 68 462 107 S505 142 535 125 S570 93 600 68" fill="none" stroke="#2b78ff" stroke-width="2.2"></path>
                    </svg>
                    <div className="tooltip"><strong>Oct 14, 2026</strong>462 vehicles</div>
                </div>
                <div className="xlabels"><span>Oct 10</span><span>Oct 11</span><b>Oct 14</b><span>Oct 15</span><span>Oct 16</span></div>
            </section>

            <section className="panel">
                <div className="panel-title">Fleet Reporting Status</div><div className="panel-sub">Current telemetry session</div>
                <div className="donut-wrap"><div className="donut"><div className="donut-center"><div><strong>459</strong><span>Reporting</span></div></div></div></div>
                <div className="charging-legend">
                    <div className="legend-box legend-purple">FRESH<strong>421</strong></div>
                    <div className="legend-box legend-blue">PARTIAL<strong>38</strong></div>
                    <div className="legend-box legend-gray">OFFLINE<strong>41</strong></div>
                </div>
            </section>

            <section className="panel">
                <div className="panel-title">Battery Health</div><div className="panel-sub">Distribution across fleet</div>
                <div className="health-list">
                    <div className="health-row"><div><div className="health-label" style={{color:"#35c97d"}}>Excellent 90–100%</div><div className="health-bar"><span className="greenbar" style={{width:"75%"}}></span></div></div><div className="health-count">124</div></div>
                    <div className="health-row"><div><div className="health-label" style={{ color: "#35c97d" }}>Good 70–89%</div><div className="health-bar"><span className="greenbar" style={{ width: "82%" }}></span></div></div><div className="health-count">241</div></div>
                    <div className="health-row"><div><div className="health-label" style={{ color: "#e4aa45" }}>Fair 40–69%</div><div className="health-bar"><span className="amberbar" style={{ width: "38%" }}></span></div></div><div className="health-count">89</div></div>
                    <div className="health-row"><div><div className="health-label" style={{ color: "#d98d2d" }}>Poor 20–39%</div><div className="health-bar"><span className="amberbar" style={{ width: "17%" }}></span></div></div><div className="health-count">32</div></div>
                    <div className="health-row"><div><div className="health-label" style={{ color: "#ef5a61" }}>Critical &lt;20%</div><div className="health-bar"><span className="redbar" style={{ width: "6%" }}></span></div></div><div className="health-count">14</div></div>
                </div>
            </section>
        </div>
    )
}