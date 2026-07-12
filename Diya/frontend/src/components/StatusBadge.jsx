/**
 * components/StatusBadge.jsx
 * ----------------------------
 * Tiny presentational component that displays a status value as a badge.
 * Kept deliberately separate and unstyled so your teammate can swap this
 * for a Tailwind/21st.dev styled version without touching any logic —
 * it just needs to keep accepting a `status` prop.
 */

function StatusBadge({ status }) {
  return <span className="status-badge">{status}</span>;
}

export default StatusBadge;
