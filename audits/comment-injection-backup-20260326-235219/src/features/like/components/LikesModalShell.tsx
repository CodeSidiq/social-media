// src/features/like/components/LikesModalShell.tsx
'use client';

import { X } from 'lucide-react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import LikesPanel from '@/features/like/components/LikesPanel';
import type { LikesModalShellProps } from '@/features/like/types/like-shell.types';

const DESKTOP_PANEL_WIDTH_CLASS = 'w-[32.75rem]';
const DESKTOP_STAGE_WIDTH_CLASS = 'w-[42.75rem]';
const DESKTOP_STAGE_MIN_HEIGHT_CLASS = 'min-h-[35rem]';

const LikesModalShell = ({
  open,
  onOpenChange,
  users,
}: LikesModalShellProps) => {
  const desktopUsers = users;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName='bg-black/35 backdrop-blur-[3px]'
        className='fixed inset-0 z-[90] h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 overflow-y-auto border-none bg-transparent p-0 shadow-none'
      >
        <DialogTitle className='sr-only'>Likes Modal</DialogTitle>

        <DialogDescription className='sr-only'>
          Dialog yang menampilkan daftar user yang menyukai postingan.
        </DialogDescription>

        <div className='min-h-[100dvh] w-full'>
          {/* Desktop */}
          <div className='hidden w-full justify-center px-6 pb-10 pt-[6.6rem] md:flex lg:px-8'>
            <div
              className={`relative ${DESKTOP_STAGE_WIDTH_CLASS} ${DESKTOP_STAGE_MIN_HEIGHT_CLASS}`}
            >
              <div className='flex w-full justify-center'>
                <div className={`relative ${DESKTOP_PANEL_WIDTH_CLASS} pt-8`}>
                  <DialogClose
                    className='absolute right-0 top-0 z-[120] inline-flex h-6 w-6 items-center justify-center text-white/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                    aria-label='Close likes modal'
                  >
                    <X className='h-6 w-6' aria-hidden='true' />
                  </DialogClose>

                  <div className='rounded-[1.75rem] bg-shell-background/95 px-5 py-5 shadow-[0_28px_90px_rgba(0,0,0,0.52)] backdrop-blur-xl'>
                    <LikesPanel users={desktopUsers} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className='relative min-h-[100dvh] w-full md:hidden'>
            <DialogClose
              className='absolute right-5 top-[20.25rem] z-[120] inline-flex h-6 w-6 items-center justify-center text-white/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              aria-label='Close likes modal'
            >
              <X className='h-6 w-6' aria-hidden='true' />
            </DialogClose>

            <div className='flex min-h-[100dvh] w-full flex-col pt-[22.125rem]'>
              <div className='relative w-full bg-shell-background/95 px-4 pb-6 pt-5 backdrop-blur-xl'>
                <LikesPanel users={users} className='pr-8' />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LikesModalShell;
