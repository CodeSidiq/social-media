// src/features/feed/hooks/useInfiniteFeed.ts

'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { feedApi } from '@/features/feed/api/feed.api';
import { mapFeedResponseToQueryData } from '@/features/feed/mappers/feed.mapper';
import type { FeedQueryData } from '@/features/feed/types/feed.types';
import { queryKeys } from '@/lib/query-keys';

type UseInfiniteFeedParams = Readonly<{
  limit?: number;
}>;

const DEFAULT_FEED_PAGE = 1;
const DEFAULT_FEED_LIMIT = 2;

export const useInfiniteFeed = ({
  limit = DEFAULT_FEED_LIMIT,
}: UseInfiniteFeedParams = {}) => {
  return useInfiniteQuery<FeedQueryData, Error>({
    queryKey: queryKeys.feed.infinite(limit),
    initialPageParam: DEFAULT_FEED_PAGE,
    queryFn: async ({ pageParam }): Promise<FeedQueryData> => {
      const currentPage =
        typeof pageParam === 'number' ? pageParam : DEFAULT_FEED_PAGE;

      const response = await feedApi.getFeed({
        page: currentPage,
        limit,
      });

      return mapFeedResponseToQueryData(response.data);
    },
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.pagination.page;
      const totalPages = lastPage.pagination.totalPages;

      if (currentPage < totalPages) {
        return currentPage + 1;
      }

      return undefined;
    },
  });
};
