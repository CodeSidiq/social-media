// src/features/public-profile/hooks/usePublicProfile.ts

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { publicProfileApi } from '@/features/public-profile/api/public-profile.api';
import { mapPublicProfilePayloadToViewModel } from '@/features/public-profile/mappers/public-profile.mapper';
import type {
  PublicProfileApiResponseDto,
} from '@/features/public-profile/types/public-profile.dto';
import type { PublicProfileViewModel } from '@/features/public-profile/types/public-profile.types';
import { queryKeys } from '@/lib/query-keys';

const getPublicProfileErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<PublicProfileApiResponseDto>(error)) {
    const responseData = error.response?.data;

    if (responseData?.message) {
      return responseData.message;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Failed to load public profile.';
};

export const usePublicProfile = (username: string) => {
  const normalizedUsername = username.trim();

  return useQuery<PublicProfileViewModel, Error>({
    queryKey: queryKeys.users.publicProfile(normalizedUsername),
    enabled: normalizedUsername.length > 0,
    retry: false,
    queryFn: async () => {
      try {
        const response = await publicProfileApi.getPublicProfile(normalizedUsername);

        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to load public profile.');
        }

        return mapPublicProfilePayloadToViewModel(response.data);
      } catch (error) {
        throw new Error(getPublicProfileErrorMessage(error));
      }
    },
  });
};
