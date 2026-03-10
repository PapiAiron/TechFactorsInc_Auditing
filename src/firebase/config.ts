import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDNrm6lLK4c_USMKt7B0A8-CnImwbg0NhU",
  authDomain: "techfactorsincauditing.firebaseapp.com",
  projectId: "techfactorsincauditing",
  storageBucket: "techfactorsincauditing.firebasestorage.app",
  messagingSenderId: "111965414995",
  appId: "1:111965414995:web:a439e18eff1c59444108a6",
  measurementId: "G-EN1CHJ886Q"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
