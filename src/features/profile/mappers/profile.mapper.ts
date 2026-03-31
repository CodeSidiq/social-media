// src/features/profile/mappers/profile.mapper.ts

import type { MyProfilePayloadDto } from '@/features/profile/types/profile.dto';
import type { MyProfileViewModel } from '@/features/profile/types/profile.types';

export const mapMyProfilePayloadToViewModel = (
  payload: MyProfilePayloadDto
): MyProfileViewModel => {
  return {
    id: payload.profile.id,
    name: payload.profile.name,
    username: payload.profile.username,
    phone: payload.profile.phone ?? '',
    avatarUrl: payload.profile.avatarUrl ?? null,
    bio: payload.profile.bio ?? '',
    stats: {
      postsCount: payload.stats.postsCount ?? 0,
      followersCount: payload.stats.followersCount ?? 0,
      followingCount: payload.stats.followingCount ?? 0,
      likesCount: payload.stats.likesCount ?? 0,
    },
  };
};
