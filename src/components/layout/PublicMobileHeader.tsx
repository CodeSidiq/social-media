// src/components/layout/PublicMobileHeader.tsx
'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import ShellContainer from '@/components/layout/ShellContainer';
import NavBrand from '@/components/navigation/NavBrand';
import SearchFieldShell from '@/components/navigation/SearchFieldShell';
import { Button } from '@/components/ui/button';

const PublicMobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((currentState) => !currentState);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className='fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-shell-background/95 backdrop-blur md:hidden'>
      <ShellContainer className='px-4'>
        <div className='flex h-20 items-center justify-between gap-3'>
          <NavBrand href='/' />

          <div className='flex items-center gap-2'>
            <SearchFieldShell variant='mobile' />

            <button
              type='button'
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              className='inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted'
            >
              {isMenuOpen ? (
                <X className='h-6 w-6' aria-hidden='true' />
              ) : (
                <Menu className='h-6 w-6' aria-hidden='true' />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen ? (
          <div className='flex items-center gap-3 pb-4'>
            <Button
              asChild
              type='button'
              variant='outline'
              className='h-[44px] flex-1 rounded-full border-border bg-transparent text-sm font-semibold text-foreground hover:bg-muted'
            >
              <Link href='/auth/login' onClick={closeMenu}>
                Login
              </Link>
            </Button>

            <Button
              asChild
              type='button'
              className='h-[44px] flex-1 rounded-full text-sm font-semibold'
            >
              <Link href='/auth/register' onClick={closeMenu}>
                Register
              </Link>
            </Button>
          </div>
        ) : null}
      </ShellContainer>
    </header>
  );
};

export default PublicMobileHeader;
