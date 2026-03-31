// src/features/like/hooks/useToggleLike.ts

import type { InfiniteData } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import type { FeedQueryData } from '@/features/feed/types/feed.types';
import { postApi } from '@/features/post/api/post.api';
import {
  patchExploreQueryDataLike,
  patchFeedQueryDataLike,
  patchInfiniteExploreQueryDataLike,
  patchInfiniteFeedQueryDataLike,
  patchPostDetailLike,
  patchPublicUserPostsQueryDataLike,
} from '@/features/post/lib/update-post-like-cache';
import type { ExplorePostsQueryData } from '@/features/post/hooks/useExplorePosts';
import type { PublicUserPostsQueryData } from '@/features/public-profile/types/public-profile.types';
import { queryKeys } from '@/lib/query-keys';
import type { Post } from '@/types/entities/post';

type ToggleLikeVariables = Readonly<{
  postId: number;
  likedByMe: boolean;
  likeCount: number;
}>;

type LikeMutationResponseDto = Readonly<{
  success: boolean;
  message: string;
  data: unknown;
}>;

type LikeSnapshotEntry = readonly [readonly unknown[], unknown];

type ToggleLikeContext = Readonly<{
  feedSnapshots: LikeSnapshotEntry[];
  postsSnapshots: LikeSnapshotEntry[];
  userSnapshots: LikeSnapshotEntry[];
  detailSnapshot: Post | undefined;
}>;

type LikePatchParams = Readonly<{
  postId: number;
  likedByMe: boolean;
  likeCount: number;
}>;

const getToggleLikeErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<LikeMutationResponseDto>(error)) {
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

  return 'Failed to update like state.';
};

const computeNextLikeState = (
  likedByMe: boolean,
  likeCount: number
): Readonly<{
  nextLikedByMe: boolean;
  nextLikeCount: number;
}> => {
  if (likedByMe) {
    return {
      nextLikedByMe: false,
      nextLikeCount: Math.max(0, likeCount - 1),
    };
  }

  return {
    nextLikedByMe: true,
    nextLikeCount: likeCount + 1,
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isInfiniteData = <TPage>(
  value: unknown
): value is InfiniteData<TPage> => {
  return (
    isRecord(value) &&
    Array.isArray(value.pages) &&
    Array.isArray(value.pageParams)
  );
};

const isFeedQueryData = (value: unknown): value is FeedQueryData => {
  return (
    isRecord(value) &&
    Array.isArray(value.items) &&
    isRecord(value.pagination)
  );
};

const isExploreQueryData = (value: unknown): value is ExplorePostsQueryData => {
  return (
    isRecord(value) &&
    Array.isArray(value.posts) &&
    Array.isArray(value.previews) &&
    isRecord(value.pagination)
  );
};

const isPublicUserPostsQueryData = (
  value: unknown
): value is PublicUserPostsQueryData => {
  return (
    isRecord(value) &&
    Array.isArray(value.posts) &&
    isRecord(value.pagination)
  );
};

const patchFeedCacheEntry = (
  currentData: unknown,
  params: LikePatchParams
): unknown => {
  if (isInfiniteData<FeedQueryData>(currentData)) {
    return patchInfiniteFeedQueryDataLike(currentData, params) ?? currentData;
  }

  if (isFeedQueryData(currentData)) {
    return patchFeedQueryDataLike(currentData, params) ?? currentData;
  }

  return currentData;
};

const patchPostsCacheEntry = (
  currentData: unknown,
  params: LikePatchParams
): unknown => {
  if (isInfiniteData<ExplorePostsQueryData>(currentData)) {
    return patchInfiniteExploreQueryDataLike(currentData, params) ?? currentData;
  }

  if (isExploreQueryData(currentData)) {
    return patchExploreQueryDataLike(currentData, params) ?? currentData;
  }

  return currentData;
};

const patchUsersCacheEntry = (
  currentData: unknown,
  params: LikePatchParams
): unknown => {
  if (isPublicUserPostsQueryData(currentData)) {
    return patchPublicUserPostsQueryDataLike(currentData, params) ?? currentData;
  }

  return currentData;
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ToggleLikeVariables, ToggleLikeContext>({
    mutationFn: async ({ postId, likedByMe }) => {
      try {
        const response = likedByMe
          ? await postApi.unlikePost(postId)
          : await postApi.likePost(postId);

        if (!response.data.success) {
          throw new Error(
            response.data.message || 'Failed to update like state.'
          );
        }
      } catch (error) {
        throw new Error(getToggleLikeErrorMessage(error));
      }
    },
    onMutate: async ({ postId, likedByMe, likeCount }) => {
      const { nextLikedByMe, nextLikeCount } = computeNextLikeState(
        likedByMe,
        likeCount
      );

      await Promise.all([
        queryClient.cancelQueries({ queryKey: queryKeys.feed.all }),
        queryClient.cancelQueries({ queryKey: queryKeys.posts.all }),
        queryClient.cancelQueries({ queryKey: queryKeys.users.all }),
        queryClient.cancelQueries({ queryKey: queryKeys.posts.detail(postId) }),
      ]);

      const feedSnapshots = queryClient.getQueriesData({
        queryKey: queryKeys.feed.all,
      });

      const postsSnapshots = queryClient.getQueriesData({
        queryKey: queryKeys.posts.all,
      });

      const userSnapshots = queryClient.getQueriesData({
        queryKey: queryKeys.users.all,
      });

      const detailSnapshot = queryClient.getQueryData<Post>(
        queryKeys.posts.detail(postId)
      );

      const patchParams: LikePatchParams = {
        postId,
        likedByMe: nextLikedByMe,
        likeCount: nextLikeCount,
      };

      queryClient.setQueriesData(
        { queryKey: queryKeys.feed.all },
        (currentData) => patchFeedCacheEntry(currentData, patchParams)
      );

      queryClient.setQueriesData(
        { queryKey: queryKeys.posts.all },
        (currentData) => patchPostsCacheEntry(currentData, patchParams)
      );

      queryClient.setQueriesData(
        { queryKey: queryKeys.users.all },
        (currentData) => patchUsersCacheEntry(currentData, patchParams)
      );

      queryClient.setQueryData(
        queryKeys.posts.detail(postId),
        (currentData: Post | undefined) =>
          patchPostDetailLike(currentData, patchParams) ?? currentData
      );

      return {
        feedSnapshots,
        postsSnapshots,
        userSnapshots,
        detailSnapshot,
      };
    },
    onError: (_error, variables, context) => {
      if (!context) {
        return;
      }

      context.feedSnapshots.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      context.postsSnapshots.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      context.userSnapshots.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      queryClient.setQueryData(
        queryKeys.posts.detail(variables.postId),
        context.detailSnapshot
      );
    },
  });
};
