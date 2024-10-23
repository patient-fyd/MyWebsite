import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.ts";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "@fortawesome/fontawesome-free/css/all.css";
import "./assets/index.css";

// 创建 Pinia 实例
const pinia = createPinia();

// 使用 pinia 持久化插件
pinia.use(piniaPluginPersistedstate);

// 创建 Vue 应用实例
const app = createApp(App);

// 使用路由和 Pinia
app.use(router);
app.use(pinia);

// 挂载应用
app.mount("#app");
