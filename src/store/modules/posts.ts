import { firestore } from "../../shared/firebase/firebaseInit";

import {
  collection,
  deleteDoc,
  DocumentData,
  getDocs,
  QuerySnapshot,
} from "firebase/firestore";

interface State {
  blogId: string;
  blogHTML: string;
  blogCoverPhoto: string;
  blogTitle: string;
  blogCoverPhotoName: string;
  blogPhotoFileURL: string;
  blogPhotoPreview: boolean;
  blogPosts: Array<any>;
  postLoaded: boolean;
  editPost: boolean;
}

const state: State = {
  // the attributes of a post
  blogHTML: "Write your blog title here...",
  blogTitle: "",
  blogCoverPhotoName: "",
  blogPhotoFileURL: "",
  blogPhotoPreview: false,
  blogPosts: [],
  postLoaded: false,
  editPost: false,
  blogId: "",
  blogCoverPhoto: "",
};

const getters = {
  blogHTML: (state: State) => state.blogHTML,
  blogTitle: (state: State) => state.blogTitle,
  blogCoverPhotoName: (state: State) => state.blogCoverPhotoName,
  blogPhotoFileURL: (state: State) => state.blogPhotoFileURL,
  blogPhotoPreview: (state: State) => state.blogPhotoPreview,
  blogPostsFeed(state: State) {
    return state.blogPosts.slice(0, 2);
  },
  blogPostsCards(state: State) {
    return state.blogPosts.slice(2, 6);
  },
  blogPosts(state: State) {
    return state.blogPosts;
  },
  editPost: (state: State) => state.editPost,
  postLoaded: (state: State) => state.postLoaded,
};

const actions = {
  // @ts-ignore
  toggleEditPost({ commit }, payload: boolean) {
    commit("setEdit", payload);
  },
  // @ts-ignore
  async updBlogTitle({ commit }, title: string) {
    commit("setBlogTitle", title);
  },
  // @ts-ignore
  async newBlogPost({ commit }, post: string) {
    commit("setBlog", post);
  },
  // @ts-ignore
  async filenameChange({ commit }, filename: string) {
    commit("setFileName", filename);
  },
  // @ts-ignore
  async createFileURL({ commit }, fileURL: string) {
    commit("setFileURL", fileURL);
  },
  // @ts-ignore
  async togglePreview({ commit }) {
    commit("setPreview");
  },

  // @ts-ignore
  async getPost({ commit }) {
    // get the blog posts from the firestore
    // then commit the mutation to set the post
    const docs = await getDocs(collection(firestore, "blogPosts"));
    if (docs) {
      // console.log("The blog posts are: ", docs);
      commit("setPost", docs);
      return;
    }
  },
  // @ts-ignore
  async deletePostFromDatabase({ commit }, payload: string) {
    const docs = await getDocs(collection(firestore, "blogPosts"));
    docs.forEach((doc) => {
      if (doc.data().blogId == payload) {
        console.log(`Delete post id: ${payload}`);
        deleteDoc(doc.ref);
        commit("deletePost", payload);
      }
    });
  },
  // @ts-ignore
  getCertainPost({ commit }, blogId: string) {
    commit("getCertainPost", blogId);
  },
};

const mutations = {
  setEdit: (state: State, payload: boolean) => (state.editPost = payload),
  setBlogTitle(state: State, payload: string) {
    state.blogTitle = payload;
  },
  setBlog(state: State, payload: string) {
    state.blogHTML = payload;
  },
  setFileName(state: State, payload: string) {
    state.blogCoverPhotoName = payload;
  },
  setFileURL(state: State, payload: string) {
    state.blogPhotoFileURL = payload;
  },
  setPreview(state: State) {
    state.blogPhotoPreview = !state.blogPhotoPreview;
  },
  async setPost(state: State, docs: QuerySnapshot<unknown, DocumentData>) {
    docs.forEach((doc) => {
      const fields = doc.data() as any;
      const data = {
        blogId: fields.blogId,
        blogHTML: fields.blogHTML,
        blogCoverPhoto: fields.blogCoverPhoto,
        blogTitle: fields.blogTitle,
        blogDate: fields.blogDate,
        blogCoverPhotoName: fields.blogCoverPhotoName,
      };
      state.blogPosts.push(data);
    });
    state.postLoaded = true;
  },
  deletePost(state: State, payload: string) {
    state.blogPosts = state.blogPosts.filter(
      (post: any) => post.blogId !== payload
    );
  },
  getCertainPost(state: State, blogId: string) {
    state.blogPosts.filter((post: any) => post.blogId == blogId);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
