// src/features/feed/hooks/useFeed.ts

import { useQuery } from '@tanstack/react-query';

import { feedApi } from '@/features/feed/api/feed.api';
import { mapFeedResponseToQueryData } from '@/features/feed/mappers/feed.mapper';
import type { FeedQueryData } from '@/features/feed/types/feed.types';
import { queryKeys } from '@/lib/query-keys';

type UseFeedParams = Readonly<{
  page?: number;
  limit?: number;
}>;

const DEFAULT_FEED_PAGE = 1;
const DEFAULT_FEED_LIMIT = 20;

export const useFeed = ({
  page = DEFAULT_FEED_PAGE,
  limit = DEFAULT_FEED_LIMIT,
}: UseFeedParams = {}) => {
  return useQuery<FeedQueryData, Error>({
    queryKey: queryKeys.feed.list(page, limit),
    queryFn: async () => {
      const response = await feedApi.getFeed({ page, limit });

      return mapFeedResponseToQueryData(response.data);
    },
  });
};
