import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Users,
  Route as RouteIcon,
  Wrench,
  Fuel,
  BarChart3,
  Settings as SettingsIcon,
  Fuel as FuelLogo,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/fleet", label: "Fleet", icon: Truck },
  { to: "/drivers", label: "Drivers", icon: Users },
  { to: "/trips", label: "Trips", icon: RouteIcon },
  { to: "/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/fuel-expenses", label: "Fuel & Expenses", icon: Fuel },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function Sidebar({ open, onNavigate }) {
  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-40 w-64 shrink-0 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col transition-transform duration-200 ${
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-[var(--color-border)]">
        <div className="w-8 h-8 rounded-md bg-[var(--color-amber-soft)] flex items-center justify-center">
          <FuelLogo size={18} className="text-[var(--color-amber)]" />
        </div>
        <span className="font-display font-extrabold text-[17px] tracking-tight text-[var(--color-text)]">
          FleetOps
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--color-surface-2)] text-[var(--color-amber)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-[var(--color-amber)]" />
                )}
                <Icon size={17} strokeWidth={2} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-[var(--color-border)]">
        <div className="rounded-lg bg-[var(--color-surface-2)] px-3 py-2.5 text-xs text-[var(--color-text-faint)]">
          <span className="text-[var(--color-text-muted)]">FleetOps</span> v1.0 · Fuel & Expense
          module
        </div>
      </div>
    </aside>
  );
}
