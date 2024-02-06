// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "notifymee-107a5.firebaseapp.com",
  projectId: "notifymee-107a5",
  storageBucket: "notifymee-107a5.appspot.com",
  messagingSenderId: "515283398879",
  appId: "1:515283398879:web:5129c8f4395283bfd3796a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
