import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** GitHub project Pages live at https://<user>.github.io/<repo>/ — base must match <repo>. */
function productionBase() {
  const repo = process.env.GITHUB_REPOSITORY?.split("/")?.[1];
  if (repo) return `/${repo}/`;
  // Local `npm run build` / `npm run deploy`: set to your GitHub repo name (this folder is portfolio_106).
  return "/portfolio_106/";
}

export default defineConfig(({ command }) => ({
  base: command === "build" ? productionBase() : "/",
  plugins: [react()],
}));
