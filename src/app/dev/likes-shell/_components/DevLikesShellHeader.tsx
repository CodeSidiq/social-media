// src/app/dev/likes-shell/_components/DevLikesShellHeader.tsx

'use client';

import { Button } from '@/components/ui/button';

type DevLikesShellHeaderProps = Readonly<{
  isOpen: boolean;
  onReopen: () => void;
}>;

const DevLikesShellHeader = ({
  isOpen,
  onReopen,
}: DevLikesShellHeaderProps) => {
  return (
    <header className='border-b border-border/60 bg-shell-background/95 backdrop-blur'>
      <div className='mx-auto flex h-14 w-full max-w-md items-center justify-between px-4'>
        <div>
          <p className='text-sm font-semibold text-foreground'>Likes Modal Shell</p>
          <p className='text-xs text-muted-foreground'>
            UI-only preview for desktop and mobile behavior
          </p>
        </div>

        {!isOpen ? (
          <Button type='button' variant='outline' size='sm' onClick={onReopen}>
            Reopen
          </Button>
        ) : null}
      </div>
    </header>
  );
};

export default DevLikesShellHeader;
