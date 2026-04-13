import { createApp } from "vue";
import App from "./App.vue";
import { installGlobalErrorHandler } from "./ui/errorHandler";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { ru } from "vuetify/locale";
import router from "./app/router";

const app = createApp(App);
const vuetify = createVuetify({
  locale: {
    locale: "ru",
    messages: { ru }
  },
  date: {
    locale: {
      ru: "ru-RU"
    }
  }
});
app.use(router);
app.use(vuetify);
installGlobalErrorHandler(app);
router.isReady().then(() => {
  app.mount("#app");
});
