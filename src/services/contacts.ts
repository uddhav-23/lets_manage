import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Contact {
  id?: string;
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  submittedAt: number;
}

// Submit a contact form
export const submitContact = async (data: {
  fullName: string;
  email: string;
  mobile: string;
  city: string;
}): Promise<string> => {
  try {
    console.log('Submitting contact:', data);
    const docRef = await addDoc(collection(db, "contacts"), {
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      city: data.city,
      submittedAt: Date.now(),
    });
    console.log('Contact submitted successfully:', docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error('Error submitting contact:', error);
    const errorCode = error?.code || 'unknown';
    const errorMessage = error?.message || 'Unknown error';
    
    if (errorCode === 'permission-denied') {
      throw new Error('Permission denied. Please check Firestore security rules.');
    } else if (errorCode === 'unavailable') {
      throw new Error('Service temporarily unavailable. Please try again later.');
    } else {
      throw new Error(`Failed to submit contact: ${errorMessage}`);
    }
  }
};

// Get all contacts (admin only)
export const getAllContacts = async (): Promise<Contact[]> => {
  try {
    const q = query(collection(db, "contacts"), orderBy("submittedAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      _id: doc.id, // For compatibility
    })) as Contact[];
  } catch (error: any) {
    console.error('Error fetching contacts:', error);
    // If orderBy fails due to missing index, try without orderBy
    if (error?.code === 'failed-precondition') {
      const querySnapshot = await getDocs(collection(db, "contacts"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        _id: doc.id,
      })) as Contact[];
    }
    throw error;
  }
};

