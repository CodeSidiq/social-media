// src/features/like/components/LikesModalShell.tsx
/**
 * Likes modal surface.
 * Displays the list of users who liked a post.
 * This UI stays isolated from shared post card logic.
 */

'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFollowUser } from '@/features/follow/hooks/useFollowUser';
import { useUnfollowUser } from '@/features/follow/hooks/useUnfollowUser';
import LikesPanel from '@/features/like/components/LikesPanel';
import type {
  LikeUserShellItem,
  LikesModalShellProps,
} from '@/features/like/types/like-shell.types';

const DESKTOP_PANEL_WIDTH_CLASS = 'w-[32.75rem]';
const DESKTOP_STAGE_WIDTH_CLASS = 'w-[42.75rem]';
const DESKTOP_STAGE_MIN_HEIGHT_CLASS = 'min-h-[35rem]';

const LikesModalShell = ({
  open,
  onOpenChange,
  post,
  users,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  pagination,
  onLoadMore,
}: LikesModalShellProps) => {
  const [mergedUsers, setMergedUsers] =
    useState<readonly LikeUserShellItem[]>(users);
  const [activeFollowUsername, setActiveFollowUsername] = useState<string | null>(
    null
  );
  const [followActionError, setFollowActionError] = useState<string | null>(null);

  const followUserMutation = useFollowUser();
  const unfollowUserMutation = useUnfollowUser();

  useEffect(() => {
    if (!open) {
      setMergedUsers([]);
      setActiveFollowUsername(null);
      setFollowActionError(null);
      return;
    }

    setMergedUsers(users);
  }, [open, users]);

  const normalizedIsLoading = Boolean(isLoading);
  const normalizedIsError = Boolean(isError);
  const page = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const hasNextPage = page < totalPages;

  useEffect(() => {
    if (!open) {
      return;
    }

    setMergedUsers((previousUsers) => {
      if (page <= 1) {
        return users;
      }

      if (users.length === 0) {
        return previousUsers;
      }

      const existingIds = new Set(previousUsers.map((user) => user.id));
      const appendedUsers = users.filter((user) => !existingIds.has(user.id));

      if (appendedUsers.length === 0) {
        return previousUsers;
      }

      return [...previousUsers, ...appendedUsers];
    });
  }, [open, page, users]);

  const isFollowActionPending =
    followUserMutation.isPending || unfollowUserMutation.isPending;

  const handleFollowClick = async (user: LikeUserShellItem) => {
    const postId = typeof post?.id === 'number' ? post.id : null;

    if (!postId || isFollowActionPending) {
      return;
    }

    setFollowActionError(null);
    setActiveFollowUsername(user.username);

    console.log('[FOLLOW_DEBUG] click', {
      postId,
      username: user.username,
      isFollowing: user.isFollowing,
      userId: user.id,
    });

    try {
      if (user.isFollowing) {
        await unfollowUserMutation.mutateAsync({
          username: user.username,
          postId,
        });
      } else {
        await followUserMutation.mutateAsync({
          username: user.username,
          postId,
        });
      }
    } catch (error) {
      console.error('[FOLLOW_DEBUG] mutation error', error);

      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update follow state.';

      setFollowActionError(message);
    } finally {
      setActiveFollowUsername(null);
    }
  };

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

        <div
          className='min-h-[100dvh] w-full'
          onClick={() => onOpenChange(false)}
        >
          <div className='hidden w-full justify-center px-6 pb-10 pt-[6.6rem] md:flex lg:px-8'>
            <div
              className={`relative ${DESKTOP_STAGE_WIDTH_CLASS} ${DESKTOP_STAGE_MIN_HEIGHT_CLASS}`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className='flex w-full justify-center'>
                <div className={`relative ${DESKTOP_PANEL_WIDTH_CLASS} pt-8`}>
                  <DialogClose
                    className='absolute right-0 top-0 z-[120] inline-flex h-6 w-6 items-center justify-center text-white/90 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                    aria-label='Close likes modal'
                  >
                    <X className='h-6 w-6' aria-hidden='true' />
                  </DialogClose>

                  <div className='rounded-[1.75rem] bg-shell-background/95 px-5 py-5 shadow-[0_28px_90px_rgba(0,0,0,0.52)] backdrop-blur-xl'>
                    <LikesPanel
                      users={mergedUsers}
                      isLoading={normalizedIsLoading && mergedUsers.length === 0}
                      isError={normalizedIsError}
                      errorMessage={errorMessage}
                      onRetry={onRetry}
                      hasNextPage={hasNextPage}
                      isLoadingMore={Boolean(
                        pagination &&
                          pagination.page > 1 &&
                          normalizedIsLoading
                      )}
                      onLoadMore={onLoadMore}
                      onFollowClick={handleFollowClick}
                      followLoadingUsername={activeFollowUsername}
                      isFollowActionDisabled={isFollowActionPending}
                      followActionError={followActionError}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='relative min-h-[100dvh] w-full md:hidden'>
            <DialogClose
              className='absolute right-5 top-[20.25rem] z-[120] inline-flex h-6 w-6 items-center justify-center text-white/90 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              aria-label='Close likes modal'
            >
              <X className='h-6 w-6' aria-hidden='true' />
            </DialogClose>

            <div className='flex min-h-[100dvh] w-full flex-col pt-[22.125rem]'>
              <div
                className='relative w-full bg-shell-background/95 px-4 pb-6 pt-5 backdrop-blur-xl'
                onClick={(event) => event.stopPropagation()}
              >
                <div className='pr-8'>
                  <LikesPanel
                    users={mergedUsers}
                    isLoading={normalizedIsLoading && mergedUsers.length === 0}
                    isError={normalizedIsError}
                    errorMessage={errorMessage}
                    onRetry={onRetry}
                    hasNextPage={hasNextPage}
                    isLoadingMore={Boolean(
                      pagination &&
                        pagination.page > 1 &&
                        normalizedIsLoading
                    )}
                    onLoadMore={onLoadMore}
                    onFollowClick={handleFollowClick}
                    followLoadingUsername={activeFollowUsername}
                    isFollowActionDisabled={isFollowActionPending}
                    followActionError={followActionError}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LikesModalShell;
