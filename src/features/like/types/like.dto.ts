// src/features/like/types/like.dto.ts

import type { ApiResponse, PaginationMeta } from '@/types/api/common';

export type PostLikeUserDto = Readonly<{
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe?: boolean;
}>;

export type PostLikesPayloadDto = Readonly<{
  users: PostLikeUserDto[];
  pagination: PaginationMeta;
}>;

export type PostLikesApiResponseDto = ApiResponse<PostLikesPayloadDto>;
