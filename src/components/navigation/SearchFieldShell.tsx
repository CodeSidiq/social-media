// src/components/navigation/SearchFieldShell.tsx

'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

import DesktopSearchBox from '@/features/search/components/DesktopSearchBox';
import MobileSearchOverlay from '@/features/search/components/MobileSearchOverlay';

type SearchFieldShellProps = Readonly<{
  variant: 'desktop' | 'mobile';
}>;

const SearchFieldShell = ({ variant }: SearchFieldShellProps) => {
  const [open, setOpen] = useState(false);

  if (variant === 'mobile') {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          aria-label='Open search'
          className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground'
        >
          <Search className='h-[1.125rem] w-[1.125rem]' />
        </button>

        <MobileSearchOverlay open={open} onOpenChange={setOpen} />
      </>
    );
  }

  return <DesktopSearchBox />;
};

export default SearchFieldShell;
