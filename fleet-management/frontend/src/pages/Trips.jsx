import { useEffect, useState } from "react";
import { Plus, Route as RouteIcon } from "lucide-react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import Modal from "../components/ui/Modal";
import Field, { inputClass } from "../components/ui/Field";
import StatusBadge from "../components/ui/StatusBadge";
import { formatDate } from "../utils/format";

export default function Trips() {
  const { notify } = useToast();
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    vehicleId: "",
    origin: "",
    destination: "",
    date: new Date().toISOString().slice(0, 10),
    status: "Available",
  });

  const load = async () => {
    setLoading(true);
    const [t, v] = await Promise.all([api.get("/trips"), api.get("/vehicles")]);
    setTrips(t.data);
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
      await api.post("/trips", form);
      notify(`Trip added — ${form.origin} → ${form.destination}.`, "success");
      setModalOpen(false);
      load();
    } catch (err) {
      notify(err.response?.data?.message || "Could not add trip.", "warning");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-extrabold text-xl lg:text-2xl text-[var(--color-text)]">Trips</h1>
          <p className="text-sm text-[var(--color-text-faint)] mt-1">Scheduled and completed trips.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-[var(--color-amber)] text-[#1A1305] hover:brightness-95"
        >
          <Plus size={16} /> Add Trip
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
          trips.map((t) => (
            <div key={t.id} className="flex items-center gap-3 px-5 py-3.5 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--color-teal-soft)] flex items-center justify-center text-[var(--color-teal)]">
                  <RouteIcon size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {t.origin} → {t.destination}
                  </p>
                  <p className="text-xs text-[var(--color-text-faint)]">
                    {t.vehicleName} · {formatDate(t.date)}
                  </p>
                </div>
              </div>
              <StatusBadge status={t.status} />
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Trip">
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
          <div className="grid grid-cols-2 gap-3">
            <Field label="Origin">
              <input
                value={form.origin}
                onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))}
                className={inputClass}
                required
              />
            </Field>
            <Field label="Destination">
              <input
                value={form.destination}
                onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                className={inputClass}
                required
              />
            </Field>
          </div>
          <Field label="Date">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className={inputClass}
              required
            />
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
              Add trip
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
