// src/features/profile/api/profile.api.ts

import type {
  MyPostsApiResponseDto,
  MyProfileApiResponseDto,
} from '@/features/profile/types/profile.dto';
import { api } from '@/lib/api';

type GetMyPostsParams = Readonly<{
  page?: number;
  limit?: number;
}>;

const DEFAULT_MY_POSTS_PAGE = 1;
const DEFAULT_MY_POSTS_LIMIT = 20;

export const profileApi = {
  getMyProfile: async (): Promise<MyProfileApiResponseDto> => {
    const response = await api.get<MyProfileApiResponseDto>('/api/me');
    return response.data;
  },

  updateMyProfile: async (formData: FormData): Promise<MyProfileApiResponseDto> => {
    const response = await api.patch<MyProfileApiResponseDto>(
      '/api/me',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  getMyPosts: async ({
    page = DEFAULT_MY_POSTS_PAGE,
    limit = DEFAULT_MY_POSTS_LIMIT,
  }: GetMyPostsParams = {}): Promise<MyPostsApiResponseDto> => {
    const response = await api.get<MyPostsApiResponseDto>('/api/me/posts', {
      params: { page, limit },
    });

    return response.data;
  },
};
