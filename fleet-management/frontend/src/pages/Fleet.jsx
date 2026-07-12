import { useEffect, useState } from "react";
import { Plus, Truck } from "lucide-react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import Modal from "../components/ui/Modal";
import Field, { inputClass } from "../components/ui/Field";

export default function Fleet() {
  const { notify } = useToast();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", regNo: "", type: "Truck" });

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/vehicles");
    setVehicles(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/vehicles", form);
      notify(`Vehicle added — ${form.name}.`, "success");
      setModalOpen(false);
      setForm({ name: "", regNo: "", type: "Truck" });
      load();
    } catch (err) {
      notify(err.response?.data?.message || "Could not add vehicle.", "warning");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-extrabold text-xl lg:text-2xl text-[var(--color-text)]">Fleet</h1>
          <p className="text-sm text-[var(--color-text-faint)] mt-1">All registered vehicles.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-[var(--color-amber)] text-[#1A1305] hover:brightness-95"
        >
          <Plus size={16} /> Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? [...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-[var(--color-surface-2)] animate-pulse" />
            ))
          : vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--color-amber-soft)] flex items-center justify-center shrink-0">
                  <Truck size={18} className="text-[var(--color-amber)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--color-text)]">{v.name}</p>
                  <p className="text-xs text-[var(--color-text-faint)] mt-0.5">
                    {v.regNo} · {v.type}
                  </p>
                </div>
              </div>
            ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Vehicle">
        <form onSubmit={handleAdd}>
          <Field label="Vehicle name">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={inputClass}
              placeholder="e.g. Tata Ace - TN01AB1234"
              required
            />
          </Field>
          <Field label="Registration number">
            <input
              value={form.regNo}
              onChange={(e) => setForm((f) => ({ ...f, regNo: e.target.value }))}
              className={inputClass}
              placeholder="e.g. TN01AB1234"
              required
            />
          </Field>
          <Field label="Type">
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className={inputClass}
            >
              <option>Truck</option>
              <option>Mini Truck</option>
              <option>Pickup</option>
              <option>Van</option>
            </select>
          </Field>
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
              Add vehicle
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
