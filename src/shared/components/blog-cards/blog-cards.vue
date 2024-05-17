<template>
  <div class="blog-card">
    <div v-show="editPost" class="icons">
      <div @click="editBlog" class="icon">
        <!-- the image has its own container, that's why the it's not centered -->
        <img class="edit" src="../../../assets/icons/edit-regular.svg" alt="" />
      </div>
      <div @click="deletePost" class="icon">
        <img
          class="delete"
          src="../../../assets/icons/trash-regular.svg"
          alt=""
        />
      </div>
    </div>
    <img class="image" :src="card.blogCoverPhoto" alt="" />
    <div class="info">
      <h4>{{ card.blogTitle }}</h4>
      <h6>
        Posted on:
        {{
          new Date(card.blogDate).toLocaleString("en-us", { dateStyle: "long" })
        }}
      </h6>
      <router-link
        class="link"
        :to="{ name: 'view-blog', params: { blogId: card.blogId } }"
      >
        View The Post
        <img class="arrow" src="../../../assets/icons/arrow-right-light.svg" />
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "blog-cards",
  props: {
    card: {
      type: Object as () => {
        blogId: string;
        blogTitle: string;
        blogPost: string;
        blogHTML: string;
        blogCoverPhoto: string;
        blogDate: string;
      },
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();

    async function editBlog() {
      await router.push({
        name: "edit-blog",
        params: {
          blogId: props.card.blogId,
        },
      });
    }

    return {
      editPost: computed(() => {
        return store.getters["posts/editPost"];
      }),
      deletePost: async () => {
        await store.dispatch("posts/deletePostFromDatabase", props.card.blogId);
      },
      editBlog: async () => editBlog,
    };
  },
});
</script>

<style lang="scss" src="./blog-cards.scss"></style>
