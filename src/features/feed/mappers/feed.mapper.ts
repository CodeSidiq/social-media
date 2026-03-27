// src/features/feed/mappers/feed.mapper.ts
/**
 * Feed data mapper.
 * Transforms authenticated feed DTOs into the shared post model used by the UI.
 * Feed-specific transformation rules should stay centralized here.
 */


import type {
  FeedPagination,
  FeedQueryData,
  FeedResponseDto,
} from '@/features/feed/types/feed.types';
import { mapPostToPreview } from '@/features/post/mappers/post.mapper';
import type { Post } from '@/types/entities/post';

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isValidPagination = (value: unknown): value is FeedPagination => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.page === 'number' &&
    typeof value.limit === 'number' &&
    typeof value.total === 'number' &&
    typeof value.totalPages === 'number'
  );
};

const toPostFromUnknown = (value: unknown): Post | null => {
  if (!isRecord(value)) {
    return null;
  }

  const { id, imageUrl, caption, createdAt, author, likeCount, commentCount } =
    value;

  if (
    typeof id !== 'number' ||
    typeof imageUrl !== 'string' ||
    typeof createdAt !== 'string' ||
    typeof likeCount !== 'number' ||
    typeof commentCount !== 'number'
  ) {
    return null;
  }

  if (!isRecord(author)) {
    return null;
  }

  const {
    id: authorId,
    username,
    name,
    avatarUrl,
  } = author as Record<string, unknown>;

  if (
    typeof authorId !== 'number' ||
    typeof username !== 'string' ||
    typeof name !== 'string' ||
    !(typeof avatarUrl === 'string' || avatarUrl === null)
  ) {
    return null;
  }

  const likedByMe =
    typeof value.likedByMe === 'boolean' ? value.likedByMe : false;

  return {
    id,
    imageUrl,
    caption: typeof caption === 'string' ? caption : '',
    createdAt,
    author: {
      id: authorId,
      username,
      name,
      avatarUrl,
    },
    stats: {
      likeCount,
      commentCount,
    },
    relationship: {
      likedByMe,
    },
  };
};

const mapFeedItemsToPreviews = (items: unknown[]) => {
  return items.map((item, index) => {
    const post = toPostFromUnknown(item);

    if (!post) {
      throw new Error(
        `Feed item contract mismatch at index ${index}. Timeline item rendering was blocked intentionally.`
      );
    }

    return mapPostToPreview(post, 'feed');
  });
};

export const mapFeedResponseToQueryData = (
  response: FeedResponseDto
): FeedQueryData => {
  if (!response.success) {
    throw new Error(response.message || 'Failed to load feed.');
  }

  if (!response.data) {
    throw new Error('Feed response data is null.');
  }

  const { items, pagination } = response.data;

  if (!Array.isArray(items)) {
    throw new Error('Feed response items is not an array.');
  }

  if (!isValidPagination(pagination)) {
    throw new Error('Feed pagination contract mismatch.');
  }

  return {
    items: mapFeedItemsToPreviews(items),
    pagination,
    message: response.message,
  };
};
