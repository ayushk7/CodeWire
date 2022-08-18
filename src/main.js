
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import regeneratorRuntime from 'regenerator-runtime'

import "./input.css";

const app = createApp(App);

app.use(router);

app.mount("#app");
