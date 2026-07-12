/**
 * models/Driver.js
 * -----------------
 * Defines the Driver "shape" plus business-rule helper functions:
 *  - field validation for create/update requests
 *  - license expiry checking
 *  - allowed driver-status transitions
 *
 * This is a plain-object model (no ORM), matching the in-memory data layer.
 * Keeping these rules here (rather than in controllers) means the same
 * validation/business logic will keep working even if data/drivers.js is
 * later replaced by a real database.
 */

// All allowed values for driverStatus
const DRIVER_STATUSES = [
  "Available",
  "On Trip",
  "Off Duty",
  "Suspended",
  "License Expired",
];

// All allowed values for safetyStatus
const SAFETY_STATUSES = ["Safe", "Warning", "Critical"];

/**
 * Defines which driverStatus values a driver can move to from their current status.
 * "Suspended" can be reached from anywhere (a dispatcher can suspend any driver).
 * "License Expired" is a system-set status (see checkLicenseExpiry) and is not
 * a manually chosen transition target here.
 * A Suspended driver can only be reinstated back to "Available".
 */
const VALID_TRANSITIONS = {
  Available: ["On Trip", "Suspended"],
  "On Trip": ["Off Duty", "Suspended"],
  "Off Duty": ["Available", "Suspended"],
  Suspended: ["Available"], // reinstatement
  "License Expired": [], // must resolve license issue outside status endpoint
};

/**
 * Validates the required fields for creating a new driver.
 * Returns { valid: boolean, errors: string[] }
 */
function validateNewDriver(body) {
  const errors = [];
  const requiredFields = [
    "name",
    "licenseNumber",
    "vehicleAssigned",
    "licenseExpiry",
    "phone",
    "age",
  ];

  requiredFields.forEach((field) => {
    if (body[field] === undefined || body[field] === null || body[field] === "") {
      errors.push(`Field "${field}" is required.`);
    }
  });

  if (body.age !== undefined && (isNaN(body.age) || Number(body.age) < 18)) {
    errors.push("Field \"age\" must be a number and driver must be at least 18.");
  }

  if (body.licenseExpiry && isNaN(Date.parse(body.licenseExpiry))) {
    errors.push('Field "licenseExpiry" must be a valid date (YYYY-MM-DD).');
  }

  if (body.safetyStatus && !SAFETY_STATUSES.includes(body.safetyStatus)) {
    errors.push(`Field "safetyStatus" must be one of: ${SAFETY_STATUSES.join(", ")}`);
  }

  if (body.driverStatus && !DRIVER_STATUSES.includes(body.driverStatus)) {
    errors.push(`Field "driverStatus" must be one of: ${DRIVER_STATUSES.join(", ")}`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Checks a driver's licenseExpiry against today's date.
 * If expired and the driver isn't already marked, returns an updated copy
 * with driverStatus = "License Expired". Otherwise returns the driver unchanged.
 */
function checkLicenseExpiry(driver) {
  if (!driver || !driver.licenseExpiry) return driver;

  const today = new Date();
  const expiry = new Date(driver.licenseExpiry);

  const isExpired = today > expiry;

  if (isExpired && driver.driverStatus !== "License Expired") {
    return {
      ...driver,
      driverStatus: "License Expired",
      remarks: driver.remarks
        ? driver.remarks
        : "Auto-flagged: license expired.",
    };
  }

  return driver;
}

/**
 * Checks whether moving from `currentStatus` to `newStatus` is a legal transition.
 */
function isValidTransition(currentStatus, newStatus) {
  if (!DRIVER_STATUSES.includes(newStatus)) return false;
  const allowed = VALID_TRANSITIONS[currentStatus] || [];
  return allowed.includes(newStatus);
}

module.exports = {
  DRIVER_STATUSES,
  SAFETY_STATUSES,
  VALID_TRANSITIONS,
  validateNewDriver,
  checkLicenseExpiry,
  isValidTransition,
};
