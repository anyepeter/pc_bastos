'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadImage } from '@/app/actions/upload';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadImage(formData);

      if (result.success && result.url) {
        onChange(result.url);
        toast.success('Image uploaded successfully');
      } else {
        toast.error(result.error || 'Failed to upload image');
      }
    } catch (error) {
      toast.error('An error occurred while uploading the image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {value ? (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
          <Image
            src={value}
            alt="Upload preview"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute top-2 right-2">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemove}
              disabled={disabled || isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              <p className="mt-2 text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-10 w-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Click to upload image
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
