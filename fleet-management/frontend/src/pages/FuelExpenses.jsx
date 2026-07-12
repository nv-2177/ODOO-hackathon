import { useEffect, useMemo, useState } from "react";
import { Plus, Fuel, Wallet, Gauge, Search } from "lucide-react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/ui/Modal";
import GaugeCard from "../components/ui/GaugeCard";
import StatCard from "../components/ui/StatCard";
import FuelLogForm from "../components/fuel/FuelLogForm";
import FuelLogTable from "../components/fuel/FuelLogTable";
import ExpenseForm from "../components/expense/ExpenseForm";
import ExpenseTable from "../components/expense/ExpenseTable";
import { formatCurrency } from "../utils/format";
import { inputClass } from "../components/ui/Field";

export default function FuelExpenses() {
  const { notify } = useToast();
  const { user } = useAuth();

  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const [vehicleFilter, setVehicleFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fuelModalOpen, setFuelModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  const canAdd = true; // Dispatcher, Admin and Manager can all add entries per role matrix

  const loadAll = async (vId = vehicleFilter) => {
    setLoading(true);
    try {
      const [vehiclesRes, tripsRes, fuelRes, expRes, summaryRes] = await Promise.all([
        api.get("/vehicles"),
        api.get("/trips"),
        api.get("/fuel-logs", { params: vId ? { vehicleId: vId } : {} }),
        api.get("/expenses", { params: vId ? { vehicleId: vId } : {} }),
        api.get("/costs/summary"),
      ]);
      setVehicles(vehiclesRes.data);
      setTrips(tripsRes.data);
      setFuelLogs(fuelRes.data);
      setExpenses(expRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      notify(err.response?.data?.message || "Could not load fuel & expense data.", "warning");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadAll(vehicleFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleFilter]);

  const filteredFuelLogs = useMemo(() => {
    if (!searchTerm.trim()) return fuelLogs;
    const t = searchTerm.toLowerCase();
    return fuelLogs.filter((l) => l.vehicleName.toLowerCase().includes(t) || l.date.includes(t));
  }, [fuelLogs, searchTerm]);

  const filteredExpenses = useMemo(() => {
    if (!searchTerm.trim()) return expenses;
    const t = searchTerm.toLowerCase();
    return expenses.filter(
      (e) =>
        e.vehicleName.toLowerCase().includes(t) ||
        e.type.toLowerCase().includes(t) ||
        (e.description || "").toLowerCase().includes(t)
    );
  }, [expenses, searchTerm]);

  const handleAddFuelLog = async (form) => {
    try {
      await api.post("/fuel-logs", form);
      notify(`Fuel entry added — ${form.quantityLiters} L logged.`, "success");
      const cost = Number(form.cost);
      const newTotal = (summary?.totalFuelCost || 0) + cost;
      if (summary && newTotal > summary.fuelBudgetThreshold) {
        notify("Fuel budget exceeded for the current tracking period.", "warning");
      }
      setFuelModalOpen(false);
      loadAll();
    } catch (err) {
      notify(err.response?.data?.message || "Could not add fuel log.", "warning");
    }
  };

  const handleAddExpense = async (form) => {
    try {
      await api.post("/expenses", form);
      notify(`Expense recorded — ${form.type} · ${formatCurrency(form.amount)}.`, "success");
      if (form.type === "Maintenance" && Number(form.amount) > (summary?.maintenanceHighThreshold || 20000)) {
        notify("High maintenance expense flagged for this vehicle.", "warning");
      }
      setExpenseModalOpen(false);
      loadAll();
    } catch (err) {
      notify(err.response?.data?.message || "Could not record expense.", "warning");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display font-extrabold text-xl lg:text-2xl text-[var(--color-text)]">
            Fuel & Expense Management
          </h1>
          <p className="text-sm text-[var(--color-text-faint)] mt-1">
            Track fuel consumption, expenses and operational cost across your fleet.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFuelModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-[var(--color-amber)] text-[#1A1305] hover:brightness-95"
          >
            <Plus size={16} /> Add Fuel Log
          </button>
          <button
            onClick={() => setExpenseModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-[var(--color-teal)] text-[#052420] hover:brightness-95"
          >
            <Plus size={16} /> Add Expense
          </button>
        </div>
      </div>

      {/* Operational Cost Summary */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3">
          Operational Cost Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GaugeCard
            title="Total Fuel Cost"
            value={summary?.totalFuelCost || 0}
            max={summary?.fuelBudgetThreshold || 50000}
            formatValue={formatCurrency}
            danger={summary?.fuelBudgetExceeded}
            sub={`of ${formatCurrency(summary?.fuelBudgetThreshold || 50000)} budget`}
          />
          <StatCard
            label="Maintenance Cost"
            value={formatCurrency(summary?.totalMaintenanceCost || 0)}
            sub="Linked from maintenance records"
            icon={Gauge}
            accent="teal"
          />
          <StatCard
            label="Overall Operational Cost"
            value={formatCurrency(summary?.overallOperationalCost || 0)}
            sub="Auto-calculated · updates in real time"
            icon={Wallet}
            accent="amber"
          />
        </div>
      </section>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)]" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search fuel logs, expenses…"
            className={`${inputClass} pl-9`}
          />
        </div>
        <select
          value={vehicleFilter}
          onChange={(e) => setVehicleFilter(e.target.value)}
          className={`${inputClass} sm:w-56`}
        >
          <option value="">All vehicles</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      {/* Fuel Logs */}
      <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 lg:p-5 mb-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display font-bold text-base text-[var(--color-text)] flex items-center gap-2">
            <Fuel size={17} className="text-[var(--color-amber)]" /> Fuel Log History
          </h2>
          <span className="text-xs text-[var(--color-text-faint)]">{filteredFuelLogs.length} entries</span>
        </div>
        <FuelLogTable logs={filteredFuelLogs} loading={loading} />
      </section>

      {/* Expenses */}
      <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 lg:p-5 mb-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display font-bold text-base text-[var(--color-text)] flex items-center gap-2">
            <Wallet size={17} className="text-[var(--color-teal)]" /> Expense History
          </h2>
          <span className="text-xs text-[var(--color-text-faint)]">{filteredExpenses.length} entries</span>
        </div>
        <ExpenseTable expenses={filteredExpenses} loading={loading} />
      </section>

      {user?.role === "Dispatcher" && (
        <p className="text-xs text-[var(--color-text-faint)] mb-4">
          Signed in as Dispatcher — you can view and add fuel logs & expenses, but system settings are
          restricted to Admins.
        </p>
      )}

      <Modal open={fuelModalOpen} onClose={() => setFuelModalOpen(false)} title="Add Fuel Log">
        <FuelLogForm vehicles={vehicles} onSubmit={handleAddFuelLog} onCancel={() => setFuelModalOpen(false)} />
      </Modal>

      <Modal open={expenseModalOpen} onClose={() => setExpenseModalOpen(false)} title="Add Expense">
        <ExpenseForm
          vehicles={vehicles}
          trips={trips}
          onSubmit={handleAddExpense}
          onCancel={() => setExpenseModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
