// src/lib/query-keys.ts

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: ['auth', 'me'] as const,
  },
  users: {
    all: ['users'] as const,
    publicProfile: (username: string) =>
      ['users', 'public-profile', username] as const,
  },
  feed: {
    all: ['feed'] as const,
    list: (page: number, limit: number) =>
      ['feed', 'list', page, limit] as const,
  },
  posts: {
    all: ['posts'] as const,
    explore: (page: number, limit: number) =>
      ['posts', 'explore', page, limit] as const,
    detail: (postId: number | string) => ['posts', 'detail', postId] as const,
    comments: (postId: number | string) =>
      ['posts', 'comments', postId] as const,
  },
  search: {
    all: ['search'] as const,
    users: (keyword: string, page = 1, limit = 20) =>
      ['search', 'users', keyword, page, limit] as const,
  },
} as const;
