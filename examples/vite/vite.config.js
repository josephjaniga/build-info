import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execSync } from "child_process";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "build-info",
      buildStart() {
        // Generate build info before build starts
        try {
          execSync("npx build-info -o ./public");
          console.log("✅ Build info generated");
        } catch (error) {
          console.warn("⚠️ Could not generate build info:", error.message);
        }
      },
    },
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
  },
});
