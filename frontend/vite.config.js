import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";
  const buildFingerprint = new Date().toISOString().replace(/[:.]/g, "-");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      sourcemap: !isProduction,
      minify: "oxc",
      cssMinify: true,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 650,
      rollupOptions: {
        output: {
          banner: isProduction
            ? "/* Proprietary source. Copyright (c) 2026 Nikhil Agrahari. All rights reserved. */"
            : undefined,
          footer: isProduction
            ? `/* Build fingerprint: ${buildFingerprint} */`
            : undefined,
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
  };
});
