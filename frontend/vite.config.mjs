import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  server: {
    host: true,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:8084",
        changeOrigin: true,
        secure: false,
        // 필요시: rewrite: (p) => p.replace(/^\/api/, ""),
      },
      // 애플 차트: dev에서도 백엔드로만 우회
      "/apple-feed": {
        target: "http://localhost:8084",
        changeOrigin: true,
        secure: false,
      },
      // OAuth 콜백/엔드포인트
      "/oauth2": {
        target: "http://localhost:8084",
        changeOrigin: true,
        secure: false,
      },
      "/login": {
        target: "http://localhost:8084",
        changeOrigin: true,
        secure: false,
      },
      // STOMP/WebSocket 핸드셰이크
      "/ws": {
        target: "ws://localhost:8084",
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: { global: "globalThis" },
      plugins: [NodeGlobalsPolyfillPlugin({ buffer: true, process: true })],
    },
  },
});
