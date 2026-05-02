import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const apiProxyTarget = (env) =>
  (env.VITE_API_BASE_URL || "http://localhost:5001/api").replace(/\/api\/?$/, "");

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = apiProxyTarget(env);

  return {
    plugins: [react()],
    server: {
      port: 5173,
      allowedHosts: ["teamtask-manager-assesment-production.up.railway.app", "localhost", ".railway.app"],
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
    preview: {
      allowedHosts: ["teamtask-manager-assesment-production.up.railway.app", ".railway.app"],
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
