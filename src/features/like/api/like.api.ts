// src/features/like/api/like.api.ts

import { api } from '@/lib/api';
import type { PostLikesApiResponseDto } from '@/features/like/types/like.dto';

type GetPostLikesParams = Readonly<{
  postId: number;
  page?: number;
  limit?: number;
}>;

const DEFAULT_POST_LIKES_PAGE = 1;
const DEFAULT_POST_LIKES_LIMIT = 20;

export const likeApi = {
  getPostLikes: async ({
    postId,
    page = DEFAULT_POST_LIKES_PAGE,
    limit = DEFAULT_POST_LIKES_LIMIT,
  }: GetPostLikesParams): Promise<PostLikesApiResponseDto> => {
    const response = await api.get<PostLikesApiResponseDto>(
      `/api/posts/${postId}/likes`,
      {
        params: {
          page,
          limit,
        },
      }
    );

    return response.data;
  },
};
