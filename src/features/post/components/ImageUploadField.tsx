// src/features/post/components/ImageUploadField.tsx
'use client';

import type React from 'react';

import { Upload } from 'lucide-react';
import { useId } from 'react';

import { cn } from '@/lib/utils';

type ImageUploadFieldProps = Readonly<{
  onSelectFile: (file: File) => void;
  errorMessage?: string;
}>;

const ImageUploadField = ({
  onSelectFile,
  errorMessage,
}: ImageUploadFieldProps) => {
  const inputId = useId();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;

    if (nextFile) {
      onSelectFile(nextFile);
    }

    event.target.value = '';
  };

  return (
    <div className='space-y-2'>
      <label
        htmlFor={inputId}
        className={cn(
          'flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-border bg-card px-6 text-center transition-colors',
          'hover:bg-card/90',
          errorMessage && 'ring-1 ring-destructive'
        )}
      >
        <span className='mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground'>
          <Upload className='size-5' strokeWidth={2.1} />
        </span>

        <div className='flex flex-wrap items-center justify-center gap-1 text-sm leading-6'>
          <span className='font-semibold text-primary'>Click to upload</span>
          <span className='text-muted-foreground'>or drag and drop</span>
        </div>

        <span className='mt-1 text-xs leading-5 text-muted-foreground'>
          PNG or JPG (max. 5mb)
        </span>
      </label>

      <input
        id={inputId}
        type='file'
        accept='image/png,image/jpeg,image/jpg,image/webp'
        className='hidden'
        onChange={handleChange}
      />
    </div>
  );
};

export default ImageUploadField;
