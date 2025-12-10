import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  orderBy 
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Subscriber {
  id?: string;
  email: string;
  subscribedAt: number;
}

// Subscribe to newsletter
export const subscribe = async (email: string): Promise<string> => {
  try {
    console.log('Subscribing email:', email);
    
    const trimmedEmail = email.trim().toLowerCase();
    
    // Check if email already exists (try with index, fallback without if needed)
    try {
      const q = query(collection(db, "subscribers"), where("email", "==", trimmedEmail));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        throw new Error("Email already subscribed");
      }
    } catch (checkError: any) {
      // If index doesn't exist, we'll just try to add and let Firestore handle duplicates
      if (checkError?.code !== 'failed-precondition') {
        throw checkError;
      }
      console.warn('Index not found, skipping duplicate check');
    }
    
    const docRef = await addDoc(collection(db, "subscribers"), {
      email: trimmedEmail,
      subscribedAt: Date.now(),
    });
    
    console.log('Subscription successful:', docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error('Error subscribing:', error);
    const errorCode = error?.code || 'unknown';
    const errorMessage = error?.message || 'Unknown error';
    
    if (errorMessage.includes("already subscribed")) {
      throw error; // Re-throw as-is
    } else if (errorCode === 'permission-denied') {
      throw new Error('Permission denied. Please check Firestore security rules.');
    } else if (errorCode === 'failed-precondition') {
      throw new Error('Database index required. Click the error link in the console to create the index.');
    } else if (errorCode === 'unavailable') {
      throw new Error('Service temporarily unavailable. Please try again later.');
    } else if (errorCode === 'already-exists') {
      throw new Error('Email already subscribed');
    } else {
      throw new Error(`Failed to subscribe: ${errorMessage}`);
    }
  }
};

// Get all subscribers (admin only)
export const getAllSubscribers = async (): Promise<Subscriber[]> => {
  try {
    const q = query(collection(db, "subscribers"), orderBy("subscribedAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Subscriber[];
  } catch (error: any) {
    console.error('Error fetching subscribers:', error);
    // If orderBy fails due to missing index, try without orderBy
    if (error?.code === 'failed-precondition') {
      const querySnapshot = await getDocs(collection(db, "subscribers"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Subscriber[];
    }
    throw error;
  }
};

