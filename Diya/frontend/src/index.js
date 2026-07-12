/**
 * index.js
 * ---------
 * React application entry point. Mounts <App /> into the #root div.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
