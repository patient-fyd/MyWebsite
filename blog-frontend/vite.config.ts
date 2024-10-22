import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 设置 @ 为 src 目录
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 代理后端服务
        changeOrigin: true,
      },
    },
  },
});
