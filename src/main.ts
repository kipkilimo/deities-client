import "./assets/main.css";
import "uno.css";

import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import { createHead } from "@vueuse/head";
import { createPinia } from "pinia";
import generatedRoutes from "~pages";
import i18n from "./plugins/i18n";
import { setupLayouts } from "virtual:generated-layouts";
import vuetify from "./plugins/vuetify";

import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";
const routes = setupLayouts(generatedRoutes);

const app = createApp({
  render: () => h(App),
  setup() {
    onInitApp();
  },
});

app.use(VueViewer);
app
  .use(createPinia())
  .use(vuetify)
  .use(createHead())
  .use(i18n)
  .use(
    createRouter({
      history: createWebHistory(import.meta.env.BASE_URL),
      routes,
    })
  );
app.mount("#app");
