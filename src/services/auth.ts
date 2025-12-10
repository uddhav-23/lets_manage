import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

// Sign up with email and password
export const signUp = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Create user document in Firestore
  await setDoc(doc(db, "users", userCredential.user.uid), {
    email: userCredential.user.email,
    createdAt: serverTimestamp(),
    admin: false, // Set to true for admin users manually or via cloud function
  });
  
  return userCredential.user;
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Sign out
export const signOut = async () => {
  await firebaseSignOut(auth);
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Check if user is admin
export const isAdmin = async (userId: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data().admin === true;
    }
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Send password reset email
export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

