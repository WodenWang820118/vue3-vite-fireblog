import { createStore, createLogger } from "vuex";
import users from "./modules/users";
import posts from "./modules/posts";

const store = createStore({
  modules: {
    users,
    posts,
  },
  strict: true,
  plugins: [createLogger()],
});

export default store;
