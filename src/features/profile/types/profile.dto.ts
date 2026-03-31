// src/features/profile/types/profile.dto.ts

import type { PaginationMeta, ApiResponse } from '@/types/api/common';
import type { PostDto } from '@/features/post/types/post.dto';
import type { UserEntity } from '@/types/entities/user';

export type MyProfileStatsDto = Readonly<{
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  likesCount?: number;
  savedCount?: number;
}>;

export type MyProfilePayloadDto = Readonly<{
  profile: UserEntity;
  stats: MyProfileStatsDto;
}>;

export type MyPostsPayloadDto = Readonly<{
  posts: PostDto[];
  pagination: PaginationMeta;
}>;

export type MyProfileApiResponseDto = ApiResponse<MyProfilePayloadDto>;
export type MyPostsApiResponseDto = ApiResponse<MyPostsPayloadDto>;
