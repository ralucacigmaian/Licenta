import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDsLVolgcinnOftVe039_cqLoq1igAiDeQ",
  authDomain: "licenta-app-d5390.firebaseapp.com",
  projectId: "licenta-app-d5390",
  storageBucket: "licenta-app-d5390.appspot.com",
  messagingSenderId: "663433490784",
  appId: "1:663433490784:web:476ba53ad7322e8cb8ae05",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);
const realtime = getDatabase(app);

export { firebase, storage, realtime, firestore };
