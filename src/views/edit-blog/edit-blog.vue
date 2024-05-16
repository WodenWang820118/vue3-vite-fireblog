<template>
  <div class="create-post">
    <blog-cover-preview v-show="blogPhotoPreview" />
    <loading v-show="loading" />
    <div class="container">
      <!-- invisible if nothing wrong -->
      <div :class="{ invisible: !error }" class="err-message">
        <p><span>Error:</span>{{ errorMsg }}</p>
      </div>
      <div class="blog-info">
        <input type="text" placeholder="Enter Blog Title" v-model="blogTitle" />
        <div class="upload-file">
          <label for="blog-photo">Change Cover Photo</label>
          <!-- the "file" type allows uploading photo -->
          <input
            type="file"
            ref="blogPhoto"
            id="blog-photo"
            @change="fileChange"
            accept=".png, .jpg, .jpeg"
          />
          <!-- disable if not having photo -->
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
        <!-- TODO: response rendered box under editor when screen size shrinks -->
        <!-- tool reference: https://github.com/code-farmer-i/vue-markdown-editor -->
        <v-md-editor
          v-model="text"
          height="600px"
          :disabled-menus="[]"
          @upload-image="imageHandler"
        >
        </v-md-editor>
      </div>
      <div class="blog-actions">
        <button @click="updateBlog">Save changes</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BlogCoverPreview from "../../shared/components/blog-cover-preview/blog-cover-preview.vue";
import Loading from "../../shared/components/loading/loading.vue";
import "firebase/storage";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { ref, computed, onMounted, defineComponent, Ref } from "vue";
import imageCompression from "browser-image-compression";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { collection, DocumentData, getDocs, getFirestore } from "firebase/firestore";
import { error } from "console";

export default defineComponent({
  name: "edit-blog",
  components: {
    'blog-cover-preview':BlogCoverPreview,
    'loading': Loading,
  },
  setup() {
    // the router reference
    const route = useRoute();
    const router = useRouter();

    // store management
    const store = useStore();

    // computed properties
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
    const filenameChange = async(filename: string) => {
      return await store.dispatch("posts/filenameChange", filename);
    };

    const createFileURL = async (fileName: string) => {
      return await store.dispatch("posts/createFileURL", fileName);
    };

    const updBlogTitle = async (title: string) => {
      return await store.dispatch("posts/updBlogTitle", title);
    };

    const togglePreview = async () => {
      return await store.dispatch("posts/togglePreview");
    };

    const setBlogState = async (state: any) => {
      return await store.dispatch("posts/setBlogState", state);
    };

    // variables
    const error = ref(false);
    const errorMsg = ref("");
    const coverPhoto: Ref<File | undefined> = ref(undefined);
    const blogTitle = ref("");
    const text = ref("");
    const loading = ref(false);
    const currentBlog: Ref<DocumentData> = ref({} as any);
    const blogPhoto = ref(undefined as any);

    // functions
    async function fileChange() {
      console.log("[There's a new photo]");
      // console.log(blogPhoto.value.files[0]);
      coverPhoto.value = await imageCompressionHandler(
        blogPhoto.value.files[0]
      );
      if (!coverPhoto.value) {
        return;
      }

      const fileName = coverPhoto.value.name;
      console.log(`The fileName: ${fileName}`);
      filenameChange(fileName); // change the state
      createFileURL(URL.createObjectURL(coverPhoto.value)); // create the URL
    }

    async function imageCompressionHandler(imageFile: File) {
      // options to compress the image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(imageFile, options);
        console.log(
          "compressedFile instanceof Blob",
          compressedFile instanceof Blob
        ); // true
        console.log(
          `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
        ); // smaller than maxSizeMB

        return compressedFile;
      } catch (error) {
        console.log(error);
      }
    }

    async function imageHandler(event: Event, insertImage: any, files: File[]) {
      console.log("[Trigger imageHandler]");
      let contentPhoto: File | undefined = files[0];
      contentPhoto = await imageCompressionHandler(contentPhoto); // compress the photo
      if (!contentPhoto) {
        return;
      }

      const fileName = contentPhoto.name;
      const url = URL.createObjectURL(contentPhoto);
      // const contentPhotoName = this.contentPhoto.name
      // const url = URL.createObjectURL(this.contentPhoto)
      console.log("Corresponding files: " + contentPhoto); // [object File]
      console.log("The file name is: " + fileName); // 5741195.jpg
      console.log("The event: " + event); // [object Event]
      console.log("The url: " + url); // blob:http://localhost:8080/08e9f458-8d7e-4828-9b96-0b404ca3a133
      console.log("[Initialize the database..]");

      const bucket = getStorage();
      const bucketRef = storageRef(bucket, `documents/blogPostPhotos/${fileName}`);
      console.log("[Initialize the firebase stoarge successfully]");
      uploadBytes(bucketRef, contentPhoto).then((snapshot) => {
        console.log("Uploaded a blob or file!", snapshot);
      });
      
      // const uploadTask = docRef.put(contentPhoto);
      // uploadTask.on(
      //   "stata_changed",
      //   (snapshot) => {
      //     console.log(snapshot); // multiple snapshot -> upload progressing
      //   },
      //   (err) => {
      //     console.log(err);
      //   },
      //   () => {
      //     console.log("[Waiting for downloading the image URL]");
      //     uploadTask.snapshot.ref.getDownloadURL().then((url) => {
      //       console.log("The URL back from firebase:" + url);
      //       insertImage({
      //         url: url,
      //         desc: "desc",
      //       });
      //     });
      //   }
      // );
    }

    async function updateBlog() {
      const db = getFirestore();
      const document = await getDocs(collection(db, "blogPosts"));

      // const document = db.collection("blogPosts").doc(route.params.blogId);
      if (blogTitle.value.length !== 0 && text.value.length !== 0) {
        if (coverPhoto.value) {
          loading.value = true;
          console.log("[All validations passed]");
          const timestamp = Date.now();
          const fileName = coverPhoto.value.name;
          const uniqueFileName = fileName + timestamp;
          // const url = URL.createObjectURL(this.coverPhoto)
          const bucket = getStorage();
          const docRef = storageRef(bucket, `documents/BlogCoverPhotos/${uniqueFileName}`);
          uploadBytes(docRef, coverPhoto.value).then((snapshot) => {
            console.log("Uploaded a blob or file!", snapshot);
          });
          
          // const uploadTask = docRef.put(coverPhoto.value);
          // uploadTask.on(
          //   "state_changed",
          //   (snapshot) => {
          //     var progress =
          //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          //     console.log("Upload is " + progress + "% done");
          //     switch (snapshot.state) {
          //       case firebase.storage.TaskState.PAUSED: // or 'paused'
          //         console.log("Upload is paused");
          //         break;
          //       case firebase.storage.TaskState.RUNNING: // or 'running'
          //         console.log("Upload is running");
          //         break;
          //     }
          //   },
          //   (err) => {
          //     console.log(err);
          //     loading.value = false;
          //   },
          //   async () => {
          //     uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          //       console.log("The URL back from firebase:" + url);
          //       console.log("The database id: " + document.id);
          //       document.update({
          //         blogHTML: DOMPurify.sanitize(text.value),
          //         blogCoverPhoto: url,
          //         blogCoverPhotoName: uniqueFileName,
          //         blogTitle: blogTitle.value,
          //       });
          //     });
          //     loading.value = true;
          //     console.log("[Route to the new post]");
          //     loading.value = false;
          //     await router.push({
          //       name: "ViewBlog",
          //       params: { blogId: document.id },
          //     });
          //   }
          // );
          return;
        }
        // if there's no new cover photo, just update the HTML and title
        loading.value = true;
        // document.update({
        //   blogHTML: text.value,
        //   blogTitle: blogTitle.value,
        // });
        loading.value = false;
        // router.push({
        //   name: "ViewBlog",
        //   params: { blogId: document.id },
        // });
      }
      error.value = true;
      errorMsg.value = "Please ensure Blog Title & Blog Post has been filled";
      setTimeout(() => {
        error.value = false;
      }, 5000);
      return;
    }

    // bring the data back to the text editor from firebase
    onMounted(async () => {
      const db = getFirestore();
      const docRef = await getDocs(collection(db, "blogPosts"));
      docRef.docs.forEach((doc) => {
        if (doc.id === route.params.blogId) {
          currentBlog.value = doc.data();
          text.value = currentBlog.value.blogHTML; // data return
          blogTitle.value = currentBlog.value.blogTitle; // data return
        }
      });

      // docRef
      //   .get()
      //   .then((doc) => {
      //     if (doc.exists) {
      //       currentBlog.value = doc.data();
      //       text.value = currentBlog.value.blogHTML; // data return
      //       blogTitle.value = currentBlog.value.blogTitle; // data return
      //     } else {
      //       console.log("No such document!");
      //     }
      //   })
      //   .catch((error) => {
      //     console.log("Error getting document:", error);
      //   });
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
      updateBlog,
      togglePreview,
      updBlogTitle,
      setBlogState,
    };
  },
});
</script>

<style lang="scss" src="./edit-blog.scss"></style>
