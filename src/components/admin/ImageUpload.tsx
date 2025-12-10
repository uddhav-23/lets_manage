import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { generateUploadUrl as generateProjectUploadUrl, getImageUrl as getProjectImageUrl } from "../../services/projects";
import { generateUploadUrl as generateClientUploadUrl, getImageUrl as getClientImageUrl } from "../../services/clients";

interface ImageUploadProps {
  onImageUploaded: (imageId: string) => void;
  currentImageId?: string;
  folder: "projects" | "clients";
}

export default function ImageUpload({ onImageUploaded, currentImageId, folder }: ImageUploadProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processingRef = useRef(false);

  useEffect(() => {
    if (currentImageId && !preview) {
      const loadPreview = async () => {
        try {
          const url = folder === "projects" 
            ? await getProjectImageUrl(currentImageId)
            : await getClientImageUrl(currentImageId);
          setPreview(url);
        } catch (error) {
          console.error("Error loading preview:", error);
        }
      };
      loadPreview();
    }
  }, [currentImageId, folder, preview]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (!file) return;

    // Check if user is authenticated
    if (!user) {
      toast.error('You must be logged in to upload images. Please log in again.');
      return;
    }

    // Prevent multiple simultaneous uploads
    if (processingRef.current || uploading) {
      toast.warning('Please wait for the current upload to complete');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    processingRef.current = true;
    setUploading(true);
    
    let objectUrl: string | null = null;

    try {
      toast.info('Processing image...');
      
      // Create canvas for image cropping/resizing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: false });
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';

      // Create promise to handle image loading with timeout
      await Promise.race([
        new Promise<void>((resolve, reject) => {
          img.onload = () => {
            try {
              // Set target dimensions (450x350 as specified)
              const targetWidth = 450;
              const targetHeight = 350;
              
              canvas.width = targetWidth;
              canvas.height = targetHeight;

              // Calculate scaling to maintain aspect ratio
              const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
              const scaledWidth = img.width * scale;
              const scaledHeight = img.height * scale;
              
              // Center the image
              const x = (targetWidth - scaledWidth) / 2;
              const y = (targetHeight - scaledHeight) / 2;

              // Fill background with white
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, targetWidth, targetHeight);
              
              // Draw the scaled image
              ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
              resolve();
            } catch (error) {
              reject(error);
            }
          };

          img.onerror = () => {
            reject(new Error('Failed to load image'));
          };

          objectUrl = URL.createObjectURL(file);
          img.src = objectUrl;
        }),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Image processing timeout')), 10000);
        })
      ]);

      // Convert canvas to blob with lower quality for faster upload
      const blob = await Promise.race([
        new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to convert canvas to blob'));
              }
            },
            'image/jpeg',
            0.6 // Further reduced quality for faster upload
          );
        }),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Blob conversion timeout')), 5000);
        })
      ]);

      // Convert blob to File for Firebase Storage
      const processedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      
      console.log('Processed file size:', processedFile.size, 'bytes');
      
      // Upload to Firebase Storage with timeout
      toast.info('Uploading image...');
      const uploadFunction = folder === "projects" ? generateProjectUploadUrl : generateClientUploadUrl;
      const storagePath = await Promise.race([
        uploadFunction(processedFile),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Upload timeout - please check your connection')), 30000);
        })
      ]);
      
      // Call the callback
      onImageUploaded(storagePath);
      
      // Set preview from blob (clean up old preview if it was a blob URL)
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
      const previewUrl = URL.createObjectURL(blob);
      setPreview(previewUrl);
      
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorCode = error?.code || 'unknown';
      const errorMessage = error?.message || 'Unknown error';
      
      if (errorCode === 'storage/unauthorized' || errorCode === 'permission-denied' || errorMessage.includes('permission')) {
        toast.error('Permission denied. Make sure you are logged in and Storage rules are deployed. Check browser console for details.');
        console.error('Storage Rules Check:', {
          authenticated: !!user,
          userId: user?.uid,
          errorCode,
          errorMessage
        });
      } else if (errorCode === 'storage/quota-exceeded') {
        toast.error('Storage quota exceeded. Please check your Firebase plan.');
      } else if (errorMessage.includes('timeout') || errorMessage.includes('network') || errorMessage.includes('fetch')) {
        toast.error('Network error. Please check your connection and try again.');
      } else if (errorCode === 'storage/canceled') {
        toast.error('Upload was canceled.');
      } else {
        toast.error(`Failed to upload image: ${errorMessage}`);
      }
    } finally {
      // Cleanup object URL
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      setUploading(false);
      processingRef.current = false;
    }
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
      >
        {preview ? (
          <div className="space-y-2">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-32 rounded-lg"
            />
            <p className="text-sm text-gray-600">Click to change image</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl text-gray-400">📷</div>
            <p className="text-gray-600">Click to upload image</p>
            <p className="text-sm text-gray-500">Will be resized to 450x350px</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {uploading && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Processing and uploading...</span>
          </div>
        </div>
      )}
    </div>
  );
}
