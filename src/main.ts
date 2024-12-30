import "./assets/main.css";
import "uno.css";
import VueSocialSharing from "vue-social-sharing";
// import { initializeWebSocket } from "./sockets/websocketClient";
import VideoPlayer from "@videojs-player/vue";
import "video.js/dist/video-js.css";

import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import { createHead } from "@vueuse/head";
import { createPinia } from "pinia";
import generatedRoutes from "~pages";
import i18n from "./plugins/i18n";
// @ts-ignore
import { setupLayouts } from "virtual:generated-layouts";
import vuetify from "./plugins/vuetify";
// import { QuillEditor, Quill } from "vue3-quill-editor-vite";
import "vue3-quill-editor-vite/dist/style.css";
import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";
const routes = setupLayouts(generatedRoutes);

const app = createApp({
  render: () => h(App),
  setup() {
    onInitApp();
  },
});

// app.use(QuillEditor);
app.use(VueViewer);
app.use(VueSocialSharing);
app.use(VideoPlayer);

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
// Initialize WebSocket after the app mounts
