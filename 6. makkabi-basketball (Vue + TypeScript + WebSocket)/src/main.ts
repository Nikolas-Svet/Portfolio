import { createApp } from 'vue';
import './assets/styles/styles.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import { router } from '@/router/router';
import { checkAccessToken, checkRefreshToken } from '@/services/auth';

const app = createApp(App);
const pinia = createPinia();

// Проверяем токены при загрузке приложения

app.use(pinia);
app.use(router);
app.mount("#app");

checkAccessToken();
checkRefreshToken();
