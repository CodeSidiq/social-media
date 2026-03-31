// src/features/post/lib/update-post-like-cache.ts

import type { InfiniteData } from '@tanstack/react-query';

import type { FeedQueryData } from '@/features/feed/types/feed.types';
import type {
  ExplorePostsQueryData,
} from '@/features/post/hooks/useExplorePosts';
import type { PublicUserPostsQueryData } from '@/features/public-profile/types/public-profile.types';
import type { Post } from '@/types/entities/post';

type LikePatchParams = Readonly<{
  postId: number;
  likedByMe: boolean;
  likeCount: number;
}>;

const updatePostLikeFields = <TPost extends Post>(
  post: TPost,
  params: LikePatchParams
): TPost => {
  if (post.id !== params.postId) {
    return post;
  }

  return {
    ...post,
    stats: {
      ...post.stats,
      likeCount: params.likeCount,
    },
    relationship: {
      ...post.relationship,
      likedByMe: params.likedByMe,
    },
  };
};

export const patchFeedQueryDataLike = (
  data: FeedQueryData | undefined,
  params: LikePatchParams
): FeedQueryData | undefined => {
  if (!data) {
    return data;
  }

  return {
    ...data,
    items: data.items.map((post) => updatePostLikeFields(post, params)),
  };
};

export const patchInfiniteFeedQueryDataLike = (
  data: InfiniteData<FeedQueryData> | undefined,
  params: LikePatchParams
): InfiniteData<FeedQueryData> | undefined => {
  if (!data) {
    return data;
  }

  return {
    ...data,
    pages: data.pages.map((page) => patchFeedQueryDataLike(page, params) ?? page),
  };
};

export const patchExploreQueryDataLike = (
  data: ExplorePostsQueryData | undefined,
  params: LikePatchParams
): ExplorePostsQueryData | undefined => {
  if (!data) {
    return data;
  }

  return {
    ...data,
    previews: data.previews.map((post) => updatePostLikeFields(post, params)),
  };
};

export const patchInfiniteExploreQueryDataLike = (
  data: InfiniteData<ExplorePostsQueryData> | undefined,
  params: LikePatchParams
): InfiniteData<ExplorePostsQueryData> | undefined => {
  if (!data) {
    return data;
  }

  return {
    ...data,
    pages: data.pages.map((page) => patchExploreQueryDataLike(page, params) ?? page),
  };
};

export const patchMyPostsQueryDataLike = (
  data: PublicUserPostsQueryData | undefined,
  params: LikePatchParams
): PublicUserPostsQueryData | undefined => {
  if (!data) {
    return data;
  }

  return {
    ...data,
    posts: data.posts.map((post) => updatePostLikeFields(post, params)),
  };
};

export const patchPublicUserPostsQueryDataLike = (
  data: PublicUserPostsQueryData | undefined,
  params: LikePatchParams
): PublicUserPostsQueryData | undefined => {
  if (!data) {
    return data;
  }

  return {
    ...data,
    posts: data.posts.map((post) => updatePostLikeFields(post, params)),
  };
};

export const patchPostDetailLike = <TPost extends Post>(
  data: TPost | undefined,
  params: LikePatchParams
): TPost | undefined => {
  if (!data) {
    return data;
  }

  return updatePostLikeFields(data, params);
};
