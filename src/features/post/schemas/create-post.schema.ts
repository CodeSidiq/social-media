// src/features/post/schemas/create-post.schema.ts

import { z } from 'zod';

const MAX_IMAGE_SIZE_IN_BYTES = 5 * 1024 * 1024;

const isSupportedImageFile = (value: unknown): value is File => {
  if (typeof File === 'undefined') {
    return false;
  }

  return value instanceof File;
};

export const createPostSchema = z.object({
  image: z
    .custom<File | null>(
      (value) => value === null || isSupportedImageFile(value),
      'Please choose a valid image file.'
    )
    .refine((value) => value !== null, {
      message: 'Please upload an image before sharing your post.',
    })
    .refine((value) => (value ? value.type.startsWith('image/') : true), {
      message: 'Only image files are allowed.',
    })
    .refine((value) => (value ? value.size <= MAX_IMAGE_SIZE_IN_BYTES : true), {
      message: 'Image size must be 5MB or less.',
    }),
  caption: z
    .string()
    .trim()
    .min(1, 'Caption is required.')
    .max(2200, 'Caption must be 2200 characters or less.'),
});

export type CreatePostFormValues = z.input<typeof createPostSchema>;
