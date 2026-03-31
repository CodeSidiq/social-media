// src/features/follow/api/follow.api.ts

import type { ApiResponse } from '@/types/api/common';
import { api } from '@/lib/api';

export type FollowMutationResponseDto = ApiResponse<null>;

export const followApi = {
  followUser: async (username: string): Promise<FollowMutationResponseDto> => {
    const response = await api.post<FollowMutationResponseDto>(
      `/api/follow/${encodeURIComponent(username)}`
    );

    return response.data;
  },

  unfollowUser: async (username: string): Promise<FollowMutationResponseDto> => {
    const response = await api.delete<FollowMutationResponseDto>(
      `/api/follow/${encodeURIComponent(username)}`
    );

    return response.data;
  },
};
