// src/features/profile/hooks/useMyPosts.ts

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { profileApi } from '@/features/profile/api/profile.api';
import { mapPostDtosToPosts } from '@/features/post/mappers/post.mapper';
import { tokenStorage } from '@/lib/auth/token-storage';
import { queryKeys } from '@/lib/query-keys';
import type { FeedPagination } from '@/features/feed/types/feed.types';
import type { Post } from '@/types/entities/post';

type UseMyPostsParams = Readonly<{
  token: string | null | undefined;
  page?: number;
  limit?: number;
}>;

export type MyPostsQueryData = Readonly<{
  posts: Post[];
  pagination: FeedPagination;
}>;

const DEFAULT_MY_POSTS_PAGE = 1;
const DEFAULT_MY_POSTS_LIMIT = 20;

const shouldClearTokenOnMyPostsError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  return error.response?.status === 401;
};

export const useMyPosts = ({
  token,
  page = DEFAULT_MY_POSTS_PAGE,
  limit = DEFAULT_MY_POSTS_LIMIT,
}: UseMyPostsParams) => {
  return useQuery<MyPostsQueryData, Error>({
    queryKey: queryKeys.profile.myPosts(page, limit),
    queryFn: async () => {
      try {
        const response = await profileApi.getMyPosts({ page, limit });

        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to load your posts.');
        }

        return {
          posts: mapPostDtosToPosts(response.data.posts),
          pagination: {
            page: response.data.pagination.page,
            limit: response.data.pagination.limit,
            total: response.data.pagination.total,
            totalPages: response.data.pagination.totalPages,
          },
        };
      } catch (error) {
        if (shouldClearTokenOnMyPostsError(error)) {
          tokenStorage.clearToken();
        }

        throw error;
      }
    },
    enabled: Boolean(token),
    retry: false,
  });
};
