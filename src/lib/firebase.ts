import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBAGybplR5fSndsNhN57fKUNfijmo3wYLo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "flipr-b90a3.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "flipr-b90a3",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "flipr-b90a3.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "436595210028",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:436595210028:web:a4b291112e38f29334de89",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-1TSW3H21PM",
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

export default app;

