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
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { db, storage } from "../lib/firebase";

export interface Project {
  id?: string;
  name: string;
  description: string;
  imageId?: string;
  imageUrl?: string;
  createdAt: number;
}

// Create a project
export const createProject = async (data: {
  name: string;
  description: string;
  imageId: string;
}): Promise<string> => {
  const docRef = await addDoc(collection(db, "projects"), {
    name: data.name,
    description: data.description,
    imageId: data.imageId,
    createdAt: Date.now(),
  });
  return docRef.id;
};

// Get all projects
export const getAllProjects = async (): Promise<Project[]> => {
  const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  
  const projects = await Promise.all(
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
  
  return projects as Project[];
};

// Update a project
export const updateProject = async (
  id: string,
  data: {
    name: string;
    description: string;
    imageId?: string;
  }
): Promise<void> => {
  const projectRef = doc(db, "projects", id);
  const updateData: any = {
    name: data.name,
    description: data.description,
  };
  
  if (data.imageId) {
    updateData.imageId = data.imageId;
  }
  
  await updateDoc(projectRef, updateData);
};

// Delete a project
export const deleteProject = async (id: string): Promise<void> => {
  // Get project to delete image if exists
  const projectRef = doc(db, "projects", id);
  const projectSnap = await getDoc(projectRef);
  
  if (projectSnap.exists()) {
    const projectData = projectSnap.data();
    
    // Delete the project document
    await deleteDoc(projectRef);
    
    // Delete the image from storage if it exists
    if (projectData.imageId) {
      try {
        const imageRef = ref(storage, projectData.imageId);
        await deleteObject(imageRef);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
  }
};

// Generate upload URL (for Firebase Storage) - Optimized for speed
export const generateUploadUrl = async (file: File): Promise<string> => {
  try {
    console.log('Starting upload, file size:', file.size, 'bytes');
    
    // Clean filename - remove special characters
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `projects/${Date.now()}_${cleanFileName}`;
    const storageRef = ref(storage, fileName);
    
    console.log('Uploading to:', fileName);
    
    // Upload with minimal metadata for speed
    await uploadBytes(storageRef, file, {
      contentType: 'image/jpeg',
    });
    
    console.log('Upload successful:', storageRef.fullPath);
    return storageRef.fullPath;
  } catch (error: any) {
    console.error('Firebase Storage upload error:', error);
    const errorCode = error?.code || 'unknown';
    const errorMessage = error?.message || 'Unknown error';
    
    if (errorCode === 'storage/unauthorized' || errorCode === 'permission-denied') {
      throw new Error('Permission denied. Make sure you are logged in and Storage rules allow uploads.');
    } else if (errorCode === 'storage/quota-exceeded') {
      throw new Error('Storage quota exceeded. Please check your Firebase plan.');
    } else if (errorCode === 'storage/canceled') {
      throw new Error('Upload was canceled.');
    } else if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
      throw new Error('Network timeout. Please check your connection and try again.');
    } else {
      throw new Error(`Upload failed: ${errorMessage}`);
    }
  }
};

// Get download URL from storage path
export const getImageUrl = async (imageId: string): Promise<string> => {
  const imageRef = ref(storage, imageId);
  return await getDownloadURL(imageRef);
};

