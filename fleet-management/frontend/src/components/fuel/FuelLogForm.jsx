import { useState } from "react";
import Field, { inputClass } from "../ui/Field";

export default function FuelLogForm({ vehicles, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    vehicleId: vehicles[0]?.id || "",
    date: new Date().toISOString().slice(0, 10),
    quantityLiters: "",
    cost: "",
    odometer: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Vehicle">
        <select value={form.vehicleId} onChange={update("vehicleId")} className={inputClass} required>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Fuel log date">
        <input type="date" value={form.date} onChange={update("date")} className={inputClass} required />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Fuel quantity (litres)">
          <input
            type="number"
            min="0"
            step="0.1"
            value={form.quantityLiters}
            onChange={update("quantityLiters")}
            className={inputClass}
            placeholder="e.g. 40"
            required
          />
        </Field>
        <Field label="Fuel cost (₹)">
          <input
            type="number"
            min="0"
            step="1"
            value={form.cost}
            onChange={update("cost")}
            className={inputClass}
            placeholder="e.g. 4200"
            required
          />
        </Field>
      </div>

      <Field label="Odometer reading (optional)">
        <input
          type="number"
          min="0"
          value={form.odometer}
          onChange={update("odometer")}
          className={inputClass}
          placeholder="e.g. 45210"
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
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--color-amber)] text-[#1A1305] hover:brightness-95 disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Log fuel entry"}
        </button>
      </div>
    </form>
  );
}
