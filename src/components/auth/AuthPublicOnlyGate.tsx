// src/components/auth/AuthPublicOnlyGate.tsx

'use client';

import { useAuthToken } from '@/features/auth/hooks/useAuthToken';
import { useMyProfile } from '@/features/profile/hooks/useMyProfile';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

type AuthPublicOnlyGateProps = {
  children: ReactNode;
};

const AuthPublicOnlyGate = ({ children }: AuthPublicOnlyGateProps) => {
  const router = useRouter();
  const token = useAuthToken();
  const { isLoading, isSuccess, isError } = useMyProfile(token);

  useEffect(() => {
    if (token && isSuccess) {
      router.replace('/timeline');
    }
  }, [isSuccess, router, token]);

  if (token === undefined) {
    return (
      <main className='flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground'>
        <div className='space-y-2 text-center'>
          <p className='text-sm font-medium text-muted-foreground'>
            Checking session
          </p>
          <p className='text-base font-semibold'>Please wait...</p>
        </div>
      </main>
    );
  }

  if (!token || isError) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <main className='flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground'>
        <div className='space-y-2 text-center'>
          <p className='text-sm font-medium text-muted-foreground'>
            Checking session
          </p>
          <p className='text-base font-semibold'>Please wait...</p>
        </div>
      </main>
    );
  }

  return (
    <main className='flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground'>
      <div className='space-y-2 text-center'>
        <p className='text-sm font-medium text-muted-foreground'>Redirecting</p>
        <p className='text-base font-semibold'>
          You already have an active session.
        </p>
      </div>
    </main>
  );
};

export default AuthPublicOnlyGate;
