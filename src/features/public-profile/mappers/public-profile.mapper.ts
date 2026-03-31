// src/features/public-profile/mappers/public-profile.mapper.ts

import {
  mapPostDtosToPreviews,
} from '@/features/post/mappers/post.mapper';
import type {
  PublicProfileFlatPayloadDto,
  PublicProfileNestedPayloadDto,
  PublicProfilePayloadDto,
  PublicUserPostsPayloadDto,
} from '@/features/public-profile/types/public-profile.dto';
import type {
  PublicProfileStats,
  PublicProfileViewModel,
  PublicUserPostsQueryData,
} from '@/features/public-profile/types/public-profile.types';
import type { UserEntity } from '@/types/entities/user';

const isNestedProfilePayload = (
  payload: PublicProfilePayloadDto
): payload is PublicProfileNestedPayloadDto => {
  return 'profile' in payload;
};

const getUserEntityFromPayload = (payload: PublicProfilePayloadDto): UserEntity => {
  if (isNestedProfilePayload(payload)) {
    return payload.profile;
  }

  return payload as PublicProfileFlatPayloadDto;
};

const getStatsFromPayload = (payload: PublicProfilePayloadDto): PublicProfileStats => {
  const stats = payload.stats;

  return {
    postsCount: stats?.postsCount ?? 0,
    followersCount: stats?.followersCount ?? 0,
    followingCount: stats?.followingCount ?? 0,
    likesCount: stats?.likesCount ?? 0,
  };
};

export const mapPublicProfilePayloadToViewModel = (
  payload: PublicProfilePayloadDto
): PublicProfileViewModel => {
  const user = getUserEntityFromPayload(payload);

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    avatarUrl: user.avatarUrl ?? null,
    bio: user.bio ?? '',
    stats: getStatsFromPayload(payload),
  };
};

export const mapPublicUserPostsPayloadToQueryData = (
  payload: PublicUserPostsPayloadDto
): PublicUserPostsQueryData => {
  return {
    posts: mapPostDtosToPreviews(payload.posts, 'feed'),
    pagination: payload.pagination,
  };
};
