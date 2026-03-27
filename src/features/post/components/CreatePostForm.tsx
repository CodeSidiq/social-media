// src/features/post/components/CreatePostForm.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ImagePreviewPanel from '@/features/post/components/ImagePreviewPanel';
import ImageUploadField from '@/features/post/components/ImageUploadField';
import { useCreatePost } from '@/features/post/hooks/useCreatePost';
import { cn } from '@/lib/utils';
import {
  createPostSchema,
  type CreatePostFormValues,
} from '@/features/post/schemas/create-post.schema';

const POST_SUCCESS_TOAST_STORAGE_KEY = 'social-media-post-success-toast';
const POST_SUCCESS_TOAST_MESSAGE = 'Success Post';

const CreatePostForm = () => {
  const router = useRouter();
  const createPostMutation = useCreatePost();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      image: null,
      caption: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  const selectedImage = useWatch({
    control,
    name: 'image',
  });

  const previewUrl = useMemo(() => {
    if (!selectedImage) {
      return null;
    }

    return URL.createObjectURL(selectedImage);
  }, [selectedImage]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSelectImage = (file: File) => {
    setValue('image', file, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    clearErrors('image');
  };

  const handleRemoveImage = () => {
    setValue('image', null, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const persistSuccessToastState = () => {
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.setItem(
      POST_SUCCESS_TOAST_STORAGE_KEY,
      JSON.stringify({
        variant: 'success',
        message: POST_SUCCESS_TOAST_MESSAGE,
      })
    );
  };

  const onSubmit = async (values: CreatePostFormValues) => {
    const formData = new FormData();

    if (values.image) {
      formData.append('image', values.image);
    }

    const normalizedCaption = values.caption.trim();

    if (normalizedCaption) {
      formData.append('caption', normalizedCaption);
    }

    await createPostMutation.mutateAsync(formData);

    persistSuccessToastState();
    router.push('/timeline');
    router.refresh();
  };

  const captionField = register('caption');

  const contentWidthClass = previewUrl
    ? 'mx-auto w-full max-w-[22.75rem]'
    : 'w-full';

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className={cn('space-y-4', contentWidthClass)}>
        <div className='space-y-2'>
          <p className='text-sm font-semibold leading-5 text-foreground'>Photo</p>

          {previewUrl ? (
            <ImagePreviewPanel
              previewUrl={previewUrl}
              onChangeImage={handleSelectImage}
              onRemoveImage={handleRemoveImage}
              errorMessage={errors.image?.message}
            />
          ) : (
            <ImageUploadField
              onSelectFile={handleSelectImage}
              errorMessage={errors.image?.message}
            />
          )}

          {errors.image ? (
            <p className='text-xs text-destructive'>{errors.image.message}</p>
          ) : null}
        </div>

        <div className='space-y-2'>
          <p className='text-sm font-semibold leading-5 text-foreground'>Caption</p>

          <Textarea
            {...captionField}
            rows={3}
            resize='none'
            hasError={Boolean(errors.caption)}
            placeholder='Create your caption'
            className='h-[6.3125rem] min-h-[6.3125rem] rounded-[1.25rem] border-border bg-card px-5 py-4 text-sm leading-6 text-foreground shadow-none focus-visible:ring-0'
          />

          {errors.caption ? (
            <p className='text-xs text-destructive'>{errors.caption.message}</p>
          ) : null}
        </div>

        {createPostMutation.isError ? (
          <p className='text-xs text-destructive'>
            {createPostMutation.error instanceof Error
              ? createPostMutation.error.message
              : 'Failed to share post. Please try again.'}
          </p>
        ) : null}

        <Button
          type='submit'
          className='h-10 w-full rounded-full text-base font-semibold'
          disabled={isSubmitting || createPostMutation.isPending}
        >
          {createPostMutation.isPending ? 'Sharing...' : 'Share'}
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;
