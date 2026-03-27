// src/components/layout/PublicDesktopNavbar.tsx
import Link from 'next/link';

import ShellContainer from '@/components/layout/ShellContainer';
import SearchFieldShell from '@/components/navigation/SearchFieldShell';
import NavBrand from '@/components/navigation/NavBrand';
import { Button } from '@/components/ui/button';

const PublicDesktopNavbar = () => {
  return (
    <header className='fixed left-0 right-0 top-0 z-50 hidden border-b border-border/80 bg-shell-background/80 backdrop-blur md:block'>
      <ShellContainer className='grid h-[4.75rem] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6 px-[18px]'>
        <div className='justify-self-start'>
          <NavBrand href='/' />
        </div>

        <div className='flex min-w-0 justify-center px-4'>
          <SearchFieldShell variant='desktop' />
        </div>

        <div className='justify-self-end'>
          <div className='flex items-center gap-3'>
            <Button
              asChild
              type='button'
              variant='outline'
              className='h-[44px] min-w-[114px] rounded-full border-border bg-transparent px-5 text-sm font-semibold text-foreground hover:bg-muted'
            >
              <Link href='/auth/login'>Login</Link>
            </Button>

            <Button
              asChild
              type='button'
              className='h-[44px] w-[130px] rounded-full text-sm font-semibold'
            >
              <Link href='/auth/register'>Register</Link>
            </Button>
          </div>
        </div>
      </ShellContainer>
    </header>
  );
};

export default PublicDesktopNavbar;
