import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function productionBase() {
  const repo = process.env.GITHUB_REPOSITORY?.split("/")?.[1];
  if (repo) return `/${repo}/`;
  return "/portfolio_106/";
}

export default defineConfig(({ command }) => ({
  base: command === "build" ? productionBase() : "/",
  plugins: [react()],
}));
