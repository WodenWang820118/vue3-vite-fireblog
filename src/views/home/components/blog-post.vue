<template>
  <div class="blog-wrapper" :class="{ 'no-user': !user }">
    <!-- use no-user class only if user not login -->
    <div class="blog-content">
      <div>
        <!-- if welcomeScreen object -->
        <h2 v-if="post.welcomeScreen">{{ post.title }}</h2>
        <h2 v-else>{{ post.blogTitle }}</h2>
        <p v-if="post.welcomeScreen">{{ post.blogPost }}</p>
        <!-- <p class="content-preview" v-else v-html="post.blogHTML"></p> -->
        <p class="content-preview" v-else v-html="compiledMarkdown"></p>
        <router-link class="link link-light" v-if="post.welcomeScreen" to="#">
          Login/Register<img
            class="arrow-light"
            src="../../../assets/Icons/arrow-right-light.svg"
          />
        </router-link>
        <router-link
          class="link"
          v-else
          :to="{ name: 'view-blog', params: { blogId: post.blogId } }"
        >
          View The Post<img
            class="arrow"
            src="../../../assets/Icons/arrow-right-light.svg"
          />
        </router-link>
      </div>
    </div>
    <div class="blog-photo">
      <img
        v-if="post.welcomeScreen"
        :src="`src/assets/blogPhotos/${post.photo}.jpg`"
        alt=""
      />
      <img v-else :src="post.blogCoverPhoto" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { marked } from "marked";

export default defineComponent({
  name: "blog-post",
  props: {
    // more clear about props type, easier for type check and validations
    // https://v3.vuejs.org/guide/component-props.html
    post: {
      type: Object as () => {
        blogId: string;
        blogTitle: string;
        blogPost: string;
        blogHTML: string;
        blogCoverPhoto: string;
        title: string;
        photo: string;
        welcomeScreen: boolean;
      },
      required: true,
    },
  },
  setup() {
    // state management
    const store = useStore();
    const user = computed(() => store.getters["users/user"]);

    return {
      user,
    };
  },
  computed: {
    compiledMarkdown: function () {
      return marked(this.post.blogHTML);
    },
  },
});
</script>

<style lang="scss" src="./blog-post.scss"></style>
