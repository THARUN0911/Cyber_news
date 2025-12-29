export default function TopBar() {
  return (
    <div className="topbar">
      <div className="logo">CyberPulse</div>

      <div className="top-actions">
        <input
          className="site-search"
          placeholder="Search cyber news…"
        />
        <button>Install</button>
      </div>
    </div>
  );
}
