const STYLES = {
  Available: "bg-[var(--color-teal-soft)] text-[var(--color-teal)]",
  Completed: "bg-[var(--color-amber-soft)] text-[var(--color-amber)]",
  Pending: "bg-[var(--color-surface-3)] text-[var(--color-text-muted)]",
  Overdue: "bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] || STYLES.Pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
