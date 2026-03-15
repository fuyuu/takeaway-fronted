import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import locale from "element-plus/dist/locale/zh-cn";
import router from "./router";
import * as ElIcons from "@element-plus/icons-vue";

const app = createApp(App);
const pinia = createPinia();
app.use(ElementPlus, { locale });
app.use(router);
app.use(pinia);
Object.keys(ElIcons).forEach((key) => app.component(key, ElIcons[key]));
app.mount("#app");
