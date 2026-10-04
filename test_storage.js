import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
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
const storage = getStorage(app);

async function run() {
  try {
    const storageRef = ref(storage, "test_upload.txt");
    await uploadString(storageRef, "Hello World");
    const url = await getDownloadURL(storageRef);
    console.log("Upload successful! URL:", url);
  } catch (err) {
    console.error("Storage Error:", err.message);
  }
  process.exit(0);
}
run();
