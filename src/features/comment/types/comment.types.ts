// src/features/comment/types/comment.types.ts

import type { PostPreview } from '@/types/entities/post';

export type CommentSurfacePost = PostPreview;

export type CommentAuthorDto = Readonly<{
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
}>;

export type CommentDto = Readonly<{
  id: number;
  text: string;
  createdAt: string;
  author: CommentAuthorDto;
}>;

export type CommentsPaginationDto = Readonly<{
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}>;

export type CommentsResponseDto = Readonly<{
  comments: CommentDto[];
  pagination: CommentsPaginationDto;
}>;

export type GetPostCommentsApiResponseDto = Readonly<{
  success: boolean;
  message: string;
  data: CommentsResponseDto | null;
}>;

export type CreateCommentPayload = Readonly<{
  text: string;
}>;

export type CreateCommentApiResponseDto = Readonly<{
  success: boolean;
  message: string;
  data: unknown;
}>;

export type DeleteCommentApiResponseDto = Readonly<{
  success: boolean;
  message: string;
  data: unknown;
}>;

export type CommentItem = Readonly<{
  id: number;
  authorId: number;
  authorUsername: string;
  authorName: string;
  avatarSrc?: string;
  text: string;
  createdAt: string;
  timeLabel: string;
}>;

export type PostCommentsQueryData = Readonly<{
  items: CommentItem[];
  pagination: CommentsPaginationDto;
}>;
