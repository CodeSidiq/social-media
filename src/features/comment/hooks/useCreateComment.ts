// src/features/comment/hooks/useCreateComment.ts

import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { commentApi } from '@/features/comment/api/comment.api';
import type {
  CreateCommentApiResponseDto,
  CreateCommentPayload,
} from '@/features/comment/types/comment.types';
import { queryKeys } from '@/lib/query-keys';

const getCreateCommentErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<CreateCommentApiResponseDto>(error)) {
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

  return 'Failed to post comment.';
};

type CreateCommentMutationVariables = Readonly<{
  postId: number;
  payload: CreateCommentPayload;
}>;

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, CreateCommentMutationVariables>({
    mutationFn: async ({ postId, payload }) => {
      try {
        const response = await commentApi.createComment(postId, payload);

        if (!response.success) {
          throw new Error(response.message || 'Failed to post comment.');
        }
      } catch (error) {
        throw new Error(getCreateCommentErrorMessage(error));
      }
    },
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.posts.comments(variables.postId),
        }),


        queryClient.invalidateQueries({
          queryKey: queryKeys.posts.detail(variables.postId),
        }),
      ]);
    },
  });
};
