// src/features/public-profile/types/public-profile.dto.ts

import type { ApiResponse, PaginationMeta } from '@/types/api/common';
import type { PostDto } from '@/features/post/types/post.dto';
import type { UserEntity } from '@/types/entities/user';

export type PublicProfileStatsDto = Readonly<{
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  likesCount?: number;
  savedCount?: number;
}>;

export type PublicProfileNestedPayloadDto = Readonly<{
  profile: UserEntity;
  stats?: PublicProfileStatsDto;
}>;

export type PublicProfileFlatPayloadDto = UserEntity &
  Readonly<{
    stats?: PublicProfileStatsDto;
  }>;

export type PublicProfilePayloadDto =
  | PublicProfileNestedPayloadDto
  | PublicProfileFlatPayloadDto;

export type PublicUserPostsPayloadDto = Readonly<{
  posts: PostDto[];
  pagination: PaginationMeta;
}>;

export type PublicProfileApiResponseDto = ApiResponse<PublicProfilePayloadDto>;
export type PublicUserPostsApiResponseDto = ApiResponse<PublicUserPostsPayloadDto>;
