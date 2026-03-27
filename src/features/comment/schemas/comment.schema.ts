// src/features/comment/schemas/comment.schema.ts

import { z } from 'zod';

export const createCommentSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Comment cannot be empty.')
    .max(1000, 'Comment is too long.'),
});

export type CreateCommentFormValues = z.infer<typeof createCommentSchema>;
