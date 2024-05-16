<template>
  <div class="reset-password">
    <Modal
      v-if="modalActive"
      :modalMessage="modalMessage"
      @close-modal="closeModal"
    />
    <Loading v-if="loading" />
    <div class="form-wrap">
      <form class="reset">
        <p class="login-register">
          Back to
          <router-link class="router-link" :to="{ name: 'Login' }"
            >Login</router-link
          >
        </p>
        <h2>Reset Password</h2>
        <p>Forgot your passowrd? Enter your email to reset it</p>
        <div class="inputs">
          <div class="input">
            <input type="text" placeholder="Email" v-model="email" />
            <img
              class="icon"
              src="../../assets/Icons/envelope-regular.svg"
              alt=""
            />
          </div>
        </div>
        <button @click.prevent="resetPassword">Reset</button>
        <div class="angle"></div>
      </form>
      <div class="background"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Modal from "../../shared/components/Modal.vue";
import Loading from "../../shared/components/Loading.vue";
import { auth } from "../../shared/firebase/firebaseInit";
import { sendPasswordResetEmail } from "firebase/auth";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ForgotPassword",
  data() {
    return {
      email: "",
      modalActive: false,
      modalMessage: "",
      loading: false,
    };
  },
  components: {
    Modal,
    Loading,
  },
  methods: {
    resetPassword() {
      this.loading = true;
        sendPasswordResetEmail(auth, this.email)
        .then(() => {
          this.modalMessage =
            "If your account exists, you will receive a email";
          this.loading = false;
          this.modalActive = true; // then pop out the components/Modal.vue
        })
        .catch((err) => {
          this.modalMessage = err.message;
          this.loading = false;
          this.modalActive = true;
        });
    },
    closeModal() {
      this.modalActive = !this.modalActive;
      this.email = "";
    },
  },
});
</script>

<style lang="scss" scoped>
.reset-password {
  position: relative;
  .form-wrap {
    .reset {
      h2 {
        margin-bottom: 8px;
      }
      p {
        text-align: center;
        margin-bottom: 32px;
      }
    }
  }
}
</style>
