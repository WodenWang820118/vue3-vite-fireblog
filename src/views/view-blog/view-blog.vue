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

export default defineComponent({
  name: "view-blog",
  setup() {
    // varailables defined
    const currentBlog = ref();
    const reload = ref(true);
    const markdownSrc = ref();

    // access router
    const route = useRoute();
    const postService = new PostService();

    async function getRoutedPost() {
      const post = await postService.getPostById(route.params.blogId);
      if (post) {
        currentBlog.value = post;
        markdownSrc.value = currentBlog.value.blogHTML;
      }
    }

    onMounted(() => {
      getRoutedPost();
    });

    // cannot return the marked during the setup phase
    // it will return the function string instead of calling
    return {
      reload,
      currentBlog,
      markdownSrc,
    };
  },
});
</script>

<style lang="scss" src="./view-blog.scss"></style>
