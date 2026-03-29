// src/features/comment/mappers/comment.mapper.ts

import type {
  CommentDto,
  CommentItem,
  CommentsResponseDto,
  PostCommentsQueryData,
} from '@/features/comment/types/comment.types';

const formatRelativeTimeLabel = (value: string): string => {
  const createdAt = new Date(value);

  if (Number.isNaN(createdAt.getTime())) {
    return 'Unknown time';
  }

  const now = new Date();
  const diffInSeconds = Math.max(
    0,
    Math.floor((now.getTime() - createdAt.getTime()) / 1000)
  );

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(createdAt);
};

export const mapCommentDtoToItem = (dto: CommentDto): CommentItem => {
  return {
    id: dto.id,
    authorId: dto.author.id,
    authorUsername: dto.author.username,
    authorName: dto.author.name,
    avatarSrc: dto.author.avatarUrl ?? undefined,
    text: dto.text,
    createdAt: dto.createdAt,
    timeLabel: formatRelativeTimeLabel(dto.createdAt),
  };
};

export const mapCommentsResponseDtoToQueryData = (
  dto: CommentsResponseDto
): PostCommentsQueryData => {
  return {
    items: dto.comments.map(mapCommentDtoToItem),
    pagination: dto.pagination,
  };
};
