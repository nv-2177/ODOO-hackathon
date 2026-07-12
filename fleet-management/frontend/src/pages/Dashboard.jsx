import { useEffect, useState } from "react";
import { Truck, Fuel, Wallet, Route as RouteIcon } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import { formatCurrency, formatDate } from "../utils/format";

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    (async () => {
      const [s, v, t] = await Promise.all([
        api.get("/costs/summary"),
        api.get("/vehicles"),
        api.get("/trips"),
      ]);
      setSummary(s.data);
      setVehicles(v.data);
      setTrips(t.data);
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-xl lg:text-2xl text-[var(--color-text)]">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-sm text-[var(--color-text-faint)] mt-1">
          Here's how your fleet is running today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Vehicles" value={vehicles.length} icon={Truck} sub="Across all types" />
        <StatCard
          label="Total Fuel Cost"
          value={formatCurrency(summary?.totalFuelCost || 0)}
          icon={Fuel}
          sub="All logged entries"
        />
        <StatCard
          label="Overall Operational Cost"
          value={formatCurrency(summary?.overallOperationalCost || 0)}
          icon={Wallet}
          accent="teal"
          sub="Fuel + Maintenance + Expenses"
        />
        <StatCard
          label="Trips"
          value={trips.length}
          icon={RouteIcon}
          accent="teal"
          sub={`${trips.filter((t) => t.status === "Available").length} awaiting dispatch`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5">
          <h2 className="font-display font-bold text-base mb-3">Vehicle-wise Operational Cost</h2>
          <div className="space-y-2.5">
            {summary?.vehicleWise?.map((v) => (
              <div key={v.vehicleId} className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-text-muted)]">{v.vehicleName}</span>
                <span className="font-mono-num font-semibold text-[var(--color-text)]">
                  {formatCurrency(v.totalCost)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5">
          <h2 className="font-display font-bold text-base mb-3">Recent Trips</h2>
          <div className="space-y-3">
            {trips.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-[var(--color-text)]">
                    {t.origin} → {t.destination}
                  </p>
                  <p className="text-xs text-[var(--color-text-faint)]">{formatDate(t.date)}</p>
                </div>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
