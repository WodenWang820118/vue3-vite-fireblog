<template>
  <div class="app-wrapper">
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
import { usePostStore } from "./stores/posts";
import { useUserStore } from "./stores/users";
import { ref, computed, defineComponent, onBeforeMount } from "vue";
import { auth } from "./shared/firebase/firebaseInit";

export default defineComponent({
  name: "app",
  components: {
    navigation: Navigation,
    "footer-vue": Footer,
  },
  setup() {
    const postStore = usePostStore();
    const userStore = useUserStore();
    const user_login = ref(false);
    const admin = ref(false);

    async function checkUserState() {
      auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
          let email = currentUser.email;
          //@ts-ignore
          email === import.meta.env.VITE_APP_ADMINEMAIL
            ? (admin.value = true)
            : (admin.value = false);
          admin.value = true;
          userStore.setUser(currentUser);
          user_login.value = true;
        } else {
          user_login.value = false;
        }
      });
    }

    onBeforeMount(async () => {
      await checkUserState();
      await postStore.getPost();
    });

    return {
      profileEmail: computed(() => userStore.profileEmail),
      postLoaded: computed(() => postStore.postLoaded),
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
