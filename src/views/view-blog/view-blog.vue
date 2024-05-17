<template>
  <div class="post-view" v-if="currentBlog">
    <div class="container quillWrapper">
      <h2>{{ currentBlog.blogTitle }}</h2>
      <h4>
        Posted on:
        {{
          new Date(currentBlog.blogDate).toLocaleString("en-us", {
            dateStyle: "long",
          })
        }}
      </h4>
      <img class="cover-photo" :src="currentBlog.blogCoverPhoto" alt="" />
      <VueShowdown :markdown="markdownSrc" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import { useRoute } from "vue-router";
import { PostService } from "../../shared/services/post.service";
import { useStore } from "vuex";

export default defineComponent({
  name: "view-blog",
  setup() {
    const currentBlog = ref();
    const reload = ref(true);
    const markdownSrc = ref();
    const route = useRoute();
    const store = useStore();
    const postService = new PostService();

    async function getRoutedPost() {
      // if there's already a post, use it instead of fetching it from the backend
      const cachedPost = await store.dispatch(
        "posts/getCertainPost",
        route.params.blogId
      );

      currentBlog.value = cachedPost
        ? cachedPost
        : await postService.getPostById(route.params.blogId);
      markdownSrc.value = currentBlog.value.blogHTML;
    }

    onMounted(async () => {
      await getRoutedPost();
    });

    return {
      reload,
      currentBlog,
      markdownSrc,
    };
  },
});
</script>

<style lang="scss" src="./view-blog.scss"></style>
