// src/components/layout/DesktopNavbar.tsx
import ShellContainer from '@/components/layout/ShellContainer';
import AvatarTriggerShell from '@/components/navigation/AvatarTriggerShell';
import NavBrand from '@/components/navigation/NavBrand';
import SearchFieldShell from '@/components/navigation/SearchFieldShell';

type DesktopNavbarProps = Readonly<{
  displayName?: string;
  username?: string;
  avatarSrc?: string;
}>;

const DesktopNavbar = ({
  displayName,
  username,
  avatarSrc,
}: DesktopNavbarProps) => {
  return (
    <header className='fixed left-0 right-0 top-0 z-50 hidden border-b border-border/80 bg-shell-background/80 backdrop-blur md:block'>
      <ShellContainer className='grid h-[4.75rem] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6 px-6'>
        <div className='justify-self-start'>
          <NavBrand href='/' />
        </div>

        <div className='flex min-w-0 justify-center px-4'>
          <SearchFieldShell variant='desktop' />
        </div>

        <div className='justify-self-end'>
          <AvatarTriggerShell
            variant='desktop'
            displayName={displayName}
            username={username}
            avatarSrc={avatarSrc}
          />
        </div>
      </ShellContainer>
    </header>
  );
};

export default DesktopNavbar;
