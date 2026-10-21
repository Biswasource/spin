import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMHtFzECfdQ7Oe8JVxLVRXQ6Cb9tBquvQ",
  authDomain: "spintechsolution-19dae.firebaseapp.com",
  projectId: "spintechsolution-19dae",
  storageBucket: "spintechsolution-19dae.firebasestorage.app",
  messagingSenderId: "1004243430138",
  appId: "1:1004243430138:web:5ae23b6a5b014daffc7743",
  measurementId: "G-LREX91TLTY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, db, auth, storage, googleProvider };
