import { Fuel, Gauge } from "lucide-react";
import { formatCurrency, formatDate, formatNumber } from "../../utils/format";

export default function FuelLogTable({ logs, loading }) {
  if (loading) {
    return <TableSkeleton />;
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-14 text-[var(--color-text-faint)]">
        <Fuel size={28} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No fuel logs yet. Add the first entry to start tracking.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[var(--color-text-faint)] text-xs uppercase tracking-wide border-b border-[var(--color-border)]">
            <th className="px-3 py-2.5 font-medium">Vehicle</th>
            <th className="px-3 py-2.5 font-medium">Date</th>
            <th className="px-3 py-2.5 font-medium text-right">Quantity</th>
            <th className="px-3 py-2.5 font-medium text-right">Cost</th>
            <th className="px-3 py-2.5 font-medium text-right">Odometer</th>
            <th className="px-3 py-2.5 font-medium">Logged by</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border-soft)]">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-[var(--color-surface-2)]/60 transition-colors">
              <td className="px-3 py-3 font-medium text-[var(--color-text)]">{log.vehicleName}</td>
              <td className="px-3 py-3 text-[var(--color-text-muted)]">{formatDate(log.date)}</td>
              <td className="px-3 py-3 text-right font-mono-num">{log.quantityLiters} L</td>
              <td className="px-3 py-3 text-right font-mono-num font-semibold text-[var(--color-amber)]">
                {formatCurrency(log.cost)}
              </td>
              <td className="px-3 py-3 text-right font-mono-num text-[var(--color-text-muted)]">
                {log.odometer ? (
                  <span className="inline-flex items-center gap-1 justify-end">
                    <Gauge size={12} /> {formatNumber(log.odometer)} km
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-3 py-3 text-[var(--color-text-muted)]">{log.createdBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-2 py-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-10 rounded-lg bg-[var(--color-surface-2)] animate-pulse" />
      ))}
    </div>
  );
}
