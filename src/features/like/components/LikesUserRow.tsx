// src/features/like/components/LikesUserRow.tsx

'use client';

import { Avatar } from '@/components/ui/avatar';
import FollowStateButton from '@/features/like/components/FollowStateButton';
import type { LikeUserShellItem } from '@/features/like/types/like-shell.types';

type LikesUserRowProps = Readonly<{
  user: LikeUserShellItem;
  onFollowClick?: (user: LikeUserShellItem) => void;
}>;

const LikesUserRow = ({ user, onFollowClick }: LikesUserRowProps) => {
  return (
    <li className='flex items-center gap-3'>
      <Avatar
        src={user.avatarUrl}
        alt={`${user.name} avatar`}
        fallbackText={user.name}
        size='lg'
      />

      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-semibold text-foreground sm:text-base'>
          {user.name}
        </p>

        <p className='truncate text-xs text-muted-foreground sm:text-sm'>
          @{user.username}
        </p>
      </div>

      <FollowStateButton
        isFollowing={user.isFollowing}
        onClick={onFollowClick ? () => onFollowClick(user) : undefined}
      />
    </li>
  );
};

export default LikesUserRow;
