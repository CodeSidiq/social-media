// src/components/layout/PublicBottomDock.tsx

'use client';

import { House, Plus, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PublicBottomDock = () => {
  const pathname = usePathname();

  const isHome = pathname === '/';

  return (
    <nav
      aria-label='Public bottom navigation'
      className='pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4'
    >
      <div className='pointer-events-auto w-full max-w-[22.5rem]'>
        <div className='grid h-[4.5rem] grid-cols-[1fr_auto_1fr] items-center rounded-full border border-border/80 bg-card/95 px-4 shadow-[0_8px_30px_rgba(0,0,0,0.28)] backdrop-blur'>
          <Link
            href='/'
            aria-current={isHome ? 'page' : undefined}
            className={[
              'inline-flex min-w-[5.5rem] flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
              isHome
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            <House className='h-5 w-5' strokeWidth={2.2} />
            <span>Home</span>
          </Link>

          <Link
            href='/auth/login'
            aria-label='Login to create post'
            className='inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_28px_rgba(127,81,249,0.42)] transition-transform hover:scale-[1.03]'
          >
            <Plus className='h-5 w-5' strokeWidth={2.4} />
          </Link>

          <Link
            href='/auth/login'
            className='inline-flex min-w-[5.5rem] flex-col items-center justify-center gap-1 justify-self-end text-xs font-medium text-muted-foreground transition-colors hover:text-foreground'
          >
            <User className='h-5 w-5' strokeWidth={2.2} />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default PublicBottomDock;
