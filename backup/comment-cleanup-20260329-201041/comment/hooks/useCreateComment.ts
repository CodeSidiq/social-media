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

type PostWithStats = {
  id: number;
  stats?: {
    commentCount: number;
  };
};

type InfinitePageWithItems = {
  items?: PostWithStats[];
  previews?: PostWithStats[];
};

type InfiniteQueryData = {
  pages?: InfinitePageWithItems[];
  pageParams?: unknown[];
};

type ListQueryData = {
  items?: PostWithStats[];
  previews?: PostWithStats[];
};

type CacheQueryData = InfiniteQueryData | ListQueryData | undefined;

const incrementPostCommentCount = <T extends PostWithStats>(post: T): T => {
  if (!post.stats) {
    return post;
  }

  return {
    ...post,
    stats: {
      ...post.stats,
      commentCount: post.stats.commentCount + 1,
    },
  };
};

const isInfiniteQueryData = (
  currentData: CacheQueryData
): currentData is InfiniteQueryData => {
  return Boolean(currentData && 'pages' in currentData);
};

const patchInfinitePages = (
  currentData: InfiniteQueryData,
  postId: number
): InfiniteQueryData => {
  return {
    ...currentData,
    pages: (currentData.pages ?? []).map((page) => {
      if (page.items) {
        return {
          ...page,
          items: page.items.map((post) =>
            post.id === postId ? incrementPostCommentCount(post) : post
          ),
        };
      }

      if (page.previews) {
        return {
          ...page,
          previews: page.previews.map((post) =>
            post.id === postId ? incrementPostCommentCount(post) : post
          ),
        };
      }

      return page;
    }),
  };
};

const patchListData = (
  currentData: ListQueryData,
  postId: number
): ListQueryData => {
  if (currentData.items) {
    return {
      ...currentData,
      items: currentData.items.map((post) =>
        post.id === postId ? incrementPostCommentCount(post) : post
      ),
    };
  }

  if (currentData.previews) {
    return {
      ...currentData,
      previews: currentData.previews.map((post) =>
        post.id === postId ? incrementPostCommentCount(post) : post
      ),
    };
  }

  return currentData;
};

const patchCommentCountInQueryData = (
  currentData: CacheQueryData,
  postId: number
): CacheQueryData => {
  if (!currentData) {
    return currentData;
  }

  if (isInfiniteQueryData(currentData)) {
    return patchInfinitePages(currentData, postId);
  }

  return patchListData(currentData, postId);
};

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
      const { postId } = variables;

      // 1. Instant UI update for timeline infinite feed
      queryClient.setQueriesData(
        { queryKey: queryKeys.feed.all },
        (currentData: CacheQueryData) =>
          patchCommentCountInQueryData(currentData, postId)
      );

      // 2. Instant UI update for explore infinite/list surfaces
      queryClient.setQueriesData(
        { queryKey: queryKeys.posts.all },
        (currentData: CacheQueryData) =>
          patchCommentCountInQueryData(currentData, postId)
      );

      // 3. Keep domain data accurate with targeted invalidation
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.posts.comments(postId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.posts.detail(postId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.feed.all,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.posts.all,
        }),
      ]);
    },
  });
};
