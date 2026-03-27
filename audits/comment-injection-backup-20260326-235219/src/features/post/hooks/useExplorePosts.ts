// src/features/post/hooks/useExplorePosts.ts
'use client';

import { useQuery } from '@tanstack/react-query';

import { postApi } from '@/features/post/api/post.api';
import {
  mapPostDtosToPosts,
  mapPostDtosToPreviews,
} from '@/features/post/mappers/post.mapper';
import { queryKeys } from '@/lib/query-keys';
import type { Post, PostPreview } from '@/types/entities/post';

type UseExplorePostsParams = Readonly<{
  page?: number;
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
const DEFAULT_EXPLORE_LIMIT = 20;

export const useExplorePosts = ({
  page = DEFAULT_EXPLORE_PAGE,
  limit = DEFAULT_EXPLORE_LIMIT,
}: UseExplorePostsParams = {}) => {
  return useQuery<ExplorePostsQueryData, Error>({
    queryKey: queryKeys.posts.explore(page, limit),
    queryFn: async (): Promise<ExplorePostsQueryData> => {
      const response = await postApi.getExplorePosts({ page, limit });

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
  });
};
