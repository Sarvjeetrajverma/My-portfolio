import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import fs from "fs";

const envStr = fs.readFileSync(".env.local", "utf8");
const env = {};
envStr.split("\n").forEach(line => {
  const [key, val] = line.split("=");
  if (key && val) env[key.trim()] = val.trim();
});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  databaseURL: env.VITE_FIREBASE_DATABASE_URL
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  try {
    console.log("Fetching projects...");
    const projSnapshot = await getDocs(collection(db, "projects"));
    console.log("Projects found:", projSnapshot.size);
    
    console.log("Fetching experiences...");
    const expSnapshot = await getDocs(collection(db, "experiences"));
    console.log("Experiences found:", expSnapshot.size);
    
    console.log("Fetching blogs...");
    const q = query(collection(db, 'blogs'), where('published', '==', true));
    const blogSnapshot = await getDocs(q);
    console.log("Blogs found:", blogSnapshot.size);
    
  } catch (err) {
    console.error("Error connecting to Firebase:", err.message);
  }
  process.exit(0);
}
run();
