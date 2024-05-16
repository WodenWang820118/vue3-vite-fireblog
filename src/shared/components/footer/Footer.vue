<template>
  <footer>
    <div class="container">
      <div class="left">
        <div class="col-1">
          <router-link class="header" :to="{ name: 'Home' }"
            >FireBlogs</router-link
          >
          <ul>
            <li>
              <a href="#"
                ><img src="../../assets/Icons/youtube-brands.svg" class="svg-icon"
              /></a>
            </li>
            <li>
              <a href="#"
                ><img src="../../assets/Icons/twitter-brands.svg" class="svg-icon"
              /></a>
            </li>
            <li>
              <a href="#"
                ><img
                  src="../../assets/Icons/instagram-brands.svg"
                  class="svg-icon"
              /></a>
            </li>
            <li>
              <a href="#"
                ><img src="../../assets/Icons/linkedin-brands.svg" class="svg-icon"
              /></a>
            </li>
          </ul>
        </div>
        <div class="col-2">
          <ul>
            <router-link class="link" :to="{ name: 'Home' }">Home</router-link>
            <router-link class="link" :to="{ name: 'Blogs' }"
              >Blogs</router-link
            >
            <!-- <router-link v-if="user" class="link" :to="{ name: 'CreatePost' }"
              >Create Post</router-link
            >
            <router-link v-if="!user" class="link" :to="{ name: 'Login' }"
              >Login In / Register</router-link
            > -->
          </ul>
        </div>
      </div>
      <div class="right">
        <p>Copyright 2021 All Rights Reserved</p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "FooterVue",
  setup() {
    const store = useStore();
    const user = computed(() => store.getters["users/user"]);
    return {
      user,
    };
  },
});
</script>

<style lang="scss" src="./footer.scss"></style>
