<template>
  <div class="home">
    <blog-post v-if="!user" :post="welcomeScreen" />
    <!-- the post props binding the post used in v-for loop -->
    <blog-post
      :post="post"
      v-for="(post, index) in blogPostsFeed"
      :key="index"
    />
    <div class="blog-card-wrap">
      <div class="container">
        <h3>View More Recent Blogs</h3>
        <div class="blog-cards">
          <blog-cards
            v-for="(card, index) in blogPostsCards"
            :card="card"
            :key="index"
          />
        </div>
      </div>
    </div>
    <div v-if="!user" class="updates">
      <div class="container">
        <h2>Never miss a post. Register for your free account today!</h2>
        <router-link class="router-button" :to="{ name: 'register' }">
          Register For FireBlogs
          <img
            class="arrow-light"
            src="../../assets/icons/arrow-right-light.svg"
          />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BlogPost from "./components/blog-post.vue";
import BlogCards from "../../shared/components/blog-cards/blog-cards.vue";
import { useStore } from "vuex";
import { ref, computed, defineComponent } from "vue";
export default defineComponent({
  name: "home",
  components: {
    "blog-post": BlogPost,
    "blog-cards": BlogCards,
  },
  setup() {
    // state management
    const store = useStore();

    const user = computed(() => store.getters["users/user"]);
    const blogPostsFeed = computed(() => store.getters["posts/blogPostsFeed"]);
    const blogPostsCards = computed(
      () => store.getters["posts/blogPostsCards"]
    );

    // variables
    const welcomeScreen = ref({
      title: "Welcome!",
      blogPost:
        "Weekly blog articles with all things programming including HTML, CSS, JavaScript and more. Register today to never miss a post!",
      welcomeScreen: true,
      photo: "coding",
    } as any);

    return {
      user,
      blogPostsFeed,
      blogPostsCards,
      welcomeScreen,
    };
  },
});
</script>

<style lang="scss" src="./home.scss"></style>
