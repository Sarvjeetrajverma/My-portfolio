import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD0QrXuM3tlgr0W9AKKQ3GnCf9uh80seyk",
  authDomain: "my-portfolio-admin-284b8.firebaseapp.com",
  projectId: "my-portfolio-admin-284b8",
  storageBucket: "my-portfolio-admin-284b8.firebasestorage.app",
  messagingSenderId: "299228906066",
  appId: "1:299228906066:web:80956a54661317d38d558b",
  // if you have a databaseURL for rtdb, add it here or default it
};

// Initialize Firebase (prevent multiple initializations)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Keep rtdb for backward compatibility if it's used somewhere else, but handle error if databaseURL is missing
let rtdb = null;
try {
  rtdb = getDatabase(app);
} catch (e) {
  console.warn("RTDB not initialized", e);
}

export { app, auth, db, storage, rtdb };