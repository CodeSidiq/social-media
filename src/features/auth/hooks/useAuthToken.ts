// src/features/auth/hooks/useAuthToken.ts

'use client';

import { useSyncExternalStore } from 'react';

import {
  AUTH_TOKEN_CHANGE_EVENT,
  tokenStorage,
} from '@/lib/auth/token-storage';

const subscribe = (onStoreChange: () => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleTokenChange = () => {
    onStoreChange();
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === 'social-media-access-token') {
      onStoreChange();
    }
  };

  window.addEventListener(AUTH_TOKEN_CHANGE_EVENT, handleTokenChange);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(AUTH_TOKEN_CHANGE_EVENT, handleTokenChange);
    window.removeEventListener('storage', handleStorage);
  };
};

export const useAuthToken = () => {
  return useSyncExternalStore(
    subscribe,
    () => tokenStorage.getToken(),
    () => undefined
  );
};
