// src/features/profile/components/MyProfilePageClient.tsx

'use client';

import { RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuthToken } from '@/features/auth/hooks/useAuthToken';
import MyProfileGallerySection from '@/features/profile/components/MyProfileGallerySection';
import SelfProfileHeader from '@/features/profile/components/SelfProfileHeader';
import { useMyProfile } from '@/features/profile/hooks/useMyProfile';


const LoadingShell = () => {
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
            key={`profile-stats-skeleton-${index + 1}`}
            className='flex min-h-24 items-center justify-center border-border p-4 md:border-r last:md:border-r-0'
          >
            <div className='h-12 w-24 animate-pulse rounded bg-muted' />
          </div>
        ))}
      </div>

      <div className='flex items-center gap-6 border-b border-border'>
        <div className='h-12 w-20 animate-pulse rounded bg-muted' />
        <div className='h-12 w-20 animate-pulse rounded bg-muted' />
      </div>

      <div className='grid grid-cols-3 gap-3 md:gap-4'>
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={`profile-gallery-skeleton-${index + 1}`}
            className='aspect-square animate-pulse rounded-2xl border border-border bg-muted/60'
          />
        ))}
      </div>
    </div>
  );
};

const ErrorShell = ({
  message,
  onRetry,
}: Readonly<{
  message: string;
  onRetry: () => void;
}>) => {
  return (
    <section className='rounded-[1.75rem] border border-border bg-card p-6 md:p-8'>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <h1 className='text-xl font-semibold text-card-foreground'>
            Failed to load your profile
          </h1>
          <p className='text-sm leading-7 text-muted-foreground'>{message}</p>
        </div>

        <Button
          type='button'
          variant='outline'
          onClick={onRetry}
          className='inline-flex items-center gap-2'
        >
          <RefreshCcw className='size-4' aria-hidden='true' />
          <span>Try again</span>
        </Button>
      </div>
    </section>
  );
};

const MyProfilePageClient = () => {
  const token = useAuthToken();
  const { data, isLoading, isError, error, refetch } = useMyProfile(token);

  if (isLoading) {
    return <LoadingShell />;
  }

  if (isError || !data) {
    const message =
      error instanceof Error
        ? error.message
        : 'Something went wrong while loading your profile.';

    return <ErrorShell message={message} onRetry={() => void refetch()} />;
  }

  return (
    <div className='mx-auto flex w-full max-w-5xl flex-col gap-6 md:gap-8'>
      <SelfProfileHeader profile={data} />

      <div className='space-y-5 md:space-y-6'>
        <MyProfileGallerySection token={token} />
      </div>
    </div>
  );
};

export default MyProfilePageClient;
