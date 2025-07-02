import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "@theatre/core",
      "@theatre/studio",
      "@theatre/r3f",
      "@theatre/r3f/dist/extension",
      "@react-three/fiber",
      "@react-three/drei",
      "three",
      "react",
      "react-dom",
      "@mui/material",
      "@mui/icons-material",
      "@emotion/react",
      "@emotion/styled"
    ],
    exclude: []
  },
  build: {
    rollupOptions: {
      input: "./index.html"
    }
  },
  server: {
    host: true,
    port: 5174
  }
});
