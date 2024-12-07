import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "@fortawesome/fontawesome-free/css/all.css";
import "./assets/styles/index.css";
// 导入 Quill 组件和样式
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

// 创建 Pinia 实例
const pinia = createPinia();

// 使用 pinia 持久化插件
pinia.use(piniaPluginPersistedstate);

// 创建 Vue 应用实例
const app = createApp(App);

// 全局注册 Quill 组件
app.component("QuillEditor", QuillEditor);

router.afterEach(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// 使用路由和 Pinia
app.use(router);
app.use(pinia);

// 挂载应用
app.mount("#app");
