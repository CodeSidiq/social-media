// src/features/comment/hooks/usePostComments.ts

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { commentApi } from '@/features/comment/api/comment.api';
import { mapCommentsResponseDtoToQueryData } from '@/features/comment/mappers/comment.mapper';
import type {
  GetPostCommentsApiResponseDto,
  PostCommentsQueryData,
} from '@/features/comment/types/comment.types';
import { queryKeys } from '@/lib/query-keys';

const getCommentErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<GetPostCommentsApiResponseDto>(error)) {
    const apiMessage = error.response?.data?.message;

    if (apiMessage) {
      return apiMessage;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Failed to load comments.';
};

type UsePostCommentsParams = Readonly<{
  postId: number;
  page?: number;
  limit?: number;
}>;

export const usePostComments = ({
  postId,
  page = 1,
  limit = 10,
}: UsePostCommentsParams) => {
  return useQuery<PostCommentsQueryData, Error>({
    queryKey: [...queryKeys.posts.comments(postId), page, limit] as const,
    queryFn: async () => {
      try {
        const response = await commentApi.getPostComments({
          postId,
          page,
          limit,
        });

        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to load comments.');
        }

        return mapCommentsResponseDtoToQueryData(response.data);
      } catch (error) {
        throw new Error(getCommentErrorMessage(error));
      }
    },
    staleTime: 15_000,
  });
};
