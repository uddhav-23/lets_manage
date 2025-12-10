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
    
    // Validate email format
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      throw new Error('Please enter a valid email address');
    }
    
    // Try to add directly - Firestore will handle duplicates if we check after
    // First, try to check for duplicates without requiring an index
    try {
      // Get all subscribers and check manually (for small datasets this is fine)
      const allSubscribers = await getDocs(collection(db, "subscribers"));
      const existingEmail = allSubscribers.docs.find(
        doc => doc.data().email?.toLowerCase() === trimmedEmail
      );
      
      if (existingEmail) {
        throw new Error("Email already subscribed");
      }
    } catch (checkError: any) {
      // If it's our "already subscribed" error, re-throw it
      if (checkError?.message?.includes("already subscribed")) {
        throw checkError;
      }
      // For other errors in duplicate check, log but continue
      console.warn('Error checking duplicates, proceeding anyway:', checkError);
    }
    
    // Add the subscriber
    console.log('Adding subscriber to Firestore...');
    const docRef = await addDoc(collection(db, "subscribers"), {
      email: trimmedEmail,
      subscribedAt: Date.now(),
    });
    
    console.log('Subscription successful! Document ID:', docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error('Error subscribing:', error);
    const errorCode = error?.code || 'unknown';
    const errorMessage = error?.message || 'Unknown error';
    
    // Handle specific Firebase errors
    if (errorMessage.includes("already subscribed")) {
      throw new Error("Email already subscribed!");
    } else if (errorCode === 'permission-denied') {
      throw new Error('Permission denied. Please check Firestore security rules are deployed.');
    } else if (errorCode === 'unavailable') {
      throw new Error('Service temporarily unavailable. Please try again later.');
    } else if (errorCode === 'failed-precondition') {
      throw new Error('Database setup required. Please check Firestore configuration.');
    } else {
      // Show the actual error message
      throw new Error(errorMessage || 'Failed to subscribe. Please try again.');
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

