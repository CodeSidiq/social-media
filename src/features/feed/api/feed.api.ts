// src/features/feed/api/feed.api.ts

import type { FeedResponseDto } from '@/features/feed/types/feed.types';
import { api } from '@/lib/api';

type GetFeedParams = Readonly<{
  page?: number;
  limit?: number;
}>;

const DEFAULT_FEED_PAGE = 1;
const DEFAULT_FEED_LIMIT = 20;

const getFeed = async ({
  page = DEFAULT_FEED_PAGE,
  limit = DEFAULT_FEED_LIMIT,
}: GetFeedParams = {}) => {
  return api.get<FeedResponseDto>('/api/feed', {
    params: {
      page,
      limit,
    },
  });
};

export const feedApi = {
  getFeed,
  getTimeline: getFeed,
};
