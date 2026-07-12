import { Receipt } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import { formatCurrency, formatDate } from "../../utils/format";

export default function ExpenseTable({ expenses, loading }) {
  if (loading) {
    return (
      <div className="space-y-2 py-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 rounded-lg bg-[var(--color-surface-2)] animate-pulse" />
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-14 text-[var(--color-text-faint)]">
        <Receipt size={28} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No expenses recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[var(--color-text-faint)] text-xs uppercase tracking-wide border-b border-[var(--color-border)]">
            <th className="px-3 py-2.5 font-medium">Type</th>
            <th className="px-3 py-2.5 font-medium">Vehicle</th>
            <th className="px-3 py-2.5 font-medium">Trip</th>
            <th className="px-3 py-2.5 font-medium">Date</th>
            <th className="px-3 py-2.5 font-medium text-right">Amount</th>
            <th className="px-3 py-2.5 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border-soft)]">
          {expenses.map((exp) => (
            <tr key={exp.id} className="hover:bg-[var(--color-surface-2)]/60 transition-colors">
              <td className="px-3 py-3 font-medium text-[var(--color-text)]">{exp.type}</td>
              <td className="px-3 py-3 text-[var(--color-text-muted)]">{exp.vehicleName}</td>
              <td className="px-3 py-3 text-[var(--color-text-muted)]">{exp.tripLabel || "—"}</td>
              <td className="px-3 py-3 text-[var(--color-text-muted)]">{formatDate(exp.date)}</td>
              <td className="px-3 py-3 text-right font-mono-num font-semibold text-[var(--color-teal)]">
                {formatCurrency(exp.amount)}
              </td>
              <td className="px-3 py-3">
                <StatusBadge status={exp.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
