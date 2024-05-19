import { firestore } from "../shared/firebase/firebaseInit";
import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import {
  collection,
  deleteDoc,
  DocumentData,
  getDocs,
  limit,
  query,
  QuerySnapshot,
} from "firebase/firestore";

export const usePostStore = defineStore("posts", () => {
  // states
  const blogHTML = ref("Write your blog title here...");
  const blogTitle = ref("");
  const blogCoverPhotoName = ref("");
  const blogPhotoFileURL = ref("");
  const blogPhotoPreview = ref(false);
  const welcomeScreen = ref(false);
  const blogPosts: Ref<
    {
      blogId: string;
      blogHTML: string;
      blogCoverPhoto: string;
      blogTitle: string;
      blogDate: string;
      blogCoverPhotoName: string;
      welcomeScreen?: boolean;
    }[]
  > = ref([]);
  const postLoaded = ref(false);
  const editPost = ref(false);

  function blogPostsFeed() {
    return blogPosts.value.slice(0, 2);
  }

  function blogPostsCards() {
    return blogPosts.value.slice(2, 6);
  }

  // actions
  async function getPost() {
    // get the blog posts from the firestore
    // then commit the mutation to set the post
    // TODO: implement pagination
    // https://firebase.google.com/docs/firestore/query-data/query-cursors
    const first = query(collection(firestore, "blogPosts"), limit(5));
    const docs = await getDocs(first);
    if (docs) {
      // console.log("The blog posts are: ", docs);
      await setPost(docs);
      return;
    }
  }

  async function deletePostFromDatabase(payload: string) {
    const docs = await getDocs(collection(firestore, "blogPosts"));
    docs.forEach((doc) => {
      if (doc.data().blogId == payload) {
        console.log(`Delete post id: ${payload}`);
        deleteDoc(doc.ref);
        deletePost(payload);
      }
    });
  }

  // mutations
  async function setPost(docs: QuerySnapshot<unknown, DocumentData>) {
    docs.forEach((doc) => {
      const fields = doc.data() as any;
      if (fields === undefined || fields === null) {
        return;
      }
      const data = {
        blogId: fields.blogId,
        blogHTML: fields.blogHTML,
        blogCoverPhoto: fields.blogCoverPhoto,
        blogTitle: fields.blogTitle,
        blogDate: fields.blogDate,
        blogCoverPhotoName: fields.blogCoverPhotoName,
      };
      blogPosts.value.push(data);
    });
    postLoaded.value = true;
  }

  function deletePost(payload: string) {
    blogPosts.value = blogPosts.value.filter(
      (post: any) => post.blogId !== payload
    );
  }

  function getCertainPost(blogId: string | string[]) {
    return blogPosts.value.filter((post: any) => post.blogId == blogId);
  }

  function toggleEditPost(payload: boolean) {
    editPost.value = payload;
  }

  function updBlogTitle(title: string) {
    blogTitle.value = title;
  }

  function newBlogPost(post: string) {
    blogHTML.value = post;
  }

  function filenameChange(filename: string) {
    blogCoverPhotoName.value = filename;
  }

  function createFileURL(fileURL: string) {
    blogPhotoFileURL.value = fileURL;
  }

  function togglePreview() {
    blogPhotoPreview.value = !blogPhotoPreview.value;
  }

  function updateBlogTitle(title: string) {
    blogTitle.value = title;
  }

  return {
    blogHTML,
    blogTitle,
    blogCoverPhotoName,
    blogPhotoFileURL,
    blogPhotoPreview,
    blogPosts,
    postLoaded,
    welcomeScreen,
    editPost,
    blogPostsFeed,
    blogPostsCards,
    toggleEditPost,
    updBlogTitle,
    newBlogPost,
    filenameChange,
    createFileURL,
    togglePreview,
    getPost,
    deletePostFromDatabase,
    getCertainPost,
    updateBlogTitle,
  };
});
