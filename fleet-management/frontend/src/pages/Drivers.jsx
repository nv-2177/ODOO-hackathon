import { useEffect, useState } from "react";
import { Plus, UserCircle2 } from "lucide-react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import Modal from "../components/ui/Modal";
import Field, { inputClass } from "../components/ui/Field";

export default function Drivers() {
  const { notify } = useToast();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", licenseNo: "" });

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/drivers");
    setDrivers(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/drivers", form);
      notify(`Driver added — ${form.name}.`, "success");
      setModalOpen(false);
      setForm({ name: "", phone: "", licenseNo: "" });
      load();
    } catch (err) {
      notify(err.response?.data?.message || "Could not add driver.", "warning");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-extrabold text-xl lg:text-2xl text-[var(--color-text)]">Drivers</h1>
          <p className="text-sm text-[var(--color-text-faint)] mt-1">Driver roster and licensing.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-[var(--color-amber)] text-[#1A1305] hover:brightness-95"
        >
          <Plus size={16} /> Add Driver
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
          drivers.map((d) => (
            <div key={d.id} className="flex items-center gap-3 px-5 py-3.5">
              <div className="w-9 h-9 rounded-full bg-[var(--color-surface-3)] flex items-center justify-center text-[var(--color-text-muted)]">
                <UserCircle2 size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">{d.name}</p>
                <p className="text-xs text-[var(--color-text-faint)]">
                  {d.phone || "No phone"} · License {d.licenseNo || "—"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Driver">
        <form onSubmit={handleAdd}>
          <Field label="Full name">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Phone">
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="License number">
            <input
              value={form.licenseNo}
              onChange={(e) => setForm((f) => ({ ...f, licenseNo: e.target.value }))}
              className={inputClass}
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
              Add driver
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
