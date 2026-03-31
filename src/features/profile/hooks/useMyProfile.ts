// src/features/profile/hooks/useMyProfile.ts

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { profileApi } from '@/features/profile/api/profile.api';
import { mapMyProfilePayloadToViewModel } from '@/features/profile/mappers/profile.mapper';
import { tokenStorage } from '@/lib/auth/token-storage';
import { queryKeys } from '@/lib/query-keys';

const PROFILE_ME_STALE_TIME = 60_000;

const shouldClearTokenOnProfileError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  return error.response?.status === 401;
};

export const useMyProfile = (token: string | null | undefined) => {
  return useQuery({
    queryKey: queryKeys.profile.me,
    queryFn: async () => {
      try {
        const response = await profileApi.getMyProfile();

        console.log('[FOLLOW_DEBUG] /api/me response', response);

        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to load profile.');
        }

        return mapMyProfilePayloadToViewModel(response.data);
      } catch (error) {
        if (shouldClearTokenOnProfileError(error)) {
          tokenStorage.clearToken();
        }

        throw error;
      }
    },
    enabled: Boolean(token),
    retry: false,
    staleTime: PROFILE_ME_STALE_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
