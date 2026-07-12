/**
 * services/driverService.js
 * ----------------------------
 * Centralizes every Axios call to the backend Driver API.
 *
 * WHY THIS FILE MATTERS FOR THE TEAM:
 * Your teammate's final Tailwind/21st.dev UI should import functions from
 * THIS file instead of calling axios directly inside components. That way,
 * when they replace DriversPage.jsx / DriverTable.jsx with polished versions,
 * none of this API logic needs to change — just call the same functions.
 */

import axios from "axios";

// Base URL for the backend API. Change this if your backend runs elsewhere.
const API_BASE_URL = "http://localhost:5000/api/drivers";

// A pre-configured axios instance (easy to add headers/interceptors later)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/** Fetch all drivers */
export async function getAllDrivers() {
  const res = await api.get("/");
  return res.data.data;
}

/** Fetch a single driver by id */
export async function getDriverById(id) {
  const res = await api.get(`/${id}`);
  return res.data.data;
}

/** Create a new driver */
export async function createDriver(driverData) {
  const res = await api.post("/", driverData);
  return res.data.data;
}

/** Update general driver info */
export async function updateDriver(id, updates) {
  const res = await api.put(`/${id}`, updates);
  return res.data.data;
}

/** Delete a driver */
export async function deleteDriver(id) {
  const res = await api.delete(`/${id}`);
  return res.data;
}

/** Update a driver's operational status (Available / On Trip / Off Duty / Suspended) */
export async function updateDriverStatus(id, status, remarks) {
  const res = await api.put(`/${id}/status`, { status, remarks });
  return res.data.data;
}

/** Update a driver's safety status (Safe / Warning / Critical) */
export async function updateSafetyStatus(id, safetyStatus) {
  const res = await api.put(`/${id}/safety`, { safetyStatus });
  return res.data.data;
}

/** Search drivers by name or vehicle */
export async function searchDrivers(query) {
  const res = await api.get("/search", { params: { query } });
  return res.data.data;
}

/** Filter drivers by exact status */
export async function filterDrivers(status) {
  const res = await api.get("/filter", { params: { status } });
  return res.data.data;
}
