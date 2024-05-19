<template>
  <div class="form-wrap">
    <form class="register">
      <p class="login-register">
        Already have an account?
        <router-link class="router-link" :to="{ name: 'login' }"
          >Login</router-link
        >
      </p>
      <h2>Create Your FireBlog Account</h2>
      <div class="inputs">
        <div class="input">
          <input type="text" placeholder="First Name" v-model="firstName" />
          <img
            class="icon"
            src="../../assets/icons/user-alt-light.svg"
            alt=""
          />
        </div>
        <div class="input">
          <input type="text" placeholder="Last Name" v-model="lastName" />
          <img
            class="icon"
            src="../../assets/icons/user-alt-light.svg"
            alt=""
          />
        </div>
        <div class="input">
          <input type="text" placeholder="Username" v-model="username" />
          <img
            class="icon"
            src="../../assets/icons/user-alt-light.svg"
            alt=""
          />
        </div>
        <div class="input">
          <input type="text" placeholder="Email" v-model="email" />
          <img
            class="icon"
            src="../../assets/icons/envelope-regular.svg"
            alt=""
          />
        </div>
        <div class="input">
          <input type="password" placeholder="Password" v-model="password" />
          <img
            class="icon"
            src="../../assets/icons/lock-alt-solid.svg"
            alt=""
          />
        </div>
        <div class="error" v-show="isError">{{ errorMsg }}</div>
      </div>
      <button @click.prevent="register">Sign Up</button>
      <div class="angle"></div>
    </form>
    <div class="background"></div>
  </div>
</template>

<script lang="ts">
import { firestore } from "../../shared/firebase/firebaseInit";
import { doc, setDoc } from "firebase/firestore";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { AuthService } from "../../shared/services/auth.service";

export default defineComponent({
  name: "register",
  setup() {
    const firstName = ref("");
    const lastName = ref("");
    const username = ref("");
    const email = ref("");
    const password = ref("");
    const isError = ref(false);
    const errorMsg = ref("");
    const router = useRouter();
    const authService = new AuthService();

    async function register() {
      if (
        email.value !== "" &&
        password.value !== "" &&
        firstName.value !== "" &&
        lastName.value !== "" &&
        username.value !== ""
      ) {
        isError.value = false;
        errorMsg.value = "";
        try {
          const userCredential =
            await authService.createUserWithEmailAndPassword(
              email.value,
              password.value
            );

          await setDoc(doc(firestore, "users", userCredential.user.uid), {
            firstName: firstName.value,
            lastName: lastName.value,
            username: username.value,
            email: email.value,
          });
        } catch (error) {
          console.log(error);
        }

        router.push({ name: "home" });
        return;
      }
      isError.value = true;
      errorMsg.value = "Please fill out all the fields";
    }

    return {
      firstName,
      lastName,
      username,
      email,
      password,
      isError,
      errorMsg,
      register,
    };
  },
});
</script>

<style lang="scss" scoped>
.register {
  h2 {
    max-width: 350px;
  }
}
</style>
