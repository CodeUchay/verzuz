import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBo1O45aU8u_dBgfgMTOvsXjYnQ6pQhrZE",
  authDomain: "verzuz-983b2.firebaseapp.com",
  projectId: "verzuz-983b2",
  storageBucket: "verzuz-983b2.appspot.com",
  messagingSenderId: "692406426431",
  appId: "1:692406426431:web:81f5ea7d3742a1c24ed18a"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);