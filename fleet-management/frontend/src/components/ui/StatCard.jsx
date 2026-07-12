export default function StatCard({ label, value, sub, icon: Icon, accent = "amber" }) {
  const accentColor = accent === "teal" ? "var(--color-teal)" : "var(--color-amber)";
  const accentSoft = accent === "teal" ? "var(--color-teal-soft)" : "var(--color-amber-soft)";

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 lg:p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
          {label}
        </span>
        {Icon && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: accentSoft, color: accentColor }}
          >
            <Icon size={16} />
          </div>
        )}
      </div>
      <p className="font-display font-extrabold text-2xl text-[var(--color-text)] font-mono-num">
        {value}
      </p>
      {sub && <p className="text-xs text-[var(--color-text-faint)] mt-1.5">{sub}</p>}
    </div>
  );
}
