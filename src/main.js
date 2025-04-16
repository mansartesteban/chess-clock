import { createApp } from "vue";
import App from "./App.vue";

import directives from "@/directives";
import plugins from "@/plugins";
import router from "@/router";
import stores from "@/stores";

import "@/assets/styles/main.css";

const app = createApp(App);

directives(app);
plugins(app);
router(app);
stores(app);

app.mount("#app");
