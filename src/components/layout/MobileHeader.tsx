// src/components/layout/MobileHeader.tsx
import ShellContainer from '@/components/layout/ShellContainer';
import AvatarTriggerShell from '@/components/navigation/AvatarTriggerShell';
import NavBrand from '@/components/navigation/NavBrand';
import SearchFieldShell from '@/components/navigation/SearchFieldShell';

type MobileHeaderProps = Readonly<{
  displayName?: string;
  username?: string;
  avatarSrc?: string;
}>;

const MobileHeader = ({
  displayName,
  username,
  avatarSrc,
}: MobileHeaderProps) => {
  return (
    <header className='fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-shell-background/95 backdrop-blur md:hidden'>
      <ShellContainer className='flex h-20 items-center justify-between gap-3 px-4'>
        <NavBrand href='/' />

        <div className='flex items-center gap-2'>
          <SearchFieldShell variant='mobile' />

          <AvatarTriggerShell
            variant='mobile'
            displayName={displayName}
            username={username}
            avatarSrc={avatarSrc}
          />
        </div>
      </ShellContainer>
    </header>
  );
};

export default MobileHeader;
