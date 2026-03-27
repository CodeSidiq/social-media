// src/features/like/components/LikesPanel.tsx

'use client';

import LikesUserList from '@/features/like/components/LikesUserList';
import type { LikeUserShellItem } from '@/features/like/types/like-shell.types';
import { cn } from '@/lib/utils';

type LikesPanelProps = Readonly<{
  users: readonly LikeUserShellItem[];
  className?: string;
}>;

const LikesPanel = ({ users, className }: LikesPanelProps) => {
  return (
    <section className={cn('flex flex-col', className)}>
      <header className='pb-3'>
        <h2 className='text-lg font-semibold leading-8 text-foreground sm:text-xl'>
          Likes
        </h2>
      </header>

      <div>
        <LikesUserList users={users} />
      </div>
    </section>
  );
};

export default LikesPanel;
