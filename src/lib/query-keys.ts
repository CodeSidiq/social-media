// src/lib/query-keys.ts

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
  },
  profile: {
    all: ['profile'] as const,
    me: ['profile', 'me'] as const,
    myPostsAll: ['profile', 'my-posts'] as const,
    myPosts: (page: number, limit: number) =>
      ['profile', 'my-posts', page, limit] as const,
  },
  users: {
    all: ['users'] as const,
    publicProfile: (username: string) =>
      ['users', 'public-profile', username] as const,
    publicPostsAll: ['users', 'public-posts'] as const,
    publicPosts: (username: string, page: number, limit: number) =>
      ['users', 'public-posts', username, page, limit] as const,
    publicLikesAll: ['users', 'public-likes'] as const,
    publicLikes: (username: string, page: number, limit: number) =>
      ['users', 'public-likes', username, page, limit] as const,
  },
  feed: {
    all: ['feed'] as const,
    list: (page: number, limit: number) =>
      ['feed', 'list', page, limit] as const,
    infinite: (limit: number) => ['feed', 'infinite', limit] as const,
  },
  posts: {
    all: ['posts'] as const,
    exploreAll: ['posts', 'explore'] as const,
    explore: (page: number, limit: number) =>
      ['posts', 'explore', page, limit] as const,
    exploreInfinite: (limit: number) =>
      ['posts', 'explore', 'infinite', limit] as const,
    detail: (postId: number | string) => ['posts', 'detail', postId] as const,
    comments: (
      postId: number | string,
      page?: number,
      limit?: number
    ) =>
      typeof page === 'number' && typeof limit === 'number'
        ? (['posts', 'comments', postId, page, limit] as const)
        : (['posts', 'comments', postId] as const),
    likes: (postId: number | string, page = 1, limit = 20) =>
      ['posts', 'likes', postId, page, limit] as const,
  },
  search: {
    all: ['search'] as const,
    users: (keyword: string, page = 1, limit = 20) =>
      ['search', 'users', keyword, page, limit] as const,
  },
} as const;
