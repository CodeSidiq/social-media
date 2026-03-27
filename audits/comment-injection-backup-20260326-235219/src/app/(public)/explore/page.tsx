// src/app/(public)/explore/page.tsx

import AuthSessionGate from '@/components/auth/AuthSessionGate';
import AppShell from '@/components/layout/AppShell';
import ExplorePostList from '@/features/post/components/ExplorePostList';

const ExplorePage = () => {
  return (
    <AuthSessionGate>
      <AppShell>
        <ExplorePostList />
      </AppShell>
    </AuthSessionGate>
  );
};

export default ExplorePage;
