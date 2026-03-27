// src/features/comment/hooks/useDeleteComment.ts

import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { commentApi } from '@/features/comment/api/comment.api';
import type { DeleteCommentApiResponseDto } from '@/features/comment/types/comment.types';
import { queryKeys } from '@/lib/query-keys';

const getDeleteCommentErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<DeleteCommentApiResponseDto>(error)) {
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

  return 'Failed to delete comment.';
};

type DeleteCommentMutationVariables = Readonly<{
  postId: number;
  commentId: number;
}>;

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteCommentMutationVariables>({
    mutationFn: async ({ commentId }) => {
      try {
        const response = await commentApi.deleteComment(commentId);

        if (!response.success) {
          throw new Error(response.message || 'Failed to delete comment.');
        }
      } catch (error) {
        throw new Error(getDeleteCommentErrorMessage(error));
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
