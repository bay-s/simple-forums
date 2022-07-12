// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { firebase } from '@firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import '@firebase/firestore'
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig =  {
  apiKey: "AIzaSyDx7o3pMGhWH_o9eYwphn8j1pG8iNloLQk",
  authDomain: "simpleforums-adeff.firebaseapp.com",
  projectId: "simpleforums-adeff",
  storageBucket: "simpleforums-adeff.appspot.com",
  messagingSenderId: "427407775526",
  appId: "1:427407775526:web:5497bd43351b4fc69693e7"
};
// const app = initializeApp(firebaseConfig);
// Initialize Firebase

export const secondaryApp = initializeApp(firebaseConfig, "Secondary");
export const app = initializeApp(firebaseConfig)
export const database = getFirestore(app)
export const auth = getAuth(app);
export const secondAuth = getAuth(secondaryApp);
export const storage = getStorage(app)