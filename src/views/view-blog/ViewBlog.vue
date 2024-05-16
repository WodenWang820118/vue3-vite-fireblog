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
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../shared/firebase/firebaseInit";

export default defineComponent({
  name: "ViewBlog",
  components: {
  },
  setup() {
    // varailables defined
    const currentBlog = ref();
    const reload = ref(true);
    const markdownSrc = ref();

    // access router
    const route = useRoute();

    async function getRoutedPost() {
      console.log(route.params.blogId);
      const postDocRef = doc(firestore, "blogPosts", `${route.params.blogId}`);
      const postDocSnap = await getDoc(postDocRef);
      if (!postDocSnap.exists()) {
        console.log("No such document!");
      } else {
        console.log("Document data:", postDocSnap.data());
        currentBlog.value = postDocSnap.data();
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
