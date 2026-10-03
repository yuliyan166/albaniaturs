'use client';

import React, { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onUploadComplete: (urls: string[]) => void;
  maxImages?: number;
  currentImages?: string[];
}

export default function ImageUpload({ 
  onUploadComplete, 
  maxImages = 5, 
  currentImages = [] 
}: ImageUploadProps) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>(currentImages);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [...images];

      for (let i = 0; i < files.length; i++) {
        if (uploadedUrls.length >= maxImages) break;

        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError(`File "${file.name}" is not an image`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError(`File "${file.name}" exceeds 5MB limit`);
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `listings/${fileName}`;

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from('listings')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('listings')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setImages(uploadedUrls);
      onUploadComplete(uploadedUrls);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = async (index: number) => {
    try {
      const newImages = [...images];
      const imageUrl = newImages[index];
      
      // Extract file path from URL and delete from storage
      if (imageUrl.includes('listings/')) {
        const filePath = imageUrl.split('/listings/')[1].split('?')[0];
        await supabase.storage.from('listings').remove([filePath]);
      }

      newImages.splice(index, 1);
      setImages(newImages);
      onUploadComplete(newImages);
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete image');
    }
  };

  return (
    <div className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Image preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
              <img 
                src={url} 
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                title="Remove image"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                Image {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {images.length < maxImages && (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={32} className="animate-spin text-blue-600" />
              <p className="text-gray-600 font-medium">Uploading images...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload size={32} className="text-gray-400" />
              <div>
                <p className="text-gray-700 font-medium">Click to upload images</p>
                <p className="text-sm text-gray-500 mt-1">
                  PNG, JPG up to 5MB each. Max {maxImages} images.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Remaining slots info */}
      <p className="text-sm text-gray-500 text-center">
        {images.length} of {maxImages} images uploaded
      </p>
    </div>
  );
}
