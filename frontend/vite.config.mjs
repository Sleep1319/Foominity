import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

// __dirname 대체 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:8084", // Spring Boot 서버 주소
        changeOrigin: true,
        secure: false,
      },
      "/oauth2": { target: "http://127.0.0.1:8084", changeOrigin: true, secure: false },
      "/login": { target: "http://127.0.0.1:8084", changeOrigin: true, secure: false },
    },
    open: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
