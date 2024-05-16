<template>
  <div class="profile">
    <Modal
      v-if="modalActive"
      :modalMessage="modalMessage"
      @close-modal="closeModal"
    />
    <div class="container">
      <h2>Account Settings</h2>
      <div class="profile-info">
        <div class="initials">{{ profileInitials }}</div>
        <!-- <div class="admin-badge">
          <img class="icon" src="@/assets/Icons/user-crown-light.svg" alt="" />
          <span>admin</span>
        </div> -->
        <div class="input">
          <label for="firstName">First Name:</label>
          <!-- mutating computed property is not a good idea, although achievable -->
          <input
            disabled
            type="text"
            id="firstName"
            v-model="profileFirstName"
          />
        </div>
        <!-- separate the udpate data and computed property -->
        <div class="input">
          <label>New First Name:</label>
          <input type="text" v-model="wishedFirstName" />
        </div>
        <!-- label attribute "for" would bind the input id: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label -->
        <div class="input">
          <label for="lastName">Last Name:</label>
          <input disabled type="text" id="lastName" v-model="profileLastName" />
        </div>
        <div class="input">
          <label>New Last Name:</label>
          <input type="text" v-model="wishedLastName" />
        </div>
        <div class="input">
          <label for="username">Username:</label>
          <input disabled type="text" id="username" v-model="profileUsername" />
        </div>
        <div class="input">
          <label>New Username:</label>
          <input type="text" v-model="wishedUsername" />
        </div>
        <div class="input">
          <label for="email">Email:</label>
          <input disabled type="text" id="email" v-model="profileEmail" />
        </div>
        <button @click="updateProfile">Save Changes</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { ref, computed, defineComponent } from "vue";
import Modal from "../../shared/components/modal/modal.vue";

export default defineComponent({
  name: "profile",
  components: {
    'modal': Modal,
  },
  setup() {
    // variables
    const modalMessage = ref("Changes were saved");
    const modalActive = ref(false);
    const wishedFirstName = ref("");
    const wishedLastName = ref("");
    const wishedUsername = ref("");

    // state management
    const store = useStore();

    const updFirstName = async(firstName: string) => {
      return await store.dispatch("users/updFirstName", firstName);
    };

    const updLastName = async(lastName: string) => {
      return await store.dispatch("users/updLastName", lastName);
    };

    const updUsername = async(userName: string) => {
      return await store.dispatch("users/updUsername", userName);
    };

    // functions

    function updateProfile() {
      if (
        wishedFirstName.value.length == 0 &&
        wishedLastName.value.length == 0 &&
        wishedUsername.value.length == 0
      ) {
        alert("No field has changed");
        return;
      }

      // update the database value when necessary
      wishedFirstName.value.length > 0
        ? updFirstName(wishedFirstName.value)
        : null;
      wishedLastName.value.length > 0
        ? updLastName(wishedLastName.value)
        : null;
      wishedUsername.value.length > 0
        ? updUsername(wishedUsername.value)
        : null;

      // reset the input fields
      modalActive.value = !modalActive.value;
      wishedFirstName.value = "";
      wishedLastName.value = "";
      wishedUsername.value = "";
    }

    function closeModal() {
      modalActive.value = !modalActive.value;
    }

    // wrapped in a object according to the category
    // to be organized and return the variables, functions, and computed properties

    const storeComputed = {
      profileInitials: computed(() => store.getters["users/profileInitials"]),
      profileFirstName: computed(() => store.getters["users/profileFirstName"]),
      profileLastName: computed(() => store.getters["users/profileLastName"]),
      profileUsername: computed(() => store.getters["users/profileUsername"]),
      profileEmail: computed(() => store.getters["users/profileEmail"]),
    };

    const vars = {
      modalMessage,
      modalActive,
      wishedFirstName,
      wishedLastName,
      wishedUsername,
    };

    const funcs = {
      updFirstName,
      updLastName,
      updUsername,
      updateProfile,
      closeModal,
    };

    return {
      ...storeComputed,
      ...funcs,
      ...vars,
    };
  },
});
</script>
<style lang="scss" src="./profile.scss"></style>
