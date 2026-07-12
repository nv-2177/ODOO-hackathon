export default function Field({ label, children }) {
  return (
    <label className="block mb-3.5">
      <span className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus-ring outline-none";
