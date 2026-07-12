/**
 * App.js
 * -------
 * Root component. Currently just renders the Drivers page directly since
 * this is a single-module MVP. If routing is added later, this is where
 * a router would go.
 */

import DriversPage from "./pages/DriversPage";

function App() {
  return <DriversPage />;
}

export default App;
