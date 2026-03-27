// src/features/like/types/like-shell.types.ts

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
  post: LikesShellPostContext;
  users: readonly LikeUserShellItem[];
}>;
