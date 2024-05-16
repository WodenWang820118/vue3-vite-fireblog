<template>
  <div class="blog-card-wrap">
    <div class="blog-cards container">
      <div class="toggle-edit" v-if="admin">
        <span>Toggle Editing Post</span>
        <input type="checkbox" autocomplete="off" @change="updEditPost(edit)" />
      </div>
      <BlogCards v-for="(card, index) in blogPosts" :card="card" :key="index" />
    </div>
  </div>
</template>

<script lang="ts">
import BlogCards from "../../shared/components/blog-cards/BlogCards.vue";
import { useStore } from "vuex";
import { onBeforeUnmount, computed, ref, onBeforeMount, defineComponent } from "vue";
import { auth } from "../../shared/firebase/firebaseInit";
import { onAuthStateChanged } from "firebase/auth";

export default defineComponent({
  name: "Blogs",
  components: {
    BlogCards,
  },
  setup() {
    // state management
    const store = useStore();
    const editPost = computed(() => store.getters["posts/editPost"]);

    // actions
    const toggleEditPost = (edit: boolean) => {
      store.dispatch("posts/toggleEditPost", edit);
    };

    // varibles
    const edit = ref(false); // for toggle purpose
    const admin = ref(false);

    /**
     * According to the state, reassign the local edit boolean to toggle the edit mode
     */
    function updEditPost(edit: boolean) {
      edit = !editPost.value;
      console.log(edit);
      toggleEditPost(edit);
    }

    /**
     * The function check if the logged in user is admin or not
     */
    function checkUserState() {
      // offical recommended way to fire the methods after the user state changes
      // otherwise, could be null
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          let email = user.email;
          // console.log(`The user email: ${email}`)
          // console.log(`The admin email: ${process.env.VUE_APP_ADMINEMAIL}`)
          // @ts-ignore
          email === import.meta.env.VUE_APP_ADMINEMAIL
            ? (admin.value = true)
            : (admin.value = false);
        } else {
          admin.value = false;
          console.log("There is no user using right now");
        }
      });
    }

    onBeforeMount(() => {
      checkUserState();
    });

    onBeforeUnmount(() => {
      // reset the state whenever leave the page
      toggleEditPost(false);
    });

    return {
      blogPosts: computed(() => store.getters["posts/blogPosts"]),
      editPost,
      edit,
      updEditPost,
      toggleEditPost,
      admin,
    };
  },
});
</script>

<style lang="scss" src="./blogs.scss"></style>
