export function Alert() {
    return (
        <aside className="card alerts">
            <div className="alerts-head"><div className="alerts-title">Alerts &amp; Issues</div><span className="view-all">View all →</span></div>
            <div className="alert-section"><div className="section-label">Critical Alerts <span>3</span></div>
                <div className="alert-item"><div className="alert-symbol">△</div><div><div className="alert-vehicle">V-1005</div><div className="alert-text">Battery critically low (1%)</div></div><div className="alert-time">Just now</div></div>
                <div className="alert-item"><div className="alert-symbol">△</div><div><div className="alert-vehicle">V-1010</div><div className="alert-text">Vehicle breakdown detected</div></div><div className="alert-time">8 min ago</div></div>
                <div className="alert-item"><div className="alert-symbol">△</div><div><div className="alert-vehicle">V-1021</div><div className="alert-text">System malfunction</div></div><div className="alert-time">15 min ago</div></div>
            </div>
            <div className="alert-section"><div className="section-label" style={{color:"#f1ae3a"}}>Data quality &amp; warning <span style={{background:"#c77b16"}}>2</span></div>
                <div className="alert-item warning"><div className="alert-symbol">△</div><div><div className="alert-vehicle">V-1004</div><div className="alert-text">Battery telemetry stale</div></div><div className="alert-time">14 min ago</div></div>
                <div className="alert-item warning"><div className="alert-symbol">△</div><div><div className="alert-vehicle">V-1008</div><div className="alert-text">Low battery (20%)</div></div><div className="alert-time">3 min ago</div></div>
            </div>
            <div className="alert-section"><div className="section-label" style={{color:"#a98cff"}}>Attention queue <span style={{background:"#7043d5"}}>1</span></div>
                <div className="alert-item info"><div className="alert-symbol">△</div><div><div className="alert-vehicle">V-1020</div><div className="alert-text">Charging rate below expected</div></div><div className="alert-time">10 min ago</div></div>
            </div>
        </aside>
    )
}