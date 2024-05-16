import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes";
import store from "./store";
import { VueShowdownPlugin } from "vue-showdown";

createApp(App)
  .use(store)
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
