import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import api from "../api/axios";
import { formatCurrency } from "../utils/format";

const PIE_COLORS = ["#F0A93A", "#33C9B0", "#E5584F", "#5B6B7C"];

export default function Analytics() {
  const [fuelLogs, setFuelLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    (async () => {
      const [f, s, e] = await Promise.all([
        api.get("/fuel-logs"),
        api.get("/costs/summary"),
        api.get("/expenses"),
      ]);
      setFuelLogs(f.data);
      setSummary(s.data);
      setExpenses(e.data);
    })();
  }, []);

  const fuelTrend = [...fuelLogs]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((f) => ({ date: f.date.slice(5), cost: f.cost, litres: f.quantityLiters }));

  const efficiency = fuelLogs.reduce((acc, f) => {
    const found = acc.find((a) => a.vehicleName === f.vehicleName);
    if (found) {
      found.litres += f.quantityLiters;
      found.cost += f.cost;
    } else {
      acc.push({ vehicleName: f.vehicleName, litres: f.quantityLiters, cost: f.cost });
    }
    return acc;
  }, []);

  const expenseByType = expenses.reduce((acc, e) => {
    const found = acc.find((a) => a.name === e.type);
    if (found) found.value += e.amount;
    else acc.push({ name: e.type, value: e.amount });
    return acc;
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-xl lg:text-2xl text-[var(--color-text)]">
          Analytics
        </h1>
        <p className="text-sm text-[var(--color-text-faint)] mt-1">
          Fuel consumption, efficiency, and operational cost trends.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Fuel Cost Trend">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={fuelTrend}>
              <CartesianGrid stroke="#1E2733" vertical={false} />
              <XAxis dataKey="date" stroke="#5B6B7C" fontSize={11} />
              <YAxis stroke="#5B6B7C" fontSize={11} />
              <Tooltip
                contentStyle={{ background: "#1B2431", border: "1px solid #26313F", borderRadius: 8 }}
                labelStyle={{ color: "#E7ECF2" }}
                formatter={(v) => formatCurrency(v)}
              />
              <Line type="monotone" dataKey="cost" stroke="#F0A93A" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Vehicle Fuel Efficiency (Litres consumed)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={efficiency}>
              <CartesianGrid stroke="#1E2733" vertical={false} />
              <XAxis dataKey="vehicleName" stroke="#5B6B7C" fontSize={10} tickLine={false} />
              <YAxis stroke="#5B6B7C" fontSize={11} />
              <Tooltip
                contentStyle={{ background: "#1B2431", border: "1px solid #26313F", borderRadius: 8 }}
                labelStyle={{ color: "#E7ECF2" }}
              />
              <Bar dataKey="litres" fill="#33C9B0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Expense Analysis by Type">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={expenseByType} dataKey="value" nameKey="name" outerRadius={85} label>
                {expenseByType.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#1B2431", border: "1px solid #26313F", borderRadius: 8 }}
                formatter={(v) => formatCurrency(v)}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "#90A0B2" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Operational Cost Report (Vehicle-wise)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={summary?.vehicleWise || []} layout="vertical">
              <CartesianGrid stroke="#1E2733" horizontal={false} />
              <XAxis type="number" stroke="#5B6B7C" fontSize={11} />
              <YAxis dataKey="vehicleName" type="category" stroke="#5B6B7C" fontSize={10} width={130} />
              <Tooltip
                contentStyle={{ background: "#1B2431", border: "1px solid #26313F", borderRadius: 8 }}
                formatter={(v) => formatCurrency(v)}
              />
              <Bar dataKey="fuelCost" stackId="a" fill="#F0A93A" name="Fuel" />
              <Bar dataKey="maintenanceCost" stackId="a" fill="#33C9B0" name="Maintenance" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5">
      <h2 className="font-display font-bold text-sm text-[var(--color-text-muted)] mb-3">{title}</h2>
      {children}
    </div>
  );
}
