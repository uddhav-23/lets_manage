import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query, 
  orderBy
} from "firebase/firestore";
import { getDownloadURL, ref, deleteObject, uploadBytes } from "firebase/storage";
import { db, storage } from "../lib/firebase";

export interface Client {
  id?: string;
  name: string;
  designation: string;
  review: string;
  imageId?: string;
  imageUrl?: string;
  createdAt: number;
}

// Create a client
export const createClient = async (data: {
  name: string;
  designation: string;
  review: string;
  imageId: string;
}): Promise<string> => {
  const docRef = await addDoc(collection(db, "clients"), {
    name: data.name,
    designation: data.designation,
    review: data.review,
    imageId: data.imageId,
    createdAt: Date.now(),
  });
  return docRef.id;
};

// Get all clients
export const getAllClients = async (): Promise<Client[]> => {
  const q = query(collection(db, "clients"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  
  const clients = await Promise.all(
    querySnapshot.docs.map(async (docSnapshot) => {
      const data = docSnapshot.data();
      let imageUrl = null;
      
      if (data.imageId) {
        try {
          const imageRef = ref(storage, data.imageId);
          imageUrl = await getDownloadURL(imageRef);
        } catch (error) {
          console.error("Error getting image URL:", error);
        }
      }
      
      return {
        id: docSnapshot.id,
        ...data,
        imageUrl,
        _id: docSnapshot.id, // For compatibility with existing code
      };
    })
  );
  
  return clients as Client[];
};

// Update a client
export const updateClient = async (
  id: string,
  data: {
    name: string;
    designation: string;
    review: string;
    imageId?: string;
  }
): Promise<void> => {
  const clientRef = doc(db, "clients", id);
  const updateData: any = {
    name: data.name,
    designation: data.designation,
    review: data.review,
  };
  
  if (data.imageId) {
    updateData.imageId = data.imageId;
  }
  
  await updateDoc(clientRef, updateData);
};

// Delete a client
export const deleteClient = async (id: string): Promise<void> => {
  // Get client to delete image if exists
  const clientRef = doc(db, "clients", id);
  const clientSnap = await getDoc(clientRef);
  
  if (clientSnap.exists()) {
    const clientData = clientSnap.data();
    
    // Delete the client document
    await deleteDoc(clientRef);
    
    // Delete the image from storage if it exists
    if (clientData.imageId) {
      try {
        const imageRef = ref(storage, clientData.imageId);
        await deleteObject(imageRef);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
  }
};

// Generate upload URL (for Firebase Storage) - for client images - Optimized
export const generateUploadUrl = async (file: File): Promise<string> => {
  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storageRef = ref(storage, `clients/${Date.now()}_${cleanFileName}`);
    
    await uploadBytes(storageRef, file, {
      contentType: 'image/jpeg',
      cacheControl: 'public, max-age=31536000',
    });
    
    return storageRef.fullPath;
  } catch (error: any) {
    console.error('Firebase Storage upload error:', error);
    if (error?.code === 'storage/unauthorized' || error?.code === 'permission-denied') {
      throw new Error('Permission denied. Make sure you are logged in.');
    }
    throw new Error(`Upload failed: ${error?.message || 'Unknown error'}`);
  }
};

// Get download URL from storage path
export const getImageUrl = async (imageId: string): Promise<string> => {
  const imageRef = ref(storage, imageId);
  return await getDownloadURL(imageRef);
};

