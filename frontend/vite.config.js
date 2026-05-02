import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: ["teamtask-manager-assesment-production.up.railway.app", "localhost", ".railway.app"],
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
  preview: {
    allowedHosts: ["teamtask-manager-assesment-production.up.railway.app", ".railway.app"],
  },
});
