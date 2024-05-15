import { Function } from "./../../../node_modules/acorn/dist/acorn.d";
import { CollectionReference, DocumentData, getDocs } from "firebase/firestore";

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
  /**
   * The function connects to the database and bring the data to the array
   * @param {*} param0
   * @returns
   */
  // accessing the state -> { state }
  // @ts-ignore
  async getPost({ commit, state }) {
    // // console.log(`The blog posts: ${state.blogPosts}`)
    // const dataBase = await db
    //   .collection("blogPosts")
    //   .orderBy("blogDate", "desc");
    // const dbResults = await dataBase.get();
    // // console.log("[Connect and get the blog posts data]");
    // // console.log(dbResults + "from [blogPosts.js]");
    // if (dbResults) {
    //   commit("setPost", dbResults);
    //   return;
    // }
    // console.log("There's something wrong with the database, or empty data");
  },
  // @ts-ignore
  async deletePostFromDatabase({ state }, payload: string) {
    // console.log(`Delete post id: ${payload}`)
    // const post = await db.collection("blogPosts").doc(payload);
    // post.delete();
    // state.blogPosts = state.blogPosts.filter((post) => post.blogId !== payload);
  },
  // @ts-ignore
  getCertainPost({ state }, blogId: string) {
    // console.log(`The current blogPosts: ${state.blogPosts}`)
    return state.blogPosts.filter((post: any) => post.blogId == blogId);
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
  async setPost(
    state: State,
    dbCollection: CollectionReference<DocumentData, DocumentData>
  ) {
    // console.log(dbCollection);
    const docs = await getDocs(dbCollection);
    docs.forEach((doc) => {
      const data = doc.data();
      state.blogPosts.push(data);
      // console.log(`The updated blog posts: ${state.blogPosts}`);
    });
    // dbCollection.forEach((doc) => {
    //   const data = {
    //     blogId: doc.data().blogId,
    //     blogHTML: doc.data().blogHTML,
    //     blogCoverPhoto: doc.data().blogCoverPhoto,
    //     blogTitle: doc.data().blogTitle,
    //     blogDate: doc.data().blogDate,
    //     blogCoverPhotoName: doc.data().blogCoverPhotoName,
    //   };
    //   state.blogPosts.push(data);
    //   // console.log(`The updated blog posts: ${state.blogPosts}`);
    // });
    state.postLoaded = true;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
