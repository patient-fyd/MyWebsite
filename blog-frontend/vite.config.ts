import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { plugin as markdown } from "vite-plugin-markdown";
import * as path from "path";

export default defineConfig({
  plugins: [vue(), vueJsx(), markdown()],
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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],  // 第三方库单独打包
          'editor': ['@vueup/vue-quill', 'quill'],   // 编辑器相关库打包
          'utils': ['lodash', 'axios']
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/variables.scss";`
      }
    }
  }
});
