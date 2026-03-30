import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" && viteCompression({ algorithm: "brotliCompress", ext: ".br" }),
    mode === "production" && viteCompression({ algorithm: "gzip", ext: ".gz" }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    cssMinify: true,
    cssCodeSplit: false,
    assetsInlineLimit: 10000,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "framer-motion": ["framer-motion"],
          "ui-utils": ["clsx", "tailwind-merge", "class-variance-authority"],
        },
      },
    },
    chunkSizeWarningLimit: 500,
    reportCompressedSize: false,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
}));
