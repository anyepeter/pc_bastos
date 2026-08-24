'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadImage } from '@/app/actions/upload';
import { toast } from 'sonner';

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  /** Cloudinary subfolder under `church/`, e.g. 'workshops'. */
  folder?: string;
}

/**
 * Gallery picker for content types that show a slider (workshops, charity).
 * Order matters — the first image is used as the cover on listing pages — so
 * the reorder arrows are part of the interface, not a nicety.
 */
export function MultiImageUpload({
  value,
  onChange,
  disabled,
  folder = 'gallery',
}: MultiImageUploadProps) {
  const [uploadingCount, setUploadingCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploadingCount(files.length);

    try {
      const uploaded: string[] = [];

      // Sequential: Cloudinary is happier and the order stays predictable.
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const result = await uploadImage(formData);

        if (result.success && result.url) {
          uploaded.push(result.url);
        } else {
          toast.error(`${file.name}: ${result.error || 'upload failed'}`);
        }
      }

      if (uploaded.length > 0) {
        onChange([...value, ...uploaded]);
        toast.success(
          uploaded.length === 1 ? 'Image added' : `${uploaded.length} images added`
        );
      }
    } catch (error) {
      toast.error('An error occurred while uploading');
    } finally {
      setUploadingCount(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, position) => position !== index));
  };

  const moveBy = (index: number, offset: number) => {
    const target = index + offset;
    if (target < 0 || target >= value.length) return;

    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const isUploading = uploadingCount > 0;

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 group"
            >
              <Image src={url} alt="" fill className="object-cover" unoptimized />

              {index === 0 && (
                <span className="absolute left-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
                  Cover
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-1 py-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveBy(index, -1)}
                    disabled={disabled || index === 0}
                    aria-label="Move image earlier"
                    className="rounded p-1 text-white hover:bg-white/20 disabled:opacity-30"
                  >
                    <ArrowLeft className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBy(index, 1)}
                    disabled={disabled || index === value.length - 1}
                    aria-label="Move image later"
                    className="rounded p-1 text-white hover:bg-white/20 disabled:opacity-30"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  disabled={disabled}
                  aria-label="Remove image"
                  className="rounded p-1 text-white hover:bg-red-500/70"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || isUploading}
        className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6 transition-colors hover:bg-gray-100 disabled:opacity-60"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-2 text-sm text-gray-600">
              Uploading {uploadingCount} image{uploadingCount === 1 ? '' : 's'}...
            </p>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {value.length > 0 ? 'Add more images' : 'Click to upload images'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              You can select several at once — PNG, JPG, GIF up to 5MB each
            </p>
          </>
        )}
      </button>
    </div>
  );
}
