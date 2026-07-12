# FleetOps — Fuel & Expense Management

A fleet management web app focused on the **Fuel & Expense Management** module: fuel logs, expense tracking, auto-calculated operational cost summaries, role-based access, search, and analytics.

```
fleet-management/
├── backend/     Express.js + Node.js REST API (JSON file database)
└── frontend/    React + Vite + Tailwind CSS (dark theme)
```

## Prerequisites

- Node.js 18+ and npm
- VS Code (or any editor/terminal)

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
npm run seed      # populates data/db.json with demo vehicles, users, fuel logs, expenses
npm run dev        # starts API on http://localhost:5000 (uses nodemon)
```

If you don't have `nodemon`, use `npm start` instead.

### Demo logins (created by `npm run seed`)

| Role       | Email                  | Password     |
|------------|-------------------------|--------------|
| Admin      | admin@fleet.com         | admin123     |
| Dispatcher | dispatcher@fleet.com    | dispatch123  |
| Manager    | manager@fleet.com       | manager123   |

Dispatchers can view/add fuel logs and expenses but **cannot** modify system settings — that's Admin-only, enforced both in the API (`middleware/role.js`) and reflected in the UI.

## 2. Frontend setup

Open a **second terminal**:

```bash
cd frontend
npm install
npm run dev         # starts app on http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to `http://localhost:5000`, so make sure the backend is running first. Open http://localhost:5173 and log in with one of the demo accounts above.

## 3. Running both in VS Code

- Open the `fleet-management` folder in VS Code.
- Open two integrated terminals (`` Ctrl+` `` / `` Cmd+` ``, then split): one in `backend`, one in `frontend`.
- Run the two `npm run dev` commands above.
- Recommended extensions: ESLint, Tailwind CSS IntelliSense.

## What's implemented

**Backend (`/backend`)**
- Express REST API: auth (JWT), vehicles, fuel logs, expenses, operational cost summary, drivers, trips, maintenance, global search, settings
- Role-based access control middleware (Admin / Dispatcher / Manager)
- JSON file "database" (`lowdb`) — no external DB setup required, seed script included
- Auto-calculated operational cost = total fuel cost + maintenance cost + other expenses, vehicle-wise and fleet-wide

**Frontend (`/frontend`)**
- Sidebar navigation with active-route highlighting (Dashboard, Fleet, Drivers, Trips, Maintenance, **Fuel & Expenses**, Analytics, Settings)
- Top bar: global search (vehicles/fuel logs/expenses/trips), user name, avatar, role badge, logout menu
- **Fuel & Expense Management page**: Add Fuel Log / Add Expense modals, fuel log history table, expense history table (with color-coded status badges), vehicle filter, instant search
- Operational Cost Summary with an instrument-panel fuel gauge (total fuel cost vs. budget), maintenance cost, and auto-calculated overall operational cost — updates in real time after every add
- In-app toast notifications: fuel entry added, expense recorded, fuel budget exceeded, high maintenance expense flagged
- Analytics page: fuel cost trend, vehicle fuel efficiency, expense breakdown, vehicle-wise operational cost report (Recharts)
- Dark theme throughout, responsive layout, JWT-protected routes

## Notes / next steps

- The JSON database resets to demo data any time you re-run `npm run seed`; for a real deployment, swap `lowdb` for Postgres/MongoDB and update `config/db.js` + controllers accordingly.
- Fleet / Drivers / Trips / Maintenance pages are functional (list + add) but intentionally lighter than the Fuel & Expense module, which was the spec in detail — extend them the same way if you need full edit/delete flows there too.
- Change `JWT_SECRET` in `backend/.env` before deploying anywhere real.
