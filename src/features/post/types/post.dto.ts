// src/features/post/types/post.dto.ts

import type { ApiResponse, PaginationMeta } from '@/types/api/common';

/**
 * DTO dari backend (RAW SHAPE)
 * Ini TIDAK sama dengan entity Post
 */
export type PostDto = Readonly<{
  id: number;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
  author: {
    id: number;
    username: string;
    name: string;
    avatarUrl: string | null;
  };
  likeCount: number;
  commentCount: number;
  likedByMe?: boolean;
}>;

export type PostPreviewDto = PostDto;

export type ExplorePostDto = PostDto;
export type ExplorePostPreviewDto = PostPreviewDto;

export type ExplorePostsDataDto = {
  posts: ExplorePostDto[];
  pagination: PaginationMeta;
};

export type ExplorePostsResponseDto = ApiResponse<ExplorePostsDataDto>;

export type CreatePostDataDto = Readonly<{
  id: number;
  imageUrl: string;
  caption: string | null;
}>;

export type CreatePostResponseDto = ApiResponse<CreatePostDataDto>;
