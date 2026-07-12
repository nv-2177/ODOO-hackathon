import { useState } from "react";
import Field, { inputClass } from "../ui/Field";

const EXPENSE_TYPES = ["Toll", "Miscellaneous", "Maintenance", "Trip"];

export default function ExpenseForm({ vehicles, trips, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    type: "Toll",
    vehicleId: vehicles[0]?.id || "",
    tripId: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    description: "",
    status: "Available",
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ ...form, tripId: form.tripId || null });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Expense type">
        <select value={form.type} onChange={update("type")} className={inputClass}>
          {EXPENSE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Vehicle">
        <select value={form.vehicleId} onChange={update("vehicleId")} className={inputClass} required>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </Field>

      {form.type === "Trip" && (
        <Field label="Related trip (optional)">
          <select value={form.tripId} onChange={update("tripId")} className={inputClass}>
            <option value="">— None —</option>
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.origin} → {t.destination} ({t.date})
              </option>
            ))}
          </select>
        </Field>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field label="Amount (₹)">
          <input
            type="number"
            min="0"
            value={form.amount}
            onChange={update("amount")}
            className={inputClass}
            placeholder="e.g. 450"
            required
          />
        </Field>
        <Field label="Date">
          <input type="date" value={form.date} onChange={update("date")} className={inputClass} required />
        </Field>
      </div>

      <Field label="Status">
        <select value={form.status} onChange={update("status")} className={inputClass}>
          <option value="Available">Available</option>
          <option value="Completed">Completed</option>
        </select>
      </Field>

      <Field label="Description (optional)">
        <textarea
          value={form.description}
          onChange={update("description")}
          className={inputClass}
          rows={2}
          placeholder="e.g. NH48 toll charges"
        />
      </Field>

      <div className="flex justify-end gap-2 mt-5">
        <button
          type="button"
          onClick={onCancel}
          className="px-3.5 py-2 rounded-lg text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--color-teal)] text-[#052420] hover:brightness-95 disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Record expense"}
        </button>
      </div>
    </form>
  );
}
