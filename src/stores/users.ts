import { doc, getDoc } from "firebase/firestore";
import { defineStore } from "pinia";
import { ref } from "vue";
import { firestore } from "../shared/firebase/firebaseInit";

export const useUserStore = defineStore(
  "users",
  () => {
    // states
    const user = ref(null);
    const profileEmail = ref("");
    const profileFirstName = ref("");
    const profileLastName = ref("");
    const profileUsername = ref("");
    const profileId = ref("");
    const profileInitials = ref("");

    // actions
    async function getProfileInfo(userUid: string) {
      if (!userUid) return;

      const docRef = doc(firestore, "users", userUid);
      const document = await getDoc(docRef);
      if (!document.exists()) return;

      setProfileId(document.data().uid);
      setProfileEmail(document.data().email);
      setFirstName(document.data().firstName);
      setLastName(document.data().lastName);
      setUsername(document.data().username);
    }

    // mutations
    function setProfileId(payload: string) {
      profileId.value = payload;
    }

    function setProfileEmail(payload: string) {
      profileEmail.value = payload;
    }

    function setProfileInitials() {
      profileInitials.value =
        profileFirstName.value[0] + profileLastName.value[0];
    }

    function setUser(payload: any) {
      user.value = payload;
    }

    function setFirstName(payload: string) {
      profileFirstName.value = payload;
    }

    function setLastName(payload: string) {
      profileLastName.value = payload;
    }

    function setUsername(payload: string) {
      profileUsername.value = payload;
    }

    return {
      user,
      profileEmail,
      profileFirstName,
      profileLastName,
      profileUsername,
      profileId,
      profileInitials,
      getProfileInfo,
      setProfileInitials,
      setUser,
      setFirstName,
      setLastName,
      setUsername,
    };
  },
  {
    persist: {
      storage: sessionStorage,
    },
  }
);
