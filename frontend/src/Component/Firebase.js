// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY_FIRE,
  authDomain: "pixaclone-a9042.firebaseapp.com",
  projectId: "pixaclone-a9042",
  storageBucket: "pixaclone-a9042.firebasestorage.app",
  messagingSenderId: "367957787836",
  appId: "1:367957787836:web:2cca1aced6fdd4255b3cb9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export {auth}