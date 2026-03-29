// src/features/comment/api/comment.api.ts

import { api } from '@/lib/api';
import { tokenStorage } from '@/lib/auth/token-storage';

import type {
  CreateCommentApiResponseDto,
  CreateCommentPayload,
  DeleteCommentApiResponseDto,
  GetPostCommentsApiResponseDto,
} from '@/features/comment/types/comment.types';

export type GetPostCommentsParams = Readonly<{
  postId: number;
  page?: number;
  limit?: number;
}>;

export const commentApi = {
  getPostComments: async ({
    postId,
    page = 1,
    limit = 10,
  }: GetPostCommentsParams): Promise<GetPostCommentsApiResponseDto> => {
    const response = await api.get<GetPostCommentsApiResponseDto>(
      `/api/posts/${postId}/comments`,
      {
        params: {
          page,
          limit,
        },
      }
    );

    return response.data;
  },

  createComment: async (
    postId: number,
    payload: CreateCommentPayload
  ): Promise<CreateCommentApiResponseDto> => {
    const token = tokenStorage.getToken();

    const response = await api.post<CreateCommentApiResponseDto>(
      `/api/posts/${postId}/comments`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    return response.data;
  },

  deleteComment: async (commentId: number): Promise<DeleteCommentApiResponseDto> => {
    const response = await api.delete<DeleteCommentApiResponseDto>(
      `/api/comments/${commentId}`
    );

    return response.data;
  },
};
