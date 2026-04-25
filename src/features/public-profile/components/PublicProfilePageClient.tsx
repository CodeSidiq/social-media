// src/features/public-profile/components/PublicProfilePageClient.tsx

'use client';

import PublicProfileErrorState from '@/features/public-profile/components/PublicProfileErrorState';
import PublicProfileHeader from '@/features/public-profile/components/PublicProfileHeader';
import PublicProfilePostsSection from '@/features/public-profile/components/PublicProfilePostsSection';
import { usePublicProfile } from '@/features/public-profile/hooks/usePublicProfile';
import { usePublicUserPosts } from '@/features/public-profile/hooks/usePublicUserPosts';


type PublicProfilePageClientProps = Readonly<{
  username: string;
}>;

const PUBLIC_POSTS_PAGE = 1;
const PUBLIC_POSTS_LIMIT = 20;

const HeaderLoadingShell = () => {
  return (
    <div className='space-y-6'>
      <div className='rounded-[1.75rem] border border-border bg-card p-5 md:p-8'>
        <div className='animate-pulse space-y-6'>
          <div className='flex flex-col gap-5 md:flex-row md:items-start'>
            <div className='size-24 rounded-full bg-muted md:size-28' />
            <div className='flex-1 space-y-3'>
              <div className='h-8 w-48 rounded bg-muted' />
              <div className='h-5 w-32 rounded bg-muted' />
              <div className='h-4 w-full max-w-2xl rounded bg-muted' />
              <div className='h-4 w-4/5 max-w-xl rounded bg-muted' />
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`public-profile-stats-skeleton-${index + 1}`}
            className='flex min-h-24 items-center justify-center border-border p-4 md:border-r last:md:border-r-0'
          >
            <div className='h-12 w-24 animate-pulse rounded bg-muted' />
          </div>
        ))}
      </div>
    </div>
  );
};

const PublicProfilePageClient = ({
  username,
}: PublicProfilePageClientProps) => {
  const profileQuery = usePublicProfile(username);
  const publicPostsQuery = usePublicUserPosts({
    username,
    page: PUBLIC_POSTS_PAGE,
    limit: PUBLIC_POSTS_LIMIT,
  });

  const posts = publicPostsQuery.data?.posts ?? [];


  if (profileQuery.isLoading) {
    return (
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-6 md:gap-8 bg-shell-background'>
        <HeaderLoadingShell />

        <section className='space-y-3'>
          <div className='h-6 w-40 animate-pulse rounded bg-muted' />
          <PublicProfilePostsSection
            username={username}
            posts={[]}
            isLoading={true}
            isError={false}
          />
        </section>
      </div>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    const message =
      profileQuery.error instanceof Error
        ? profileQuery.error.message
        : 'Something went wrong while loading the public profile.';

    return (
      <PublicProfileErrorState
        title='Failed to load public profile'
        message={message}
        onRetry={() => void profileQuery.refetch()}
      />
    );
  }

  return (
    <div className='mx-auto flex w-full max-w-5xl flex-col gap-6 md:gap-8'>
      <PublicProfileHeader profile={profileQuery.data} />


      <section className='space-y-3'>
        <PublicProfilePostsSection
          username={username}
          posts={posts}
          isLoading={publicPostsQuery.isLoading}
          isError={publicPostsQuery.isError}
          errorMessage={publicPostsQuery.error?.message}
          onRetry={() => void publicPostsQuery.refetch()}
        />
      </section>
    </div>
  );
};

export default PublicProfilePageClient;
