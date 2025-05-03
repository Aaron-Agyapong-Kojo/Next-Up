
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6vD79ondB5BtszkwugN8OuT44ixrqW6o",
  authDomain: "next-up-a7790.firebaseapp.com",
  projectId: "next-up-a7790",
  storageBucket: "bece-app-888ac.appspot.com",
  messagingSenderId: "517610048639",
  appId: "1:517610048639:web:b4d7ba1bda9249096f034a",
  measurementId: "G-PP60VBZ32G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
