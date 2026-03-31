// src/features/post/api/post.api.ts

import type {
  CreatePostResponseDto,
  ExplorePostsResponseDto,
} from '@/features/post/types/post.dto';
import { api } from '@/lib/api';

type GetExplorePostsParams = Readonly<{
  page?: number;
  limit?: number;
}>;

type LikePostResponseDto = Readonly<{
  success: boolean;
  message: string;
  data: unknown;
}>;

const DEFAULT_EXPLORE_PAGE = 1;
const DEFAULT_EXPLORE_LIMIT = 20;

export const postApi = {
  getExplorePosts: async ({
    page = DEFAULT_EXPLORE_PAGE,
    limit = DEFAULT_EXPLORE_LIMIT,
  }: GetExplorePostsParams = {}) => {
    return api.get<ExplorePostsResponseDto>('/api/posts', {
      params: {
        page,
        limit,
      },
    });
  },

  createPost: async (formData: FormData) => {
    return api.post<CreatePostResponseDto>('/api/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  likePost: async (postId: number) => {
    return api.post<LikePostResponseDto>(`/api/posts/${postId}/like`);
  },

  unlikePost: async (postId: number) => {
    return api.delete<LikePostResponseDto>(`/api/posts/${postId}/like`);
  },

  /**
   * Keep detail response intentionally untyped for now.
   * Session 3A has not verified the successful 200 payload shape for post detail yet.
   */
  getPostDetail: async (postId: number) => {
    return api.get(`/api/posts/${postId}`);
  },
};
