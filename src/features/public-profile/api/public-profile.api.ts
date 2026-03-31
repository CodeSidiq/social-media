// src/features/public-profile/api/public-profile.api.ts

import { api } from '@/lib/api';

import type {
  PublicProfileApiResponseDto,
  PublicUserPostsApiResponseDto,
} from '@/features/public-profile/types/public-profile.dto';

type GetPublicUserPostsParams = Readonly<{
  username: string;
  page?: number;
  limit?: number;
}>;

const DEFAULT_PUBLIC_POSTS_PAGE = 1;
const DEFAULT_PUBLIC_POSTS_LIMIT = 20;

export const publicProfileApi = {
  getPublicProfile: async (
    username: string
  ): Promise<PublicProfileApiResponseDto> => {
    const response = await api.get<PublicProfileApiResponseDto>(
      `/api/users/${encodeURIComponent(username)}`
    );

    return response.data;
  },

  getPublicUserPosts: async ({
    username,
    page = DEFAULT_PUBLIC_POSTS_PAGE,
    limit = DEFAULT_PUBLIC_POSTS_LIMIT,
  }: GetPublicUserPostsParams): Promise<PublicUserPostsApiResponseDto> => {
    const response = await api.get<PublicUserPostsApiResponseDto>(
      `/api/users/${encodeURIComponent(username)}/posts`,
      {
        params: {
          page,
          limit,
        },
      }
    );

    return response.data;
  },


  getPublicUserLikes: async ({
    username,
    page = DEFAULT_PUBLIC_POSTS_PAGE,
    limit = DEFAULT_PUBLIC_POSTS_LIMIT,
  }: GetPublicUserPostsParams) => {
    const response = await api.get(
      `/api/users/${encodeURIComponent(username)}/likes`,
      {
        params: {
          page,
          limit,
        },
      }
    );

    return response.data;
  },

};
