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
  try {
    console.log('Attempting to create user with email:', email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User created successfully:', userCredential.user.uid);
    
    // Create user document in Firestore
    try {
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        createdAt: serverTimestamp(),
        admin: false, // Set to true for admin users manually or via cloud function
      });
      console.log('User document created in Firestore');
    } catch (firestoreError: any) {
      console.error('Error creating user document in Firestore:', firestoreError);
      // Don't throw - user is created in Auth, document creation is secondary
      // If permission denied, we'll handle it gracefully
      if (firestoreError?.code === 'permission-denied') {
        console.warn('Firestore permission denied for user document creation. User is still created in Auth.');
      }
    }
    
    return userCredential.user;
  } catch (error: any) {
    console.error('Sign up error:', error);
    const errorCode = error?.code || 'unknown';
    const errorMessage = error?.message || 'Unknown error';
    
    // Provide more specific error messages
    if (errorCode === 'auth/email-already-in-use') {
      throw new Error('This email is already registered. Please sign in instead.');
    } else if (errorCode === 'auth/invalid-email') {
      throw new Error('Invalid email address. Please check your email format.');
    } else if (errorCode === 'auth/weak-password') {
      throw new Error('Password is too weak. Please use at least 6 characters.');
    } else if (errorCode === 'auth/operation-not-allowed') {
      throw new Error('Email/Password authentication is not enabled. Please enable it in Firebase Console.');
    } else if (errorCode === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error(`Failed to create account: ${errorMessage} (Code: ${errorCode})`);
    }
  }
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

