/**
 * pages/DriversPage.jsx
 * ------------------------
 * Main page for the Drivers & Safety Profiles module.
 * Holds all state (driver list, search query) and delegates:
 *   - data fetching to services/driverService.js
 *   - rendering to components/DriverTable.jsx
 *
 * This separation means your teammate can build a new page component
 * (e.g. using Tailwind/21st.dev) that reuses the exact same service
 * functions and just changes what's rendered.
 */

import { useEffect, useState } from "react";
import DriverTable from "../components/DriverTable";
import {
  getAllDrivers,
  searchDrivers,
  updateDriverStatus,
} from "../services/driverService";

function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /** Loads the full driver list from the backend */
  async function loadDrivers() {
    setLoading(true);
    setError("");
    try {
      const data = await getAllDrivers();
      setDrivers(data);
    } catch (err) {
      setError("Failed to load drivers. Is the backend running on port 5000?");
    } finally {
      setLoading(false);
    }
  }

  // Load drivers once when the page first mounts
  useEffect(() => {
    loadDrivers();
  }, []);

  /** Runs a search; falls back to the full list when the query is empty */
  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = query.trim() ? await searchDrivers(query.trim()) : await getAllDrivers();
      setDrivers(data);
    } catch (err) {
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  }

  /** Advances a driver to the given next status in the normal cycle */
  async function handleUpdateStatus(driver, nextStatus) {
    try {
      const updated = await updateDriverStatus(driver.id, nextStatus);
      setDrivers((prev) => prev.map((d) => (d.id === driver.id ? updated : d)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  }

  /** Suspends a driver, prompting for a required reason (remarks) */
  async function handleSuspend(driver) {
    const remarks = window.prompt(`Reason for suspending ${driver.name}:`);
    if (!remarks) return; // cancelled or empty — suspension requires a reason

    try {
      const updated = await updateDriverStatus(driver.id, "Suspended", remarks);
      setDrivers((prev) => prev.map((d) => (d.id === driver.id ? updated : d)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to suspend driver.");
    }
  }

  /** Placeholder delete handler (calls backend, then removes from local state) */
  async function handleDelete(driver) {
    if (!window.confirm(`Delete driver ${driver.name}?`)) return;
    try {
      const driverService = await import("../services/driverService");
      await driverService.deleteDriver(driver.id);
      setDrivers((prev) => prev.filter((d) => d.id !== driver.id));
    } catch (err) {
      alert("Failed to delete driver.");
    }
  }

  return (
    <div>
      <h1>Drivers & Safety Profiles</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name or vehicle..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={loadDrivers}>
          Refresh
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <DriverTable
        drivers={drivers}
        onUpdateStatus={handleUpdateStatus}
        onSuspend={handleSuspend}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default DriversPage;
