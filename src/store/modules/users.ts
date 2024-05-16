interface User {
  user: any;
  profileEmail: string;
  profileFirstName: string;
  profileLastName: string;
  profileUsername: string;
  profileId: string;
  profileInitials: string;
}

const state: User = {
  user: "",
  profileEmail: "",
  profileFirstName: "",
  profileLastName: "",
  profileUsername: "",
  profileId: "",
  profileInitials: "",
};

const getters = {
  user: (state: User) => state.user,
  profileEmail(state: User) {
    return state.profileEmail;
  },
  profileFirstName(state: User) {
    return state.profileFirstName;
  },
  profileLastName(state: User) {
    return state.profileLastName;
  },
  profileUsername(state: User) {
    return state.profileUsername;
  },
  profileInitials(state: User) {
    return state.profileInitials;
  },
  profileId(state: User) {
    return state.profileId;
  },
};

const actions = {
  // @ts-ignore
  async getCurrentUser({ commit }) {
    // const dataBase = await db
    //   .collection("users")
    //   .doc(firebase.auth().currentUser.uid);
    // await dataBase
    //   .get()
    //   .then((user) => {
    //     if (user.exists) {
    //       // console.log(`The user is: ${user.data()}`)
    //       // console.log(`The uid: ${user.data().uid}`)
    //       // console.log(`The email: ${user.data().email}`)
    //       // console.log(`The first name: ${user.data().firstName}`)
    //       // console.log(`The last name: ${user.data().lastName}`)
    //       // console.log(`The username: ${user.data().username}`)
    //       commit("setProfileInfo", user);
    //       commit("setProfileInitials", user);
    //     } else {
    //       console.log("No such user");
    //     }
    //   })
    //   .catch((error) => {
    //     console.log("Error getting document:", error);
    //   });
  },
  // @ts-ignore
  async mountUser({ commit }, user: User) {
    commit("setUser", user);
  },
  // update the each user file when needed
  // will commit and mutate the state
  // @ts-ignore
  async updFirstName({ commit }, firstName: string) {
    // console.log("[Retrieve the new first name]: " + firstName);
    // const dataBase = await db.collection("users").doc(state.profileId);
    // await dataBase.update({
    //   firstName: firstName,
    // });
    // console.log("[Successfully update the first name in firestore]");
    // commit("setFirstName", firstName);
  },
  // @ts-ignore
  async updLastName({ commit }, lastName: string) {
    // console.log("[Retrieve the new last name]: " + lastName);
    // const dataBase = await db.collection("users").doc(state.profileId);
    // await dataBase.update({
    //   lastName: lastName,
    // });
    // console.log("[Successfully update the last name in firestore]");
    // commit("setLastName", lastName);
  },
  // @ts-ignore
  async updUsername({ commit }, username: string) {
    // console.log("[Retrieve the new username]: " + username);
    // const dataBase = await db.collection("users").doc(state.profileId);
    // await dataBase.update({
    //   username: username,
    // });
    // console.log("[Successfully update the username in firestore]");
    // commit("setUsername", username);
  },
};

const mutations = {
  // @ts-ignore
  setProfileInfo(state: User, response) {
    state.profileId = response.data().uid;
    state.profileEmail = response.data().email;
    state.profileFirstName = response.data().firstName;
    state.profileLastName = response.data().lastName;
    state.profileUsername = response.data().username;
  },
  // TODO: the current initials would grab
  setProfileInitials(state: User) {
    // state.profileInitials =
    //   state.profileFirstName.match(/(\b\S)?/g).join("") +
    //   state.profileLastName.match(/(\b\S)?/g).join("")
    // much better just use the first letter
    state.profileInitials =
      state.profileFirstName[0] + state.profileLastName[0];
  },
  setUser(state: User, payload: any) {
    state.user = payload;
  },
  setFirstName(state: User, payload: string) {
    state.profileFirstName = payload;
  },
  setLastName(state: User, payload: string) {
    state.profileLastName = payload;
  },
  setUsername(state: User, payload: string) {
    state.profileUsername = payload;
  },
};

export default {
  namespaced: true, // for using the multiple modules together
  state,
  getters,
  actions,
  mutations,
};
