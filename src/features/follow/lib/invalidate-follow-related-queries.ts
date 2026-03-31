// src/features/follow/lib/invalidate-follow-related-queries.ts

import type { QueryClient, Query } from '@tanstack/react-query';

type InvalidateFollowRelatedQueriesParams = Readonly<{
  postId: number;
  username: string;
}>;

const isPostLikesQueryForPost = (
  query: Query,
  postId: number
): boolean => {
  const queryKey = query.queryKey;

  return (
    Array.isArray(queryKey) &&
    queryKey[0] === 'posts' &&
    queryKey[1] === 'likes' &&
    queryKey[2] === postId
  );
};

export const invalidateFollowRelatedQueries = async (
  queryClient: QueryClient,
  { postId, username }: InvalidateFollowRelatedQueriesParams
): Promise<void> => {
  console.log('[FOLLOW_DEBUG] invalidateFollowRelatedQueries', {
    postId,
    username,
    note: 'Only invalidating likes query. Profile stats stay optimistic because backend stats are stale.',
  });

  await Promise.all([
    queryClient.invalidateQueries({
      predicate: (query) => isPostLikesQueryForPost(query, postId),
    }),
  ]);
};
