import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDPiWCYU7j3mSdR5GtMRrjEg-lQX_s-sxk",
  authDomain: "bniexcellent-18e66.firebaseapp.com",
  projectId: "bniexcellent-18e66",
  storageBucket: "bniexcellent-18e66.firebasestorage.app",
  messagingSenderId: "943260586723",
  appId: "1:943260586723:web:9ec535710b7cde89042bd6",
  measurementId: "G-VFEPYMZW9V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
