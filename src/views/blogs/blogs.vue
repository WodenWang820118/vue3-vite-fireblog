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
    const store = useStore();
    const authService = new AuthService();
    const edit = ref(false);
    const admin = ref(false);

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

    onBeforeMount(async () => {
      await checkUserState();
    });

    onBeforeUnmount(async () => {
      await store.dispatch("posts/toggleEditPost", false);
    });

    return {
      blogPosts: computed(() => store.getters["posts/blogPosts"]),
      editPost: computed(() => store.getters["posts/editPost"]),
      edit,
      updEditPost: async (edit: boolean) =>
        await store.dispatch("posts/toggleEditPost", !edit),
      toggleEditPost: async () =>
        await store.dispatch("posts/toggleEditPost", edit),
      admin,
    };
  },
});
</script>

<style lang="scss" src="./blogs.scss"></style>
