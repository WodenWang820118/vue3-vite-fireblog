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

<style lang="scss">
.post-view {
  h4 {
    font-weight: 400;
    font-size: 14px;
    margin-bottom: 24px;
  }
  min-height: 100%;
  .container {
    max-width: 1000px;
    padding: 60px 25px;
  }
  .ql-editor {
    padding: 0;
  }
  h2 {
    margin-bottom: 16px;
    font-weight: 300;
    font-size: 32px;
  }
  .cover-photo {
    width: 100%;
    margin-bottom: 32px;
  }
}
// overide the default markdown style
td,
th {
  padding: 10px;
  border: 1px solid #ddd;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
  border: 2px solid #ddd;
}
</style>
