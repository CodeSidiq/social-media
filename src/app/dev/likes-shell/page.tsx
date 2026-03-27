// src/app/dev/likes-shell/page.tsx

'use client';

import { useState } from 'react';

import DevLikesShellBackground from './_components/DevLikesShellBackground';
import DevLikesShellHeader from './_components/DevLikesShellHeader';
import { mockLikeUsers } from './_mocks/mockLikeUsers';
import { mockLikesPost } from './_mocks/mockLikesPost';
import LikesModalShell from '@/features/like/components/LikesModalShell';

const LikesShellPage = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className='min-h-screen bg-shell-background text-foreground'>
      <DevLikesShellHeader isOpen={open} onReopen={() => setOpen(true)} />

      <div className='relative'>
        <DevLikesShellBackground post={mockLikesPost} />

        <LikesModalShell
          open={open}
          onOpenChange={setOpen}
          post={mockLikesPost}
          users={mockLikeUsers}
        />
      </div>
    </div>
  );
};

export default LikesShellPage;
