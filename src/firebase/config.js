import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnVYw-r431DqQxoRiJmT8wu0OX9UpHg1k",
  authDomain: "car-showroom-1275a.firebaseapp.com",
  projectId: "car-showroom-1275a",
  storageBucket: "car-showroom-1275a.firebasestorage.app",
  messagingSenderId: "547363925354",
  appId: "1:547363925354:web:e7aedaadfb6d76fb87c913",
  measurementId: "G-MFFZ4BHEFR",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

export const db = getFirestore(app);
export default app;