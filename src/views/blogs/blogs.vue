<template>
  <div class="blog-card-wrap">
    <div class="blog-cards container">
      <div class="toggle-edit" v-if="isAdmin">
        <span>Toggle Editing Post</span>
        <input
          type="checkbox"
          autocomplete="off"
          @change="updateEditPost(isEdit)"
        />
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
    const isEdit = ref(false);
    const isAdmin = ref(false);

    async function checkUserState() {
      const currentUser = await authService.checkUserState();
      if (currentUser) {
        let email = currentUser.email;
        //@ts-ignore
        email === import.meta.env.VITE_APP_ADMINEMAIL
          ? (isAdmin.value = true)
          : (isAdmin.value = false);
        isAdmin.value = true;
      } else {
        isAdmin.value = false;
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
      isEdit,
      updateEditPost: async (editState: boolean) => {
        isEdit.value = !editState;
        return await store.dispatch("posts/toggleEditPost", isEdit.value);
      },
      isAdmin,
    };
  },
});
</script>

<style lang="scss" src="./blogs.scss"></style>
