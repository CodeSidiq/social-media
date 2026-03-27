// src/features/post/hooks/useInfiniteExplorePosts.ts

'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { postApi } from '@/features/post/api/post.api';
import {
  mapPostDtosToPosts,
  mapPostDtosToPreviews,
} from '@/features/post/mappers/post.mapper';
import { queryKeys } from '@/lib/query-keys';
import type { Post, PostPreview } from '@/types/entities/post';

type UseInfiniteExplorePostsParams = Readonly<{
  limit?: number;
}>;

type ExplorePostsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ExplorePostsQueryData = {
  posts: Post[];
  previews: PostPreview[];
  pagination: ExplorePostsPagination;
};

const DEFAULT_EXPLORE_PAGE = 1;
const DEFAULT_EXPLORE_LIMIT = 2;

export const useInfiniteExplorePosts = ({
  limit = DEFAULT_EXPLORE_LIMIT,
}: UseInfiniteExplorePostsParams = {}) => {
  return useInfiniteQuery<ExplorePostsQueryData, Error>({
    queryKey: queryKeys.posts.exploreInfinite(limit),
    initialPageParam: DEFAULT_EXPLORE_PAGE,
    queryFn: async ({ pageParam }): Promise<ExplorePostsQueryData> => {
      const currentPage =
        typeof pageParam === 'number' ? pageParam : DEFAULT_EXPLORE_PAGE;

      const response = await postApi.getExplorePosts({
        page: currentPage,
        limit,
      });

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to fetch explore posts');
      }

      const { posts, pagination } = response.data.data;

      return {
        posts: mapPostDtosToPosts(posts),
        previews: mapPostDtosToPreviews(posts, 'explore'),
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          totalPages: pagination.totalPages,
        },
      };
    },
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.pagination.page;
      const totalPages = lastPage.pagination.totalPages;

      if (currentPage < totalPages) {
        return currentPage + 1;
      }

      return undefined;
    },
  });
};
