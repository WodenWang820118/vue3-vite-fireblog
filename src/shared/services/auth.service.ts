import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "../firebase/firebaseInit";
export class AuthService {
  checkUserState(): Promise<User> {
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged((user) => {
        if (user !== null) {
          resolve(user);
        } else {
          reject("No user is signed in");
        }
      });
    });
  }

  async signUserOut() {
    await signOut(auth);
    window.location.reload();
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
