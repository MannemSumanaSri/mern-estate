// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-d4df4.firebaseapp.com",
  projectId: "mern-estate-d4df4",
  storageBucket: "mern-estate-d4df4.firebasestorage.app",
  messagingSenderId: "1056696822572",
  appId: "1:1056696822572:web:a99837b1325a1b06e8da89"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);