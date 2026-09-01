export function CardSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-block skeleton-media" />
          <div className="skeleton-block skeleton-line" style={{ width: "40%" }} />
          <div className="skeleton-block skeleton-line" style={{ width: "70%" }} />
          <div className="skeleton-block skeleton-line" style={{ width: "50%" }} />
        </div>
      ))}
    </div>
  );
}

export function GaugeSpinner({ label = "Loading" }) {
  return (
    <div className="gauge-spinner" role="status" aria-label={label}>
      <svg viewBox="0 0 100 100">
        <circle className="gauge-track" cx="50" cy="50" r="42" />
        <circle className="gauge-needle" cx="50" cy="50" r="42" />
      </svg>
      <span className="mono">{label}…</span>
    </div>
  );
}
