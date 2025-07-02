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
      "@react-three/fiber",
      "@react-three/drei",
      "three"
    ]
  },
  build: {
    rollupOptions: {
      input: {
        main: "./index.html"
      }
    }
  }
});
