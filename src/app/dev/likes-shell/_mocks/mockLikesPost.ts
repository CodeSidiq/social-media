// src/app/dev/likes-shell/_mocks/mockLikesPost.ts

import type { LikesShellPostContext } from '@/features/like/types/like-shell.types';

export const mockLikesPost: LikesShellPostContext = {
  id: 101,
  imageUrl:
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
  caption:
    'Creating unforgettable moments with my favorite person. Every little moment feels special when shared with the right heart.',
  createdAt: '2026-03-23T08:15:00.000Z',
  author: {
    id: 12,
    username: 'claradewi',
    name: 'Clara Dewi',
    avatarUrl: null,
  },
  stats: {
    likeCount: 123,
    commentCount: 18,
  },
  relationship: {
    likedByMe: true,
  },
};
