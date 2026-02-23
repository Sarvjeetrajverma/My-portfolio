import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBnl7gw4n1lXFnKnEgQA5OwvlNTk473YCI",
  authDomain: "portfolio-gallery-65de8.firebaseapp.com",
  projectId: "portfolio-gallery-65de8",
  storageBucket: "portfolio-gallery-65de8.firebasestorage.app",
  messagingSenderId: "692940632991",
  appId: "1:692940632991:web:9feb6ebc6ba67b1babc3aa"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);