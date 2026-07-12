import { useEffect, useState } from "react";
import { Lock, Save } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Field, { inputClass } from "../components/ui/Field";

export default function Settings() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [settings, setSettings] = useState(null);
  const isAdmin = user?.role === "Admin";

  useEffect(() => {
    api.get("/settings").then((res) => setSettings(res.data));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put("/settings", settings);
      setSettings(data);
      notify("Settings updated.", "success");
    } catch (err) {
      notify(err.response?.data?.message || "You do not have permission to change settings.", "warning");
    }
  };

  if (!settings) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-xl lg:text-2xl text-[var(--color-text)]">Settings</h1>
        <p className="text-sm text-[var(--color-text-faint)] mt-1">System-wide configuration.</p>
      </div>

      {!isAdmin && (
        <div className="flex items-center gap-2.5 bg-[var(--color-danger-soft)] text-[var(--color-danger)] rounded-lg px-4 py-3 text-sm mb-5">
          <Lock size={16} className="shrink-0" />
          Your role ({user?.role}) can view settings but cannot modify system configuration. Contact an
          Admin for changes.
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5"
      >
        <fieldset disabled={!isAdmin} className="disabled:opacity-60">
          <Field label="Company name">
            <input
              value={settings.companyName}
              onChange={(e) => setSettings((s) => ({ ...s, companyName: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="Currency">
            <input
              value={settings.currency}
              onChange={(e) => setSettings((s) => ({ ...s, currency: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fuel budget threshold (₹)">
              <input
                type="number"
                value={settings.fuelBudgetThreshold}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, fuelBudgetThreshold: Number(e.target.value) }))
                }
                className={inputClass}
              />
            </Field>
            <Field label="High maintenance threshold (₹)">
              <input
                type="number"
                value={settings.maintenanceHighThreshold}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, maintenanceHighThreshold: Number(e.target.value) }))
                }
                className={inputClass}
              />
            </Field>
          </div>
        </fieldset>

        {isAdmin && (
          <button
            type="submit"
            className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--color-amber)] text-[#1A1305] hover:brightness-95"
          >
            <Save size={15} /> Save changes
          </button>
        )}
      </form>
    </div>
  );
}
