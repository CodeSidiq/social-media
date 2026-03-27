// src/app/(protected)/timeline/page.tsx
/**
 * Protected timeline route.
 * Entry point for the authenticated feed surface.
 * Rendering logic is delegated to the feature layer.
 */


import TimelineFeedPageClient from '@/features/feed/components/TimelineFeedPageClient';

const TimelinePage = () => {
  return <TimelineFeedPageClient />;
};

export default TimelinePage;
