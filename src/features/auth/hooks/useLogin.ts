// src/features/auth/hooks/useLogin.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api/auth.api';
import type { LoginRequestDto } from '@/features/auth/types/auth.dto';
import { tokenStorage } from '@/lib/auth/token-storage';
import { queryKeys } from '@/lib/query-keys';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginRequestDto) => authApi.login(payload),
    onSuccess: async (response) => {
      if (!response.success || !response.data) {
        return;
      }

      tokenStorage.setToken(response.data.token);

      /**
       * auth.me must represent GET /api/me only.
       * Do not hydrate auth.me from login response,
       * even if the shape looks similar.
       */
      await queryClient.invalidateQueries({
        queryKey: queryKeys.auth.me,
      });
    },
  });
};
