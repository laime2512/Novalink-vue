import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Importar estilos globales
import './assets/css/main.css'
import './assets/css/noscript.css'

const app = createApp(App)

app.use(router)

app.mount('#app')