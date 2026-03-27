// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import PublicTimelinePageClient from '@/features/feed/components/PublicTimelinePageClient';
import { useAuthToken } from '@/features/auth/hooks/useAuthToken';
import { useMe } from '@/features/auth/hooks/useMe';

const RootPage = () => {
  const router = useRouter();
  const token = useAuthToken();
  const meQuery = useMe(token);

  useEffect(() => {
    if (!token) {
      return;
    }

    if (meQuery.isSuccess) {
      router.replace('/timeline');
    }
  }, [token, meQuery.isSuccess, router]);

  if (token && meQuery.isLoading) {
    return (
      <div className='min-h-screen bg-shell-background text-foreground'>
        <main className='flex min-h-screen items-center justify-center px-4'>
          <p className='text-sm text-muted-foreground'>Checking session...</p>
        </main>
      </div>
    );
  }

  if (token && meQuery.isSuccess) {
    return null;
  }

  return <PublicTimelinePageClient />;
};

export default RootPage;
