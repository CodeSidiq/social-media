// src/features/feed/types/feed.types.ts

import type { PostPreview } from '@/types/entities/post';

export type FeedPaginationDto = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type FeedDataDto = {
  items: unknown[];
  pagination: FeedPaginationDto;
};

export type FeedResponseDto = {
  success: boolean;
  message: string;
  data: FeedDataDto | null;
};

export type FeedPagination = FeedPaginationDto;

export type FeedQueryData = {
  items: PostPreview[];
  pagination: FeedPagination;
  message: string;
};
