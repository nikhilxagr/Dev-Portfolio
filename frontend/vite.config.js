import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/react-router-dom/")
          ) {
            return "vendor-react";
          }

          if (id.includes("/framer-motion/")) {
            return "vendor-motion";
          }

          if (
            id.includes("/lucide-react/") ||
            id.includes("/react-icons/") ||
            id.includes("/clsx/")
          ) {
            return "vendor-ui";
          }

          if (id.includes("/axios/") || id.includes("/react-helmet-async/")) {
            return "vendor-data";
          }

          return "vendor-misc";
        },
      },
    },
  },
});
