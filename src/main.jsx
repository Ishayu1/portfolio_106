import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const THEME_STORAGE_KEY = "portfolio_theme";

const getOsTheme = () =>
  window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";

const storedPref = localStorage.getItem(THEME_STORAGE_KEY);
const preference = storedPref === "auto" || storedPref === "light" || storedPref === "dark" ? storedPref : "auto";
document.documentElement.dataset.theme = preference === "auto" ? getOsTheme() : preference;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
