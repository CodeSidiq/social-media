// src/features/like/mappers/like.mapper.ts

import type { PostLikeUserDto } from '@/features/like/types/like.dto';
import type { LikeUserShellItem } from '@/features/like/types/like-shell.types';

export const mapLikeUserDtoToShell = (
  dto: PostLikeUserDto
): LikeUserShellItem => {
  return {
    id: dto.id,
    username: dto.username,
    name: dto.name,
    avatarUrl: dto.avatarUrl ?? null,

    /**
     * UI contract:
     * - Like modal expects `isFollowing`
     * - API returns `isFollowedByMe`
     *
     * Mapping must normalize this difference.
     */
    isFollowing: Boolean(dto.isFollowedByMe),
  };
};

export const mapLikeUserDtosToShell = (
  dtos: readonly PostLikeUserDto[]
): LikeUserShellItem[] => {
  return dtos.map(mapLikeUserDtoToShell);
};
