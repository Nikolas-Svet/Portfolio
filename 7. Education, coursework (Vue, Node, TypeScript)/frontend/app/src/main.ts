import './assets/styles/main.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import {createStores, setupStores} from './stores';
import { initAuth } from './utils/auth';

const app = createApp(App)

setupStores(app);

// Создаём единый объект stores
const stores = createStores();
app.config.globalProperties.$stores = stores;

initAuth(stores.auth);
app.use(router)

app.mount('#app')
