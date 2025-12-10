import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { generateUploadUrl, getImageUrl } from "../../services/projects";

interface ImageUploadProps {
  onImageUploaded: (imageId: string) => void;
  currentImageId?: string;
}

export default function ImageUpload({ onImageUploaded, currentImageId }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processingRef = useRef(false);

  useEffect(() => {
    if (currentImageId && !preview) {
      const loadPreview = async () => {
        try {
          const url = await getImageUrl(currentImageId);
          setPreview(url);
        } catch (error) {
          console.error("Error loading preview:", error);
        }
      };
      loadPreview();
    }
  }, [currentImageId]);

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
      // Create canvas for image cropping/resizing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      const img = new Image();

      // Create promise to handle image loading
      await new Promise<void>((resolve, reject) => {
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
      });

      // Convert canvas to blob with lower quality for faster upload
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert canvas to blob'));
            }
          },
          'image/jpeg',
          0.75 // Reduced quality for faster upload (was 0.9)
        );
      });

      // Convert blob to File for Firebase Storage
      const processedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      
      // Upload to Firebase Storage
      toast.info('Uploading image...');
      const storagePath = await generateUploadUrl(processedFile);
      
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
      const errorMessage = error?.message || 'Unknown error';
      if (errorMessage.includes('storage') || errorMessage.includes('permission')) {
        toast.error('Storage permission denied. Please check Firebase Storage rules.');
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        toast.error('Network error. Please check your connection and try again.');
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
