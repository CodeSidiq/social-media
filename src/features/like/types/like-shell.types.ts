// src/features/like/types/like-shell.types.ts

import type { FeedPagination } from '@/features/feed/types/feed.types';
import type { PostPreview } from '@/types/entities/post';

/**
 * ⚠️ LEGACY TYPE (USED IN DEV SHELL)
 * DO NOT REMOVE
 */
export type LikesShellPostContext = Readonly<{
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  author: Readonly<{
    id: number;
    username: string;
    name: string;
    avatarUrl: string | null;
  }>;
  stats: Readonly<{
    likeCount: number;
    commentCount: number;
  }>;
  relationship: Readonly<{
    likedByMe: boolean;
  }>;
}>;

export type LikesModalPostContext = PostPreview | LikesShellPostContext;

export type LikeUserShellItem = Readonly<{
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowing: boolean;
}>;

export type LikesModalShellProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: LikesModalPostContext;
  users: readonly LikeUserShellItem[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  pagination?: FeedPagination;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}>;
