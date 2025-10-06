// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, updateProfile } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVvGZeqw6JxY7hOCRN567W4HVwZ_02hfc",
  authDomain: "booker-9c195.firebaseapp.com",
  projectId: "booker-9c195",
  storageBucket: "booker-9c195.firebasestorage.app",
  messagingSenderId: "909714092781",
  appId: "1:909714092781:web:5b37c9af7c14706dc912e4",
  measurementId: "G-9M27PLKLTJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();
