// src/features/profile/components/EditProfilePageClient.tsx

'use client';

import Link from 'next/link';
import { ChevronLeft, RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuthToken } from '@/features/auth/hooks/useAuthToken';
import EditProfileForm from '@/features/profile/components/EditProfileForm';
import { useMyProfile } from '@/features/profile/hooks/useMyProfile';

const EditProfileLoadingShell = () => {
  return (
    <div className='mx-auto flex w-full max-w-3xl flex-col gap-6'>
      <div className='flex items-center justify-between gap-3'>
        <div className='h-10 w-32 animate-pulse rounded-full bg-muted' />
        <div className='h-6 w-40 animate-pulse rounded bg-muted' />
      </div>

      <div className='rounded-[1.75rem] border border-border bg-card p-6 md:p-8'>
        <div className='animate-pulse space-y-6'>
          <div className='flex items-center gap-4'>
            <div className='size-24 rounded-full bg-muted md:size-28' />
            <div className='space-y-3'>
              <div className='h-5 w-36 rounded bg-muted' />
              <div className='h-4 w-44 rounded bg-muted' />
              <div className='h-12 w-36 rounded-full bg-muted' />
            </div>
          </div>
        </div>
      </div>

      <div className='rounded-[1.75rem] border border-border bg-card p-6 md:p-8'>
        <div className='animate-pulse space-y-5'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`edit-profile-field-skeleton-${index + 1}`} className='space-y-2'>
              <div className='h-4 w-24 rounded bg-muted' />
              <div className='h-14 w-full rounded-2xl bg-muted' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const EditProfileErrorShell = ({
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
            Failed to load edit profile form
          </h1>
          <p className='text-sm leading-7 text-muted-foreground'>{message}</p>
        </div>

        <div className='flex flex-col gap-3 sm:flex-row'>
          <Button
            type='button'
            variant='outline'
            onClick={onRetry}
            className='inline-flex items-center gap-2'
          >
            <RefreshCcw className='size-4' aria-hidden='true' />
            <span>Try again</span>
          </Button>

          <Button asChild variant='ghost'>
            <Link href='/profile'>Back to Profile</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

const EditProfileAuthFallback = () => {
  return (
    <section className='rounded-[1.75rem] border border-border bg-card p-6 md:p-8'>
      <div className='space-y-3'>
        <h1 className='text-xl font-semibold text-card-foreground'>
          Authentication required
        </h1>
        <p className='text-sm leading-7 text-muted-foreground'>
          Your edit profile surface depends on authenticated self-profile data.
        </p>

        <Button asChild variant='outline'>
          <Link href='/auth/login'>Go to Login</Link>
        </Button>
      </div>
    </section>
  );
};

const EditProfilePageClient = () => {
  const token = useAuthToken();
  const { data, isLoading, isError, error, refetch } = useMyProfile(token);

  if (!token) {
    return <EditProfileAuthFallback />;
  }

  if (isLoading) {
    return <EditProfileLoadingShell />;
  }

  if (isError || !data) {
    const message =
      error instanceof Error
        ? error.message
        : 'Something went wrong while loading your profile.';

    return <EditProfileErrorShell message={message} onRetry={() => void refetch()} />;
  }

  return (
    <div className='mx-auto flex w-full max-w-3xl flex-col gap-6 md:gap-8'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <Button asChild variant='ghost' className='inline-flex items-center gap-2 self-start'>
          <Link href='/profile'>
            <ChevronLeft className='size-4' aria-hidden='true' />
            <span>Back to Profile</span>
          </Link>
        </Button>

        <div className='space-y-1'>
          <h1 className='text-2xl font-semibold text-foreground'>Edit Profile</h1>
          <p className='text-sm leading-7 text-muted-foreground'>
            Update your identity fields and preview your next avatar before API wiring
            lands in Session 8B.
          </p>
        </div>
      </div>

      <EditProfileForm profile={data} />
    </div>
  );
};

export default EditProfilePageClient;
