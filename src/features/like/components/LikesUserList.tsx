// src/features/like/components/LikesUserList.tsx

'use client';

import LikesUserRow from '@/features/like/components/LikesUserRow';
import type { LikeUserShellItem } from '@/features/like/types/like-shell.types';

type LikesUserListProps = Readonly<{
  users: readonly LikeUserShellItem[];
  onFollowClick?: (user: LikeUserShellItem) => void;
  followLoadingUsername?: string | null;
  isFollowActionDisabled?: boolean;
}>;

const LikesUserList = ({
  users,
  onFollowClick,
  followLoadingUsername = null,
  isFollowActionDisabled = false,
}: LikesUserListProps) => {
  return (
    <ul className='space-y-4'>
      {users.map((user) => (
        <LikesUserRow
          key={user.id}
          user={user}
          onFollowClick={onFollowClick}
          isFollowActionLoading={followLoadingUsername === user.username}
          isFollowActionDisabled={isFollowActionDisabled}
        />
      ))}
    </ul>
  );
};

export default LikesUserList;
