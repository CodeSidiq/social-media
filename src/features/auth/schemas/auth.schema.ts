// src/features/auth/schemas/auth.schema.ts

import type { RegisterRequestDto } from '@/features/auth/types/auth.dto';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required.'),

    username: z.string().trim().min(1, 'Username is required.'),

    email: z
      .string()
      .trim()
      .min(1, 'Email is required.')
      .email('Enter a valid email address.'),

    phone: z.string().trim().min(1, 'Phone number is required.'),

    password: z.string().min(6, 'Password must be at least 6 characters long.'),

    confirmPassword: z.string().min(1, 'Confirm password is required.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const toRegisterRequestDto = ({
  name,
  username,
  email,
  phone,
  password,
}: RegisterFormValues): RegisterRequestDto => {
  return {
    name,
    username,
    email,
    phone,
    password,
  };
};
