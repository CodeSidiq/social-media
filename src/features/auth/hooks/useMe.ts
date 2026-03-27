// src/features/auth/hooks/useMe.ts

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { authApi } from '@/features/auth/api/auth.api';
import { tokenStorage } from '@/lib/auth/token-storage';
import { queryKeys } from '@/lib/query-keys';

const shouldClearTokenOnMeError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;

  return status === 401;
};

export const useMe = (token: string | null | undefined) => {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      try {
        const response = await authApi.getMe();

        if (!response.success || !response.data) {
          throw new Error(
            response.message || 'Failed to load authenticated user.'
          );
        }

        return response;
      } catch (error) {
        if (shouldClearTokenOnMeError(error)) {
          tokenStorage.clearToken();
        }

        throw error;
      }
    },
    enabled: Boolean(token),
    retry: false,
  });
};
