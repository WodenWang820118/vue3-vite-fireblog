<template>
  <div class="blog-card-wrap">
    <div class="blog-cards container">
      <div class="toggle-edit" v-if="admin">
        <span>Toggle Editing Post</span>
        <input type="checkbox" autocomplete="off" @change="updEditPost(edit)" />
      </div>
      <blog-cards
        v-for="(card, index) in blogPosts"
        :card="card"
        :key="index"
      />
    </div>
  </div>
</template>

<script lang="ts">
import BlogCards from "../../shared/components/blog-cards/blog-cards.vue";
import { useStore } from "vuex";
import {
  onBeforeUnmount,
  computed,
  ref,
  onBeforeMount,
  defineComponent,
} from "vue";
import { AuthService } from "../../shared/services/auth.service";
export default defineComponent({
  name: "blogs",
  components: {
    "blog-cards": BlogCards,
  },
  setup() {
    // state management
    const store = useStore();
    const editPost = computed(() => store.getters["posts/editPost"]);

    // actions
    async function toggleEditPost(edit: boolean) {
      await store.dispatch("posts/toggleEditPost", edit);
    }

    // varibles
    const edit = ref(false); // for toggle purpose
    const admin = ref(false);

    const authService = new AuthService();

    async function updEditPost(edit: boolean) {
      edit = !editPost.value;
      await toggleEditPost(edit);
    }

    async function checkUserState() {
      const currentUser = await authService.checkUserState();
      if (currentUser) {
        let email = currentUser.email;
        //@ts-ignore
        email === import.meta.env.VITE_APP_ADMINEMAIL
          ? (admin.value = true)
          : (admin.value = false);
        admin.value = true;
      } else {
        admin.value = false;
      }
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
