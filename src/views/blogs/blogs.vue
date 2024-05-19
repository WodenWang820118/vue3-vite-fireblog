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
    <div
      class="load-more-container"
      style="display: flex; justify-content: center"
    >
      <button @click="loadMorePosts">Load More Posts</button>
    </div>
  </div>
</template>

<script lang="ts">
import BlogCards from "../../shared/components/blog-cards/blog-cards.vue";
import {
  onBeforeUnmount,
  computed,
  ref,
  onBeforeMount,
  defineComponent,
} from "vue";
import { usePostStore } from "../../stores/posts";
import { auth } from "../../shared/firebase/firebaseInit";

export default defineComponent({
  name: "blogs",
  components: {
    "blog-cards": BlogCards,
  },
  setup() {
    const store = usePostStore();
    const isEdit = ref(false);
    const isAdmin = ref(false);

    function checkUserState() {
      auth.onAuthStateChanged((currentUser) => {
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
      });
    }

    async function loadMorePosts() {
      await store.loadMorePosts();
    }

    onBeforeMount(() => {
      checkUserState();
    });

    onBeforeUnmount(() => {
      store.toggleEditPost(false);
    });

    return {
      blogPosts: computed(() => store.blogPosts),
      editPost: computed(() => store.editPost),
      isEdit,
      updateEditPost: (editState: boolean) => {
        isEdit.value = !editState;
        store.toggleEditPost(isEdit.value);
      },
      isAdmin,
      loadMorePosts,
    };
  },
});
</script>

<style lang="scss" src="./blogs.scss"></style>
