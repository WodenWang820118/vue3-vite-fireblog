<template>
  <div class="create-post">
    <blog-cover-preview v-show="blogPhotoPreview" />
    <loading v-show="loading" />
    <div class="container">
      <div :class="{ invisible: !error }" class="err-message">
        <p><span>Error:</span>{{ errorMsg }}</p>
      </div>
      <div class="blog-info">
        <input type="text" placeholder="Enter Blog Title" v-model="blogTitle" />
        <div class="upload-file">
          <label for="blog-photo">Change Cover Photo</label>
          <input
            type="file"
            ref="blogPhoto"
            id="blog-photo"
            @change="fileChange"
            accept=".png, .jpg, .jpeg"
          />
          <button
            @click="togglePreview"
            class="preview"
            :class="{ 'button-inactive': !blogPhotoFileURL }"
          >
            Preview Photo
          </button>
          <span v-if="coverPhoto">File Chosen: {{ blogCoverPhotoName }}</span>
        </div>
      </div>
      <div class="editor">
        <md-editor v-model="text" @upload-image="imageHandler" />
      </div>
      <div class="blog-actions">
        <button @click="uploadBlog">Save changes</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// components
import BlogCoverPreview from "../../shared/components/blog-cover-preview/blog-cover-preview.vue";
import Loading from "../../shared/components/loading/loading.vue";
// vue
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { ref, computed, onMounted, defineComponent, Ref } from "vue";
// services
import { DocumentData } from "firebase/firestore";
import { PostService } from "../../shared/services/post.service";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
export default defineComponent({
  name: "edit-blog",
  components: {
    "blog-cover-preview": BlogCoverPreview,
    loading: Loading,
    "md-editor": MdEditor,
  },
  setup() {
    // the router reference
    const route = useRoute();
    const router = useRouter();

    // store management
    const store = useStore();

    // computed properties
    const profileId = computed(() => store.getters["users/profileId"]);
    const storeComputed = {
      users: computed(() => store.getters["users/profileId"]),
      blogHTML: computed(() => store.getters["posts/blogHTML"]),
      blogCoverPhotoName: computed(
        () => store.getters["posts/blogCoverPhotoName"]
      ),
      blogPhotoFileURL: computed(() => store.getters["posts/blogPhotoFileURL"]),
      blogPhotoPreview: computed(() => store.getters["posts/blogPhotoPreview"]),
      blogPosts: computed(() => store.getters["posts/blogPosts"]),
    };

    // actions
    async function filenameChange(filename: string) {
      return await store.dispatch("posts/filenameChange", filename);
    }

    async function createFileURL(fileName: string) {
      return await store.dispatch("posts/createFileURL", fileName);
    }

    async function updateBlogTitle(title: string) {
      return await store.dispatch("posts/updBlogTitle", title);
    }

    async function togglePreview() {
      return await store.dispatch("posts/togglePreview");
    }

    async function setBlogState(state: any) {
      return await store.dispatch("posts/setBlogState", state);
    }

    // variables
    const error = ref(false);
    const errorMsg = ref("");
    const coverPhoto: Ref<File | undefined> = ref(undefined);
    const blogTitle = ref("");
    const text = ref("");
    const loading = ref(false);
    const currentBlog: Ref<DocumentData> = ref({} as any);
    const blogPhoto = ref(undefined as any);

    // services and functions
    const postService = new PostService();

    async function fileChange() {
      console.log("[There's a new photo]");
      // console.log(blogPhoto.value.files[0]);
      coverPhoto.value = await postService.imageCompressionHandler(
        blogPhoto.value.files[0]
      );
      if (!coverPhoto.value) {
        return;
      }

      const fileName = coverPhoto.value.name;
      console.log(`The fileName: ${fileName}`);
      await filenameChange(fileName); // change the state
      await createFileURL(URL.createObjectURL(coverPhoto.value)); // create the URL
    }

    async function imageHandler(files: File[]) {
      return await postService.imageHandler(files);
    }

    async function uploadBlog() {
      if (blogTitle.value.length === 0 && text.value.length === 0) {
        error.value = true;
        errorMsg.value = "Please ensure you uploaded a cover photo";
        setTimeout(() => {
          error.value = false;
        }, 5000);
        return;
      }

      if (!coverPhoto.value) {
        error.value = true;
        errorMsg.value = "Please ensure you uploaded a cover photo";
        setTimeout(() => {
          error.value = false;
        }, 5000);
        return;
      }

      loading.value = true;
      console.log("[All validations passed]");
      const timestamp = Date.now();
      const fileName = coverPhoto.value.name;
      const uniqueFileName = fileName + timestamp;

      // upload the photo to the storage
      const url = await postService.uploadBlogPostPhoto(
        uniqueFileName,
        coverPhoto.value
      );

      // upload the blog post document to the firestore
      const generatedPost = await postService.uploadBlogPost({
        blogId: "",
        blogHTML: text.value,
        blogCoverPhoto: url,
        blogCoverPhotoName: fileName,
        blogTitle: blogTitle.value,
        profileId: profileId.value,
        blogDate: timestamp,
      });

      loading.value = true;
      console.log("[Route to the new post]");
      loading.value = false;

      await router.push({
        name: "view-blog",
        params: { blogId: generatedPost.blogId },
      });
    }

    // bring the data back to the text editor from firebase
    onMounted(async () => {
      const post = await postService.getPostById(route.params.blogId);
      if (post) {
        currentBlog.value = post;
        text.value = currentBlog.value.blogHTML;
        blogTitle.value = currentBlog.value.blogTitle;
      }
    });

    return {
      ...storeComputed,
      error,
      errorMsg,
      blogPhoto,
      coverPhoto,
      blogTitle,
      text,
      loading,
      currentBlog,
      fileChange,
      imageHandler,
      togglePreview,
      uploadBlog,
      updateBlogTitle,
      setBlogState,
    };
  },
});
</script>

<style lang="scss" src="./edit-blog.scss"></style>
