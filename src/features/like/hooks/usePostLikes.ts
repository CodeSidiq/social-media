// src/features/like/hooks/usePostLikes.ts

import { useQuery } from '@tanstack/react-query';

import type { FeedPagination } from '@/features/feed/types/feed.types';
import { likeApi } from '@/features/like/api/like.api';
import { mapLikeUserDtosToShell } from '@/features/like/mappers/like.mapper';
import type { LikeUserShellItem } from '@/features/like/types/like-shell.types';
import { queryKeys } from '@/lib/query-keys';

type UsePostLikesParams = Readonly<{
  postId: number | null | undefined;
  page?: number;
  limit?: number;
}>;

export type PostLikesQueryData = Readonly<{
  users: LikeUserShellItem[];
  pagination: FeedPagination;
}>;

const DEFAULT_POST_LIKES_PAGE = 1;
const DEFAULT_POST_LIKES_LIMIT = 20;

const normalizePositiveInteger = (
  value: number | undefined,
  fallbackValue: number
): number => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
    return fallbackValue;
  }

  return value;
};

export const usePostLikes = ({
  postId,
  page = DEFAULT_POST_LIKES_PAGE,
  limit = DEFAULT_POST_LIKES_LIMIT,
}: UsePostLikesParams) => {
  const normalizedPage = normalizePositiveInteger(page, DEFAULT_POST_LIKES_PAGE);
  const normalizedLimit = normalizePositiveInteger(
    limit,
    DEFAULT_POST_LIKES_LIMIT
  );
  const hasValidPostId = typeof postId === 'number' && postId > 0;

  return useQuery<PostLikesQueryData, Error>({
    queryKey: queryKeys.posts.likes(
      hasValidPostId ? postId : 'unknown',
      normalizedPage,
      normalizedLimit
    ),
    enabled: hasValidPostId,
    queryFn: async () => {
      if (!hasValidPostId || typeof postId !== 'number') {
        throw new Error('Post id is required to load likes.');
      }

      const response = await likeApi.getPostLikes({
        postId,
        page: normalizedPage,
        limit: normalizedLimit,
      });

      if (!response.data) {
        throw new Error('Failed to load post likes.');
      }

      const { users, pagination } = response.data;

      return {
        users: mapLikeUserDtosToShell(users),
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          totalPages: pagination.totalPages,
        },
      };
    },
  });
};
