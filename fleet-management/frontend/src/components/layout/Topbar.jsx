import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Menu, ChevronDown, LogOut, UserCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const ROLE_STYLES = {
  Admin: "bg-[var(--color-amber-soft)] text-[var(--color-amber)]",
  Dispatcher: "bg-[var(--color-teal-soft)] text-[var(--color-teal)]",
  Manager: "bg-[var(--color-surface-3)] text-[var(--color-text-muted)]",
};

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setResults(null);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const { data } = await api.get("/search", { params: { q: query } });
        setResults(data);
      } catch {
        setResults(null);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  const totalResults = results
    ? results.vehicles.length + results.fuelLogs.length + results.expenses.length + results.trips.length
    : 0;

  return (
    <header className="h-16 shrink-0 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur flex items-center gap-3 px-4 lg:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div ref={boxRef} className="relative flex-1 max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)]"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Search vehicles, fuel logs, trips…"
          className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg pl-9 pr-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus-ring outline-none"
        />

        {results && (
          <div className="absolute mt-2 w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg shadow-xl overflow-hidden max-h-80 overflow-y-auto">
            {totalResults === 0 ? (
              <p className="px-3.5 py-3 text-sm text-[var(--color-text-faint)]">
                No matches for “{query}”.
              </p>
            ) : (
              <div className="divide-y divide-[var(--color-border-soft)]">
                {results.vehicles.length > 0 && (
                  <ResultGroup title="Vehicles" items={results.vehicles.map((v) => v.name)} />
                )}
                {results.fuelLogs.length > 0 && (
                  <ResultGroup
                    title="Fuel Logs"
                    items={results.fuelLogs.map((f) => `${f.date} · ${f.quantityLiters} L`)}
                    onClick={() => navigate("/fuel-expenses")}
                  />
                )}
                {results.expenses.length > 0 && (
                  <ResultGroup
                    title="Expenses"
                    items={results.expenses.map((e) => `${e.type} · ₹${e.amount}`)}
                    onClick={() => navigate("/fuel-expenses")}
                  />
                )}
                {results.trips.length > 0 && (
                  <ResultGroup
                    title="Trips"
                    items={results.trips.map((t) => `${t.origin} → ${t.destination}`)}
                    onClick={() => navigate("/trips")}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ml-auto relative" ref={menuOpen ? boxRef : null}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors"
        >
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-sm font-medium text-[var(--color-text)]">{user?.name}</span>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                ROLE_STYLES[user?.role] || ROLE_STYLES.Manager
              }`}
            >
              {user?.role}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--color-surface-3)] flex items-center justify-center text-[var(--color-text-muted)]">
            <UserCircle2 size={20} />
          </div>
          <ChevronDown size={15} className="text-[var(--color-text-faint)]" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg shadow-xl py-1.5 z-50">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-[var(--color-danger)] hover:bg-[var(--color-surface-3)]"
            >
              <LogOut size={15} />
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function ResultGroup({ title, items, onClick }) {
  return (
    <div className="px-3.5 py-2.5">
      <p className="text-[10px] uppercase tracking-wide text-[var(--color-text-faint)] mb-1">
        {title}
      </p>
      <ul className="space-y-1">
        {items.slice(0, 4).map((it, i) => (
          <li
            key={i}
            onClick={onClick}
            className="text-sm text-[var(--color-text)] cursor-pointer hover:text-[var(--color-amber)]"
          >
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
