// src/features/profile/schemas/edit-profile.schema.ts

import { z } from 'zod';

const MAX_AVATAR_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_AVATAR_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
]);

export const editProfileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  username: z.string().trim().min(1, 'Username is required.'),
  phone: z.string().trim().min(1, 'Phone number is required.'),
  bio: z
    .string()
    .trim()
    .max(280, 'Bio must be 280 characters or less.'),
  avatar: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_AVATAR_FILE_SIZE_BYTES,
      'Avatar must be 5MB or smaller.'
    )
    .refine(
      (file) => !file || ACCEPTED_AVATAR_TYPES.has(file.type),
      'Avatar must be PNG, JPG, or WEBP.'
    ),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
