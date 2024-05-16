<template>
  <div class="app-wrapper">
    <!-- provide the router view only if posts are loaded -->
    <div class="app" v-if="postLoaded">
      <Navigation :user_login="user_login" :admin="admin" />
      <router-view />
      <Footer v-if="!user_login" />
    </div>
  </div>
</template>

<script lang="ts">
import Navigation from "./shared/components/navigation/Navigation.vue";
import Footer from "./shared/components/footer/Footer.vue";
import { ref, onMounted, computed, defineComponent, Ref } from "vue";
import { useStore } from 'vuex'
import { auth } from "./shared/firebase/firebaseInit";
import { User } from "firebase/auth";
export default defineComponent({
  name: "app",
  components: {
    Navigation,
    Footer,
  },
  setup() {
    // composition api, useStore with vuex
    const store = useStore();
    // composition api, use ref
    const user_login: Ref<boolean> = ref(false);
    const admin: Ref<boolean> = ref(false);
    // dispatched, or committed method from store
    const getCurrentUser = () => {
      return store.dispatch("users/getCurrentUser");
    };
    const mountUser = (user: User | null) => {
      if (!user) {
        return;
      }
      return store.dispatch("users/mountUser", user);
    };
    const getPost = async () => {
      return await store.dispatch("posts/getPost");
    };
    // the functions used in this view
    /**
     * The function check if any user logged in
     */
    function checkUserState() {
      // offical recommended way to fire the methods after the user state changes
      // otherwise, could be null
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          let email = user.email;
          // console.log(`The user email: ${email}`)
          // console.log(`The admin email: ${process.env.VUE_APP_ADMINEMAIL}`)
          //@ts-ignore
          // email === import.meta.env.VITE_APP_ADMINEMAIL
          //   ? (admin.value = true)
          //   : (admin.value = false);
          admin.value = true;
          console.log("The user signed in!");
          user = await mountUser(user);
          getCurrentUser();
          user_login.value = true;
        } else {
          user_login.value = false;
          console.log("There is no user using right now");
        }
      });
    }

    onMounted(() => {
      getPost();
      checkUserState();
    });
    // the return here returns the functions that are used in the template
    return {
      profileEmail: computed(() => store.getters["users/profileEmail"]),
      postLoaded: computed(() => store.getters["posts/postLoaded"]),
      user_login,
      admin, getPost
    };
  },
  watch: {
    user_login(val) {
      console.log(`The user_login value is changed to ${val}`);
      this.user_login = val;
    },
    admin(val) {
      console.log(`The admin value is changed to ${val}`);
      this.admin = val;
    },
  },
});
</script>

<style lang="scss" src="./app.scss"></style>
