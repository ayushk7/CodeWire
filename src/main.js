import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import regeneratorRuntime from "regenerator-runtime";
// import editor from './rete/editor.js'
import './assets/css/main.css'
// import './assets/css/styles.css'

const app = createApp(App)

app.use(router)
// editor
app.mount('#app')
