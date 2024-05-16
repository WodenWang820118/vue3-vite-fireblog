<!-- the third part of the website for users to login -->
<template>
  <div class="form-wrap">
    <form class="login">
      <p class="login-register">
        Don't have an account?
        <router-link class="router-link" :to="{ name: 'Register' }"
          >Register</router-link
        >
      </p>
      <h2>Login to FireBlogs</h2>
      <div class="inputs">
        <div class="input">
          <input type="text" placeholder="Email" v-model="email" />
          <img class="icon" src="../../assets/Icons/envelope-regular.svg" alt="" />
        </div>
        <div class="input">
          <input type="password" placeholder="Password" v-model="password" />
          <img class="icon" src="../../assets/Icons/lock-alt-solid.svg" alt="" />
        </div>
        <div class="error" v-show="error">{{ errorMsg }}</div>
      </div>
      <router-link class="forgot-password" :to="{ name: 'ForgotPassword' }">
        Forgot your password?
      </router-link>
      <button @click.prevent="signIn">Sign In</button>
      <div class="angle"></div>
    </form>
    <div class="background"></div>
  </div>
</template>

<script lang="ts">
import { auth } from "../../shared/firebase/firebaseInit";
import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Login",
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref(false);
    const errorMsg = ref('');

    return {
      email,
      password,
      error,
      errorMsg,
    };
  },
  methods: {
    signIn() {
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential: UserCredential) => {
          this.$router.push({ name: "Home" });
          this.error = false;
          this.errorMsg = "";
          this.email = "";
          this.password = "";
        })
        .catch((err) => {
          this.error = true;
          this.errorMsg = err.message;
          console.log(this.errorMsg);
        });
    },
  },
});
</script>

<style lang="scss" src="./login.scss"></style>
