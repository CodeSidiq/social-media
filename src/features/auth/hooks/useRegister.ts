// src/features/auth/hooks/useRegister.ts

import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/auth.api';
import type { RegisterRequestDto } from '@/features/auth/types/auth.dto';

export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: RegisterRequestDto) => authApi.register(payload),
  });
};
