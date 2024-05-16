<template>
  <div class="app-wrapper">
    <!-- provide the router view only if posts are loaded -->
    <div class="app" v-if="postLoaded">
      <navigation :user_login="user_login" :admin="admin" />
      <router-view />
      <footer-vue v-if="!user_login" />
    </div>
  </div>
</template>

<script lang="ts">
import Navigation from "./shared/components/navigation/navigation.vue";
import Footer from "./shared/components/footer/footer.vue";
import { ref, onMounted, computed, defineComponent, Ref } from "vue";
import { useStore } from "vuex";
import { User } from "firebase/auth";
import { AuthService } from "./shared/services/auth.service";
export default defineComponent({
  name: "app",
  components: {
    navigation: Navigation,
    "footer-vue": Footer,
  },
  setup() {
    const store = useStore();
    const user_login: Ref<boolean> = ref(false);
    const admin: Ref<boolean> = ref(false);
    const authService = new AuthService();

    async function checkUserState() {
      const currentUser = await authService.checkUserState();
      if (currentUser) {
        let email = currentUser.email;
        //@ts-ignore
        email === import.meta.env.VITE_APP_ADMINEMAIL
          ? (admin.value = true)
          : (admin.value = false);
        admin.value = true;
        await store.dispatch("users/mountUser", currentUser);
        user_login.value = true;
      } else {
        user_login.value = false;
      }
    }

    onMounted(async () => {
      // check the store before fetching data from the server
      if (!store.getters["posts/postLoaded"])
        await store.dispatch("posts/getPost");
      if (!store.getters["users/profileEmail"]) await checkUserState();
    });

    return {
      profileEmail: computed(() => store.getters["users/profileEmail"]),
      postLoaded: computed(() => store.getters["posts/postLoaded"]),
      user_login,
      admin,
    };
  },
  watch: {
    user_login(val) {
      // console.log(`The user_login value is changed to ${val}`);
      this.user_login = val;
    },
    admin(val) {
      // console.log(`The admin value is changed to ${val}`);
      this.admin = val;
    },
  },
});
</script>

<style lang="scss" src="./app.scss"></style>
