import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.ts";
import { createPinia } from "pinia";
import "@fortawesome/fontawesome-free/css/all.css";
import "./assets/global.css";

const app = createApp(App);

app.use(router);
app.use(createPinia());

app.mount("#app");
