import { createApp } from "vue";
import App from "./app.vue";
import router from "./routes";
import { VueShowdownPlugin } from "vue-showdown";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

createApp(App)
  .use(pinia)
  .use(router)
  .use(VueShowdownPlugin, {
    flavor: "github",
    options: {
      emoji: true,
      simplifiedAutoLink: true,
      strikethrough: true,
      tables: true,
      tasklists: true,
      simpleLineBreaks: true,
      openLinksInNewWindow: true,
      backslashEscapesHTMLTags: true,
      ghCodeBlocks: true,
      ghCompatibleHeaderId: true,
      parseImgDimensions: true,
      requireSpaceBeforeHeadingText: true,
      ghMentions: true,
    },
  })
  .mount("#app");
