import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB9D51M_e4XkvBSoyFZPc8hTaKCTbgqBjk",
  authDomain: "vuejs3-fireblog.firebaseapp.com",
  projectId: "vuejs3-fireblog",
  storageBucket: "vuejs3-fireblog.appspot.com",
  messagingSenderId: "954680780309",
  appId: "1:954680780309:web:147f187f86f99dc590901c",
};

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);
const bucket = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);

export { firebaseApp, firestore, bucket, auth };
