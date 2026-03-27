// src/components/layout/AppShell.tsx

'use client';

import type { ReactNode } from 'react';

import AppBottomDock from '@/components/layout/AppBottomDock';
import DesktopNavbar from '@/components/layout/DesktopNavbar';
import MobileHeader from '@/components/layout/MobileHeader';
import ShellContainer from '@/components/layout/ShellContainer';
import { useAuthToken } from '@/features/auth/hooks/useAuthToken';
import { useMe } from '@/features/auth/hooks/useMe';

type AppShellProps = Readonly<{
  children: ReactNode;
}>;

const FALLBACK_SHELL_IDENTITY = {
  displayName: 'User',
  username: 'user',
  avatarSrc: '/assets/avatar/avatar-placeholder.jpg',
} as const;

const AppShell = ({ children }: AppShellProps) => {
  const token = useAuthToken();
  const { data } = useMe(token);

  const shellIdentity = {
    displayName: data?.data?.name ?? FALLBACK_SHELL_IDENTITY.displayName,
    username: data?.data?.username ?? FALLBACK_SHELL_IDENTITY.username,
    avatarSrc: data?.data?.avatarUrl ?? FALLBACK_SHELL_IDENTITY.avatarSrc,
  };

  return (
    <div className='min-h-screen bg-shell-background text-foreground'>
      <div className='fixed inset-x-0 top-0 z-40'>
        <DesktopNavbar
          displayName={shellIdentity.displayName}
          username={shellIdentity.username}
          avatarSrc={shellIdentity.avatarSrc}
        />

        <MobileHeader
          displayName={shellIdentity.displayName}
          username={shellIdentity.username}
          avatarSrc={shellIdentity.avatarSrc}
        />
      </div>

      <main className='pb-[clamp(6.5rem,12vw,7.75rem)] pt-20 md:pt-[5rem]'>
        <ShellContainer>{children}</ShellContainer>
      </main>

      <AppBottomDock variant='protected' />
    </div>
  );
};

export default AppShell;
