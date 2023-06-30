import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD8juzMG5SHWzDBWJ6MgMsg-VJbjICgm58",
  authDomain: "webcarros-2c247.firebaseapp.com",
  projectId: "webcarros-2c247",
  storageBucket: "webcarros-2c247.appspot.com",
  messagingSenderId: "260925520104",
  appId: "1:260925520104:web:eb1f61121f023b53f4715d",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
export { db, auth, storage };
