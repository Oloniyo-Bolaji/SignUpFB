// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyBNv9SXyE6FB0D57IGEXWdBFRqCXQRWqDQ",
  authDomain: "signup-fa0a9.firebaseapp.com",
  projectId: "signup-fa0a9",
  storageBucket: "signup-fa0a9.firebasestorage.app",
  messagingSenderId: "69530988877",
  appId: "1:69530988877:web:3c099ae75e7f88aff54704",
  measurementId: "G-BVL72DSCMZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();