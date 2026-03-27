// src/features/search/hooks/useSearchUsers.ts

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { searchApi } from '@/features/search/api/search.api';
import { mapSearchUsersResponseDtoToResult } from '@/features/search/mappers/search.mapper';
import type {
  SearchUsersApiResponseDto,
  SearchUsersResult,
} from '@/features/search/types/search.types';
import { queryKeys } from '@/lib/query-keys';

const MIN_SEARCH_CHARACTERS = 2;

const getSearchErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<SearchUsersApiResponseDto>(error)) {
    const responseData = error.response?.data;

    if (responseData?.message) {
      return responseData.message;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Failed to search users.';
};

type UseSearchUsersParams = Readonly<{
  keyword: string;
  page: number;
  limit: number;
}>;

export const useSearchUsers = ({
  keyword,
  page,
  limit,
}: UseSearchUsersParams) => {
  const normalizedKeyword = keyword.trim();
  const canSearch = normalizedKeyword.length >= MIN_SEARCH_CHARACTERS;

  return useQuery<SearchUsersResult, Error>({
    queryKey: queryKeys.search.users(normalizedKeyword, page, limit),
    enabled: canSearch,
    queryFn: async () => {
      try {
        const response = await searchApi.searchUsers({
          q: normalizedKeyword,
          page,
          limit,
        });

        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to search users.');
        }

        return mapSearchUsersResponseDtoToResult(response.data);
      } catch (error) {
        throw new Error(getSearchErrorMessage(error));
      }
    },
  });
};
