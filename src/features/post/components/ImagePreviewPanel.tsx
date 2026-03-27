// src/features/post/components/ImagePreviewPanel.tsx
'use client';

import type React from 'react';
import Image from 'next/image';
import { Trash2, Upload } from 'lucide-react';
import { useId } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ImagePreviewPanelProps = Readonly<{
  previewUrl: string;
  onChangeImage: (file: File) => void;
  onRemoveImage: () => void;
  errorMessage?: string;
  accept?: string;
}>;

const ImagePreviewPanel = ({
  previewUrl,
  onChangeImage,
  onRemoveImage,
  errorMessage,
  accept = 'image/png,image/jpeg,image/jpg,image/webp',
}: ImagePreviewPanelProps) => {
  const inputId = useId();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;

    if (nextFile) {
      onChangeImage(nextFile);
    }

    event.target.value = '';
  };

  return (
    <div className='space-y-2'>
      <div
        className={cn(
          'rounded-[1.75rem] border border-border bg-card p-5',
          errorMessage && 'border-destructive'
        )}
      >
        <div className='relative aspect-square w-full overflow-hidden rounded-[1.25rem] bg-muted'>
          <Image
            src={previewUrl}
            alt='Selected post preview'
            fill
            unoptimized
            className='object-cover object-center'
            sizes='364px'
          />
        </div>

        <div className='mt-4 flex items-center gap-3'>
          <Button
            asChild
            type='button'
            variant='outline'
            size='sm'
            className='h-8 flex-1 rounded-xl border-border bg-card text-foreground hover:bg-card/90'
          >
            <label
              htmlFor={inputId}
              className='inline-flex cursor-pointer items-center justify-center gap-2'
            >
              <Upload className='size-4' strokeWidth={2.1} />
              <span>Change Image</span>
            </label>
          </Button>

          <input
            id={inputId}
            type='file'
            accept={accept}
            className='sr-only'
            onChange={handleFileChange}
          />

          <Button
            type='button'
            variant='destructive'
            size='sm'
            className='h-8 rounded-xl px-4'
            onClick={onRemoveImage}
          >
            <Trash2 className='size-4' strokeWidth={2.1} />
            <span>Delete Image</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewPanel;
