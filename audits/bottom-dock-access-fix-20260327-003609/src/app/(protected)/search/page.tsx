// src/app/(protected)/search/page.tsx

import AppBottomDock from '@/components/layout/AppBottomDock';
import FeedShell from '@/components/layout/FeedShell';
import SearchPageClient from '@/features/search/components/SearchPageClient';

const SearchPage = () => {
  return (
    <>
      <FeedShell accessVariant='authenticated'>
        <SearchPageClient />
      </FeedShell>

      <AppBottomDock variant='protected' />
    </>
  );
};

export default SearchPage;
