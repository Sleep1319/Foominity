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
    proxy: {
      "/api": {
        target: "http://localhost:8084",
        changeOrigin: true,
        secure: false,
      },
      //  애플 차트: dev에서도 백엔드로만 우회 (prod도 동일 경로 사용)
      "/apple-feed": {
        target: "http://localhost:8084",
        changeOrigin: true,
        secure: false,
      },
    },
    open: true,
  },
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  optimizeDeps: {
    esbuildOptions: {
      define: { global: "globalThis" },
      plugins: [NodeGlobalsPolyfillPlugin({ buffer: true, process: true })],
    },
  },
});

// ======================================== 배포 대비
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "node:path";
// import { fileURLToPath } from "node:url";
// import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export default defineConfig({
//   server: {
//     host: true,
//     proxy: {
//       "/api": {
//         target: "http://localhost:8084",
//         changeOrigin: true,
//         secure: false,
//       },
//       // (참고) 기존 /apple-rss 프록시 유지 — 사용은 안 해도 됨
//       "/apple-rss": {
//         target: "https://rss.marketingtools.apple.com",
//         changeOrigin: true,
//         secure: true,
//         followRedirects: true,
//         rewrite: (p) => p.replace(/^\/apple-rss/, ""),
//         configure: (proxy) => {
//           proxy.on("proxyRes", (proxyRes) => {
//             const loc = proxyRes.headers["location"];
//             if (typeof loc === "string") {
//               if (loc.startsWith("https://rss.marketingtools.apple.com")) {
//                 proxyRes.headers["location"] = loc.replace(
//                   "https://rss.marketingtools.apple.com",
//                   "/apple-rss"
//                 );
//               } else if (
//                 loc.startsWith("https://rss.applemarketingtools.com")
//               ) {
//                 proxyRes.headers["location"] = loc.replace(
//                   "https://rss.applemarketingtools.com",
//                   "/apple-rss"
//                 );
//               }
//             }
//           });
//         },
//       },
//     },
//     open: true,
//   },
//   plugins: [
//     react(),
//     // 리다이렉트를 dev 서버가 직접 따라가서 JSON만 반환 (브라우저는 항상 same-origin으로 받음)
//     {
//       name: "apple-rss-middleware",
//       configureServer(server) {
//         server.middlewares.use("/apple-feed", async (req, res) => {
//           try {
//             const upstream =
//               "https://rss.marketingtools.apple.com" +
//               req.url.replace(/^\/apple-feed/, "");
//             const r = await fetch(upstream, { redirect: "follow" }); // Node18+ 권장
//             res.statusCode = r.status;
//             res.setHeader(
//               "content-type",
//               r.headers.get("content-type") || "application/json"
//             );
//             const buf = Buffer.from(await r.arrayBuffer());
//             res.end(buf);
//           } catch (e) {
//             res.statusCode = 500;
//             res.end(JSON.stringify({ error: String(e) }));
//           }
//         });
//       },
//     },
//   ],
//   resolve: {
//     alias: { "@": path.resolve(__dirname, "src") },
//   },
//   optimizeDeps: {
//     esbuildOptions: {
//       define: { global: "globalThis" },
//       plugins: [NodeGlobalsPolyfillPlugin({ buffer: true, process: true })],
//     },
//   },
// });

// 기존 코드 아래 ================================
// 혹시 문제 생기면 위 싹 지우고 아래 코드 살리세염

// import {defineConfig} from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'node:path'
// import {fileURLToPath} from 'node:url'
// import {NodeGlobalsPolyfillPlugin} from '@esbuild-plugins/node-globals-polyfill';

// // __dirname 대체 설정
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// export default defineConfig({
//     server: {
//         host: true,
//         proxy: {
//             '/api': {
//                 target: 'http://localhost:8084', // ✅ Spring Boot 서버 주소
//                 changeOrigin: true,
//                 secure: false,
//             }
//         },
//         open: true,
//     },
//     plugins: [react()],
//     resolve: {
//         alias: {
//             '@': path.resolve(__dirname, 'src'),
//         },
//     },
//     optimizeDeps: {
//         esbuildOptions: {
//             define: {
//                 global: 'globalThis', // ✅ 핵심 설정
//             },
//             plugins: [
//                 NodeGlobalsPolyfillPlugin({
//                     buffer: true,
//                     process: true,
//                 }),
//             ],
//         },
//     },
// })
