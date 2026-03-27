// src/app/dev/comment-shell/_mocks/mockPost.ts

import type { PostPreview } from '@/types/entities/post';

export const mockPost: PostPreview = {
  id: 999,
  imageUrl: '/assets/images/image-post-sample.jpg',
  caption:
    'Creating unforgettable moments with my favorite person! 👑✨ Every laugh, every little adventure, every quiet moment together feels like magic.',
  createdAt: '2026-03-22T14:00:00.000Z',
  author: {
    id: 101,
    username: 'johndoe',
    name: 'John Doe',
    avatarUrl: '/assets/avatar/avatar-placeholder.jpg',
  },
  stats: {
    likeCount: 20,
    commentCount: 20,
  },
  relationship: {
    likedByMe: true,
  },
  surface: 'feed',
};
