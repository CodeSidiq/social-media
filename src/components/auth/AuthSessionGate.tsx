// src/components/auth/AuthSessionGate.tsx

'use client';

import { useAuthToken } from '@/features/auth/hooks/useAuthToken';
import { useMyProfile } from '@/features/profile/hooks/useMyProfile';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

type AuthSessionGateProps = {
  children: ReactNode;
};

const AuthSessionGate = ({ children }: AuthSessionGateProps) => {
  const router = useRouter();
  const token = useAuthToken();
  const { isLoading, isError } = useMyProfile(token);

  useEffect(() => {
    if (token === undefined) return;

    if (!token || isError) {
      // 🔥 redirect ke public surface, bukan login
      router.replace('/');
    }
  }, [isError, router, token]);

  if (token === undefined || isLoading) {
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
    return (
      <main className='flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground'>
        <div className='space-y-2 text-center'>
          <p className='text-sm font-medium text-muted-foreground'>
            Redirecting
          </p>
          <p className='text-base font-semibold'>
            Redirecting to public page...
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
};

export default AuthSessionGate;
