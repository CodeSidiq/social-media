// src/features/public-profile/types/public-profile.types.ts

import type { FeedPagination } from '@/features/feed/types/feed.types';
import type { PostPreview } from '@/types/entities/post';

export type PublicProfileStats = Readonly<{
  postsCount: number;
  followersCount: number;
  followingCount: number;
  likesCount: number;
}>;

export type PublicProfileViewModel = Readonly<{
  id: number;
  name: string;
  username: string;
  avatarUrl: string | null;
  bio: string;
  stats: PublicProfileStats;
}>;

export type PublicUserPostsQueryData = Readonly<{
  posts: PostPreview[];
  pagination: FeedPagination;
}>;
