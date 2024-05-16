<template>
  <div class="create-post">
    <BlogCoverPreview v-show="blogPhotoPreview" />
    <Loading v-show="loading" />
    <div class="container">
      <div :class="{ invisible: !error }" class="err-message">
        <p><span>Error:</span>{{ errorMsg }}</p>
      </div>
      <div class="blog-info">
        <input type="text" placeholder="Enter Blog Title" v-model="blogTitle" />
        <div class="upload-file">
          <label for="blog-photo">Upload Cover Photo</label>
          <input type="file" ref="blogPhoto" id="blog-photo" @change="observeFile" accept=".png, .jpg, .jpeg" />
          <button @click="togglePreview" class="preview" :class="{ 'button-inactive': !blogPhotoFileURL }">
            Preview Photo
          </button>
          <span v-if="coverPhoto">File Chosen: {{ blogCoverPhotoName }}</span>
        </div>
      </div>
      <div class="editor">
        <MdEditor :language="'en-US'" v-model="text" @upload-image="imageHandler" />
      </div>
      <div class="blog-actions">
        <button @click="uploadBlog">Publish Blog</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// components
import BlogCoverPreview from "../../shared/components/blog-cover-preview/BlogCoverPreview.vue";
import Loading from "../../shared/components/loading/Loading.vue";
// vue
import { ref,  defineComponent, Ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
// services
import { MdEditor } from 'md-editor-v3';
import { EditorService } from "./editor.service";
import 'md-editor-v3/lib/style.css';
import { error } from "console";

export default defineComponent({
  name: "CreatePost",
  components: {
    BlogCoverPreview,
    Loading,
    MdEditor,
  },
  setup() {
    const store = useStore();
    const profileId = computed(() => store.getters["users/profileId"]);
    const storeComputed = {
      blogHTML: computed(() => store.getters["posts/blogHTML"]),
      blogCoverPhotoName: computed(
        () => store.getters["posts/blogCoverPhotoName"]
      ),
      blogPhotoFileURL: computed(
        () => store.getters["posts/blogPhotoFileURL"]
      ),
      blogPhotoPreview: computed(
        () => store.getters["posts/blogPhotoPreview"]
      ),
    };

    async function updateBlogTitle(title: string) {
      await store.dispatch("posts/updateBlogTitle", title);
    }

    async function filenameChange(filename: string) {
      await store.dispatch("posts/filenameChange", filename);
    }

    async function createFileURL(file: any) {
      await store.dispatch("posts/createFileURL", file);
    }

    async function togglePreview() {
      await store.dispatch("posts/togglePreview");
    }
    // services and functions
    const editorService = new EditorService();

    // route management
    const route = useRoute();
    const router = useRouter();

    // variables
    const error = ref(false);
    const errorMsg = ref("");
    const coverPhoto: Ref<File | undefined> = ref(undefined);
    const blogTitle = ref("");
    const text = ref("");
    const loading = ref(false);
    const blogPhoto = ref("" as any); // ref props in the template

    async function observeFile() {
      coverPhoto.value = await editorService.imageCompressionHandler(
        blogPhoto.value.files[0]
      );
      console.log(coverPhoto.value);
      if (!coverPhoto.value) {
        return;
      }

      const fileName = coverPhoto.value.name;
      await filenameChange(fileName); // change the state
      await createFileURL(URL.createObjectURL(coverPhoto.value)); // create the URL
    }

    async function imageHandler(files: File[]) {
      return await editorService.imageHandler(files);
    }

    // TODO: try catch with error loading
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
      const url = await editorService.uploadBlogPostPhoto(uniqueFileName, coverPhoto.value);

      // upload the blog post document to the firestore
      const generatedPost = await editorService.uploadBlogPost(
        {
          blogId: "",
          blogHTML: text.value,
          blogCoverPhoto: url,
          blogCoverPhotoName: fileName,
          blogTitle: blogTitle.value,
          profileId: profileId.value,
          blogDate: timestamp,
        }
      );

      loading.value = true;
      console.log("[Route to the new post]");
      loading.value = false;

      await router.push({
        name: "ViewBlog",
        params: { blogId: generatedPost.blogId },
      });
    }

    return {
      ...storeComputed,
      updateBlogTitle,
      togglePreview,
      observeFile,
      imageHandler,
      uploadBlog,
      profileId,
      error,
      errorMsg,
      coverPhoto,
      blogTitle,
      text,
      loading,
      blogPhoto,
    };
  }
});
</script>

<style lang="scss" src="./create-post.scss"></style>
