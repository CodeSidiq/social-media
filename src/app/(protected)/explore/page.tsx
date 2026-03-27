// src/app/(protected)/explore/page.tsx
/**
 * Protected explore route.
 * Shares the same visual language as other feed surfaces.
 * Protected shell ownership stays in the route-group layout.
 */

import ExplorePostList from '@/features/post/components/ExplorePostList';

const ExplorePage = () => {
  return <ExplorePostList />;
};

export default ExplorePage;
