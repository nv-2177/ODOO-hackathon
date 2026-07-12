/**
 * Signature instrument-panel gauge — reads like a fuel/temperature dial,
 * used to visualize budget consumption at a glance.
 */
export default function GaugeCard({ title, value, max, formatValue, sub, danger }) {
  const pct = Math.min(1, max > 0 ? value / max : 0);
  const angle = -120 + pct * 240; // sweep from -120deg to +120deg
  const radius = 54;
  const circumference = (240 / 360) * 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct);
  const color = danger ? "var(--color-danger)" : "var(--color-amber)";

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 flex flex-col items-center">
      <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide self-start mb-2">
        {title}
      </span>

      <div className="relative w-36 h-28">
        <svg viewBox="0 0 140 110" className="w-full h-full -mt-1">
          {/* track */}
          <path
            d="M 20 90 A 54 54 0 1 1 120 90"
            fill="none"
            stroke="var(--color-surface-3)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* value arc */}
          <path
            d="M 20 90 A 54 54 0 1 1 120 90"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease" }}
          />
          {/* needle */}
          <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "70px 90px", transition: "transform 0.6s ease" }}>
            <line x1="70" y1="90" x2="70" y2="42" stroke="var(--color-text)" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="70" cy="90" r="4.5" fill="var(--color-text)" />
          </g>
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <span className="font-mono-num font-semibold text-lg text-[var(--color-text)]">
            {Math.round(pct * 100)}%
          </span>
        </div>
      </div>

      <p className="font-display font-bold text-xl text-[var(--color-text)] font-mono-num mt-1">
        {formatValue(value)}
      </p>
      {sub && <p className="text-xs text-[var(--color-text-faint)] mt-1 text-center">{sub}</p>}
    </div>
  );
}
