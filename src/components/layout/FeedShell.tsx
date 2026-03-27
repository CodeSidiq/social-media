// src/components/layout/FeedShell.tsx
/**
 * Feed layout shell.
 * Provides consistent structure across timeline and public feed surfaces.
 * Access-specific behavior is controlled through the accessVariant prop.
 */

import DesktopNavbar from '@/components/layout/DesktopNavbar';
import MobileHeader from '@/components/layout/MobileHeader';
import PublicDesktopNavbar from '@/components/layout/PublicDesktopNavbar';
import PublicMobileHeader from '@/components/layout/PublicMobileHeader';

type FeedShellProps = Readonly<{
  accessVariant: 'public' | 'authenticated';
  children: React.ReactNode;
  displayName?: string;
  username?: string;
  avatarSrc?: string;
}>;

const FeedShell = ({
  accessVariant,
  children,
  displayName,
  username,
  avatarSrc,
}: FeedShellProps) => {
  const isPublic = accessVariant === 'public';

  return (
    <div className='min-h-screen bg-shell-background text-foreground'>
      {isPublic ? (
        <>
          <PublicDesktopNavbar />
          <PublicMobileHeader />
        </>
      ) : (
        <>
          <DesktopNavbar
            displayName={displayName}
            username={username}
            avatarSrc={avatarSrc}
          />
          <MobileHeader
            displayName={displayName}
            username={username}
            avatarSrc={avatarSrc}
          />
        </>
      )}

      <main className='pb-[clamp(6.5rem,12vw,7.75rem)] pt-[5.5rem] md:pt-[6.5rem]'>
        {children}
      </main>
    </div>
  );
};

export default FeedShell;
