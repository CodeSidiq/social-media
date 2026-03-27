// src/features/auth/hooks/useLogout.ts

'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { tokenStorage } from '@/lib/auth/token-storage';
import { queryKeys } from '@/lib/query-keys';

type UseLogoutReturn = {
  isLoggingOut: boolean;
  logout: () => void;
};

export const useLogout = (): UseLogoutReturn => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = () => {
    setIsLoggingOut(true);

    tokenStorage.clearToken();

    queryClient.removeQueries({
      queryKey: queryKeys.auth.all,
    });

    // 🔥 redirect ke public surface, bukan login
    router.replace('/');
  };

  return {
    isLoggingOut,
    logout,
  };
};
