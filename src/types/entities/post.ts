// src/types/entities/post.ts

export type PostAuthor = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
};

export type PostStats = {
  likeCount: number;
  commentCount: number;
};

export type PostRelationship = {
  likedByMe: boolean;
};

export type Post = {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  author: PostAuthor;
  stats: PostStats;
  relationship: PostRelationship;
};

export type PostPreviewSurface = 'explore' | 'feed';

export type PostPreview = Post & {
  surface: PostPreviewSurface;
};

export type PostEntity = Post;
