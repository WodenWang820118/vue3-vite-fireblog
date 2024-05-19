import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "../firebase/firebaseInit";
import { useRouter } from "vue-router";

export class AuthService {
  router = useRouter();
  constructor() {}

  async signUserOut() {
    await signOut(auth);
    this.router.push({ name: "home" });
  }

  async sendPasswordResetEmail(email: string) {
    await sendPasswordResetEmail(auth, email);
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  async createUserWithEmailAndPassword(email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password);
  }
}
