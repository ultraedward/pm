export default function TopNav() {
  const demo = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <div className="brand-mark">PM</div>
          <span className="pill">{demo ? "DEMO DATA" : "LIVE"}</span>
          <span className="small">Nike x E*TRADE tester build</span>
        </div>

        <div className="nav">
          <a href="/">Dashboard</a>
          <a href="/charts">Charts</a>
          <a href="/alerts">Alerts</a>
        </div>
      </div>
    </div>
  );
}
