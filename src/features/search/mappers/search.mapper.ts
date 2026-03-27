// src/features/search/mappers/search.mapper.ts

import type {
  SearchUserDto,
  SearchUserItem,
  SearchUsersResponseDto,
  SearchUsersResult,
} from '@/features/search/types/search.types';

export const mapSearchUserDtoToItem = (dto: SearchUserDto): SearchUserItem => {
  return {
    id: dto.id,
    username: dto.username,
    name: dto.name,
    avatarUrl: dto.avatarUrl,
    isFollowedByMe: dto.isFollowedByMe,
  };
};

export const mapSearchUsersResponseDtoToResult = (
  dto: SearchUsersResponseDto
): SearchUsersResult => {
  return {
    users: dto.users.map(mapSearchUserDtoToItem),
    pagination: {
      page: dto.pagination.page,
      limit: dto.pagination.limit,
      total: dto.pagination.total,
      totalPages: dto.pagination.totalPages,
    },
  };
};
