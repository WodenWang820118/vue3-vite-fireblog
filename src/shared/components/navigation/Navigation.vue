<template>
  <header>
    <nav class="container">
      <div class="branding">
        <router-link class="header" :to="{ name: 'home' }"
          >FireBlogs</router-link
        >
      </div>
      <div class="nav-links">
        <ul v-show="!mobile">
          <router-link class="link" :to="{ name: 'home' }">Home</router-link>
          <router-link class="link" :to="{ name: 'blogs' }">Blogs</router-link>
          <router-link
            v-if="user_login && admin"
            class="link"
            :to="{ name: 'create-post' }"
            >Create Post
          </router-link>
          <router-link v-if="!user_login" class="link" :to="{ name: 'login' }"
            >Login/Register
          </router-link>
        </ul>
        <div
          v-if="user"
          @click="toggleProfileMenu"
          class="profile"
          ref="profile"
        >
          <span>{{ profileInitials }}</span>
          <div v-show="profileMenu" class="profile-menu">
            <div class="info">
              <!-- directly access the global store/state/users -->
              <p class="initials">{{ profileInitials }}</p>
              <div class="right">
                <p>{{ profileFirstName }} {{ profileLastName }}</p>
                <p>{{ profileUsername }}</p>
                <p>{{ profileEmail }}</p>
              </div>
            </div>
            <div class="options">
              <div class="option">
                <router-link class="option" :to="{ name: 'profile' }">
                  <img
                    class="icon"
                    src="../assets/Icons/user-alt-light.svg"
                    alt=""
                  />
                  <p>Profile</p>
                </router-link>
              </div>
              <div @click="signUserOut" class="option">
                <img
                  class="icon"
                  src="../assets/Icons/sign-out-alt-regular.svg"
                  alt=""
                />
                <p>Sign Out</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <!-- use file-loader to deal with svg file -->
    <!-- vue-cli-plugin-svg @see https://www.npmjs.com/package/vue-cli-plugin-svg-vue3 -->
    <img
      @click="toggleMobileNav"
      v-show="mobile"
      src="../assets/Icons/bars-regular.svg"
      alt=""
      class="menu-icon"
    />
    <transition name="mobile-nav">
      <ul class="mobile-nav" v-show="mobileNav">
        <router-link class="link" :to="{ name: 'home' }">Home</router-link>
        <router-link class="link" :to="{ name: 'blogs' }">Blogs</router-link>
        <router-link
          v-if="user_login && admin"
          class="link"
          :to="{ name: 'create-post' }"
          >Create Post</router-link
        >
        <router-link v-if="!user_login" class="link" :to="{ name: 'login' }"
          >Login/Register</router-link
        >
      </ul>
    </transition>
  </header>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { ref, computed, defineComponent } from "vue";
import { auth } from "../../firebase/firebaseInit";
import { signOut } from "firebase/auth";

export default defineComponent({
  name: "navigation",
  setup() {
    // get the store
    const store = useStore();

    // the variables for adjusting the responsiiveness
    const profileMenu = ref(false);
    const mobile = ref(false); // true ? 'show icon' : '' -> can toggle mobileNav
    const mobileNav = ref(false);
    const windowWidth = ref(window.innerWidth);
    const profile = ref(null);

    function checkScreen() {
      if (windowWidth.value <= 750) {
        mobile.value = true; // for toggling mobile responsiveness and navigation
        return;
      }
      mobile.value = false;
      mobileNav.value = false;
      return;
    }

    function toggleMobileNav() {
      mobileNav.value = !mobileNav.value;
    }

    function toggleProfileMenu(e: MouseEvent) {
      if (e.target === profile.value) {
        profileMenu.value = !profileMenu.value;
      }
    }

    async function signUserOut() {
      await signOut(auth).then(() => {
        // console.log("The user safely log out");
        // alert("Hope to see you again")
      });
      window.location.reload();
    }

    window.addEventListener("resize", () => {
      checkScreen();
    });

    return {
      // store states
      user: computed(() => store.getters["users/user"]),
      profileInitials: computed(() => store.getters["users/profileInitials"]),
      profileFirstName: computed(() => store.getters["users/profileFirstName"]),
      profileLastName: computed(() => store.getters["users/profileLastName"]),
      profileUsername: computed(() => store.getters["users/profileUsername"]),
      profileEmail: computed(() => store.getters["users/profileEmail"]),
      profileMenu,
      profile,
      mobile,
      mobileNav,
      windowWidth,
      toggleProfileMenu,
      toggleMobileNav,
      signUserOut,
    };
  },
  props: {
    user_login: {
      type: Boolean,
    },
    admin: {
      type: Boolean,
    },
  },
});
</script>

<style lang="scss" src="./navigation.scss"></style>
