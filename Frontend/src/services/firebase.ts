// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEC3vcihwlGBeeS8V5hkuFvUSnKlTVz8s",
  authDomain: "kalendas-d01a9.firebaseapp.com",
  projectId: "kalendas-d01a9",
  storageBucket: "kalendas-d01a9.firebasestorage.app",
  messagingSenderId: "530697375664",
  appId: "1:530697375664:web:bf1aec3b2dcdd350a49075"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();