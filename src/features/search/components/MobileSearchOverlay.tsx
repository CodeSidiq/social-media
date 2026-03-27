// src/features/search/components/MobileSearchOverlay.tsx

'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

import SearchPageClient from '@/features/search/components/SearchPageClient';

type MobileSearchOverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';

const MobileSearchOverlay = ({
  open,
  onOpenChange,
}: MobileSearchOverlayProps) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

    const handleViewportChange = (
      event: MediaQueryListEvent | MediaQueryList
    ) => {
      if (event.matches) {
        onOpenChange(false);
      }
    };

    handleViewportChange(mediaQuery);

    const listener = (event: MediaQueryListEvent) => {
      handleViewportChange(event);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', listener);

      return () => {
        mediaQuery.removeEventListener('change', listener);
      };
    }

    mediaQuery.addListener(listener);

    return () => {
      mediaQuery.removeListener(listener);
    };
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='p-0 md:hidden [&>button]:hidden'>
        <DialogTitle className='sr-only'>Search</DialogTitle>
        <DialogDescription className='sr-only'>
          Dialog untuk mencari user berdasarkan nama atau username
        </DialogDescription>

        <div className='relative min-h-[100dvh] bg-shell-background'>
          <button
            type='button'
            onClick={() => onOpenChange(false)}
            className='absolute right-5 top-5 z-[100] inline-flex h-6 w-6 items-center justify-center text-white/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            aria-label='Close search'
          >
            <X className='h-6 w-6' aria-hidden='true' />
          </button>

          <SearchPageClient />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileSearchOverlay;
