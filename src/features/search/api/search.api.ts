// src/features/search/api/search.api.ts

import { api } from '@/lib/api';

import type { SearchUsersApiResponseDto } from '@/features/search/types/search.types';

export type SearchUsersParams = {
  q: string;
  page?: number;
  limit?: number;
};

export const searchApi = {
  searchUsers: async ({
    q,
    page = 1,
    limit = 20,
  }: SearchUsersParams): Promise<SearchUsersApiResponseDto> => {
    const response = await api.get<SearchUsersApiResponseDto>(
      '/api/users/search',
      {
        params: {
          q,
          page,
          limit,
        },
      }
    );

    return response.data;
  },
};
