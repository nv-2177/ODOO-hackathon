/**
 * components/DriverTable.jsx
 * -----------------------------
 * Renders the list of drivers as a plain HTML table with action buttons.
 * This is intentionally unstyled — it exists only so the backend can be
 * tested end-to-end. Your teammate can replace this with a styled table
 * as long as it keeps calling the same onX handler props.
 *
 * Props:
 *  - drivers: array of driver objects
 *  - onUpdateStatus(driver): called when "Update Status" is clicked
 *  - onSuspend(driver): called when "Suspend" is clicked
 *  - onDelete(driver): called when "Delete" is clicked
 */

import StatusBadge from "./StatusBadge";

// Defines the "next" status in the normal operational cycle for the Update Status button
const NEXT_STATUS = {
  Available: "On Trip",
  "On Trip": "Off Duty",
  "Off Duty": "Available",
};

function DriverTable({ drivers, onUpdateStatus, onSuspend, onDelete }) {
  if (!drivers || drivers.length === 0) {
    return <p>No drivers found.</p>;
  }

  return (
    <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>License No.</th>
          <th>Vehicle</th>
          <th>License Expiry</th>
          <th>Phone</th>
          <th>Age</th>
          <th>Safety Status</th>
          <th>Driver Status</th>
          <th>Remarks</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {drivers.map((driver) => {
          const nextStatus = NEXT_STATUS[driver.driverStatus];
          const canAdvanceStatus = Boolean(nextStatus);
          const canSuspend = driver.driverStatus !== "Suspended";

          return (
            <tr key={driver.id}>
              <td>{driver.id}</td>
              <td>{driver.name}</td>
              <td>{driver.licenseNumber}</td>
              <td>{driver.vehicleAssigned}</td>
              <td>{driver.licenseExpiry}</td>
              <td>{driver.phone}</td>
              <td>{driver.age}</td>
              <td><StatusBadge status={driver.safetyStatus} /></td>
              <td><StatusBadge status={driver.driverStatus} /></td>
              <td>{driver.remarks}</td>
              <td>
                <button
                  disabled={!canAdvanceStatus}
                  onClick={() => onUpdateStatus(driver, nextStatus)}
                  title={canAdvanceStatus ? `Move to "${nextStatus}"` : "No next status available"}
                >
                  Update Status
                </button>{" "}
                <button disabled={!canSuspend} onClick={() => onSuspend(driver)}>
                  Suspend
                </button>{" "}
                <button onClick={() => onDelete(driver)}>Delete</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default DriverTable;
