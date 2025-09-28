import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import ViteYaml from "@modyfi/vite-plugin-yaml";
import envCheckPlugin from "./src/plugins/vite.plugins.envCheck.js";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react(), tailwindcss(), ViteYaml(), envCheckPlugin(["VITE_API_BASE_URL"])],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3010,
  },
});
