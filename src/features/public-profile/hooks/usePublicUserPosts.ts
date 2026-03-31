// src/features/public-profile/hooks/usePublicUserPosts.ts

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { publicProfileApi } from '@/features/public-profile/api/public-profile.api';
import { mapPublicUserPostsPayloadToQueryData } from '@/features/public-profile/mappers/public-profile.mapper';
import type {
  PublicUserPostsApiResponseDto,
} from '@/features/public-profile/types/public-profile.dto';
import type { PublicUserPostsQueryData } from '@/features/public-profile/types/public-profile.types';
import { queryKeys } from '@/lib/query-keys';

type UsePublicUserPostsParams = Readonly<{
  username: string;
  page?: number;
  limit?: number;
}>;

const DEFAULT_PUBLIC_POSTS_PAGE = 1;
const DEFAULT_PUBLIC_POSTS_LIMIT = 20;

const getPublicUserPostsErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<PublicUserPostsApiResponseDto>(error)) {
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

  return 'Failed to load public user posts.';
};

export const usePublicUserPosts = ({
  username,
  page = DEFAULT_PUBLIC_POSTS_PAGE,
  limit = DEFAULT_PUBLIC_POSTS_LIMIT,
}: UsePublicUserPostsParams) => {
  const normalizedUsername = username.trim();

  return useQuery<PublicUserPostsQueryData, Error>({
    queryKey: queryKeys.users.publicPosts(normalizedUsername, page, limit),
    enabled: normalizedUsername.length > 0,
    retry: false,
    queryFn: async () => {
      try {
        const response = await publicProfileApi.getPublicUserPosts({
          username: normalizedUsername,
          page,
          limit,
        });

        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to load public user posts.');
        }

        return mapPublicUserPostsPayloadToQueryData(response.data);
      } catch (error) {
        throw new Error(getPublicUserPostsErrorMessage(error));
      }
    },
  });
};
