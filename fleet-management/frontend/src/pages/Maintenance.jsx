import { useEffect, useState } from "react";
import { Plus, Wrench } from "lucide-react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import Modal from "../components/ui/Modal";
import Field, { inputClass } from "../components/ui/Field";
import { formatCurrency, formatDate } from "../utils/format";

export default function Maintenance() {
  const { notify } = useToast();
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    vehicleId: "",
    description: "",
    cost: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const load = async () => {
    setLoading(true);
    const [m, v] = await Promise.all([api.get("/maintenance"), api.get("/vehicles")]);
    setRecords(m.data);
    setVehicles(v.data);
    setForm((f) => ({ ...f, vehicleId: f.vehicleId || v.data[0]?.id || "" }));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/maintenance", form);
      notify("Maintenance record added.", "success");
      if (Number(form.cost) > 20000) notify("High maintenance expense flagged for this vehicle.", "warning");
      setModalOpen(false);
      load();
    } catch (err) {
      notify(err.response?.data?.message || "Could not add maintenance record.", "warning");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-extrabold text-xl lg:text-2xl text-[var(--color-text)]">
            Maintenance
          </h1>
          <p className="text-sm text-[var(--color-text-faint)] mt-1">
            Service history, linked to Operational Cost Summary.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-[var(--color-amber)] text-[#1A1305] hover:brightness-95"
        >
          <Plus size={16} /> Add Record
        </button>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl divide-y divide-[var(--color-border-soft)]">
        {loading ? (
          <div className="p-5 space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 rounded-lg bg-[var(--color-surface-2)] animate-pulse" />
            ))}
          </div>
        ) : (
          records.map((m) => (
            <div key={m.id} className="flex items-center gap-3 px-5 py-3.5 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--color-surface-3)] flex items-center justify-center text-[var(--color-text-muted)]">
                  <Wrench size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">{m.description}</p>
                  <p className="text-xs text-[var(--color-text-faint)]">
                    {m.vehicleName} · {formatDate(m.date)}
                  </p>
                </div>
              </div>
              <span className="font-mono-num font-semibold text-sm text-[var(--color-text)]">
                {formatCurrency(m.cost)}
              </span>
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Maintenance Record">
        <form onSubmit={handleAdd}>
          <Field label="Vehicle">
            <select
              value={form.vehicleId}
              onChange={(e) => setForm((f) => ({ ...f, vehicleId: e.target.value }))}
              className={inputClass}
              required
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Description">
            <input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={inputClass}
              placeholder="e.g. Brake pad replacement"
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Cost (₹)">
              <input
                type="number"
                min="0"
                value={form.cost}
                onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))}
                className={inputClass}
                required
              />
            </Field>
            <Field label="Date">
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className={inputClass}
                required
              />
            </Field>
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--color-amber)] text-[#1A1305] hover:brightness-95"
            >
              Add record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
